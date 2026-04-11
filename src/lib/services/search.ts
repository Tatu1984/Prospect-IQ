// Deep independent search orchestrator.
//
// Architecture:
//   1. Provider registry runs every enabled data source in parallel.
//      Free providers are always on. Paid providers activate automatically
//      when their env vars are set — no code changes needed.
//   2. Multi-query SERP search across DuckDuckGo + Bing.
//   3. Page scraping for every real URL we find.
//   4. Content-based relevance filter (the page must mention the person
//      for their contact info to count).
//   5. SMTP verification on every email — we never show fabricated addresses.
//   6. Per-search cost tracking so you can price the product accurately.

import { prisma } from "@/lib/db";
import {
  searchDuckDuckGo,
  extractFromSnippets as extractFromDuck,
  extractSocialProfiles as extractSocialsFromDuck,
  type DuckResult,
} from "./duckduckgo";
import { searchBing } from "./bing";
import { scrapeMany, scrapePage, type ScrapedPage } from "./page-scraper";
import { verifyMany, confidenceFromVerify } from "./email-verify";
import { getEnabledProviders, runProvider } from "./providers/registry";
import type { ProviderQuery } from "./providers/types";

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

export interface ProviderRunSummary {
  id: string;
  label: string;
  paid: boolean;
  resultCount: number;
  durationMs: number;
  costUsd: number;
  error: string | null;
}

export interface SearchDiagnostics {
  providersEnabled: number;
  providerRuns: ProviderRunSummary[];
  queriesRun: string[];
  duckResultsTotal: number;
  bingResultsTotal: number;
  pagesScraped: number;
  emailsDiscovered: number;
  emailsVerified: number;
  personalSitesTried: string[];
  totalDurationMs: number;
  totalApiCostUsd: number;
}

