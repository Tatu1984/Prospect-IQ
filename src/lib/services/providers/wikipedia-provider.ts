import { searchWikipedia } from "../wikipedia";
import type { Provider, ProviderPerson } from "./types";

export const wikipediaProvider: Provider = {
  id: "wikipedia",
  label: "Wikipedia",
  isEnabled: () => true,
  costPerCallUsd: 0,
  async run(query) {
    if (query.type !== "name") return [];

    const results = await searchWikipedia(
      query.extra ? `${query.name} ${query.extra}` : query.name,
      3
    );

    return results.map(
      (w): ProviderPerson => ({
        fullName: w.title,
        photoUrl: w.thumbnail,
        location: null,
        bio: w.extract ? w.extract.slice(0, 400) : w.description,
        company: w.description,
        jobTitle: null,
        emails: [],
        phones: [],
        socials: [{ platform: "wikipedia", username: w.title, url: w.pageUrl }],
      })
    );
  },
};
