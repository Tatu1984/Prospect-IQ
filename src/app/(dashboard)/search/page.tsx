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
  ExternalLink,
  Star,
  Eye,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_TYPES } from "@/lib/constants";

const mockResults = [
  {
    id: "1",
    name: "Rahul Sharma",
    title: "CTO",
    company: "TechNova Solutions",
    location: "Bangalore, India",
    photo: null,
    matchScore: 95,
    emails: ["r***a@technova.in"],
    phones: ["+91 98***210"],
    socials: ["linkedin", "github", "twitter"],
    isRevealed: false,
  },
  {
    id: "2",
    name: "Rahul S. Sharma",
    title: "VP Engineering",
    company: "FinStack India",
    location: "Mumbai, India",
    photo: null,
    matchScore: 82,
    emails: ["r***a@finstack.io"],
    phones: [],
    socials: ["linkedin"],
    isRevealed: false,
  },
  {
    id: "3",
    name: "Rahul Kumar Sharma",
    title: "Full Stack Developer",
    company: "Freelancer",
    location: "Delhi, India",
    photo: null,
    matchScore: 68,
    emails: ["r***a@gmail.com"],
    phones: ["+91 77***456"],
    socials: ["linkedin", "github"],
    isRevealed: true,
  },
  {
    id: "4",
    name: "Rahul Sharma",
    title: "Product Manager",
    company: "Zomato",
    location: "Gurgaon, India",
    photo: null,
    matchScore: 61,
    emails: [],
    phones: ["+91 88***789"],
    socials: ["linkedin", "twitter"],
    isRevealed: false,
  },
];

const filterSections = [
  {
    label: "Country",
    key: "country",
    options: ["India", "USA", "UK", "Canada", "Australia", "Germany"],
  },
  {
    label: "Industry",
    key: "industry",
    options: ["Technology", "Finance", "Healthcare", "Education", "E-commerce", "Media"],
  },
  {
    label: "Seniority",
    key: "seniority",
    options: ["C-Level", "VP", "Director", "Manager", "Senior", "Entry Level"],
  },
  {
    label: "Company Size",
    key: "companySize",
    options: ["1-10", "11-50", "51-200", "201-1000", "1001-5000", "5000+"],
  },
];

export default function SearchPage() {
  const [query, setQuery] = useState("Rahul Sharma, Bangalore");
  const [searchType, setSearchType] = useState("name");
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const activeFilterCount = Object.keys(activeFilters).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    setTimeout(() => setIsSearching(false), 1500);
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
        {/* Search type tabs */}
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

        {/* Input + buttons */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                SEARCH_TYPES.find((t) => t.value === searchType)?.placeholder
              }
              className="w-full rounded-xl border border-input bg-card py-3.5 pl-12 pr-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-input px-4 py-3 text-sm font-medium transition-colors",
              showFilters || activeFilterCount > 0
                ? "bg-primary/10 border-primary text-primary"
                : "hover:bg-muted"
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {filterSections.map((section) => (
                <div key={section.key}>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {section.label}
                  </label>
                  <select
                    value={activeFilters[section.key] || ""}
                    onChange={(e) =>
                      setActiveFilters((prev) => {
                        const next = { ...prev };
                        if (e.target.value) next[section.key] = e.target.value;
                        else delete next[section.key];
                        return next;
                      })
                    }
                    className="w-full rounded-lg border border-input bg-background py-2 px-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="">All</option>
                    {section.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilters({})}
                className="mt-3 text-xs text-destructive hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </form>

      {/* Search progress */}
      {isSearching && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm font-medium">Searching across sources...</span>
          </div>
          <div className="space-y-2">
            {["LinkedIn Public", "Google SERP", "Social Profiles", "Public Directories"].map(
              (source, i) => (
                <div key={source} className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-1000"
                      style={{ width: `${Math.min(100, (i + 1) * 30)}%` }}
                    />
                  </div>
                  <span className="w-32 text-xs text-muted-foreground">{source}</span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && !isSearching && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{mockResults.length}</span> results
              for &quot;{query}&quot;
              <span className="ml-1">&middot; 2 credits used</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by:</span>
              <select className="rounded-lg border border-input bg-background px-2 py-1 text-xs outline-none">
                <option>Relevance</option>
                <option>Confidence</option>
                <option>Data completeness</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {mockResults.map((result) => (
              <div
                key={result.id}
                className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {result.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profile/${result.id}`}
                        className="text-base font-semibold hover:text-primary transition-colors"
                      >
                        {result.name}
                      </Link>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          result.matchScore >= 80
                            ? "bg-emerald-500/10 text-emerald-500"
                            : result.matchScore >= 60
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                        )}
                      >
                        {result.matchScore}% match
                      </span>
                    </div>

                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      {result.title && (
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          {result.title}
                        </span>
                      )}
                      {result.company && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {result.company}
                        </span>
                      )}
                      {result.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {result.location}
                        </span>
                      )}
                    </div>

                    {/* Contact preview */}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {result.emails.map((email, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          <Mail className="h-3 w-3" />
                          {email}
                        </span>
                      ))}
                      {result.phones.map((phone, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          <Phone className="h-3 w-3" />
                          {phone}
                        </span>
                      ))}
                      {result.socials.map((social) => (
                        <span
                          key={social}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs capitalize"
                        >
                          <Globe className="h-3 w-3" />
                          {social}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {result.isRevealed ? (
                      <Link
                        href={`/profile/${result.id}`}
                        className="flex items-center gap-1 rounded-lg bg-muted px-3 py-2 text-xs font-medium transition-colors hover:bg-muted/80"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Profile
                      </Link>
                    ) : (
                      <button className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                        <Sparkles className="h-3.5 w-3.5" />
                        Reveal (5 credits)
                      </button>
                    )}
                    <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                      <Star className="h-3.5 w-3.5" />
                      Save
                    </button>
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
