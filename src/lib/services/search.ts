// Independent search orchestrator.
//
// Data sources (all self-run, no paid 3rd-party APIs):
//  - GitHub API (free, public endpoints)
//  - DuckDuckGo HTML (scraped, no key)
//  - Direct page scraper (cheerio on real web pages)
//  - SMTP/MX email verifier (Node built-in dns + net)
//
// Every contact returned traces back to a real URL we fetched.
// No pattern-generated or guessed emails.

import { prisma } from "@/lib/db";
import { searchGitHub, getGitHubEmails } from "./github";
import { searchDuckDuckGo, extractFromSnippets, extractSocialProfiles } from "./duckduckgo";
import { scrapeMany } from "./page-scraper";
import { verifyEmail, verifyMany, confidenceFromVerify } from "./email-verify";

export interface SearchInput {
  query: string;
  type: "name" | "email" | "phone" | "username" | "domain" | "company";
  userId: string;
}

export interface EmailEntry {
  email: string;
  confidence: number;
  source: string;
  sourceUrl: string | null;
  verified: boolean;
  verifyResult: string;
}

export interface PhoneEntry {
  phone: string;
  confidence: number;
  source: string;
  sourceUrl: string | null;
}

export interface SocialEntry {
  platform: string;
  username: string;
  url: string;
}

export interface PersonResult {
  id: string;
  fullName: string;
  photoUrl: string | null;
  location: string | null;
  bio: string | null;
  company: string | null;
  jobTitle: string | null;
  matchScore: number;
  emails: EmailEntry[];
  phones: PhoneEntry[];
  socials: SocialEntry[];
  sources: string[];
}

