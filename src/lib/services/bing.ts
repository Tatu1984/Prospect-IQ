// Bing search scraper — free, no API key.
// Parses the HTML search results page.

import * as cheerio from "cheerio";
import type { DuckResult } from "./duckduckgo";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

export async function searchBing(query: string, maxResults = 10): Promise<DuckResult[]> {
  try {
    const url = `https://www.bing.com/search?q=${encodeURIComponent(query)}&count=${maxResults}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];

    const html = await res.text();
    const $ = cheerio.load(html);
    const results: DuckResult[] = [];

    $("li.b_algo").each((_, el) => {
      if (results.length >= maxResults) return;
      const $el = $(el);
      const title = $el.find("h2").first().text().trim();
      const url = $el.find("h2 a").first().attr("href") || "";
      const snippet = $el.find(".b_caption p").first().text().trim() || $el.find("p").first().text().trim();
      if (url && url.startsWith("http")) {
        results.push({ title, url, snippet });
      }
    });

    return results;
  } catch {
    return [];
  }
}
