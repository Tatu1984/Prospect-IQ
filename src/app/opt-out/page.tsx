"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, Mail, Phone, User, CheckCircle2, Zap, ArrowLeft } from "lucide-react";

export default function OptOutPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold">Request Submitted</h1>
          <p className="mt-2 text-muted-foreground">
            Your data removal request has been received. We will process it within
            30 days as per DPDP Act requirements. You will receive a confirmation
            email once your data has been removed.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold tracking-tight">
            Prospect<span className="text-primary">IQ</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card p-8">
          <div className="mb-6 text-center">
            <Shield className="mx-auto h-10 w-10 text-primary mb-3" />
            <h1 className="text-2xl font-bold">Data Removal Request</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              If you believe your personal data appears on ProspectIQ and you want
              it removed, submit this form. We comply with India&apos;s DPDP Act 2023
              and GDPR.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="opt-name">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="opt-name"
                  type="text"
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="opt-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="opt-email"
                  type="email"
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="opt-phone">
                Phone Number (optional)
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="opt-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium" htmlFor="opt-reason">
                Reason for removal
              </label>
              <textarea
                id="opt-reason"
                rows={3}
                placeholder="Tell us why you'd like your data removed (optional)"
                className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20 resize-none"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="opt-confirm"
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-input accent-primary"
                required
              />
              <label htmlFor="opt-confirm" className="text-xs text-muted-foreground">
                I confirm that I am the person whose data I am requesting to be
                removed, or I am their authorized representative. I understand
                ProspectIQ will verify my identity before processing this request.
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Submit Removal Request
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Requests are processed within 30 days per DPDP Act requirements.
            <br />
            For urgent requests, email{" "}
            <a href="mailto:privacy@prospectiq.in" className="text-primary hover:underline">
              privacy@prospectiq.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