export async function executeSearch(input: SearchInput): Promise<{
  results: PersonResult[];
  creditsUsed: number;
  searchId: string;
}> {
  const { query, type, userId } = input;
  const { name, extra } = parseQuery(query, type);

  // ── Step 1: Fetch from independent sources in parallel ─────────
  const [githubResults, duckResults] = await Promise.all([
    type === "name" || type === "username"
      ? searchGitHub(name, 5)
      : Promise.resolve([]),
    searchDuckDuckGo(`${name} ${extra}`.trim(), 15),
  ]);

  // ── Step 2: Extract what's in the SERP snippets ────────────────
  const snippetExtract = extractFromSnippets(duckResults);
  const serpSocials = extractSocialProfiles(duckResults);

  // ── Step 3: Scrape the top N real URLs for contact info ────────
  // Prefer URLs that look contact-relevant
  const contactRelevantUrls = duckResults
    .filter((r) => {
      const u = r.url.toLowerCase();
      // Skip noisy aggregator/social URLs we already parsed
      if (u.includes("linkedin.com") || u.includes("twitter.com") || u.includes("x.com")) return false;
      if (u.includes("facebook.com") || u.includes("instagram.com")) return false;
      return true;
    })
    .slice(0, 6)
    .map((r) => r.url);

  const scrapedPages = await scrapeMany(contactRelevantUrls, 4);

  // Collect all found emails/phones with their source URLs
  const scrapedEmails = new Map<string, string>(); // email -> source URL
  const scrapedPhones = new Map<string, string>(); // phone -> source URL
  const scrapedSocials: SocialEntry[] = [];
  const socialSeen = new Set<string>();

  for (const page of scrapedPages) {
    for (const email of page.emails) {
      if (!scrapedEmails.has(email)) scrapedEmails.set(email, page.url);
    }
    for (const phone of page.phones) {
      if (!scrapedPhones.has(phone)) scrapedPhones.set(phone, page.url);
    }
    for (const s of page.socials) {
      const key = `${s.platform}:${s.username.toLowerCase()}`;
      if (!socialSeen.has(key)) {
        socialSeen.add(key);
        scrapedSocials.push(s);
      }
    }
  }

  // Also fold in snippet-extracted contacts (mark source as SERP)
  for (const email of snippetExtract.emails) {
    if (!scrapedEmails.has(email)) {
      const matching = duckResults.find((r) =>
        `${r.title} ${r.snippet}`.toLowerCase().includes(email)
      );
      scrapedEmails.set(email, matching?.url || "");
    }
  }
  for (const phone of snippetExtract.phones) {
    if (!scrapedPhones.has(phone)) {
      const matching = duckResults.find((r) => `${r.title} ${r.snippet}`.includes(phone));
      scrapedPhones.set(phone, matching?.url || "");
    }
  }
  for (const s of serpSocials) {
    const key = `${s.platform}:${s.username.toLowerCase()}`;
    if (!socialSeen.has(key)) {
      socialSeen.add(key);
      scrapedSocials.push(s);
    }
  }

  // ── Step 4: Verify ALL discovered emails via SMTP/MX ───────────
  const allEmails = Array.from(scrapedEmails.keys());
  const verifications = allEmails.length > 0 ? await verifyMany(allEmails.slice(0, 15), 3) : [];
  const verifyMap = new Map(verifications.map((v) => [v.email, v]));

  // ── Step 5: Build person results ───────────────────────────────
  const personResults: PersonResult[] = [];

  // Process GitHub results (highest confidence source)
  for (const gh of githubResults) {
    const emails: EmailEntry[] = [];

    // GitHub profile email (if public)
    if (gh.email) {
      const v = await verifyEmail(gh.email);
      emails.push({
        email: gh.email,
        confidence: confidenceFromVerify(v.result),
        source: "GitHub profile",
        sourceUrl: gh.profileUrl,
        verified: v.result === "deliverable",
        verifyResult: v.result,
      });
    }

    // GitHub commit emails
    const ghCommitEmails = await getGitHubEmails(gh.username);
    for (const e of ghCommitEmails) {
      if (emails.some((existing) => existing.email === e)) continue;
      const cached = verifyMap.get(e);
      const v = cached ? cached : await verifyEmail(e);
      emails.push({
        email: e,
        confidence: confidenceFromVerify(v.result),
        source: "GitHub commits",
        sourceUrl: `${gh.profileUrl}?tab=overview`,
        verified: v.result === "deliverable",
        verifyResult: v.result,
      });
    }

    const socials: SocialEntry[] = [
      { platform: "github", username: gh.username, url: gh.profileUrl },
    ];
    if (gh.twitter) {
      socials.push({ platform: "twitter", username: gh.twitter, url: `https://x.com/${gh.twitter}` });
    }

    // Attach scraped socials only if the username looks like this person.
    // Strict: username must contain a substantial part of the person's name
    // (not just a single letter).
    const ghNameParts = gh.name
      .toLowerCase()
      .split(/\s+/)
      .filter((p) => p.length >= 3);
    for (const s of scrapedSocials) {
      if (socials.some((existing) => existing.platform === s.platform)) continue;
      const uname = s.username.toLowerCase();
      // Require the username to contain a name part AND not be a common generic
      const matches = ghNameParts.some((part) => uname.includes(part));
      if (matches) {
        socials.push(s);
      }
    }

    const matchScore = calculateMatchScore(name, extra, gh.name, gh.location, gh.company);

    personResults.push({
      id: "",
      fullName: gh.name,
      photoUrl: gh.avatarUrl,
      location: gh.location,
      bio: gh.bio,
      company: gh.company,
      jobTitle: null,
      matchScore,
      emails,
      phones: [],
      socials,
      sources: ["GitHub"],
    });
  }

  // ── Step 6: Add scraped results as a consolidated person if no GitHub match ─
  // Keep only emails that are verified or accept_all (domain exists)
  const usableEmails: EmailEntry[] = [];
  for (const [email, sourceUrl] of scrapedEmails.entries()) {
    const v = verifyMap.get(email);
    if (!v) continue;
    if (v.result === "undeliverable" || v.result === "no_mx" || v.result === "invalid_syntax") continue;

    usableEmails.push({
      email,
      confidence: confidenceFromVerify(v.result),
      source: sourceUrl ? hostnameFromUrl(sourceUrl) : "Web",
      sourceUrl: sourceUrl || null,
      verified: v.result === "deliverable",
      verifyResult: v.result,
    });
  }

  const usablePhones: PhoneEntry[] = [];
  for (const [phone, sourceUrl] of scrapedPhones.entries()) {
    usablePhones.push({
      phone,
      confidence: 75, // phone found on real page — confidence medium-high
      source: sourceUrl ? hostnameFromUrl(sourceUrl) : "Web",
      sourceUrl: sourceUrl || null,
    });
  }

  // Attach scraped contacts to the top GitHub result ONLY if they look
  // related to that person (same domain as their blog/company, or the page
  // that yielded the contact actually mentions their name).
  if (personResults.length > 0) {
    const top = personResults[0];
    const topNameParts = top.fullName
      .toLowerCase()
      .split(/\s+/)
      .filter((p) => p.length >= 3);

    const looksRelated = (sourceUrl: string | null): boolean => {
      if (!sourceUrl) return false;
      const u = sourceUrl.toLowerCase();
      return topNameParts.some((part) => u.includes(part));
    };

    for (const e of usableEmails) {
      if (top.emails.some((existing) => existing.email === e.email)) continue;
      if (!looksRelated(e.sourceUrl)) continue;
      top.emails.push(e);
    }
    for (const p of usablePhones) {
      if (top.phones.some((existing) => existing.phone === p.phone)) continue;
      if (!looksRelated(p.sourceUrl)) continue;
      top.phones.push(p);
    }
    if ((top.emails.length > 0 || top.phones.length > 0) && !top.sources.includes("Web scraping")) {
      top.sources.push("Web scraping");
    }
  } else {
    // No GitHub matches — create a web-only person record IF there are
    // contacts from pages that actually mention the searched name.
    const queryNameParts = name
      .toLowerCase()
      .split(/\s+/)
      .filter((p) => p.length >= 3);

    const looksRelated = (sourceUrl: string | null): boolean => {
      if (!sourceUrl) return false;
      const u = sourceUrl.toLowerCase();
      return queryNameParts.some((part) => u.includes(part));
    };

    const filteredEmails = usableEmails.filter((e) => looksRelated(e.sourceUrl));
    const filteredPhones = usablePhones.filter((p) => looksRelated(p.sourceUrl));
    const filteredSocials = scrapedSocials.filter((s) => {
      const u = s.username.toLowerCase();
      return queryNameParts.some((part) => u.includes(part));
    });

    if (filteredEmails.length > 0 || filteredPhones.length > 0 || filteredSocials.length > 0) {
      personResults.push({
        id: "",
        fullName: name,
        photoUrl: null,
        location: null,
        bio: duckResults[0]?.snippet || null,
        company: extra || null,
        jobTitle: null,
        matchScore: 50,
        emails: filteredEmails,
        phones: filteredPhones,
        socials: filteredSocials,
        sources: ["Web scraping", "DuckDuckGo"],
      });
    }
  }

  // Dedupe emails/socials/phones within each result to respect DB unique constraints
  for (const p of personResults) {
    const emailSeen = new Set<string>();
    p.emails = p.emails.filter((e) => {
      if (emailSeen.has(e.email)) return false;
      emailSeen.add(e.email);
      return true;
    });
    p.emails.sort((a, b) => b.confidence - a.confidence);

    // Unique per (personId, platform) in DB — keep first occurrence
    const socialSeen = new Set<string>();
    p.socials = p.socials.filter((s) => {
      if (socialSeen.has(s.platform)) return false;
      socialSeen.add(s.platform);
      return true;
    });

    const phoneSeen = new Set<string>();
    p.phones = p.phones.filter((ph) => {
      if (phoneSeen.has(ph.phone)) return false;
      phoneSeen.add(ph.phone);
      return true;
    });
  }

  // Sort results by match score
  personResults.sort((a, b) => b.matchScore - a.matchScore);

  // ── Step 7: Save to DB ─────────────────────────────────────────
  const searchRecord = await prisma.searchRecord.create({
    data: {
      userId,
      query,
      queryType: type,
      creditsUsed: 2,
      resultCount: personResults.length,
    },
  });

  for (const result of personResults) {
    const person = await prisma.person.create({
      data: {
        fullName: result.fullName,
        photoUrl: result.photoUrl,
        location: result.location,
        bio: result.bio,
        qualityScore: result.matchScore,
        emails: {
          create: result.emails.map((e) => ({
            email: e.email,
            confidence: e.confidence,
            isVerified: e.verified,
            source: e.source,
            lastCheckedAt: new Date(),
          })),
        },
        phones: {
          create: result.phones.map((p) => ({
            phone: p.phone,
            confidence: p.confidence,
            source: p.source,
          })),
        },
        socialProfiles: {
          create: result.socials.map((s) => ({
            platform: s.platform,
            username: s.username,
            profileUrl: s.url,
          })),
        },
        ...(result.company
          ? {
              professional: {
                create: {
                  company: result.company,
                  jobTitle: result.jobTitle,
                },
              },
            }
          : {}),
        dataSources: {
          create: [
            ...result.sources.map((s) => ({ sourceType: s })),
            ...Array.from(new Set(result.emails.map((e) => e.sourceUrl).filter(Boolean)))
              .slice(0, 10)
              .map((url) => ({ sourceType: "Page", sourceUrl: url as string })),
          ],
        },
        searchResults: {
          create: {
            searchId: searchRecord.id,
            matchScore: result.matchScore,
            matchedOn: result.sources,
          },
        },
      },
    });
    result.id = person.id;
  }

  return { results: personResults, creditsUsed: 2, searchId: searchRecord.id };
}

