// Apollo.io provider — stub. Activates when APOLLO_API_KEY is set.
// Apollo has 120M+ B2B contacts with emails and phones.
//
// Pricing as of 2026:
//  - $0.05/enriched contact on pay-as-you-go
//  - $49/mo for 10K credits on starter

import type { Provider, ProviderPerson, ProviderQuery } from "./types";

const API_KEY = process.env.APOLLO_API_KEY || "";

export const apolloProvider: Provider = {
  id: "apollo",
  label: "Apollo.io",
  isEnabled: () => API_KEY.length > 0,
  costPerCallUsd: 0.05,
  async run(query: ProviderQuery): Promise<ProviderPerson[]> {
    if (!API_KEY) return [];

    // TODO: implement when API key supplied
    // Example:
    // const res = await fetch("https://api.apollo.io/v1/people/match", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json", "X-Api-Key": API_KEY },
    //   body: JSON.stringify({
    //     name: query.name,
    //     organization_name: query.extra,
    //     reveal_personal_emails: true,
    //     reveal_phone_number: true,
    //   }),
    // });

    console.warn("[apollo] stub — set APOLLO_API_KEY to activate");
    return [];
  },
};
