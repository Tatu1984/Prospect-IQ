// Hunter.io provider — stub. Activates when HUNTER_API_KEY is set.
// Hunter specializes in finding business emails by name + domain.
//
// Pricing: free (25/mo), Starter $49/mo (500 searches), etc.

import type { Provider, ProviderPerson, ProviderQuery } from "./types";

const API_KEY = process.env.HUNTER_API_KEY || "";

export const hunterProvider: Provider = {
  id: "hunter",
  label: "Hunter.io",
  isEnabled: () => API_KEY.length > 0,
  costPerCallUsd: 0.098, // ~$49/500 searches
  async run(query: ProviderQuery): Promise<ProviderPerson[]> {
    if (!API_KEY) return [];
    // Hunter's email-finder works best with name + company/domain
    if (query.type !== "name") return [];
    if (!query.extra) return []; // needs company to be useful

    // TODO:
    // const first = query.nameParts[0];
    // const last = query.nameParts[query.nameParts.length - 1];
    // const url = `https://api.hunter.io/v2/email-finder?domain=${query.extra}&first_name=${first}&last_name=${last}&api_key=${API_KEY}`;
    // const res = await fetch(url);

    console.warn("[hunter] stub — set HUNTER_API_KEY to activate");
    return [];
  },
};
