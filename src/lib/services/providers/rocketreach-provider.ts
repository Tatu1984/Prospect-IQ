// RocketReach provider — stub. Activates when ROCKETREACH_API_KEY is set.
// RocketReach offers person lookup with emails, phones, and social profiles.
//
// Pricing: Essentials $69/mo (170 lookups), Pro $119/mo (400 lookups)
// ~$0.30-$0.40 per lookup

import type { Provider, ProviderPerson, ProviderQuery } from "./types";

const API_KEY = process.env.ROCKETREACH_API_KEY || "";

export const rocketreachProvider: Provider = {
  id: "rocketreach",
  label: "RocketReach",
  isEnabled: () => API_KEY.length > 0,
  costPerCallUsd: 0.35,
  async run(query: ProviderQuery): Promise<ProviderPerson[]> {
    if (!API_KEY) return [];
    if (query.type !== "name") return [];

    // TODO:
    // const res = await fetch("https://api.rocketreach.co/v2/api/lookupProfile", {
    //   method: "GET",
    //   headers: { "Api-Key": API_KEY },
    //   // params: name + current_employer
    // });

    console.warn("[rocketreach] stub — set ROCKETREACH_API_KEY to activate");
    return [];
  },
};
