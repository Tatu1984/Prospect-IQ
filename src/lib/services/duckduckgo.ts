// DuckDuckGo HTML scraper — free, no API key, independent SERP source.
// Uses the HTML version of DuckDuckGo which is explicitly designed to be
// parseable without JavaScript.

import * as cheerio from "cheerio";

export interface DuckResult {
  title: string;
  url: string;
  snippet: string;
}

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export async function searchDuckDuckGo(query: string, maxResults = 10): Promise<DuckResult[]> {
  try {
    const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      // DuckDuckGo can be slow; 15s timeout
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const results: DuckResult[] = [];

    // DuckDuckGo HTML uses .result for each search result
    $(".result").each((_, el) => {
      if (results.length >= maxResults) return;

      const $el = $(el);
      const title = $el.find(".result__title").text().trim();
      let resultUrl = $el.find(".result__url").attr("href") || $el.find(".result__title a").attr("href") || "";
      const snippet = $el.find(".result__snippet").text().trim();

      // DuckDuckGo wraps URLs in a redirect. Unwrap it.
      if (resultUrl.startsWith("//duckduckgo.com/l/?uddg=")) {
        try {
          const params = new URLSearchParams(resultUrl.split("?")[1]);
          const decoded = params.get("uddg");
          if (decoded) resultUrl = decodeURIComponent(decoded);
        } catch {
          // keep original
        }
      }

      if (resultUrl && !resultUrl.startsWith("//")) {
        if (!resultUrl.startsWith("http")) resultUrl = `https://${resultUrl}`;
        results.push({ title, url: resultUrl, snippet });
      }
    });

    return results;
  } catch {
    return [];
  }
}

// Extract contact info from snippet text (pre-scrape quick wins)
export function extractFromSnippets(results: DuckResult[]): {
  emails: Set<string>;
  phones: Set<string>;
} {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  // Strict phone: requires country code OR area code in parens, then 7-10 digits with separators
  const phoneRegex =
    /(?:\+\d{1,3}[-.\s]\d{2,4}[-.\s]\d{3,4}[-.\s]\d{3,4}|\(\d{3}\)\s?\d{3}[-.\s]\d{4}|\+\d{10,15})/g;

  const emails = new Set<string>();
  const phones = new Set<string>();

  for (const r of results) {
    const text = `${r.title} ${r.snippet}`;
    (text.match(emailRegex) || []).forEach((e) => {
      const clean = e.toLowerCase().trim();
      // Filter obvious junk
      if (!clean.includes("@example.") && !clean.includes("@domain.") && !clean.endsWith(".png") && !clean.endsWith(".jpg")) {
        emails.add(clean);
      }
    });
    (text.match(phoneRegex) || []).forEach((p) => phones.add(p.trim()));
  }

  return { emails, phones };
}

// Detect social profile URLs from result URLs.
// These patterns must match ONLY profile URLs (not search/watch/share pages).
const SOCIAL_PATTERNS: { platform: string; regex: RegExp }[] = [
  { platform: "linkedin", regex: /linkedin\.com\/in\/([a-zA-Z0-9_\-%]+)\/?(?:$|\?)/ },
  // Twitter/X: username must not be followed by /status, /search, etc.
  { platform: "twitter", regex: /(?:twitter|x)\.com\/([a-zA-Z0-9_]{1,15})\/?(?:$|\?)/ },
  { platform: "instagram", regex: /instagram\.com\/([a-zA-Z0-9_.]+)\/?(?:$|\?)/ },
  { platform: "github", regex: /github\.com\/([a-zA-Z0-9-]+)\/?(?:$|\?)/ },
  { platform: "facebook", regex: /facebook\.com\/([a-zA-Z0-9.]+)\/?(?:$|\?)/ },
  { platform: "youtube", regex: /youtube\.com\/@([a-zA-Z0-9_-]+)\/?(?:$|\?)/ },
  { platform: "reddit", regex: /reddit\.com\/user\/([a-zA-Z0-9_-]+)\/?(?:$|\?)/ },
  { platform: "medium", regex: /medium\.com\/@([a-zA-Z0-9_-]+)\/?(?:$|\?)/ },
];

// Reserved paths that aren't profile usernames
const RESERVED_USERNAMES = new Set([
  "watch", "search", "share", "sharer", "intent", "home", "login", "signup",
  "signin", "about", "help", "privacy", "terms", "tos", "explore", "trending",
  "news", "stories", "reel", "reels", "tv", "live", "p", "tag", "tagged",
  "directory", "pages", "groups", "events", "marketplace", "gaming", "watch",
  "status", "hashtag", "i", "messages", "settings", "notifications",
  "britannica", "wikipedia",
]);

export function extractSocialProfiles(results: DuckResult[]): {
  platform: string;
  url: string;
  username: string;
}[] {
  const found: { platform: string; url: string; username: string }[] = [];
  const seen = new Set<string>();

  for (const r of results) {
    for (const { platform, regex } of SOCIAL_PATTERNS) {
      const match = r.url.match(regex);
      if (!match) continue;

      const username = match[1];
      // Filter reserved/junk usernames
      if (RESERVED_USERNAMES.has(username.toLowerCase())) continue;
      if (username.length < 2 || username.length > 50) continue;

      const key = `${platform}:${username.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      found.push({ platform, url: r.url, username });
    }
  }

  return found;
}
