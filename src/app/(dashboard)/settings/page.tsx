"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  Users,
  Palette,
  Globe,
  Smartphone,
  Lock,
  Mail,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "team", label: "Team", icon: Users },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Tabs */}
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-left",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "account" && (
            <div className="rounded-xl border border-border bg-card p-6 space-y-6">
              <h2 className="text-lg font-semibold">Account Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Full Name</label>
                  <input
                    type="text"
                    defaultValue="Sudipto"
                    className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Email</label>
                  <input
                    type="email"
                    defaultValue="sudipto@infinititech.com"
                    className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Role / Purpose</label>
                  <select className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary">
                    <option>Sales & Business Development</option>
                    <option>Recruitment & Talent Acquisition</option>
                    <option>Journalism & Media</option>
                    <option>Academic Research</option>
                    <option>Background Verification</option>
                    <option>Personal Use</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Timezone</label>
                  <select className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary">
                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                    <option>America/New_York (EST)</option>
                    <option>Europe/London (GMT)</option>
                  </select>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Current Password</label>
                    <input type="password" className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">New Password</label>
                    <input type="password" className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium">Confirm New Password</label>
                    <input type="password" className="w-full rounded-lg border border-input bg-background py-2.5 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20" />
                  </div>
                  <button className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Two-Factor Authentication</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add an extra layer of security using TOTP authenticator app
                    </p>
                  </div>
                  <button className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-2">Active Sessions</h2>
                <p className="text-sm text-muted-foreground mb-4">Manage your logged-in devices</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Chrome on macOS</p>
                        <p className="text-xs text-muted-foreground">Bangalore, India · Current session</p>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-500 font-medium">Active</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Safari on iPhone</p>
                        <p className="text-xs text-muted-foreground">Bangalore, India · 2 hours ago</p>
                      </div>
                    </div>
                    <button className="text-xs text-destructive hover:underline">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "Search completed", desc: "When a bulk or async search finishes", enabled: true },
                  { label: "Credits running low", desc: "When balance drops below 10%", enabled: true },
                  { label: "Weekly usage report", desc: "Summary of searches, credits, and results", enabled: false },
                  { label: "New feature announcements", desc: "Product updates and new capabilities", enabled: true },
                  { label: "Security alerts", desc: "Login from new device, API key usage", enabled: true },
                ].map((notif, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{notif.label}</p>
                      <p className="text-xs text-muted-foreground">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={notif.enabled} />
                      <div className="h-6 w-11 rounded-full bg-muted peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold">Team Members</h2>
                  <p className="text-sm text-muted-foreground">Manage workspace members and roles</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  <Mail className="h-4 w-4" />
                  Invite Member
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Sudipto", email: "sudipto@infinititech.com", role: "Admin" },
                  { name: "Amit K.", email: "amit@infinititech.com", role: "Member" },
                  { name: "Priya S.", email: "priya@infinititech.com", role: "Member" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {member.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <select className="rounded-lg border border-input bg-background px-2 py-1 text-xs outline-none">
                      <option selected={member.role === "Admin"}>Admin</option>
                      <option selected={member.role === "Manager"}>Manager</option>
                      <option selected={member.role === "Member"}>Member</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
