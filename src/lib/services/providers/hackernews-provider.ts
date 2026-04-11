import { searchHackerNews, getHNUser } from "../hackernews";
import type { Provider, ProviderPerson } from "./types";

export const hackerNewsProvider: Provider = {
  id: "hackernews",
  label: "HackerNews",
  isEnabled: () => true,
  costPerCallUsd: 0,
  async run(query) {
    if (query.type !== "name" && query.type !== "username") return [];

    const results = await searchHackerNews(query.name, 8);

    // Group by author
    const authorCounts = new Map<string, number>();
    for (const h of results) {
      if (h.author) authorCounts.set(h.author, (authorCounts.get(h.author) ?? 0) + 1);
    }

    const persons: ProviderPerson[] = [];
    for (const [author, count] of Array.from(authorCounts.entries()).slice(0, 3)) {
      const profile = await getHNUser(author);
      persons.push({
        fullName: author,
        photoUrl: null,
        location: null,
        bio: profile?.about?.slice(0, 400) ?? `Active on HackerNews (${count} items)`,
        company: null,
        jobTitle: null,
        emails: [],
        phones: [],
        socials: [
          {
            platform: "hackernews",
            username: author,
            url: `https://news.ycombinator.com/user?id=${author}`,
          },
        ],
      });
    }

    return persons;
  },
};
