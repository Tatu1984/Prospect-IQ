export interface Person {
  id: string;
  fullName: string;
  aliases: string[];
  photoUrl: string | null;
  location: string | null;
  bio: string | null;
  aiSummary: string | null;
  qualityScore: number;
  isOptedOut: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PersonEmail {
  id: string;
  personId: string;
  email: string;
  isVerified: boolean;
  confidence: number;
  source: string;
  lastCheckedAt: string | null;
}

export interface PersonPhone {
  id: string;
  personId: string;
  phone: string;
  carrier: string | null;
  lineType: "mobile" | "landline" | "voip" | null;
  isWhatsApp: boolean;
  confidence: number;
  source: string;
}

export interface SocialProfile {
  id: string;
  personId: string;
  platform: SocialPlatform;
  username: string;
  profileUrl: string;
  followerCount: number | null;
  isVerified: boolean;
}

export type SocialPlatform =
  | "linkedin"
  | "twitter"
  | "instagram"
  | "github"
  | "youtube"
  | "facebook"
  | "reddit"
  | "tiktok";

export interface ProfessionalData {
  id: string;
  personId: string;
  jobTitle: string;
  company: string;
  industry: string | null;
  seniority: string | null;
  startDate: string | null;
}

export interface EducationData {
  id: string;
  personId: string;
  institution: string;
  degree: string | null;
  fieldOfStudy: string | null;
  graduationYear: number | null;
}

export interface DataSource {
  id: string;
  personId: string;
  sourceUrl: string;
  sourceType: string;
  extractedAt: string;
  raw: string | null;
}

export interface PersonProfile extends Person {
  emails: PersonEmail[];
  phones: PersonPhone[];
  socialProfiles: SocialProfile[];
  professional: ProfessionalData | null;
  education: EducationData[];
  dataSources: DataSource[];
}
