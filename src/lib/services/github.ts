// GitHub API — search users, get profile + email + social links
// No auth needed for basic search (60 req/hr), with token: 5000 req/hr

interface GitHubUser {
  login: string;
  name: string | null;
  email: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitter_username: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

interface GitHubSearchResult {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubPerson {
  name: string;
  username: string;
  email: string | null;
  bio: string | null;
  company: string | null;
  location: string | null;
  avatarUrl: string;
  profileUrl: string;
  blog: string | null;
  twitter: string | null;
  followers: number;
  repos: number;
}

const headers: Record<string, string> = {
  Accept: "application/vnd.github+json",
  "User-Agent": "ProspectIQ/1.0",
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

export async function searchGitHub(query: string, maxResults = 5): Promise<GitHubPerson[]> {
  try {
    // Search users
    const searchUrl = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${maxResults}`;
    const searchRes = await fetch(searchUrl, { headers, next: { revalidate: 3600 } });

    if (!searchRes.ok) return [];

    const searchData = await searchRes.json();
    const users: GitHubSearchResult[] = searchData.items || [];

    // Fetch full profiles in parallel
    const profiles = await Promise.all(
      users.map(async (u): Promise<GitHubPerson | null> => {
        try {
          const res = await fetch(`https://api.github.com/users/${u.login}`, { headers });
          if (!res.ok) return null;
          const user: GitHubUser = await res.json();
          return {
            name: user.name || user.login,
            username: user.login,
            email: user.email,
            bio: user.bio,
            company: user.company?.replace(/^@/, "") || null,
            location: user.location,
            avatarUrl: user.avatar_url,
            profileUrl: user.html_url,
            blog: user.blog || null,
            twitter: user.twitter_username,
            followers: user.followers,
            repos: user.public_repos,
          };
        } catch {
          return null;
        }
      })
    );

    return profiles.filter((p): p is GitHubPerson => p !== null);
  } catch {
    return [];
  }
}

export async function getGitHubEmails(username: string): Promise<string[]> {
  // Try to get emails from public events (commits)
  try {
    const res = await fetch(`https://api.github.com/users/${username}/events/public?per_page=10`, { headers });
    if (!res.ok) return [];

    const events = await res.json();
    const emails = new Set<string>();

    for (const event of events) {
      if (event.type === "PushEvent" && event.payload?.commits) {
        for (const commit of event.payload.commits) {
          if (commit.author?.email && !commit.author.email.includes("noreply.github.com")) {
            emails.add(commit.author.email);
          }
        }
      }
    }

    return Array.from(emails);
  } catch {
    return [];
  }
}
