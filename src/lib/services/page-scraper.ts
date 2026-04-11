// Page scraper — fetches a real web page and extracts emails, phones,
// and social profiles from the HTML. Respects a short timeout so one
// slow page can't stall the whole search.

import * as cheerio from "cheerio";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export interface ScrapedPage {
  url: string;
  title: string;
  emails: string[];
  phones: string[];
  socials: { platform: string; url: string; username: string }[];
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PHONE_REGEX =
  /(?:\+\d{1,3}[-.\s]?\d{2,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}|\(\d{3}\)\s?\d{3}[-.\s]?\d{4})/g;

// Paths we avoid to keep scraping polite and avoid binaries
const SKIP_EXT = /\.(pdf|zip|rar|tar|gz|jpg|jpeg|png|gif|svg|mp4|mp3|webm)(\?|$)/i;

export async function scrapePage(url: string): Promise<ScrapedPage | null> {
  if (SKIP_EXT.test(url)) return null;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) return null;

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return null;
    }

    const html = await res.text();
    // Cap at 500KB to avoid parsing massive pages
    const truncated = html.length > 500_000 ? html.slice(0, 500_000) : html;

    return extractFromHtml(url, truncated);
  } catch {
    return null;
  }
}

function extractFromHtml(url: string, html: string): ScrapedPage {
  const $ = cheerio.load(html);
  const title = $("title").text().trim() || $("h1").first().text().trim();

  // Strip script/style to avoid false positive matches
  $("script, style, noscript").remove();
  const text = $("body").text();

  // Emails — raw text + mailto: links
  const emails = new Set<string>();
  (text.match(EMAIL_REGEX) || []).forEach((e) => {
    const clean = e.toLowerCase().trim();
    if (isValidContactEmail(clean)) emails.add(clean);
  });
  $("a[href^='mailto:']").each((_, el) => {
    const href = $(el).attr("href") || "";
    const email = href.replace(/^mailto:/, "").split("?")[0].toLowerCase().trim();
    if (isValidContactEmail(email)) emails.add(email);
  });

  // Phones — raw text + tel: links
  const phones = new Set<string>();
  (text.match(PHONE_REGEX) || []).forEach((p) => {
    const clean = p.trim();
    if (isValidPhone(clean)) phones.add(clean);
  });
  $("a[href^='tel:']").each((_, el) => {
    const href = $(el).attr("href") || "";
    const phone = href.replace(/^tel:/, "").trim();
    if (isValidPhone(phone)) phones.add(phone);
  });

  // Socials — <a href> anywhere on page
  const socials: ScrapedPage["socials"] = [];
  const socialSeen = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const social = detectSocial(href);
    if (social && !socialSeen.has(`${social.platform}:${social.username}`)) {
      socialSeen.add(`${social.platform}:${social.username}`);
      socials.push(social);
    }
  });

  return {
    url,
    title,
    emails: Array.from(emails),
    phones: Array.from(phones),
    socials,
  };
}

function isValidContactEmail(email: string): boolean {
  if (!email.includes("@")) return false;
  if (email.length > 100) return false;
  // Reject obvious junk
  const junkPatterns = [
    /@example\./,
    /@domain\./,
    /@test\./,
    /@yourdomain\./,
    /@your-?site\./,
    /noreply@/,
    /no-reply@/,
    /donotreply@/,
    /@sentry\.io$/,
    /@w3\.org$/,
    /@schema\.org$/,
    /\.(png|jpg|jpeg|gif|svg|webp)$/,
    /^[a-f0-9]{32,}@/, // md5 hashes
  ];
  return !junkPatterns.some((r) => r.test(email));
}

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  // Must have between 10 and 15 digits (international range)
  return digits.length >= 10 && digits.length <= 15;
}

const RESERVED_USERNAMES = new Set([
  "watch", "search", "share", "sharer", "intent", "home", "login", "signup",
  "signin", "about", "help", "privacy", "terms", "tos", "explore", "trending",
  "news", "stories", "reel", "reels", "tv", "live", "p", "tag", "tagged",
  "directory", "pages", "groups", "events", "marketplace", "gaming",
  "status", "hashtag", "i", "messages", "settings", "notifications",
]);

function detectSocial(href: string): { platform: string; url: string; username: string } | null {
  const patterns: { platform: string; regex: RegExp }[] = [
    { platform: "linkedin", regex: /linkedin\.com\/in\/([a-zA-Z0-9_\-%]+)\/?(?:$|\?)/ },
    { platform: "twitter", regex: /(?:twitter|x)\.com\/([a-zA-Z0-9_]{1,15})\/?(?:$|\?)/ },
    { platform: "instagram", regex: /instagram\.com\/([a-zA-Z0-9_.]+)\/?(?:$|\?)/ },
    { platform: "github", regex: /github\.com\/([a-zA-Z0-9-]+)\/?(?:$|\?)/ },
    { platform: "facebook", regex: /facebook\.com\/([a-zA-Z0-9.]+)\/?(?:$|\?)/ },
    { platform: "youtube", regex: /youtube\.com\/@([a-zA-Z0-9_-]+)\/?(?:$|\?)/ },
    { platform: "medium", regex: /medium\.com\/@([a-zA-Z0-9_-]+)\/?(?:$|\?)/ },
  ];

  for (const { platform, regex } of patterns) {
    const match = href.match(regex);
    if (!match) continue;

    const username = match[1];
    if (RESERVED_USERNAMES.has(username.toLowerCase())) continue;
    if (username.length < 2 || username.length > 50) continue;

    return { platform, url: href, username };
  }
  return null;
}

// Scrape multiple pages in parallel with concurrency limit
export async function scrapeMany(urls: string[], maxConcurrent = 5): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = [];
  for (let i = 0; i < urls.length; i += maxConcurrent) {
    const batch = urls.slice(i, i + maxConcurrent);
    const scraped = await Promise.all(batch.map(scrapePage));
    scraped.forEach((page) => {
      if (page) results.push(page);
    });
  }
  return results;
}
