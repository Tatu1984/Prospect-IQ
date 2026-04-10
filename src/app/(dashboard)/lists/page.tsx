"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  Users,
  Search,
  FolderOpen,
  Trash2,
  Pencil,
  Download,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockLists = [
  {
    id: "1",
    name: "Bangalore CTOs",
    count: 24,
    updatedAt: "2 hours ago",
    color: "bg-indigo-500",
  },
  {
    id: "2",
    name: "Fintech Founders",
    count: 18,
    updatedAt: "1 day ago",
    color: "bg-emerald-500",
  },
  {
    id: "3",
    name: "DevRel Contacts",
    count: 42,
    updatedAt: "3 days ago",
    color: "bg-amber-500",
  },
  {
    id: "4",
    name: "Hiring Pipeline - Frontend",
    count: 15,
    updatedAt: "1 week ago",
    color: "bg-cyan-500",
  },
  {
    id: "5",
    name: "Conference Speakers 2026",
    count: 9,
    updatedAt: "2 weeks ago",
    color: "bg-rose-500",
  },
];

const mockContacts = [
  { id: "1", name: "Rahul Sharma", title: "CTO", company: "TechNova Solutions", email: "rahul@technova.in" },
  { id: "2", name: "Priya Mehta", title: "VP Engineering", company: "FinStack India", email: "priya@finstack.io" },
  { id: "3", name: "Arun Kapoor", title: "CTO", company: "PayWise", email: "arun@paywise.in" },
  { id: "4", name: "Sneha Reddy", title: "Tech Lead", company: "Razorpay", email: "sneha.r@razorpay.com" },
];

export default function ListsPage() {
  const [selectedList, setSelectedList] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Saved Lists</h1>
          <p className="text-sm text-muted-foreground">
            Organize and manage your saved contacts
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New List
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lists sidebar */}
        <div className="space-y-2">
          {mockLists.map((list) => (
            <button
              key={list.id}
              onClick={() => setSelectedList(list.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                selectedList === list.id
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:bg-muted"
              )}
            >
              <div className={cn("h-3 w-3 rounded-full shrink-0", list.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{list.name}</p>
                <p className="text-xs text-muted-foreground">
                  {list.count} contacts &middot; {list.updatedAt}
                </p>
              </div>
              <button
                className="p-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </button>
          ))}
        </div>

        {/* List contents */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
              <h2 className="font-semibold">
                {mockLists.find((l) => l.id === selectedList)?.name}
              </h2>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {mockContacts.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted">
                <Pencil className="h-4 w-4" />
              </button>
              <button className="p-2 text-destructive hover:text-destructive rounded-lg hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Search within list */}
          <div className="border-b border-border px-5 py-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in this list..."
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Contacts */}
          <div className="divide-y divide-border">
            {mockContacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {contact.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.title} at {contact.company}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {contact.email}
                  </span>
                  <Link
                    href={`/profile/${contact.id}`}
                    className="p-1 text-muted-foreground hover:text-primary"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
