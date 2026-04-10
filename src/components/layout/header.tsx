"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Search,
  Bell,
  CreditCard,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Sparkles,
  Menu,
} from "lucide-react";

export function Header({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const creditsBalance = (user as Record<string, unknown>)?.creditsBalance as number ?? 50;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile menu toggle */}
      <button
        onClick={onMenuToggle}
        className="mr-3 rounded-lg p-2 hover:bg-muted lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search shortcut */}
      <div className="flex flex-1 items-center">
        <Link
          href="/search"
          className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground max-w-md w-full"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search people, companies, emails...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground sm:inline-block">
            ⌘K
          </kbd>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 ml-4">
        {/* Credits */}
        <Link
          href="/billing"
          className="hidden sm:flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{creditsBalance.toLocaleString()}</span>
          <span className="hidden md:inline text-primary/70">credits</span>
        </Link>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg p-1.5 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              {userName[0]?.toUpperCase() || "U"}
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-lg">
                <div className="px-3 py-2 border-b border-border mb-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{userEmail}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CreditCard className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-medium">
                      {creditsBalance} credits
                    </span>
                  </div>
                </div>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setShowUserMenu(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
