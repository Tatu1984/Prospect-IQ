// LinkedIn provider — stub. Activates when LINKEDIN_API_KEY or
// LINKEDIN_COOKIE is set. Supports: official LinkedIn API, unofficial
// scraping libraries (puppeteer + cookie), or aggregator APIs like
// Proxycurl/RapidAPI LinkedIn endpoints.
//
// Implementation path when ready:
//  1. Get Proxycurl / LinkedIn People API key
//  2. Set LINKEDIN_API_KEY and LINKEDIN_API_PROVIDER=proxycurl in env
//  3. Fill in fetchLinkedInPerson below

import type { Provider, ProviderPerson, ProviderQuery } from "./types";

const API_KEY = process.env.LINKEDIN_API_KEY || "";
const PROVIDER_NAME = process.env.LINKEDIN_API_PROVIDER || "proxycurl"; // proxycurl | rapidapi | custom

export const linkedinProvider: Provider = {
  id: "linkedin",
  label: "LinkedIn",
  isEnabled: () => API_KEY.length > 0,
  // Proxycurl pricing: ~$0.01 per lookup for person endpoint
  costPerCallUsd: 0.01,
  async run(query: ProviderQuery): Promise<ProviderPerson[]> {
    if (!API_KEY) return [];
    if (query.type !== "name" && query.type !== "company" && query.type !== "domain") return [];

    // TODO: implement real fetch when API key is supplied
    // Example Proxycurl call:
    //
    // const res = await fetch(
    //   `https://nubela.co/proxycurl/api/linkedin/profile/resolve?first_name=${first}&last_name=${last}&company_domain=${extra}`,
    //   { headers: { Authorization: `Bearer ${API_KEY}` } }
    // );
    // const data = await res.json();
    // return [{ fullName: data.full_name, ... }];

    console.warn(`[linkedin] provider=${PROVIDER_NAME} not yet implemented — set LINKEDIN_API_KEY to activate`);
    return [];
  },
};
