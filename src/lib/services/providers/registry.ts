// Provider registry — lists all available providers (free + paid stubs).
// Paid providers only activate when their env vars are present, so you
// can drop in API keys later and they'll start contributing automatically.

import type { Provider, ProviderQuery, ProviderResult } from "./types";
import { githubProvider } from "./github-provider";
import { gitlabProvider } from "./gitlab-provider";
import { wikipediaProvider } from "./wikipedia-provider";
import { openAlexProvider, crossrefProvider } from "./academic-provider";
import { hackerNewsProvider } from "./hackernews-provider";
// Paid / restricted — no-op until env vars are present
import { linkedinProvider } from "./linkedin-provider";
import { apolloProvider } from "./apollo-provider";
import { clearbitProvider } from "./clearbit-provider";
import { hunterProvider } from "./hunter-provider";
import { rocketreachProvider } from "./rocketreach-provider";
import { peopledatalabsProvider } from "./peopledatalabs-provider";

export const ALL_PROVIDERS: Provider[] = [
  // Free providers
  githubProvider,
  gitlabProvider,
  wikipediaProvider,
  openAlexProvider,
  crossrefProvider,
  hackerNewsProvider,
  // Paid providers (stubs — activate when env vars set)
  linkedinProvider,
  apolloProvider,
  clearbitProvider,
  hunterProvider,
  rocketreachProvider,
  peopledatalabsProvider,
];

export function getEnabledProviders(): Provider[] {
  return ALL_PROVIDERS.filter((p) => p.isEnabled());
}

export async function runProvider(
  provider: Provider,
  query: ProviderQuery
): Promise<ProviderResult> {
  const start = Date.now();
  try {
    const persons = await provider.run(query);
    return {
      providerId: provider.id,
      persons,
      rawCostUsd: persons.length > 0 ? provider.costPerCallUsd : 0,
      durationMs: Date.now() - start,
      error: null,
    };
  } catch (err) {
    return {
      providerId: provider.id,
      persons: [],
      rawCostUsd: 0,
      durationMs: Date.now() - start,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function runAllProviders(query: ProviderQuery): Promise<ProviderResult[]> {
  const enabled = getEnabledProviders();
  return Promise.all(enabled.map((p) => runProvider(p, query)));
}
