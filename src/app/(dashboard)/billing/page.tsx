"use client";

import { useState } from "react";
import {
  CreditCard,
  Sparkles,
  Check,
  ArrowRight,
  Download,
  Plus,
  Zap,
  TrendingUp,
  Receipt,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/constants";

const mockInvoices = [
  { id: "INV-2026-004", date: "Apr 1, 2026", amount: "₹4,999", status: "paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "₹4,999", status: "paid" },
  { id: "INV-2026-002", date: "Feb 1, 2026", amount: "₹4,999", status: "paid" },
  { id: "INV-2026-001", date: "Jan 1, 2026", amount: "₹1,499", status: "paid" },
];

export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const currentPlan = "professional";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing & Credits</h1>
        <p className="text-sm text-muted-foreground">
          Manage your subscription, credits, and invoices
        </p>
      </div>

      {/* Current plan + credits */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Plan</span>
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold text-primary">Professional</p>
          <p className="text-xs text-muted-foreground mt-1">
            2,000 credits/month &middot; Renews May 1
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Credits Balance</span>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">1,847</p>
          <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: "92%" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-1">92% remaining</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">This Month</span>
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">153</p>
          <p className="text-xs text-muted-foreground mt-1">Credits consumed</p>
        </div>
      </div>

      {/* Credit top-up */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Buy More Credits</h2>
          <span className="text-xs text-muted-foreground">100 credits = ₹499</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-4">
          {[100, 500, 1000, 2500].map((credits) => (
            <button
              key={credits}
              className="rounded-lg border border-border p-4 text-center transition-colors hover:border-primary hover:bg-primary/5"
            >
              <p className="text-lg font-bold">{credits}</p>
              <p className="text-xs text-muted-foreground">credits</p>
              <p className="mt-1 text-sm font-medium text-primary">
                ₹{((credits / 100) * 499).toLocaleString("en-IN")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Pricing plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Plans</h2>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                billingCycle === "monthly" ? "bg-card shadow-sm" : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                billingCycle === "annual" ? "bg-card shadow-sm" : "text-muted-foreground"
              )}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const isPopular = "popular" in plan && plan.popular;
            return (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-xl border p-5 transition-shadow",
                  isCurrent
                    ? "border-primary bg-primary/5 shadow-md"
                    : isPopular
                      ? "border-primary/50"
                      : "border-border bg-card"
                )}
              >
                {isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                    Popular
                  </span>
                )}
                <h3 className="font-semibold">{plan.name}</h3>
                <div className="mt-2">
                  {plan.priceInr >= 0 ? (
                    <p className="text-2xl font-bold">
                      ₹{billingCycle === "annual" ? Math.round(plan.priceInr * 0.8).toLocaleString("en-IN") : plan.priceInr.toLocaleString("en-IN")}
                      <span className="text-sm font-normal text-muted-foreground">/mo</span>
                    </p>
                  ) : (
                    <p className="text-2xl font-bold">Custom</p>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.credits > 0 ? `${plan.credits.toLocaleString()} credits/mo` : "Custom credits"}
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={cn(
                    "mt-4 w-full rounded-lg py-2 text-xs font-medium transition-colors",
                    isCurrent
                      ? "bg-muted text-muted-foreground cursor-default"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Current Plan" : plan.priceInr < 0 ? "Contact Sales" : "Upgrade"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoices */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            Invoices
          </h2>
        </div>
        <div className="divide-y divide-border">
          {mockInvoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm font-medium">{inv.id}</p>
                <p className="text-xs text-muted-foreground">{inv.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{inv.amount}</span>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500 capitalize">
                  {inv.status}
                </span>
                <button className="text-muted-foreground hover:text-foreground">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
