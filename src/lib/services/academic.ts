// Academic sources — free public APIs.
// Crossref: 130M+ scholarly works with author names and affiliations.
// OpenAlex: 250M+ works with richer author data (ORCID, institutions).
// Results often include author emails in metadata.

export interface AcademicAuthor {
  name: string;
  affiliation: string | null;
  orcid: string | null;
  email: string | null;
  worksCount: number;
  sampleWorkTitle: string | null;
  sampleWorkUrl: string | null;
}

export async function searchOpenAlex(query: string, maxResults = 5): Promise<AcademicAuthor[]> {
  try {
    const url = `https://api.openalex.org/authors?search=${encodeURIComponent(query)}&per-page=${maxResults}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ProspectIQ/1.0 (mailto:research@prospectiq.local)",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const authors = data.results || [];

    return authors.map((a: Record<string, unknown>) => {
      const lastKnownInst = a.last_known_institutions as Array<Record<string, unknown>> | undefined;
      const inst = lastKnownInst?.[0];
      return {
        name: (a.display_name as string) || "",
        affiliation: (inst?.display_name as string) || null,
        orcid: (a.orcid as string) || null,
        email: null, // OpenAlex doesn't expose emails directly
        worksCount: (a.works_count as number) || 0,
        sampleWorkTitle: null,
        sampleWorkUrl: (a.id as string) || null,
      };
    });
  } catch {
    return [];
  }
}

// Crossref search — works+authors. Sometimes includes corresponding author email in metadata.
export async function searchCrossref(query: string, maxResults = 5): Promise<AcademicAuthor[]> {
  try {
    const url = `https://api.crossref.org/works?query.author=${encodeURIComponent(query)}&rows=${maxResults}&select=author,title,DOI,URL`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "ProspectIQ/1.0 (mailto:research@prospectiq.local)",
      },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];

    const data = await res.json();
    const items = data.message?.items || [];

    // Group authors by name
    const byName = new Map<string, AcademicAuthor>();
    for (const item of items) {
      const authors = item.author || [];
      const titleArr = item.title || [];
      const title = titleArr[0] || null;
      const doi = item.DOI || null;
      const workUrl = doi ? `https://doi.org/${doi}` : null;

      for (const author of authors) {
        const name = `${author.given || ""} ${author.family || ""}`.trim();
        if (!name) continue;

        if (!byName.has(name)) {
          byName.set(name, {
            name,
            affiliation: author.affiliation?.[0]?.name || null,
            orcid: author.ORCID || null,
            email: null,
            worksCount: 1,
            sampleWorkTitle: title,
            sampleWorkUrl: workUrl,
          });
        } else {
          const existing = byName.get(name)!;
          existing.worksCount++;
        }
      }
    }

    return Array.from(byName.values()).slice(0, maxResults);
  } catch {
    return [];
  }
}
