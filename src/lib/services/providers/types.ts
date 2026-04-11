// Provider interface — lets us plug in any data source (free or paid)
// behind a uniform contract. Each provider reports its own cost so we
// can price searches accurately.

export interface ProviderQuery {
  name: string;
  extra: string;
  nameParts: string[];
  type: "name" | "email" | "phone" | "username" | "domain" | "company";
}

export interface ProviderPerson {
  fullName: string;
  photoUrl?: string | null;
  location?: string | null;
  bio?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  emails: Array<{ email: string; source: string; sourceUrl?: string | null }>;
  phones: Array<{ phone: string; source: string; sourceUrl?: string | null }>;
  socials: Array<{ platform: string; username: string; url: string }>;
}

export interface ProviderResult {
  providerId: string;
  persons: ProviderPerson[];
  rawCostUsd: number; // API call cost (0 for free sources)
  durationMs: number;
  error: string | null;
}

export interface Provider {
  id: string;
  label: string;
  /** true if required env vars are set and provider is ready to run */
  isEnabled: () => boolean;
  /** Per-call cost in USD (for pricing — 0 for free) */
  costPerCallUsd: number;
  /** Execute the lookup */
  run: (query: ProviderQuery) => Promise<ProviderPerson[]>;
}
