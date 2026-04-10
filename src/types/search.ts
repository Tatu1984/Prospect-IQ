import type { Person } from "./person";

export type SearchType =
  | "name"
  | "email"
  | "phone"
  | "username"
  | "domain"
  | "company"
  | "natural_language";

export interface SearchQuery {
  q: string;
  type: SearchType;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

export interface SearchFilters {
  country?: string;
  industry?: string;
  companySize?: string;
  seniority?: string;
  socialPresence?: SocialPresenceFilter;
  dataType?: ("email" | "phone" | "social")[];
}

export type SocialPresenceFilter = "any" | "verified" | "high_followers";

export interface SearchResult {
  person: Person;
  matchScore: number;
  matchedOn: string[];
  previewFields: {
    email?: string;
    phone?: string;
    company?: string;
    title?: string;
  };
  isRevealed: boolean;
}

export interface SearchResponse {
  data: SearchResult[];
  meta: PaginationMeta;
  searchId: string;
  creditsUsed: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SearchRecord {
  id: string;
  userId: string;
  query: string;
  queryType: SearchType;
  creditsUsed: number;
  resultCount: number;
  cachedAt: string | null;
  createdAt: string;
}
