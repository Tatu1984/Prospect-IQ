import { searchGitLab } from "../gitlab";
import type { Provider, ProviderPerson } from "./types";

export const gitlabProvider: Provider = {
  id: "gitlab",
  label: "GitLab",
  isEnabled: () => true,
  costPerCallUsd: 0,
  async run(query) {
    if (query.type !== "name" && query.type !== "username") return [];

    const results = await searchGitLab(query.name, 5);
    const persons: ProviderPerson[] = [];

    for (const gl of results) {
      const emails: ProviderPerson["emails"] = [];
      if (gl.publicEmail) {
        emails.push({ email: gl.publicEmail, source: "GitLab public email", sourceUrl: gl.profileUrl });
      }

      const socials: ProviderPerson["socials"] = [
        { platform: "gitlab", username: gl.username, url: gl.profileUrl },
      ];
      if (gl.linkedin) {
        socials.push({ platform: "linkedin", username: gl.linkedin, url: `https://linkedin.com/in/${gl.linkedin}` });
      }
      if (gl.twitter) {
        socials.push({ platform: "twitter", username: gl.twitter, url: `https://x.com/${gl.twitter}` });
      }

      persons.push({
        fullName: gl.name,
        photoUrl: gl.avatarUrl,
        location: gl.location,
        bio: gl.bio,
        company: gl.organization,
        jobTitle: gl.jobTitle,
        emails,
        phones: [],
        socials,
      });
    }

    return persons;
  },
};
