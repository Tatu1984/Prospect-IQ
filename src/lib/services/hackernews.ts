// HackerNews search via Algolia public API — free, no key.
// Great for finding tech founders, engineers, writers by username or mentions.

export interface HNHit {
  type: "story" | "comment";
  author: string;
  title: string | null;
  url: string | null;
  commentText: string | null;
  storyId: number;
  createdAt: string;
  objectID: string;
}

export async function searchHackerNews(query: string, maxResults = 10): Promise<HNHit[]> {
  try {
    const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&hitsPerPage=${maxResults}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.hits || []).map((h: Record<string, unknown>) => ({
      type: (h._tags as string[] | undefined)?.includes("comment") ? "comment" : "story",
      author: (h.author as string) || "",
      title: (h.title as string | null) || null,
      url: (h.url as string | null) || null,
      commentText: (h.comment_text as string | null) || null,
      storyId: (h.story_id as number) || 0,
      createdAt: (h.created_at as string) || "",
      objectID: (h.objectID as string) || "",
    }));
  } catch {
    return [];
  }
}

export async function getHNUser(username: string): Promise<{
  about: string | null;
  karma: number;
  createdAt: string;
} | null> {
  try {
    const res = await fetch(`https://hn.algolia.com/api/v1/users/${encodeURIComponent(username)}`, {
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      about: data.about ?? null,
      karma: data.karma ?? 0,
      createdAt: data.created_at ?? "",
    };
  } catch {
    return null;
  }
}