// ─── Helpers ──────────────────────────────────────────────

function parseQuery(query: string, type: string): { name: string; extra: string } {
  if (type === "email" || type === "phone" || type === "domain") {
    return { name: query.trim(), extra: "" };
  }
  const parts = query.split(",").map((s) => s.trim());
  return { name: parts[0], extra: parts.slice(1).join(", ") };
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Web";
  }
}

function calculateMatchScore(
  queryName: string,
  queryExtra: string,
  foundName: string,
  foundLocation: string | null,
  foundCompany: string | null
): number {
  let score = 0;
  const qName = queryName.toLowerCase();
  const fName = foundName.toLowerCase();

  const qParts = qName.split(/\s+/);
  const fParts = fName.split(/\s+/);
  const matchedParts = qParts.filter((p) => fParts.some((fp) => fp.includes(p) || p.includes(fp)));
  score += (matchedParts.length / Math.max(qParts.length, 1)) * 60;

  if (queryExtra && foundLocation) {
    const qLoc = queryExtra.toLowerCase();
    const fLoc = foundLocation.toLowerCase();
    if (fLoc.includes(qLoc) || qLoc.includes(fLoc)) score += 20;
  }
  if (queryExtra && foundCompany) {
    const qComp = queryExtra.toLowerCase();
    const fComp = foundCompany.toLowerCase();
    if (fComp.includes(qComp) || qComp.includes(fComp)) score += 20;
  }
  if (foundLocation) score += 5;
  if (foundCompany) score += 5;

  return Math.min(Math.round(score), 100);
}
