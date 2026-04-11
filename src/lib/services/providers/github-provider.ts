import { searchGitHub, getGitHubEmails } from "../github";
import type { Provider, ProviderPerson } from "./types";

export const githubProvider: Provider = {
  id: "github",
  label: "GitHub",
  isEnabled: () => true, // Always enabled (free API, 60/hr unauth, 5000/hr with token)
  costPerCallUsd: 0,
  async run(query) {
    if (query.type !== "name" && query.type !== "username") return [];

    const results = await searchGitHub(query.name, 5);
    const persons: ProviderPerson[] = [];

    for (const gh of results) {
      const emails: ProviderPerson["emails"] = [];
      if (gh.email) emails.push({ email: gh.email, source: "GitHub profile", sourceUrl: gh.profileUrl });

      const commitEmails = await getGitHubEmails(gh.username);
      for (const e of commitEmails) {
        if (!emails.some((x) => x.email === e)) {
          emails.push({ email: e, source: "GitHub commits", sourceUrl: `${gh.profileUrl}?tab=overview` });
        }
      }

      const socials: ProviderPerson["socials"] = [
        { platform: "github", username: gh.username, url: gh.profileUrl },
      ];
      if (gh.twitter) socials.push({ platform: "twitter", username: gh.twitter, url: `https://x.com/${gh.twitter}` });

      persons.push({
        fullName: gh.name,
        photoUrl: gh.avatarUrl,
        location: gh.location,
        bio: gh.bio,
        company: gh.company,
        jobTitle: null,
        emails,
        phones: [],
        socials,
      });
    }

    return persons;
  },
};
