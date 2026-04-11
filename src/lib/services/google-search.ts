// Google Custom Search API — SERP mining for finding people

export interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

export async function searchGoogle(query: string, maxResults = 10): Promise<GoogleSearchResult[]> {
  const apiKey = process.env.GOOGLE_CSE_API_KEY;
  const cx = process.env.GOOGLE_CSE_CX;

  if (!apiKey || !cx) return [];

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=${Math.min(maxResults, 10)}`;
    const res = await fetch(url);

    if (!res.ok) return [];

    const data = await res.json();
    return (data.items || []).map((item: { title: string; link: string; snippet: string; displayLink: string }) => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      displayLink: item.displayLink,
    }));
  } catch {
    return [];
  }
}

// Extract potential emails and phones from SERP snippets
export function extractContactsFromSnippets(results: GoogleSearchResult[]): {
  emails: string[];
  phones: string[];
} {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(?:\+\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;

  const emails = new Set<string>();
  const phones = new Set<string>();

  for (const r of results) {
    const text = `${r.title} ${r.snippet}`;
    const foundEmails = text.match(emailRegex) || [];
    const foundPhones = text.match(phoneRegex) || [];

    foundEmails.forEach((e) => emails.add(e.toLowerCase()));
    foundPhones.forEach((p) => {
      const clean = p.replace(/[^\d+]/g, "");
      if (clean.length >= 10) phones.add(p.trim());
    });
  }

  return { emails: Array.from(emails), phones: Array.from(phones) };
}

// Detect social profile URLs from SERP results
export function extractSocialProfiles(results: GoogleSearchResult[]): {
  platform: string;
  url: string;
  username: string;
}[] {
  const socialPatterns: { platform: string; regex: RegExp }[] = [
    { platform: "linkedin", regex: /linkedin\.com\/in\/([a-zA-Z0-9_-]+)/ },
    { platform: "twitter", regex: /(?:twitter|x)\.com\/([a-zA-Z0-9_]+)/ },
    { platform: "instagram", regex: /instagram\.com\/([a-zA-Z0-9_.]+)/ },
    { platform: "github", regex: /github\.com\/([a-zA-Z0-9-]+)/ },
    { platform: "facebook", regex: /facebook\.com\/([a-zA-Z0-9.]+)/ },
  ];

  const found: { platform: string; url: string; username: string }[] = [];
  const seen = new Set<string>();

  for (const r of results) {
    for (const { platform, regex } of socialPatterns) {
      const match = r.link.match(regex);
      if (match && !seen.has(`${platform}:${match[1]}`)) {
        seen.add(`${platform}:${match[1]}`);
        found.push({ platform, url: r.link, username: match[1] });
      }
    }
  }

  return found;
}
