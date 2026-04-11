// Email pattern generator — infer likely email addresses from name + domain

export interface GeneratedEmail {
  email: string;
  pattern: string;
  confidence: number;
}

const COMMON_PATTERNS = [
  { pattern: "first.last", confidence: 85 },
  { pattern: "firstlast", confidence: 70 },
  { pattern: "first", confidence: 60 },
  { pattern: "flast", confidence: 65 },
  { pattern: "first_last", confidence: 55 },
  { pattern: "f.last", confidence: 50 },
  { pattern: "last.first", confidence: 40 },
  { pattern: "lastfirst", confidence: 35 },
  { pattern: "first.l", confidence: 30 },
];

export function generateEmailPatterns(fullName: string, domain: string): GeneratedEmail[] {
  const parts = fullName.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2 || !domain) return [];

  const first = parts[0].replace(/[^a-z]/g, "");
  const last = parts[parts.length - 1].replace(/[^a-z]/g, "");

  if (!first || !last) return [];

  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");

  return COMMON_PATTERNS.map(({ pattern, confidence }) => {
    let local: string;
    switch (pattern) {
      case "first.last": local = `${first}.${last}`; break;
      case "firstlast": local = `${first}${last}`; break;
      case "first": local = first; break;
      case "flast": local = `${first[0]}${last}`; break;
      case "first_last": local = `${first}_${last}`; break;
      case "f.last": local = `${first[0]}.${last}`; break;
      case "last.first": local = `${last}.${first}`; break;
      case "lastfirst": local = `${last}${first}`; break;
      case "first.l": local = `${first}.${last[0]}`; break;
      default: local = `${first}.${last}`;
    }
    return { email: `${local}@${cleanDomain}`, pattern, confidence };
  });
}

// Common free email providers — if person has no company, try these
const FREE_PROVIDERS = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];

export function generateFreeEmailGuesses(fullName: string): GeneratedEmail[] {
  const parts = fullName.trim().toLowerCase().split(/\s+/);
  if (parts.length < 2) return [];

  const first = parts[0].replace(/[^a-z]/g, "");
  const last = parts[parts.length - 1].replace(/[^a-z]/g, "");

  if (!first || !last) return [];

  // Only generate the most common patterns for free providers
  return FREE_PROVIDERS.flatMap((domain) => [
    { email: `${first}.${last}@${domain}`, pattern: "first.last", confidence: 25 },
    { email: `${first}${last}@${domain}`, pattern: "firstlast", confidence: 20 },
  ]);
}
