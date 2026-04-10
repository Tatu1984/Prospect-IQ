export type CreditAction =
  | "basic_search"
  | "full_reveal"
  | "email_verify"
  | "phone_verify"
  | "bulk_row"
  | "ai_summary"
  | "dark_web_check"
  | "digital_footprint"
  | "company_intel"
  | "chrome_reveal";

export type TransactionType = "deduct" | "topup" | "bonus" | "refund";

export interface CreditTransaction {
  id: string;
  userId: string;
  delta: number;
  balance: number;
  type: TransactionType;
  action?: CreditAction;
  searchId?: string;
  description: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: PlanTier;
  status: "active" | "canceled" | "past_due" | "trialing";
  currentPeriodEnd: string;
  stripeSubId: string | null;
  razorpaySubId: string | null;
}

export interface PlanTier {
  id: string;
  name: string;
  credits: number;
  priceInr: number;
  priceUsd: number;
  features: string[];
}

export interface Invoice {
  id: string;
  userId: string;
  amount: number;
  currency: "INR" | "USD";
  gstAmount: number | null;
  status: "paid" | "pending" | "failed";
  pdfUrl: string | null;
  issuedAt: string;
}
