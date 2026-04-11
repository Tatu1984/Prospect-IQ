"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Building2,
  Briefcase,
  Globe,
  Mail,
  Phone,
  ChevronDown,
  Sparkles,
  Star,
  Eye,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_TYPES } from "@/lib/constants";

interface SearchResultPerson {
  id: string;
  fullName: string;
  photoUrl: string | null;
  location: string | null;
  bio: string | null;
  company: string | null;
  jobTitle: string | null;
  matchScore: number;
  emails: { email: string; confidence: number; source: string }[];
  phones: { phone: string; confidence: number; source: string }[];
  socials: { platform: string; username: string; url: string }[];
  sources: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultPerson[]>([]);
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [searchProgress, setSearchProgress] = useState<string[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError("");
    setResults([]);
    setHasSearched(true);
    setSearchProgress(["Searching GitHub profiles...", "Mining Google SERP...", "Generating email patterns..."]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), type: searchType }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Search failed");
        setIsSearching(false);
        return;
      }

      setResults(data.results || []);
      setCreditsUsed(data.creditsUsed || 0);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSearching(false);
      setSearchProgress([]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-sm text-muted-foreground">
          Find anyone globally — by name, email, phone, username, or company
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="space-y-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {SEARCH_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setSearchType(type.value)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                searchType === type.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={SEARCH_TYPES.find((t) => t.value === searchType)?.placeholder}
              className="w-full rounded-xl border border-input bg-card py-3.5 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>

      {/* Search progress */}
      {isSearching && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Searching across sources...</span>
          </div>
          <div className="space-y-2">
            {searchProgress.map((source, i) => (
              <div key={source} className="flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary animate-pulse" style={{ width: `${60 + i * 15}%` }} />
                </div>
                <span className="w-52 text-xs text-muted-foreground">{source}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Results */}
      {hasSearched && !isSearching && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{results.length}</span> result{results.length !== 1 ? "s" : ""}
              {query && <> for &quot;{query}&quot;</>}
              {creditsUsed > 0 && <span className="ml-1">&middot; {creditsUsed} credits used</span>}
            </p>
          </div>

          {results.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No results found</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Try a different name, add a company or location, or try another search type.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.id} className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {result.photoUrl ? (
                    <img src={result.photoUrl} alt={result.fullName} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {result.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/profile/${result.id}`} className="text-base font-semibold hover:text-primary transition-colors">
                        {result.fullName}
                      </Link>
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        result.matchScore >= 70 ? "bg-emerald-500/10 text-emerald-500"
                          : result.matchScore >= 40 ? "bg-amber-500/10 text-amber-500"
                            : "bg-red-500/10 text-red-500"
                      )}>
                        {result.matchScore}% match
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      {result.company && (
                        <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{result.company}</span>
                      )}
                      {result.location && (
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{result.location}</span>
                      )}
                    </div>

                    {result.bio && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{result.bio}</p>
                    )}

                    {/* Contact data */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {result.emails.slice(0, 3).map((e, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                          <Mail className="h-3 w-3" />
                          {e.email}
                          <span className={cn("ml-1 text-[10px]", e.confidence >= 80 ? "text-emerald-500" : "text-amber-500")}>
                            {e.confidence}%
                          </span>
                        </span>
                      ))}
                      {result.phones.slice(0, 2).map((p, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs">
                          <Phone className="h-3 w-3" />
                          {p.phone}
                        </span>
                      ))}
                      {result.socials.map((s) => (
                        <a key={`${s.platform}-${s.username}`} href={s.url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs hover:bg-muted/80 capitalize">
                          <Globe className="h-3 w-3" />
                          {s.platform}
                        </a>
                      ))}
                    </div>

                    {/* Sources */}
                    <div className="mt-2 flex items-center gap-1">
                      <span className="text-[10px] text-muted-foreground">Sources:</span>
                      {result.sources.map((s) => (
                        <span key={s} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Link href={`/profile/${result.id}`}
                      className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                      <Eye className="h-3.5 w-3.5" />
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