export async function executeSearch(input: SearchInput): Promise<{
  results: PersonResult[];
  creditsUsed: number;
  searchId: string;
  diagnostics: SearchDiagnostics;
}> {
  const searchStart = Date.now();
  const { query, type, userId } = input;
  const { name, extra } = parseQuery(query, type);
  const nameParts = name.toLowerCase().split(/\s+/).filter((p) => p.length >= 2);

  const providerQuery: ProviderQuery = { name, extra, nameParts, type };

  const diagnostics: SearchDiagnostics = {
    providersEnabled: 0,
    providerRuns: [],
    queriesRun: [],
    duckResultsTotal: 0,
    bingResultsTotal: 0,
    pagesScraped: 0,
    emailsDiscovered: 0,
    emailsVerified: 0,
    personalSitesTried: [],
    totalDurationMs: 0,
    totalApiCostUsd: 0,
  };

  // ── Step 1: Run all enabled providers in parallel ────────────────
  const providers = getEnabledProviders();
  diagnostics.providersEnabled = providers.length;
  const providerResults = await Promise.all(providers.map((p) => runProvider(p, providerQuery)));
  for (const r of providerResults) {
    const provider = providers.find((p) => p.id === r.providerId);
    if (!provider) continue;
    const paid = provider.costPerCallUsd > 0;
    diagnostics.providerRuns.push({
      id: r.providerId,
      label: provider.label,
      paid,
      resultCount: r.persons.length,
      durationMs: r.durationMs,
      costUsd: r.rawCostUsd,
      error: r.error,
    });
    diagnostics.totalApiCostUsd += r.rawCostUsd;
  }

  // ── Step 2: Multi-query SERP search (free, no key) ───────────────
  const duckQueries: string[] = [];
  const bingQueries: string[] = [];
  const baseQuery = extra ? `"${name}" ${extra}` : `"${name}"`;

  duckQueries.push(baseQuery);
  duckQueries.push(`"${name}" email contact`);
  duckQueries.push(`"${name}" linkedin`);
  if (extra) {
    duckQueries.push(`"${name}" "${extra}"`);
    duckQueries.push(`"${name}" ${extra} contact`);
  }
  duckQueries.push(`"${name}" twitter OR instagram OR facebook`);

  bingQueries.push(baseQuery);
  bingQueries.push(`"${name}" email`);
  if (extra) bingQueries.push(`"${name}" "${extra}"`);

  diagnostics.queriesRun = [
    ...duckQueries.map((q) => `ddg: ${q}`),
    ...bingQueries.map((q) => `bing: ${q}`),
  ];

  const [duckBatches, bingBatches] = await Promise.all([
    Promise.all(duckQueries.map((q) => searchDuckDuckGo(q, 10))),
    Promise.all(bingQueries.map((q) => searchBing(q, 10))),
  ]);

  const seenUrls = new Set<string>();
  const serpResults: DuckResult[] = [];
  for (const batch of [...duckBatches, ...bingBatches]) {
    for (const r of batch) {
      if (!r.url || seenUrls.has(r.url)) continue;
      seenUrls.add(r.url);
      serpResults.push(r);
    }
  }
  diagnostics.duckResultsTotal = duckBatches.reduce((s, b) => s + b.length, 0);
  diagnostics.bingResultsTotal = bingBatches.reduce((s, b) => s + b.length, 0);

  // ── Step 3: Extract socials and snippet contacts from SERP ───────
  const serpSocials = extractSocialsFromDuck(serpResults);
  const snippetContacts = extractFromDuck(serpResults);

  // ── Step 4: Scrape top 30 pages (no URL filter — include LinkedIn/X/etc) ─
  const urlsToScrape = serpResults.slice(0, 30).map((r) => r.url);
  const scrapedPages = await scrapeMany(urlsToScrape, 8);

  // ── Step 5: Personal website guessing ────────────────────────────
  if (nameParts.length >= 2) {
    const domains = guessPersonalDomains(nameParts);
    for (const domain of domains.slice(0, 8)) {
      const page = await scrapePage(`https://${domain}`).catch(() => null);
      if (page) {
        scrapedPages.push(page);
        diagnostics.personalSitesTried.push(domain);
      }
    }
  }
  diagnostics.pagesScraped = scrapedPages.length;

  // ── Step 6: Content-based relevance filter for scraped contacts ──
  const scrapedEmails = new Map<string, { url: string; pageMentionsName: boolean }>();
  const scrapedPhones = new Map<string, { url: string; pageMentionsName: boolean }>();
  const scrapedSocials: SocialEntry[] = [];
  const socialSeen = new Set<string>();

  for (const page of scrapedPages) {
    const mentions = pageMentionsPerson(page, nameParts, extra);
    for (const email of page.emails) {
      if (!scrapedEmails.has(email)) {
        scrapedEmails.set(email, { url: page.url, pageMentionsName: mentions });
      }
    }
    for (const phone of page.phones) {
      if (!scrapedPhones.has(phone)) {
        scrapedPhones.set(phone, { url: page.url, pageMentionsName: mentions });
      }
    }
    for (const s of page.socials) {
      const key = `${s.platform}:${s.username.toLowerCase()}`;
      if (!socialSeen.has(key)) {
        socialSeen.add(key);
        scrapedSocials.push(s);
      }
    }
  }

  for (const email of snippetContacts.emails) {
    if (!scrapedEmails.has(email)) {
      const r = serpResults.find((x) => `${x.title} ${x.snippet}`.toLowerCase().includes(email));
      const mentions = r
        ? nameParts.some((p) => `${r.title} ${r.snippet}`.toLowerCase().includes(p))
        : false;
      scrapedEmails.set(email, { url: r?.url || "", pageMentionsName: mentions });
    }
  }

  for (const s of serpSocials) {
    const key = `${s.platform}:${s.username.toLowerCase()}`;
    if (!socialSeen.has(key)) {
      socialSeen.add(key);
      scrapedSocials.push(s);
    }
  }

  diagnostics.emailsDiscovered = scrapedEmails.size;

  // ── Step 7: SMTP verify every email ──────────────────────────────
  const emailsToVerify = Array.from(scrapedEmails.keys()).slice(0, 25);
  const verifications = emailsToVerify.length > 0 ? await verifyMany(emailsToVerify, 4) : [];
  const verifyMap = new Map(verifications.map((v) => [v.email, v]));
  diagnostics.emailsVerified = verifications.filter(
    (v) => v.result === "deliverable" || v.result === "accept_all" || v.result === "unknown"
  ).length;

  // ── Step 8: Build person results from provider outputs ───────────
  const personResults: PersonResult[] = [];

  for (const pr of providerResults) {
    const providerDef = providers.find((p) => p.id === pr.providerId);
    if (!providerDef) continue;

    for (const person of pr.persons) {
      // Verify any emails the provider returned
      const verifiedEmails: EmailEntry[] = [];
      for (const e of person.emails) {
        let cached = verifyMap.get(e.email);
        if (!cached) {
          const v = await import("./email-verify").then((m) => m.verifyEmail(e.email));
          cached = v;
        }
        verifiedEmails.push({
          email: e.email,
          confidence: confidenceFromVerify(cached.result),
          source: e.source,
          sourceUrl: e.sourceUrl ?? null,
          verified: cached.result === "deliverable",
          verifyResult: cached.result,
        });
      }

      personResults.push({
        id: "",
        fullName: person.fullName,
        photoUrl: person.photoUrl ?? null,
        location: person.location ?? null,
        bio: person.bio ?? null,
        company: person.company ?? null,
        jobTitle: person.jobTitle ?? null,
        matchScore: calculateMatchScore(name, extra, person.fullName, person.location ?? null, person.company ?? null),
        emails: verifiedEmails,
        phones: person.phones.map((p) => ({
          phone: p.phone,
          confidence: 75,
          source: p.source,
          sourceUrl: p.sourceUrl ?? null,
        })),
        socials: person.socials,
        sources: [providerDef.label],
      });
    }
  }

  // ── Step 9: Merge web-scraped contacts ───────────────────────────
  const usableEmails: EmailEntry[] = [];
  const usablePhones: PhoneEntry[] = [];

  for (const [email, info] of scrapedEmails.entries()) {
    const v = verifyMap.get(email);
    if (!v) continue;
    if (v.result === "undeliverable" || v.result === "no_mx" || v.result === "invalid_syntax") continue;
    if (!info.pageMentionsName) continue;

    usableEmails.push({
      email,
      confidence: confidenceFromVerify(v.result),
      source: info.url ? hostnameFromUrl(info.url) : "Web",
      sourceUrl: info.url || null,
      verified: v.result === "deliverable",
      verifyResult: v.result,
    });
  }

  for (const [phone, info] of scrapedPhones.entries()) {
    if (!info.pageMentionsName) continue;
    usablePhones.push({
      phone,
      confidence: 75,
      source: info.url ? hostnameFromUrl(info.url) : "Web",
      sourceUrl: info.url || null,
    });
  }

  const relevantSocials = scrapedSocials.filter((s) => {
    const u = s.username.toLowerCase();
    return nameParts.some((part) => u.includes(part));
  });

  if (personResults.length > 0) {
    const top = personResults[0];
    for (const e of usableEmails) if (!top.emails.some((x) => x.email === e.email)) top.emails.push(e);
    for (const p of usablePhones) if (!top.phones.some((x) => x.phone === p.phone)) top.phones.push(p);
    for (const s of relevantSocials) if (!top.socials.some((x) => x.platform === s.platform)) top.socials.push(s);
    if ((usableEmails.length > 0 || usablePhones.length > 0) && !top.sources.includes("Web scraping")) {
      top.sources.push("Web scraping");
    }
  } else if (usableEmails.length > 0 || usablePhones.length > 0 || relevantSocials.length > 0) {
    personResults.push({
      id: "",
      fullName: titleCase(name),
      photoUrl: null,
      location: null,
      bio: serpResults[0]?.snippet || null,
      company: extra || null,
      jobTitle: null,
      matchScore: 60,
      emails: usableEmails,
      phones: usablePhones,
      socials: relevantSocials,
      sources: ["Web scraping"],
    });
  }

  // ── Step 10: Dedupe + sort ───────────────────────────────────────
  for (const p of personResults) {
    const eSeen = new Set<string>();
    p.emails = p.emails.filter((e) => (eSeen.has(e.email) ? false : (eSeen.add(e.email), true)));
    p.emails.sort((a, b) => b.confidence - a.confidence);

    const sSeen = new Set<string>();
    p.socials = p.socials.filter((s) => (sSeen.has(s.platform) ? false : (sSeen.add(s.platform), true)));

    const phSeen = new Set<string>();
    p.phones = p.phones.filter((ph) => (phSeen.has(ph.phone) ? false : (phSeen.add(ph.phone), true)));
  }
  personResults.sort((a, b) => b.matchScore - a.matchScore);

  diagnostics.totalDurationMs = Date.now() - searchStart;

  // ── Step 11: Persist to DB ───────────────────────────────────────
  const searchRecord = await prisma.searchRecord.create({
    data: { userId, query, queryType: type, creditsUsed: 2, resultCount: personResults.length },
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
          create: result.phones.map((p) => ({ phone: p.phone, confidence: p.confidence, source: p.source })),
        },
        socialProfiles: {
          create: result.socials.map((s) => ({ platform: s.platform, username: s.username, profileUrl: s.url })),
        },
        ...(result.company
          ? { professional: { create: { company: result.company, jobTitle: result.jobTitle } } }
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
          create: { searchId: searchRecord.id, matchScore: result.matchScore, matchedOn: result.sources },
        },
      },
    });
    result.id = person.id;
  }

  return { results: personResults, creditsUsed: 2, searchId: searchRecord.id, diagnostics };
}

