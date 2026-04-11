import { prisma } from "@/lib/db";
import { searchGitHub, getGitHubEmails } from "./github";
import { generateEmailPatterns, generateFreeEmailGuesses } from "./email-patterns";
import { searchGoogle, extractContactsFromSnippets, extractSocialProfiles } from "./google-search";

export interface SearchInput {
  query: string;
  type: "name" | "email" | "phone" | "username" | "domain" | "company";
  userId: string;
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
  emails: { email: string; confidence: number; source: string }[];
  phones: { phone: string; confidence: number; source: string }[];
  socials: { platform: string; username: string; url: string }[];
  sources: string[];
}

export async function executeSearch(input: SearchInput): Promise<{
  results: PersonResult[];
  creditsUsed: number;
  searchId: string;
}> {
  const { query, type, userId } = input;

  // Parse query — "Rahul Sharma, Bangalore" → name="Rahul Sharma", location="Bangalore"
  const { name, extra } = parseQuery(query, type);

  // Run all data sources in parallel
  // For GitHub, search by name only (extras like "Meta" hurt matching)
  const [githubResults, googleResults] = await Promise.all([
    type === "name" || type === "username"
      ? searchGitHub(name, 5)
      : Promise.resolve([]),
    searchGoogle(`${name} ${extra} contact email`.trim(), 10),
  ]);

  // Extract contacts from Google SERP
  const serpContacts = extractContactsFromSnippets(googleResults);
  const serpSocials = extractSocialProfiles(googleResults);

  // Build person results
  const personResults: PersonResult[] = [];

  // Process GitHub results
  for (const gh of githubResults) {
    const emails: { email: string; confidence: number; source: string }[] = [];
    const socials: { platform: string; username: string; url: string }[] = [
      { platform: "github", username: gh.username, url: gh.profileUrl },
    ];

    // Get emails from GitHub events
    const ghEmails = await getGitHubEmails(gh.username);
    for (const e of ghEmails) {
      emails.push({ email: e, confidence: 90, source: "GitHub commits" });
    }

    // If GitHub profile has email
    if (gh.email) {
      emails.push({ email: gh.email, confidence: 95, source: "GitHub profile" });
    }

    // Generate email patterns from GitHub company OR user-supplied company
    const companyForPatterns = gh.company || extra;
    if (companyForPatterns) {
      const domain = extractDomain(companyForPatterns);
      if (domain) {
        const patterns = generateEmailPatterns(gh.name, domain);
        patterns.slice(0, 4).forEach((p) =>
          emails.push({ email: p.email, confidence: p.confidence, source: `Pattern (${domain})` })
        );
      }
    }

    // Also try blog domain if available
    if (gh.blog) {
      const blogDomain = extractDomain(gh.blog);
      if (blogDomain) {
        const patterns = generateEmailPatterns(gh.name, blogDomain);
        patterns.slice(0, 2).forEach((p) =>
          emails.push({ email: p.email, confidence: p.confidence, source: `Pattern (${blogDomain})` })
        );
      }
    }

    // Add twitter if available
    if (gh.twitter) {
      socials.push({ platform: "twitter", username: gh.twitter, url: `https://x.com/${gh.twitter}` });
    }

    // Check for LinkedIn from SERP
    const linkedIn = serpSocials.find(
      (s) => s.platform === "linkedin" && gh.name.toLowerCase().split(" ").some((part) => s.username.toLowerCase().includes(part))
    );
    if (linkedIn) {
      socials.push(linkedIn);
    }

    // Calculate match score
    const matchScore = calculateMatchScore(name, extra, gh.name, gh.location, gh.company);

    personResults.push({
      id: "", // will be set after DB save
      fullName: gh.name,
      photoUrl: gh.avatarUrl,
      location: gh.location,
      bio: gh.bio,
      company: gh.company,
      jobTitle: null,
      matchScore,
      emails: dedupeEmails(emails),
      phones: [],
      socials,
      sources: ["GitHub"],
    });
  }

  // Add SERP-only contacts if they found emails/phones not attributed to GitHub profiles
  if (serpContacts.emails.length > 0 || serpContacts.phones.length > 0) {
    // Check if any SERP contacts match existing results
    const unmatched = serpContacts.emails.filter(
      (e) => !personResults.some((p) => p.emails.some((pe) => pe.email === e))
    );
    const unmatchedPhones = serpContacts.phones;

    if (unmatched.length > 0 || unmatchedPhones.length > 0) {
      // Try to add to highest-scoring result, or create a generic one
      if (personResults.length > 0) {
        for (const email of unmatched) {
          personResults[0].emails.push({ email, confidence: 60, source: "Google SERP" });
        }
        for (const phone of unmatchedPhones) {
          personResults[0].phones.push({ phone, confidence: 50, source: "Google SERP" });
        }
        if (!personResults[0].sources.includes("Google SERP")) {
          personResults[0].sources.push("Google SERP");
        }
      } else if (name) {
        // No GitHub results, create from SERP data
        personResults.push({
          id: "",
          fullName: name,
          photoUrl: null,
          location: null,
          bio: null,
          company: extra || null,
          jobTitle: null,
          matchScore: 40,
          emails: unmatched.map((e) => ({ email: e, confidence: 60, source: "Google SERP" })),
          phones: unmatchedPhones.map((p) => ({ phone: p, confidence: 50, source: "Google SERP" })),
          socials: serpSocials,
          sources: ["Google SERP"],
        });
      }
    }
  }

  // Add SERP social profiles to existing results
  for (const social of serpSocials) {
    for (const result of personResults) {
      if (!result.socials.some((s) => s.platform === social.platform)) {
        // Check name match
        const nameWords = result.fullName.toLowerCase().split(" ");
        if (nameWords.some((w) => social.username.toLowerCase().includes(w))) {
          result.socials.push(social);
          if (!result.sources.includes("Google SERP")) {
            result.sources.push("Google SERP");
          }
        }
      }
    }
  }

  // If no results at all and we have a name, generate email guesses
  if (personResults.length === 0 && name) {
    const allEmails: { email: string; confidence: number; source: string }[] = [];

    // Generate company-domain emails if extra looks like a company
    if (extra) {
      const domain = extractDomain(extra);
      if (domain) {
        const patterns = generateEmailPatterns(name, domain);
        patterns.slice(0, 4).forEach((p) =>
          allEmails.push({ email: p.email, confidence: p.confidence, source: `Pattern (${domain})` })
        );
      }
    }

    // Always add free provider guesses
    const freeGuesses = generateFreeEmailGuesses(name);
    freeGuesses.slice(0, 4).forEach((g) =>
      allEmails.push({ email: g.email, confidence: g.confidence, source: `Pattern (${g.pattern})` })
    );

    personResults.push({
      id: "",
      fullName: name,
      photoUrl: null,
      location: null,
      bio: null,
      company: extra || null,
      jobTitle: null,
      matchScore: extra ? 35 : 20,
      emails: allEmails,
      phones: [],
      socials: serpSocials,
      sources: ["Email Pattern Generator"],
    });
  }

  // Sort by match score
  personResults.sort((a, b) => b.matchScore - a.matchScore);

  // Save to database
  const searchRecord = await prisma.searchRecord.create({
    data: {
      userId,
      query,
      queryType: type,
      creditsUsed: 2,
      resultCount: personResults.length,
    },
  });

  // Save persons to DB
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
            source: e.source,
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
          create: result.sources.map((s) => ({
            sourceType: s,
          })),
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

  // Credits are deducted by the API route (atomic operation, prevents race condition)
  return {
    results: personResults,
    creditsUsed: 2,
    searchId: searchRecord.id,
  };
}

