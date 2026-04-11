// Wikipedia + Wikidata — free public APIs, no key.
// Finds public figures, academics, executives, authors, artists.

export interface WikiPerson {
  title: string;
  description: string | null;
  extract: string | null;
  pageUrl: string;
  thumbnail: string | null;
  wikidataId: string | null;
}

const USER_AGENT = "ProspectIQ/1.0 (research contact discovery)";

export async function searchWikipedia(query: string, maxResults = 3): Promise<WikiPerson[]> {
  try {
    // 1. Full-text search
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=${encodeURIComponent(query)}&srlimit=${maxResults}&origin=*`;
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const hits: Array<{ title: string; pageid: number }> = data.query?.search ?? [];
    if (hits.length === 0) return [];

    // 2. Fetch page summaries + pageprops (wikidata id) in parallel
    const pages = await Promise.all(
      hits.map(async (hit) => {
        try {
          const summaryRes = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(hit.title)}`,
            { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(8_000) }
          );
          if (!summaryRes.ok) return null;
          const summary = await summaryRes.json();

          // Only keep person entries (type=disambiguation is not a person)
          const description: string | undefined = summary.description;
          if (summary.type === "disambiguation") return null;

          return {
            title: summary.title as string,
            description: description ?? null,
            extract: summary.extract ?? null,
            pageUrl: summary.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`,
            thumbnail: summary.thumbnail?.source ?? null,
            wikidataId: summary.wikibase_item ?? null,
          } as WikiPerson;
        } catch {
          return null;
        }
      })
    );

    return pages.filter((p): p is WikiPerson => p !== null);
  } catch {
    return [];
  }
}
