"use client";

import { useState } from "react";
import {
  Key,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Activity,
  Shield,
  AlertTriangle,
} from "lucide-react";

const mockKeys = [
  {
    id: "1",
    name: "Production API",
    keyPreview: "piq_live_****...7f2a",
    permissions: ["search", "enrich", "verify"],
    rateLimit: 100,
    lastUsedAt: "2 minutes ago",
    createdAt: "Mar 15, 2026",
    requestsToday: 847,
  },
  {
    id: "2",
    name: "Staging / Test",
    keyPreview: "piq_test_****...3b8c",
    permissions: ["search"],
    rateLimit: 50,
    lastUsedAt: "3 days ago",
    createdAt: "Feb 20, 2026",
    requestsToday: 0,
  },
  {
    id: "3",
    name: "Chrome Extension",
    keyPreview: "piq_ext_****...9d1e",
    permissions: ["search", "enrich"],
    rateLimit: 30,
    lastUsedAt: "1 hour ago",
    createdAt: "Apr 1, 2026",
    requestsToday: 23,
  },
];

export default function ApiKeysPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-sm text-muted-foreground">
            Manage API keys for external integrations
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Key
        </button>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
        <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium">Keep your API keys secure</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Never expose API keys in client-side code or public repositories.
            Each key can be revoked individually if compromised.
          </p>
        </div>
      </div>

      {/* API Keys list */}
      <div className="space-y-4">
        {mockKeys.map((key) => (
          <div
            key={key.id}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Key className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{key.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="rounded bg-muted px-2 py-0.5 text-xs font-mono">
                      {key.keyPreview}
                    </code>
                    <button className="text-muted-foreground hover:text-foreground">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              <button className="text-destructive hover:text-destructive/80 p-1">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                {key.permissions.join(", ")}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="h-3.5 w-3.5" />
                {key.rateLimit} req/min
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Last used {key.lastUsedAt}
              </span>
              <span>
                {key.requestsToday > 0
                  ? `${key.requestsToday} requests today`
                  : "No requests today"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* API Usage */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-semibold mb-4">API Usage (This Month)</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">Total Requests</p>
            <p className="text-2xl font-bold mt-1">12,847</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-bold mt-1 text-emerald-500">99.2%</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-xs text-muted-foreground">Avg Latency</p>
            <p className="text-2xl font-bold mt-1">342ms</p>
          </div>
        </div>
      </div>
    </div>
  );
}
