"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  FolderPlus,
  Share2,
  Sparkles,
  RefreshCw,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  id: string;
  fullName: string;
  aliases: string[];
  photoUrl: string | null;
  location: string | null;
  bio: string | null;
  aiSummary: string | null;
  qualityScore: number;
  createdAt: string;
  emails: { id: string; email: string; isVerified: boolean; confidence: number; source: string }[];
  phones: { id: string; phone: string; carrier: string | null; lineType: string | null; isWhatsApp: boolean; confidence: number; source: string }[];
  socialProfiles: { id: string; platform: string; username: string; profileUrl: string; followerCount: number | null; isVerified: boolean }[];
  professional: { jobTitle: string | null; company: string | null; industry: string | null; seniority: string | null } | null;
  education: { institution: string; degree: string | null; fieldOfStudy: string | null; graduationYear: number | null }[];
  dataSources: { sourceType: string; sourceUrl: string | null; extractedAt: string }[];
}

function ConfidenceBadge({ score }: { score: number }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
      score >= 80 ? "bg-emerald-500/10 text-emerald-500" : score >= 50 ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
    )}>
      {score >= 80 ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
      {score}%
    </span>
  );
}

export default function ProfilePage() {
  const params = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profiles/${params.id}`);
        if (!res.ok) {
          setError(res.status === 404 ? "Profile not found" : "Failed to load profile");
          return;
        }
        setProfile(await res.json());
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [params.id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="space-y-4">
        <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to search
        </Link>
        <div className="rounded-xl border border-border bg-card p-10 text-center">
          <p className="text-sm text-muted-foreground">{error || "Profile not found"}</p>
        </div>
      </div>
    );
  }

  const p = profile;

  return (
    <div className="space-y-6">
      <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to results
      </Link>

      {/* Profile header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {p.photoUrl ? (
            <img src={p.photoUrl} alt={p.fullName} className="h-20 w-20 rounded-2xl object-cover" />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
              {p.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{p.fullName}</h1>
                {p.aliases.length > 0 && (
                  <p className="mt-0.5 text-sm text-muted-foreground">Also known as: {p.aliases.join(", ")}</p>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-center">
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-full border-4",
                  p.qualityScore >= 70 ? "border-emerald-500 text-emerald-500" : p.qualityScore >= 40 ? "border-amber-500 text-amber-500" : "border-red-500 text-red-500"
                )}>
                  <span className="text-lg font-bold">{p.qualityScore}</span>
                </div>
                <span className="mt-1 text-xs text-muted-foreground">Quality</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {p.professional?.jobTitle && (
                <span className="flex items-center gap-1"><Briefcase className="h-4 w-4" />{p.professional.jobTitle}</span>
              )}
              {p.professional?.company && (
                <span className="flex items-center gap-1"><Building2 className="h-4 w-4" />{p.professional.company}</span>
              )}
              {p.location && (
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{p.location}</span>
              )}
            </div>

            {p.bio && <p className="mt-3 text-sm">{p.bio}</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
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

          {/* Contact info */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                Contact Information
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {p.emails.length + p.phones.length}
                </span>
              </h2>
            </div>
            {p.emails.length === 0 && p.phones.length === 0 ? (
              <div className="px-5 py-6 text-center text-sm text-muted-foreground">
                No contact information found yet
              </div>
            ) : (
              <div className="divide-y divide-border">
                {p.emails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between px-5 py-3">
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
                          <CheckCircle2 className="h-3 w-3" /> Verified
                        </span>
                      )}
                      <ConfidenceBadge score={email.confidence} />
                      <button onClick={() => copyToClipboard(email.email)} className="p-1 text-muted-foreground hover:text-foreground">
                        {copied === email.email ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
                {p.phones.map((phone) => (
                  <div key={phone.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{phone.phone}</p>
                        <p className="text-xs text-muted-foreground">
                          {phone.source}
                          {phone.carrier && ` · ${phone.carrier}`}
                          {phone.isWhatsApp && " · WhatsApp"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConfidenceBadge score={phone.confidence} />
                      <button onClick={() => copyToClipboard(phone.phone)} className="p-1 text-muted-foreground hover:text-foreground">
                        {copied === phone.phone ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Professional */}
          {p.professional && (p.professional.company || p.professional.jobTitle) && (
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-muted-foreground" /> Professional
                </h2>
              </div>
              <div className="px-5 py-4 grid gap-4 sm:grid-cols-2">
                {p.professional.jobTitle && <div><p className="text-xs text-muted-foreground">Job Title</p><p className="text-sm font-medium">{p.professional.jobTitle}</p></div>}
                {p.professional.company && <div><p className="text-xs text-muted-foreground">Company</p><p className="text-sm font-medium">{p.professional.company}</p></div>}
                {p.professional.industry && <div><p className="text-xs text-muted-foreground">Industry</p><p className="text-sm font-medium">{p.professional.industry}</p></div>}
                {p.professional.seniority && <div><p className="text-xs text-muted-foreground">Seniority</p><p className="text-sm font-medium">{p.professional.seniority}</p></div>}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Social profiles */}
          {p.socialProfiles.length > 0 && (
            <div className="rounded-xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" /> Social Profiles
                </h2>
              </div>
              <div className="divide-y divide-border">
                {p.socialProfiles.map((social) => (
                  <a key={social.id} href={social.profileUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-muted">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5" />
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
                ))}
              </div>
            </div>
          )}

          {/* Data sources */}
          <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border px-5 py-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" /> Data Sources
              </h2>
            </div>
            <div className="divide-y divide-border">
              {p.dataSources.map((src, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{src.sourceType}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(src.extractedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {src.sourceUrl && (
                    <a href={src.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
