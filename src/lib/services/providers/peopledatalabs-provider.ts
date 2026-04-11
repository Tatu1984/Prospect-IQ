// PeopleDataLabs provider — stub. Activates when PDL_API_KEY is set.
// PeopleDataLabs has 3B+ people records, one of the largest datasets.
//
// Pricing: Pay-as-you-go $0.05/match, volume discounts at scale

import type { Provider, ProviderPerson, ProviderQuery } from "./types";

const API_KEY = process.env.PDL_API_KEY || "";

export const peopledatalabsProvider: Provider = {
  id: "peopledatalabs",
  label: "PeopleDataLabs",
  isEnabled: () => API_KEY.length > 0,
  costPerCallUsd: 0.05,
  async run(query: ProviderQuery): Promise<ProviderPerson[]> {
    if (!API_KEY) return [];

    // TODO:
    // const res = await fetch("https://api.peopledatalabs.com/v5/person/enrich", {
    //   method: "POST",
    //   headers: { "X-Api-Key": API_KEY, "Content-Type": "application/json" },
    //   body: JSON.stringify({ name: query.name, company: query.extra }),
    // });

    console.warn("[peopledatalabs] stub — set PDL_API_KEY to activate");
    return [];
  },
};
