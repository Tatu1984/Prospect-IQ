import type { CreditAction } from "@/types/credit";

export const CREDIT_COSTS: Record<CreditAction, number> = {
  basic_search: 2,
  full_reveal: 5,
  email_verify: 1,
  phone_verify: 1,
  bulk_row: 3,
  ai_summary: 1,
  dark_web_check: 2,
  digital_footprint: 8,
  company_intel: 5,
  chrome_reveal: 4,
};

export const PLANS = [
  {
    id: "free",
    name: "Free",
    credits: 50,
    priceInr: 0,
    priceUsd: 0,
    features: [
      "50 credits/month",
      "Preview-only results",
      "No phone data",
      "Limited export",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    credits: 500,
    priceInr: 1499,
    priceUsd: 18,
    features: [
      "500 credits/month",
      "Full contact data",
      "Email verification",
      "CSV export",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    credits: 2000,
    priceInr: 4999,
    priceUsd: 59,
    popular: true,
    features: [
      "2,000 credits/month",
      "API access",
      "CRM push",
      "Chrome extension",
      "Bulk search",
    ],
  },
  {
    id: "business",
    name: "Business",
    credits: 10000,
    priceInr: 14999,
    priceUsd: 179,
    features: [
      "10,000 credits/month",
      "Team workspace",
      "Webhooks",
      "Priority queue",
      "Advanced filters",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: -1,
    priceInr: -1,
    priceUsd: -1,
    features: [
      "Custom credits",
      "Dedicated cluster",
      "SLA guarantee",
      "White-label option",
      "Custom integrations",
    ],
  },
] as const;

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Search", href: "/search", icon: "Search" },
  { label: "Saved Lists", href: "/lists", icon: "BookmarkCheck" },
  { label: "Bulk Upload", href: "/bulk", icon: "Upload" },
  { label: "API Keys", href: "/api-keys", icon: "Key" },
  { label: "Billing", href: "/billing", icon: "CreditCard" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin/dashboard", icon: "BarChart3" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Jobs", href: "/admin/jobs", icon: "Activity" },
  { label: "Sources", href: "/admin/sources", icon: "Database" },
] as const;

export const SOCIAL_PLATFORMS = {
  linkedin: { label: "LinkedIn", color: "#0A66C2" },
  twitter: { label: "Twitter/X", color: "#1DA1F2" },
  instagram: { label: "Instagram", color: "#E4405F" },
  github: { label: "GitHub", color: "#181717" },
  youtube: { label: "YouTube", color: "#FF0000" },
  facebook: { label: "Facebook", color: "#1877F2" },
  reddit: { label: "Reddit", color: "#FF4500" },
  tiktok: { label: "TikTok", color: "#000000" },
} as const;

export const SEARCH_TYPES = [
  { value: "name", label: "Name", placeholder: "John Doe, Bangalore" },
  { value: "email", label: "Email", placeholder: "john@company.com" },
  { value: "phone", label: "Phone", placeholder: "+91 98765 43210" },
  { value: "username", label: "Username", placeholder: "@johndoe" },
  { value: "domain", label: "Domain", placeholder: "company.com" },
  { value: "company", label: "Company", placeholder: "Acme Inc" },
  { value: "natural_language", label: "AI Search", placeholder: "Find the CTO of a Bangalore fintech company named Rahul" },
] as const;

export const PURPOSE_OPTIONS = [
  { value: "sales", label: "Sales & Business Development" },
  { value: "recruitment", label: "Recruitment & Talent Acquisition" },
  { value: "journalism", label: "Journalism & Media" },
  { value: "research", label: "Academic Research" },
  { value: "background_check", label: "Background Verification" },
  { value: "personal", label: "Personal Use" },
] as const;
