// Clearbit provider — stub. Activates when CLEARBIT_API_KEY is set.
// Clearbit Person API returns enriched profiles from email or domain.
//
// Pricing: $99/mo base + $0.02/lookup (volume discounts at higher tiers)

import type { Provider, ProviderPerson, ProviderQuery } from "./types";

const API_KEY = process.env.CLEARBIT_API_KEY || "";

export const clearbitProvider: Provider = {
  id: "clearbit",
  label: "Clearbit",
  isEnabled: () => API_KEY.length > 0,
  costPerCallUsd: 0.02,
  async run(query: ProviderQuery): Promise<ProviderPerson[]> {
    if (!API_KEY) return [];
    // Clearbit works best with email/domain, not name
    if (query.type !== "email" && query.type !== "domain") return [];

    // TODO:
    // const res = await fetch(
    //   `https://person.clearbit.com/v2/people/find?email=${email}`,
    //   { headers: { Authorization: `Bearer ${API_KEY}` } }
    // );

    console.warn("[clearbit] stub — set CLEARBIT_API_KEY to activate");
    return [];
  },
};
