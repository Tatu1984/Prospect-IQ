// Environment variable validation
// Throws on startup if required vars are missing in production

const required = ["DATABASE_URL", "AUTH_SECRET"] as const;

const optional = [
  "NEXTAUTH_URL",
  "AUTH_URL",
  "AUTH_TRUST_HOST",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FACEBOOK_CLIENT_ID",
  "FACEBOOK_CLIENT_SECRET",
  "LINKEDIN_CLIENT_ID",
  "LINKEDIN_CLIENT_SECRET",
  "GITHUB_TOKEN",
] as const;

export function validateEnv() {
  const missing: string[] = [];
  for (const key of required) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    const msg = `Missing required environment variables: ${missing.join(", ")}`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(msg);
    } else {
      console.warn(`[env] ${msg}`);
    }
  }
}

// Run validation on import in production
if (process.env.NODE_ENV === "production") {
  validateEnv();
}

export const env = {
  databaseUrl: process.env.DATABASE_URL!,
  authSecret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET!,
  googleOAuth: !!process.env.GOOGLE_CLIENT_ID,
  facebookOAuth: !!process.env.FACEBOOK_CLIENT_ID,
  linkedinOAuth: !!process.env.LINKEDIN_CLIENT_ID,
  githubToken: !!process.env.GITHUB_TOKEN,
};