// ─── Helpers ──────────────────────────────────────────────

function parseQuery(query: string, type: string): { name: string; extra: string } {
  if (type === "email" || type === "phone" || type === "domain") {
    return { name: query.trim(), extra: "" };
  }
  const parts = query.split(",").map((s) => s.trim());
  return { name: parts[0], extra: parts.slice(1).join(", ") };
}

function pageMentionsPerson(page: ScrapedPage, nameParts: string[], extra: string): boolean {
  if (nameParts.length === 0) return false;
  const body = page.bodyText;
  const title = page.title.toLowerCase();

  if (nameParts.length >= 2) {
    const [a, b] = nameParts.slice(0, 2);
    if ((body.includes(a) && body.includes(b)) || (title.includes(a) && title.includes(b))) return true;
    const joined = nameParts.join(" ");
    if (body.includes(joined) || title.includes(joined)) return true;
    return false;
  }

  const single = nameParts[0];
  if (!body.includes(single) && !title.includes(single)) return false;
  if (extra) {
    const e = extra.toLowerCase();
    return body.includes(e) || title.includes(e);
  }
  return true;
}

function guessPersonalDomains(nameParts: string[]): string[] {
  if (nameParts.length < 2) return [];
  const first = nameParts[0].replace(/[^a-z]/g, "");
  const last = nameParts[nameParts.length - 1].replace(/[^a-z]/g, "");
  if (!first || !last) return [];
  return [
    `${first}${last}.com`,
    `${first}-${last}.com`,
    `${first}.${last}.com`,
    `${last}${first}.com`,
    `${first}${last}.me`,
    `${first}-${last}.me`,
    `${first}${last}.dev`,
    `${first}${last}.io`,
    `${first}${last}.net`,
    `${first}.${last}.dev`,
  ];
}

function hostnameFromUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Web";
  }
}

function titleCase(s: string): string {
  return s.split(/\s+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
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
