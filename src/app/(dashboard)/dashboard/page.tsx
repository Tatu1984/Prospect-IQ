"use client";

import Link from "next/link";
import {
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Mail,
  Phone,
  ArrowUpRight,
  Clock,
  Zap,
  CreditCard,
} from "lucide-react";

const stats = [
  { label: "Credits Remaining", value: "1,847", icon: Sparkles, change: "+200 this month", color: "text-primary" },
  { label: "Searches Today", value: "23", icon: Search, change: "+12% vs yesterday", color: "text-emerald-500" },
  { label: "Profiles Found", value: "156", icon: Users, change: "92% match rate", color: "text-amber-500" },
  { label: "Emails Verified", value: "89", icon: Mail, change: "94% deliverable", color: "text-cyan-500" },
];

const recentSearches = [
  { query: "Rahul Sharma, Bangalore", type: "name", results: 8, credits: 2, time: "2 min ago" },
  { query: "priya.m@techcorp.in", type: "email", results: 1, credits: 1, time: "15 min ago" },
  { query: "+91 98765 43210", type: "phone", results: 1, credits: 1, time: "1 hr ago" },
  { query: "acmesolutions.com", type: "domain", results: 24, credits: 2, time: "2 hrs ago" },
  { query: "@design_ninja", type: "username", results: 3, credits: 2, time: "3 hrs ago" },
];

const quickActions = [
  { label: "Search People", href: "/search", icon: Search, desc: "Find anyone globally" },
  { label: "Bulk Upload", href: "/bulk", icon: TrendingUp, desc: "Enrich CSV contacts" },
  { label: "Saved Lists", href: "/lists", icon: Users, desc: "View bookmarked profiles" },
  { label: "Buy Credits", href: "/billing", icon: CreditCard, desc: "Top up your balance" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here&apos;s your activity overview.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Searches */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Recent Searches</h2>
            </div>
            <Link
              href="/search"
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentSearches.map((search, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    {search.type === "email" ? (
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    ) : search.type === "phone" ? (
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Search className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{search.query}</p>
                    <p className="text-xs text-muted-foreground">
                      {search.results} results &middot; {search.credits} credits
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {search.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">Quick Actions</h2>
            </div>
          </div>
          <div className="p-3 space-y-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-muted group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <action.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </div>
                <ArrowUpRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Usage bar */}
          <div className="border-t border-border px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Monthly usage</span>
              <span className="font-medium">153 / 2,000</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: "7.65%" }}
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Resets on May 1, 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
