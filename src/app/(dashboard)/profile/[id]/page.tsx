"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  GraduationCap,
  Globe,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Download,
  Star,
  FolderPlus,
  Share2,
  Sparkles,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockProfile = {
  id: "1",
  fullName: "Rahul Sharma",
  aliases: ["Rahul S.", "rahulsharma_dev"],
  photoUrl: null,
  location: "Bangalore, Karnataka, India",
  bio: "CTO & Co-founder building the future of fintech in India. Previously at Microsoft and Flipkart. IIT Delhi '14.",
  aiSummary:
    "Rahul Sharma is a senior technology leader based in Bangalore, India, currently serving as CTO at TechNova Solutions — a Series B fintech startup focused on cross-border payments. He has 10+ years of experience across Microsoft, Flipkart, and startups. Active on GitHub with 200+ contributions in 2025. Strong presence in the Bangalore tech community.",
  qualityScore: 87,
  emails: [
    { email: "rahul@technova.in", isVerified: true, confidence: 95, source: "Company website", lastCheckedAt: "2026-04-08" },
    { email: "rahul.sharma@gmail.com", isVerified: true, confidence: 82, source: "GitHub profile", lastCheckedAt: "2026-04-05" },
    { email: "r.sharma@outlook.com", isVerified: false, confidence: 45, source: "Pattern inference", lastCheckedAt: null },
  ],
  phones: [
    { phone: "+91 98765 43210", carrier: "Jio", lineType: "mobile", isWhatsApp: true, confidence: 88, source: "Public directory" },
  ],
  socialProfiles: [
    { platform: "linkedin", username: "rahulsharma-cto", profileUrl: "#", followerCount: 12400, isVerified: false },
    { platform: "github", username: "rahulsharma-dev", profileUrl: "#", followerCount: 890, isVerified: true },
    { platform: "twitter", username: "rahul_techcto", profileUrl: "#", followerCount: 5600, isVerified: true },
    { platform: "instagram", username: "rahul.explores", profileUrl: "#", followerCount: 2300, isVerified: false },
  ],
  professional: {
    jobTitle: "CTO & Co-founder",
    company: "TechNova Solutions",
    industry: "Fintech",
    seniority: "C-Level",
    startDate: "2022-03",
  },
  education: [
    { institution: "IIT Delhi", degree: "B.Tech", fieldOfStudy: "Computer Science", graduationYear: 2014 },
  ],
  dataSources: [
    { sourceType: "LinkedIn Public", sourceUrl: "#", extractedAt: "2026-04-08" },
    { sourceType: "GitHub", sourceUrl: "#", extractedAt: "2026-04-08" },
    { sourceType: "Google SERP", sourceUrl: "#", extractedAt: "2026-04-07" },
    { sourceType: "Company Website", sourceUrl: "#", extractedAt: "2026-04-05" },
  ],
};

const platformIcons: Record<string, LucideIcon> = {
  linkedin: Globe,
  github: Globe,
  twitter: Globe,
  instagram: Globe,
  youtube: Globe,
};

function ConfidenceBadge({ score }: { score: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        score >= 80 ? "bg-emerald-500/10 text-emerald-500" : score >= 50 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
      )}
    >
      {score >= 80 ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {score}%
    </span>
  );
}

export default function ProfilePage() {
  const p = mockProfile;

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link
        href="/search"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to results
      </Link>

      {/* Profile header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
            {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{p.fullName}</h1>
                {p.aliases.length > 0 && (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Also known as: {p.aliases.join(", ")}
                  </p>
                )}
              </div>
              {/* Quality score */}
              <div className="hidden sm:flex flex-col items-center">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full border-4",
                  p.qualityScore >= 80 ? "border-emerald-500 text-emerald-500" : "border-amber-500 text-amber-500"
                )}>
                  <span className="text-lg font-bold">{p.qualityScore}</span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">Quality</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                {p.professional?.jobTitle}
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                {p.professional?.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {p.location}
              </span>
            </div>

            {p.bio && <p className="mt-3 text-sm">{p.bio}</p>}

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                <FolderPlus className="h-3.5 w-3.5" />
                Save to List
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
                <Download className="h-3.5 w-3.5" />
                Export PDF
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
                <RefreshCw className="h-3.5 w-3.5" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column — Main data */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          {p.aiSummary && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-primary">AI Summary</h2>
              </div>
              <p className="text-sm leading-relaxed">{p.aiSummary}</p>
            </div>
          )}

          {/* Contact data */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                Contact Information
              </h2>
            </div>
            <div className="divide-y divide-border">
              {p.emails.map((email, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{email.email}</p>
                      <p className="text-xs text-muted-foreground">{email.source}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {email.isVerified && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                    <ConfidenceBadge score={email.confidence} />
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {p.phones.map((phone, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{phone.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        {phone.carrier} &middot; {phone.lineType}
                        {phone.isWhatsApp && " · WhatsApp"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ConfidenceBadge score={phone.confidence} />
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                Professional
              </h2>
            </div>
            <div className="px-5 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Job Title</p>
                  <p className="text-sm font-medium">{p.professional?.jobTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Company</p>
                  <p className="text-sm font-medium">{p.professional?.company}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Industry</p>
                  <p className="text-sm font-medium">{p.professional?.industry}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Seniority</p>
                  <p className="text-sm font-medium">{p.professional?.seniority}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
                Education
              </h2>
            </div>
            <div className="px-5 py-4 space-y-3">
              {p.education.map((edu, i) => (
                <div key={i}>
                  <p className="text-sm font-medium">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">
                    {edu.degree} in {edu.fieldOfStudy} &middot; {edu.graduationYear}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Sidebar */}
        <div className="space-y-6">
          {/* Social profiles */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                Social Profiles
              </h2>
            </div>
            <div className="divide-y divide-border">
              {p.socialProfiles.map((social) => {
                const Icon = platformIcons[social.platform] || Globe;
                return (
                  <a
                    key={social.platform}
                    href={social.profileUrl}
                    className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium">@{social.username}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {social.platform}
                          {social.followerCount && ` · ${(social.followerCount / 1000).toFixed(1)}K`}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Data sources */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                Data Sources
              </h2>
            </div>
            <div className="divide-y divide-border">
              {p.dataSources.map((src, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{src.sourceType}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {src.extractedAt}
                    </p>
                  </div>
                  <a href={src.sourceUrl} className="text-muted-foreground hover:text-foreground">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
