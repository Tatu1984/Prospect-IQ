"use client";

import {
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Clock,
  Activity,
  Gauge,
} from "lucide-react";
import { cn } from "@/lib/utils";

const dataSources = [
  { name: "LinkedIn Public", type: "scraper", status: "healthy", successRate: 94.2, avgLatency: 1200, lastChecked: "2m ago", todayRequests: 1247 },
  { name: "Google SERP (CSE)", type: "api", status: "healthy", successRate: 99.8, avgLatency: 340, lastChecked: "1m ago", todayRequests: 3891 },
  { name: "GitHub API", type: "api", status: "healthy", successRate: 99.9, avgLatency: 180, lastChecked: "30s ago", todayRequests: 892 },
  { name: "Twitter/X Public", type: "scraper", status: "degraded", successRate: 78.5, avgLatency: 2100, lastChecked: "5m ago", todayRequests: 456 },
  { name: "JustDial", type: "scraper", status: "down", successRate: 12.0, avgLatency: 5000, lastChecked: "10m ago", todayRequests: 89 },
  { name: "IndiaMART", type: "scraper", status: "healthy", successRate: 91.3, avgLatency: 980, lastChecked: "3m ago", todayRequests: 234 },
  { name: "WHOIS Lookup", type: "api", status: "healthy", successRate: 98.5, avgLatency: 420, lastChecked: "1m ago", todayRequests: 567 },
  { name: "Hunter.io", type: "api", status: "healthy", successRate: 99.1, avgLatency: 290, lastChecked: "2m ago", todayRequests: 1102 },
  { name: "Twilio Lookup", type: "api", status: "healthy", successRate: 99.7, avgLatency: 150, lastChecked: "1m ago", todayRequests: 445 },
  { name: "HaveIBeenPwned", type: "api", status: "healthy", successRate: 100, avgLatency: 200, lastChecked: "4m ago", todayRequests: 78 },
];

const statusConfig = {
  healthy: { icon: CheckCircle2, label: "Healthy", color: "text-emerald-500 bg-emerald-500/10" },
  degraded: { icon: AlertTriangle, label: "Degraded", color: "text-amber-500 bg-amber-500/10" },
  down: { icon: XCircle, label: "Down", color: "text-red-500 bg-red-500/10" },
};

export default function AdminSourcesPage() {
  const healthyCount = dataSources.filter((s) => s.status === "healthy").length;
  const degradedCount = dataSources.filter((s) => s.status === "degraded").length;
  const downCount = dataSources.filter((s) => s.status === "down").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Data Sources</h1>
          <p className="text-sm text-muted-foreground">Monitor health and uptime of all data sources</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted">
          <RefreshCw className="h-4 w-4" />
          Check All
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-sm text-muted-foreground">Healthy</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-emerald-500">{healthyCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <span className="text-sm text-muted-foreground">Degraded</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-amber-500">{degradedCount}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span className="text-sm text-muted-foreground">Down</span>
          </div>
          <p className="mt-1 text-3xl font-bold text-red-500">{downCount}</p>
        </div>
      </div>

      {/* Sources table */}
      <div className="rounded-xl border border-border bg-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left font-medium px-5 py-3">Source</th>
              <th className="text-left font-medium px-5 py-3">Type</th>
              <th className="text-left font-medium px-5 py-3">Status</th>
              <th className="text-left font-medium px-5 py-3">Success Rate</th>
              <th className="text-left font-medium px-5 py-3">Avg Latency</th>
              <th className="text-left font-medium px-5 py-3">Requests Today</th>
              <th className="text-left font-medium px-5 py-3">Last Checked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {dataSources.map((source) => {
              const config = statusConfig[source.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <tr key={source.name} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{source.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      source.type === "api" ? "bg-blue-500/10 text-blue-500" : "bg-purple-500/10 text-purple-500"
                    )}>
                      {source.type}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", config.color)}>
                      <StatusIcon className="h-3 w-3" />
                      {config.label}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "font-mono",
                      source.successRate >= 95 ? "text-emerald-500" : source.successRate >= 70 ? "text-amber-500" : "text-red-500"
                    )}>
                      {source.successRate}%
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-muted-foreground">
                    {source.avgLatency}ms
                  </td>
                  <td className="px-5 py-3 font-mono">
                    {source.todayRequests.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {source.lastChecked}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
