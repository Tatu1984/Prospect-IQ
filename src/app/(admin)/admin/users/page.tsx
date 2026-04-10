"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Shield,
  Ban,
  CreditCard,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockUsers = [
  { id: "1", name: "Ankit Patel", email: "ankit@company.in", plan: "Starter", credits: 342, searches: 156, status: "active", joined: "Mar 15, 2026" },
  { id: "2", name: "Sarah Connor", email: "sarah@techcorp.com", plan: "Professional", credits: 1847, searches: 892, status: "active", joined: "Feb 20, 2026" },
  { id: "3", name: "Ravi Kumar", email: "ravi.k@gmail.com", plan: "Free", credits: 12, searches: 38, status: "active", joined: "Jan 10, 2026" },
  { id: "4", name: "Maria Santos", email: "maria@agency.io", plan: "Business", credits: 8200, searches: 2341, status: "active", joined: "Dec 5, 2025" },
  { id: "5", name: "John Doe", email: "john@spam.net", plan: "Free", credits: 0, searches: 50, status: "suspended", joined: "Apr 1, 2026" },
  { id: "6", name: "Priya Mehta", email: "priya@fintech.com", plan: "Professional", credits: 1200, searches: 567, status: "active", joined: "Mar 1, 2026" },
  { id: "7", name: "Alex Brown", email: "alex@recruit.co", plan: "Starter", credits: 100, searches: 400, status: "active", joined: "Feb 15, 2026" },
];

const planColors: Record<string, string> = {
  Free: "bg-gray-500/10 text-gray-500",
  Starter: "bg-blue-500/10 text-blue-500",
  Professional: "bg-indigo-500/10 text-indigo-500",
  Business: "bg-emerald-500/10 text-emerald-500",
  Enterprise: "bg-amber-500/10 text-amber-500",
};

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-sm text-muted-foreground">
          View, manage, and moderate platform users
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full rounded-lg border border-input bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select className="rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none">
          <option>All Plans</option>
          <option>Free</option>
          <option>Starter</option>
          <option>Professional</option>
          <option>Business</option>
          <option>Enterprise</option>
        </select>
        <select className="rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none">
          <option>All Status</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-medium px-5 py-3">User</th>
              <th className="text-left font-medium px-5 py-3">Plan</th>
              <th className="text-left font-medium px-5 py-3">Credits</th>
              <th className="text-left font-medium px-5 py-3">Searches</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="text-left font-medium px-5 py-3">Joined</th>
              <th className="text-left font-medium px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", planColors[user.plan])}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono">{user.credits.toLocaleString()}</td>
                <td className="px-5 py-3 font-mono">{user.searches.toLocaleString()}</td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    user.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                  )}>
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">{user.joined}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1 rounded hover:bg-muted" title="View">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted" title="Adjust credits">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded hover:bg-muted" title={user.status === "active" ? "Suspend" : "Unsuspend"}>
                      <Ban className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border px-5 py-3">
          <span className="text-xs text-muted-foreground">
            Showing 1-7 of 2,847 users
          </span>
          <div className="flex items-center gap-1">
            <button className="rounded p-1 hover:bg-muted">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="rounded px-2.5 py-1 text-xs font-medium bg-primary text-primary-foreground">1</button>
            <button className="rounded px-2.5 py-1 text-xs hover:bg-muted">2</button>
            <button className="rounded px-2.5 py-1 text-xs hover:bg-muted">3</button>
            <span className="px-1 text-muted-foreground">...</span>
            <button className="rounded px-2.5 py-1 text-xs hover:bg-muted">407</button>
            <button className="rounded p-1 hover:bg-muted">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
