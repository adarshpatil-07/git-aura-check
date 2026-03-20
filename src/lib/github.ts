export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

export interface AuraProfile {
  user: GitHubUser;
  auraType: string;
  auraEmoji: string;
  auraDescription: string;
  auraScore: number;
  accountAgeDays: number;
  accountAgeYears: number;
}

export async function fetchGitHubUser(username: string): Promise<GitHubUser> {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403) throw new Error("Rate limit exceeded. Try again later.");
    throw new Error("Failed to fetch user data");
  }
  return res.json();
}

export function computeAura(user: GitHubUser): AuraProfile {
  const now = new Date();
  const created = new Date(user.created_at);
  const accountAgeDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  const accountAgeYears = Math.floor(accountAgeDays / 365);

  // Score components
  const repoScore = Math.min(user.public_repos * 2, 200);
  const followerScore = Math.min(user.followers * 3, 300);
  const gistScore = Math.min(user.public_gists * 5, 100);
  const ageScore = Math.min(accountAgeYears * 20, 200);
  const socialScore = Math.min(user.following * 0.5, 50);
  const auraScore = Math.min(repoScore + followerScore + gistScore + ageScore + socialScore, 999);

  let auraType: string;
  let auraEmoji: string;
  let auraDescription: string;

  if (user.followers > 1000 && user.public_repos > 50) {
    auraType = "The Legend";
    auraEmoji = "👑";
    auraDescription = "A rare force of nature. Code and community bow before you.";
  } else if (user.followers > 500) {
    auraType = "The Influencer";
    auraEmoji = "✨";
    auraDescription = "Your presence echoes across the developer multiverse.";
  } else if (user.public_repos > 100) {
    auraType = "The Architect";
    auraEmoji = "🏛️";
    auraDescription = "You build empires in code. Every repo is a monument.";
  } else if (accountAgeYears > 10) {
    auraType = "The Ancient One";
    auraEmoji = "🔮";
    auraDescription = "You've witnessed eras of tech rise and fall. Wisdom incarnate.";
  } else if (accountAgeYears > 5) {
    auraType = "The Veteran";
    auraEmoji = "⚔️";
    auraDescription = "Battle-tested and code-hardened. A true survivor.";
  } else if (user.public_repos > 50) {
    auraType = "The Builder";
    auraEmoji = "🔨";
    auraDescription = "Relentless creator. Your repos tell a story of ambition.";
  } else if (user.followers > 100) {
    auraType = "The Rising Star";
    auraEmoji = "🌟";
    auraDescription = "The community has noticed you. Your ascent has begun.";
  } else if (user.public_gists > 20) {
    auraType = "The Scholar";
    auraEmoji = "📚";
    auraDescription = "A keeper of knowledge, sharing wisdom in fragments.";
  } else if (user.public_repos > 20) {
    auraType = "The Tinkerer";
    auraEmoji = "⚙️";
    auraDescription = "Curiosity drives you. Every project is a new experiment.";
  } else if (user.following > user.followers * 3 && user.following > 50) {
    auraType = "The Observer";
    auraEmoji = "👁️";
    auraDescription = "You watch, you learn, you absorb the collective genius.";
  } else if (accountAgeYears < 1) {
    auraType = "The Rising Star";
    auraEmoji = "🌟";
    auraDescription = "Fresh on the scene with unlimited potential. Your journey begins now.";
  } else {
    auraType = "The Newcomer";
    auraEmoji = "🌱";
    auraDescription = "Fresh potential. The journey of a thousand commits begins here.";
  }

  return { user, auraType, auraEmoji, auraDescription, auraScore, accountAgeDays, accountAgeYears };
}
