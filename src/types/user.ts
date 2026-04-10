export type UserRole = "USER" | "MANAGER" | "ADMIN" | "SUPER_ADMIN";

export type UserPurpose =
  | "sales"
  | "recruitment"
  | "journalism"
  | "research"
  | "background_check"
  | "personal";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  purpose: UserPurpose;
  teamId: string | null;
  creditsBalance: number;
  twoFactorEnabled: boolean;
  avatarUrl: string | null;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  ownerId: string;
  plan: PlanType;
  creditsPool: number;
  members: TeamMember[];
}

export interface TeamMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

export type PlanType = "free" | "starter" | "professional" | "business" | "enterprise";

export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  keyPreview: string;
  permissions: string[];
  rateLimit: number;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  targetPersonId: string | null;
  creditsUsed: number;
  metadata: Record<string, unknown>;
  timestamp: string;
}