// ─── Helpers ─────────────────────────────────────────────

function parseQuery(query: string, type: string): { name: string; extra: string } {
  if (type === "email" || type === "phone" || type === "domain") {
    return { name: query.trim(), extra: "" };
  }
  // Split on comma — "Rahul Sharma, Bangalore" → name + location
  const parts = query.split(",").map((s) => s.trim());
  return { name: parts[0], extra: parts.slice(1).join(", ") };
}

function extractDomain(companyOrUrl: string): string | null {
  // If it looks like a URL or domain
  if (companyOrUrl.includes(".")) {
    return companyOrUrl.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");
  }
  // Try company name → domain guess
  const clean = companyOrUrl.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (clean.length > 2) return `${clean}.com`;
  return null;
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

  // Name matching
  const qParts = qName.split(/\s+/);
  const fParts = fName.split(/\s+/);
  const matchedParts = qParts.filter((p) => fParts.some((fp) => fp.includes(p) || p.includes(fp)));
  score += (matchedParts.length / Math.max(qParts.length, 1)) * 60;

  // Location matching
  if (queryExtra && foundLocation) {
    const qLoc = queryExtra.toLowerCase();
    const fLoc = foundLocation.toLowerCase();
    if (fLoc.includes(qLoc) || qLoc.includes(fLoc)) score += 20;
  }

  // Company matching
  if (queryExtra && foundCompany) {
    const qComp = queryExtra.toLowerCase();
    const fComp = foundCompany.toLowerCase();
    if (fComp.includes(qComp) || qComp.includes(fComp)) score += 20;
  }

  // Bonus for having data
  if (foundLocation) score += 5;
  if (foundCompany) score += 5;

  return Math.min(Math.round(score), 100);
}

function dedupeEmails(emails: { email: string; confidence: number; source: string }[]) {
  const seen = new Map<string, { email: string; confidence: number; source: string }>();
  for (const e of emails) {
    const existing = seen.get(e.email);
    if (!existing || existing.confidence < e.confidence) {
      seen.set(e.email, e);
    }
  }
  return Array.from(seen.values()).sort((a, b) => b.confidence - a.confidence);
}
