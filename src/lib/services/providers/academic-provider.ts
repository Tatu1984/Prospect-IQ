import { searchOpenAlex, searchCrossref } from "../academic";
import type { Provider, ProviderPerson } from "./types";

export const openAlexProvider: Provider = {
  id: "openalex",
  label: "OpenAlex",
  isEnabled: () => true,
  costPerCallUsd: 0,
  async run(query) {
    if (query.type !== "name") return [];

    const results = await searchOpenAlex(query.name, 4);
    return results.map((a): ProviderPerson => {
      const socials: ProviderPerson["socials"] = [];
      if (a.orcid) {
        const id = a.orcid.replace("https://orcid.org/", "");
        socials.push({
          platform: "orcid",
          username: id,
          url: a.orcid.startsWith("http") ? a.orcid : `https://orcid.org/${id}`,
        });
      }
      return {
        fullName: a.name,
        photoUrl: null,
        location: null,
        bio: a.affiliation ? `Researcher at ${a.affiliation}` : null,
        company: a.affiliation,
        jobTitle: "Researcher",
        emails: [],
        phones: [],
        socials,
      };
    });
  },
};

export const crossrefProvider: Provider = {
  id: "crossref",
  label: "Crossref",
  isEnabled: () => true,
  costPerCallUsd: 0,
  async run(query) {
    if (query.type !== "name") return [];

    const results = await searchCrossref(query.name, 4);
    return results.map(
      (a): ProviderPerson => ({
        fullName: a.name,
        photoUrl: null,
        location: null,
        bio: a.affiliation ? `Published author at ${a.affiliation}` : null,
        company: a.affiliation,
        jobTitle: "Author",
        emails: [],
        phones: [],
        socials: a.orcid
          ? [{ platform: "orcid", username: a.orcid, url: `https://orcid.org/${a.orcid}` }]
          : [],
      })
    );
  },
};
