"use client";

import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockJobs = [
  {
    id: "1",
    filename: "bangalore_ctos.csv",
    totalRows: 150,
    processed: 150,
    status: "completed" as const,
    creditsUsed: 450,
    createdAt: "Apr 8, 2026",
  },
  {
    id: "2",
    filename: "leads_march.csv",
    totalRows: 500,
    processed: 342,
    status: "processing" as const,
    creditsUsed: 1026,
    createdAt: "Apr 10, 2026",
  },
  {
    id: "3",
    filename: "conference_attendees.csv",
    totalRows: 75,
    processed: 0,
    status: "queued" as const,
    creditsUsed: 0,
    createdAt: "Apr 10, 2026",
  },
];

const statusConfig = {
  completed: { icon: CheckCircle2, label: "Completed", color: "text-emerald-500 bg-emerald-500/10" },
  processing: { icon: Loader2, label: "Processing", color: "text-amber-500 bg-amber-500/10" },
  queued: { icon: Clock, label: "Queued", color: "text-muted-foreground bg-muted" },
  failed: { icon: AlertCircle, label: "Failed", color: "text-destructive bg-destructive/10" },
};

export default function BulkPage() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bulk Upload</h1>
        <p className="text-sm text-muted-foreground">
          Upload a CSV of names, emails, or domains to enrich in bulk (3 credits/row)
        </p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        className={cn(
          "rounded-xl border-2 border-dashed p-10 text-center transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-muted-foreground/50"
        )}
      >
        <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">
          Drag & drop your CSV file here, or{" "}
          <button className="text-primary hover:underline">browse</button>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Supported: .csv (max 10,000 rows). Columns: name, email, phone, company, domain
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted">
            <Download className="h-3.5 w-3.5" />
            Download Template
          </button>
        </div>
      </div>

      {/* Column mapping preview - shown after upload */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 flex items-center justify-between">
          <h2 className="font-semibold">Processing Jobs</h2>
          <span className="text-xs text-muted-foreground">
            {mockJobs.length} jobs total
          </span>
        </div>

        <div className="divide-y divide-border">
          {mockJobs.map((job) => {
            const config = statusConfig[job.status];
            const StatusIcon = config.icon;
            const progress = job.totalRows > 0 ? (job.processed / job.totalRows) * 100 : 0;

            return (
              <div key={job.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{job.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.totalRows} rows &middot; {job.creditsUsed} credits &middot; {job.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.color)}>
                      <StatusIcon className={cn("h-3 w-3", job.status === "processing" && "animate-spin")} />
                      {config.label}
                    </span>
                    {job.status === "completed" && (
                      <button className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                        <Download className="h-3 w-3" />
                        Results
                      </button>
                    )}
                  </div>
                </div>
                {job.status === "processing" && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>{job.processed} / {job.totalRows} processed</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
