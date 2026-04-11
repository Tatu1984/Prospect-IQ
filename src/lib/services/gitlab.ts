// GitLab public API — free, no auth needed for public user search.

export interface GitLabPerson {
  name: string;
  username: string;
  bio: string | null;
  location: string | null;
  organization: string | null;
  jobTitle: string | null;
  avatarUrl: string;
  profileUrl: string;
  website: string | null;
  email: string | null;
  publicEmail: string | null;
  skype: string | null;
  linkedin: string | null;
  twitter: string | null;
}

export async function searchGitLab(query: string, maxResults = 5): Promise<GitLabPerson[]> {
  try {
    const searchUrl = `https://gitlab.com/api/v4/users?search=${encodeURIComponent(query)}&per_page=${maxResults}`;
    const res = await fetch(searchUrl, {
      headers: { "User-Agent": "ProspectIQ/1.0" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return [];

    const users = await res.json();
    if (!Array.isArray(users)) return [];

    return users.map((u: Record<string, unknown>) => ({
      name: (u.name as string) || (u.username as string),
      username: (u.username as string) || "",
      bio: (u.bio as string | null) || null,
      location: (u.location as string | null) || null,
      organization: (u.organization as string | null) || null,
      jobTitle: (u.job_title as string | null) || null,
      avatarUrl: (u.avatar_url as string) || "",
      profileUrl: (u.web_url as string) || "",
      website: (u.website_url as string | null) || null,
      email: (u.email as string | null) || null,
      publicEmail: (u.public_email as string | null) || null,
      skype: (u.skype as string | null) || null,
      linkedin: (u.linkedin as string | null) || null,
      twitter: (u.twitter as string | null) || null,
    }));
  } catch {
    return [];
  }
}
