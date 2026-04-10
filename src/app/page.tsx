"use client";

import Link from "next/link";
import {
  Zap,
  Search,
  Shield,
  Globe,
  Mail,
  Phone,
  Users,
  BarChart3,
  ArrowRight,
  Check,
  Sparkles,
  ChevronRight,
  Code,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/constants";

const features = [
  {
    icon: Search,
    title: "Universal Search",
    description: "Find anyone globally by name, email, phone, username, or company. B2B and B2C.",
  },
  {
    icon: Mail,
    title: "Email Discovery & Verification",
    description: "Discover emails via pattern matching and multi-source scraping. SMTP verification included.",
  },
  {
    icon: Phone,
    title: "Phone Intelligence",
    description: "Phone number extraction, carrier lookup, WhatsApp detection, and reverse lookup.",
  },
  {
    icon: Globe,
    title: "Social Profile Aggregation",
    description: "Automatically link LinkedIn, Twitter, GitHub, Instagram, and more into unified profiles.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Resolution",
    description: "Claude AI resolves ambiguous identities, generates summaries, and scores data confidence.",
  },
  {
    icon: Shield,
    title: "Privacy & Compliance",
    description: "DPDP Act and GDPR compliant. Self-service opt-out portal. Transparent data sourcing.",
  },
];

const useCases = [
  { icon: Users, title: "Sales Teams", desc: "Find decision-makers and their verified contact data" },
  { icon: BarChart3, title: "Recruiters", desc: "Source passive candidates with full digital profiles" },
  { icon: Globe, title: "Journalists", desc: "Research subjects and verify public figures" },
  { icon: Code, title: "Developers", desc: "Integrate via REST API with 2-line setup" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Prospect<span className="text-primary">IQ</span>
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#api" className="text-sm text-muted-foreground hover:text-foreground transition-colors">API</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Powered Contact Intelligence
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find anyone.
            <br />
            <span className="text-primary">Anywhere.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            ProspectIQ discovers, aggregates, and verifies contact information for any
            person globally — professionals, influencers, freelancers, and public figures.
            Beyond B2B.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Free — 50 Credits
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              See How It Works
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required. 50 free credits on signup.
          </p>

          {/* Mock search bar */}
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="rounded-2xl border border-border bg-card p-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-muted px-4 py-3 flex-1">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    Try: &quot;Rahul Sharma, CTO, Bangalore&quot;
                  </span>
                </div>
                <button className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Everything you need to find anyone</h2>
            <p className="mt-3 text-muted-foreground">
              Multi-source aggregation, AI-powered resolution, and real-time verification
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Built for every use case</h2>
            <p className="mt-3 text-muted-foreground">
              Sales, recruiting, journalism, research — ProspectIQ adapts to your workflow
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="rounded-xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                  <uc.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{uc.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations bar */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-sm text-muted-foreground mb-6">Integrates with your stack</p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Code className="h-5 w-5" /> REST API
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Monitor className="h-5 w-5" /> Chrome Extension
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe className="h-5 w-5" /> LinkedIn Sidebar
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              HubSpot
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              Salesforce
            </div>
            <div className="flex items-center gap-2 text-sm font-medium">
              Zapier
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Simple, credit-based pricing</h2>
            <p className="mt-3 text-muted-foreground">
              Start free. Pay as you grow. No hidden fees.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {PLANS.map((plan) => {
              const isPopular = "popular" in plan && plan.popular;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative rounded-xl border p-6 transition-shadow hover:shadow-md",
                    isPopular ? "border-primary shadow-md" : "border-border bg-card"
                  )}
                >
                  {isPopular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </span>
                  )}
                  <h3 className="font-semibold">{plan.name}</h3>
                  <div className="mt-3">
                    {plan.priceInr >= 0 ? (
                      <p className="text-2xl font-bold">
                        ₹{plan.priceInr.toLocaleString("en-IN")}
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
                  <Link
                    href="/register"
                    className={cn(
                      "mt-4 block w-full rounded-lg py-2.5 text-center text-xs font-medium transition-colors",
                      isPopular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "border border-border hover:bg-muted"
                    )}
                  >
                    {plan.priceInr === 0 ? "Start Free" : plan.priceInr < 0 ? "Contact Sales" : "Get Started"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* API section */}
      <section id="api" className="border-t border-border bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold">Developer-first API</h2>
              <p className="mt-3 text-muted-foreground">
                Full REST API with search, enrich, and verify endpoints.
                API key auth, rate limiting, and webhooks included.
              </p>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  RESTful JSON API with OpenAPI spec
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Search, enrich, verify, and bulk endpoints
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Per-key rate limits and permissions
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-primary" />
                  Webhook notifications for async jobs
                </div>
              </div>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Get API Key <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <pre className="text-sm overflow-x-auto">
                <code className="text-muted-foreground">
{`curl -X GET \\
  "https://api.prospectiq.in/v1/search?q=Rahul+Sharma&type=name" \\
  -H "Authorization: Bearer piq_live_xxxxx"

{
  "data": [
    {
      "fullName": "Rahul Sharma",
      "title": "CTO",
      "company": "TechNova Solutions",
      "location": "Bangalore, India",
      "emails": ["rahul@technova.in"],
      "confidence": 95,
      "qualityScore": 87
    }
  ],
  "meta": { "total": 4, "creditsUsed": 2 }
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold">Ready to find anyone?</h2>
          <p className="mt-3 text-muted-foreground">
            Start with 50 free credits. No credit card required.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Get Started Free <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <span className="font-bold">ProspectIQ</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Universal Contact Intelligence & People Discovery Platform by Infinititech Partners.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Product</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <a href="#features" className="block hover:text-foreground">Features</a>
                <a href="#pricing" className="block hover:text-foreground">Pricing</a>
                <a href="#api" className="block hover:text-foreground">API</a>
                <a href="#" className="block hover:text-foreground">Chrome Extension</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Legal</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <a href="#" className="block hover:text-foreground">Privacy Policy</a>
                <a href="#" className="block hover:text-foreground">Terms of Service</a>
                <Link href="/opt-out" className="block hover:text-foreground">Data Removal (Opt-Out)</Link>
                <a href="#" className="block hover:text-foreground">DPDP Compliance</a>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3">Company</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <a href="#" className="block hover:text-foreground">About</a>
                <a href="#" className="block hover:text-foreground">Blog</a>
                <a href="mailto:hello@prospectiq.in" className="block hover:text-foreground">Contact</a>
                <a href="mailto:privacy@prospectiq.in" className="block hover:text-foreground">Privacy Inquiries</a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Infinititech Partners. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
