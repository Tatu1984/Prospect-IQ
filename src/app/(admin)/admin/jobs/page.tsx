"use client";

import {
  Activity,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Pause,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

const queueStats = [
  { label: "Active", value: 12, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Waiting", value: 48, color: "text-amber-500", bg: "bg-amber-500/10" },
  { label: "Completed", value: "8.4K", color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Failed", value: 23, color: "text-red-500", bg: "bg-red-500/10" },
];

const mockJobs = [
  { id: "job_8291", type: "linkedin", target: "Rahul Sharma", status: "active", attempts: 1, startedAt: "12s ago", duration: "12s" },
  { id: "job_8290", type: "serp", target: "finstack.io domain search", status: "active", attempts: 1, startedAt: "18s ago", duration: "18s" },
  { id: "job_8289", type: "social", target: "@design_ninja (Twitter)", status: "active", attempts: 1, startedAt: "25s ago", duration: "25s" },
  { id: "job_8288", type: "whois", target: "techcorp.com", status: "completed", attempts: 1, startedAt: "2m ago", duration: "1.2s" },
  { id: "job_8287", type: "smtp", target: "priya@finstack.io", status: "completed", attempts: 1, startedAt: "2m ago", duration: "3.4s" },
  { id: "job_8286", type: "directory", target: "JustDial - Bangalore CTOs", status: "failed", attempts: 3, startedAt: "5m ago", duration: "45s", error: "Cloudflare block (403)" },
  { id: "job_8285", type: "pdf", target: "Resume_Arun_K.pdf", status: "completed", attempts: 1, startedAt: "8m ago", duration: "2.1s" },
  { id: "job_8284", type: "linkedin", target: "Maria Santos", status: "waiting", attempts: 0, startedAt: "-", duration: "-" },
  { id: "job_8283", type: "serp", target: "CTO bangalore fintech", status: "waiting", attempts: 0, startedAt: "-", duration: "-" },
];

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  active: { icon: Loader2, color: "text-emerald-500" },
  completed: { icon: CheckCircle2, color: "text-blue-500" },
  failed: { icon: XCircle, color: "text-red-500" },
  waiting: { icon: Clock, color: "text-amber-500" },
};

const typeColors: Record<string, string> = {
  linkedin: "bg-blue-500/10 text-blue-500",
  serp: "bg-green-500/10 text-green-500",
  social: "bg-pink-500/10 text-pink-500",
  whois: "bg-purple-500/10 text-purple-500",
  smtp: "bg-cyan-500/10 text-cyan-500",
  directory: "bg-orange-500/10 text-orange-500",
  pdf: "bg-amber-500/10 text-amber-500",
};

export default function AdminJobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Scraping Job Monitor</h1>
          <p className="text-sm text-muted-foreground">Real-time BullMQ queue status</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
            <Pause className="h-4 w-4" />
            Pause Queue
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Queue stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {queueStats.map((stat) => (
          <div key={stat.label} className={cn("rounded-xl border border-border bg-card p-5")}>
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <p className={cn("text-3xl font-bold mt-1", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-medium px-5 py-3">Job ID</th>
              <th className="text-left font-medium px-5 py-3">Type</th>
              <th className="text-left font-medium px-5 py-3">Target</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="text-left font-medium px-5 py-3">Attempts</th>
              <th className="text-left font-medium px-5 py-3">Duration</th>
              <th className="text-left font-medium px-5 py-3">Started</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockJobs.map((job) => {
              const config = statusConfig[job.status];
              const StatusIcon = config.icon;
              return (
                <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-mono text-xs">{job.id}</td>
                  <td className="px-5 py-3">
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", typeColors[job.type])}>
                      {job.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{job.target}</p>
                    {"error" in job && job.error && (
                      <p className="text-xs text-red-500 mt-0.5">{job.error}</p>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", config.color)}>
                      <StatusIcon className={cn("h-3.5 w-3.5", job.status === "active" && "animate-spin")} />
                      {job.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono">{job.attempts}/3</td>
                  <td className="px-5 py-3 text-muted-foreground">{job.duration}</td>
                  <td className="px-5 py-3 text-muted-foreground">{job.startedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
