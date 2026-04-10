"use client";

import {
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  Search,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const platformStats = [
  { label: "Total Users", value: "2,847", change: "+12%", up: true, icon: Users },
  { label: "DAU", value: "423", change: "+8%", up: true, icon: Activity },
  { label: "Revenue (MRR)", value: "₹4.2L", change: "+15%", up: true, icon: DollarSign },
  { label: "Searches Today", value: "8,291", change: "-3%", up: false, icon: Search },
  { label: "Credits Consumed", value: "24.5K", change: "+22%", up: true, icon: TrendingUp },
  { label: "Active Subscriptions", value: "891", change: "+5%", up: true, icon: CreditCard },
];

const recentUsers = [
  { name: "Ankit Patel", email: "ankit@company.in", plan: "Starter", signedUp: "2 hours ago" },
  { name: "Sarah Connor", email: "sarah@techcorp.com", plan: "Professional", signedUp: "5 hours ago" },
  { name: "Ravi Kumar", email: "ravi.k@gmail.com", plan: "Free", signedUp: "1 day ago" },
  { name: "Maria Santos", email: "maria@agency.io", plan: "Business", signedUp: "1 day ago" },
  { name: "James Lee", email: "james@startup.com", plan: "Starter", signedUp: "2 days ago" },
];

const planDistribution = [
  { plan: "Free", count: 1200, pct: 42 },
  { plan: "Starter", count: 890, pct: 31 },
  { plan: "Professional", count: 520, pct: 18 },
  { plan: "Business", count: 210, pct: 7 },
  { plan: "Enterprise", count: 27, pct: 1 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Platform-wide metrics and overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platformStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{stat.label}</span>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">{stat.value}</p>
            <div className="mt-1 flex items-center gap-1">
              {stat.up ? (
                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={`text-xs font-medium ${stat.up ? "text-emerald-500" : "text-red-500"}`}>
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent signups */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Recent Signups</h2>
          </div>
          <div className="divide-y divide-border">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                    {user.plan}
                  </span>
                  <p className="text-xs text-muted-foreground mt-0.5">{user.signedUp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plan distribution */}
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-semibold">Plan Distribution</h2>
          </div>
          <div className="p-5 space-y-4">
            {planDistribution.map((item) => (
              <div key={item.plan}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{item.plan}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.count.toLocaleString()} users ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
