const API = "https://api.github.com";
const MAX_SCORE = 1500;

const TIERS = [
  { min: 1500, name: "Legend" },
  { min: 700, name: "Architect" },
  { min: 300, name: "Rising builder" },
  { min: 100, name: "Active" },
  { min: 30, name: "Getting started" },
  { min: 0, name: "Just landed" },
];

const form = document.getElementById("search-form");
const input = document.getElementById("username");
const button = form.querySelector("button");
const statusEl = document.getElementById("status");
const result = document.getElementById("result");

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = isError ? "error" : "";
}

async function getJSON(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (res.status === 404) {
    throw new Error("No GitHub user found with that name.");
  }
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    const when = reset
      ? new Date(Number(reset) * 1000).toLocaleTimeString()
      : "a bit later";
    throw new Error("GitHub's rate limit was reached. Try again after " + when + ".");
  }
  if (!res.ok) {
    throw new Error("GitHub returned an error. Please try again.");
  }
  return res.json();
}

function calculateAura(user, repos) {
  const ownRepos = repos.filter((repo) => !repo.fork);
  const stars = ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const forks = ownRepos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const repoCount = Math.min(user.public_repos, 100);
  const years =
    (Date.now() - new Date(user.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  const parts = [
    { label: "Followers", calc: user.followers + " x 3", points: user.followers * 3 },
    { label: "Stars on own repos", calc: stars + " x 2", points: stars * 2 },
    { label: "Forks of own repos", calc: forks + " x 1", points: forks },
    { label: "Public repos (up to 100)", calc: repoCount + " x 1", points: repoCount },
    { label: "Account age", calc: years.toFixed(1) + " years x 15", points: Math.round(years * 15) },
  ];

  const total = parts.reduce((sum, part) => sum + part.points, 0);
  return { parts, total };
}

function getTier(total) {
  return TIERS.find((tier) => total >= tier.min).name;
}

function topLanguages(repos) {
  const counts = {};
  repos
    .filter((repo) => !repo.fork && repo.language)
    .forEach((repo) => {
      counts[repo.language] = (counts[repo.language] || 0) + 1;
    });

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language, count]) => language + " (" + count + ")");

  return sorted.length ? sorted.join(", ") : "No language data on public repos.";
}

function render(user, repos) {
  const { parts, total } = calculateAura(user, repos);

  const avatar = document.getElementById("avatar");
  avatar.src = user.avatar_url;
  avatar.alt = "Avatar of " + user.login;

  document.getElementById("name").textContent = user.name || user.login;

  const link = document.getElementById("profile-link");
  link.href = user.html_url;
  link.textContent = "@" + user.login;

  document.getElementById("tier").textContent = getTier(total);
  document.getElementById("points").textContent = total.toLocaleString();
  document.getElementById("bar-fill").style.width =
    Math.min(100, (total / MAX_SCORE) * 100) + "%";

  const body = document.getElementById("breakdown");
  body.replaceChildren();
  parts.forEach((part) => {
    const row = document.createElement("tr");
    [part.label, part.calc, part.points.toLocaleString()].forEach((text, index) => {
      const cell = document.createElement("td");
      cell.textContent = text;
      if (index === 2) cell.className = "num";
      row.appendChild(cell);
    });
    body.appendChild(row);
  });

  document.getElementById("languages").textContent = topLanguages(repos);
  result.hidden = false;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = input.value.trim();
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    setStatus("Enter a valid GitHub username (letters, numbers and hyphens only).", true);
    return;
  }

  button.disabled = true;
  result.hidden = true;
  setStatus("Looking up " + username + "...");

  try {
    const [user, repos] = await Promise.all([
      getJSON(API + "/users/" + username),
      getJSON(API + "/users/" + username + "/repos?per_page=100&type=owner"),
    ]);
    render(user, repos);
    setStatus("");
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    button.disabled = false;
  }
});