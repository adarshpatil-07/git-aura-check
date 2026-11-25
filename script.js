const API = "https://api.github.com";
const MAX_SCORE = 1500;

const TIERS = [
  { min: 1500, name: "The Legend", line: "People star your repos without being asked. That is rare." },
  { min: 700, name: "The Architect", line: "You build things other people end up building on." },
  { min: 300, name: "The Builder", line: "Consistent, shipping, quietly dangerous." },
  { min: 100, name: "Rising Star", line: "The graph is climbing and people have started to notice." },
  { min: 30, name: "The Tinkerer", line: "A few repos, a lot of curiosity. Keep pushing." },
  { min: 0, name: "The Lurker", line: "Mostly watching so far. One good repo changes everything." },
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
  const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });

  if (res.status === 404) throw new Error("No GitHub user found with that name.");
  if (res.status === 403 || res.status === 429) {
    const reset = res.headers.get("x-ratelimit-reset");
    const when = reset ? new Date(Number(reset) * 1000).toLocaleTimeString() : "a bit later";
    throw new Error("GitHub's rate limit was reached. Try again after " + when + ".");
  }
  if (!res.ok) throw new Error("GitHub returned an error. Please try again.");
  return res.json();
}

function calculate(user, repos) {
  const own = repos.filter((r) => !r.fork);
  const stars = own.reduce((sum, r) => sum + r.stargazers_count, 0);
  const forks = own.reduce((sum, r) => sum + r.forks_count, 0);
  const years = (Date.now() - new Date(user.created_at).getTime()) / (365.25 * 24 * 60 * 60 * 1000);

  const total =
    user.followers * 3 +
    stars * 2 +
    forks +
    Math.min(user.public_repos, 100) +
    Math.round(years * 15);

  return { total, stars, forks };
}

function topLanguages(repos) {
  const counts = {};
  repos
    .filter((r) => !r.fork && r.language)
    .forEach((r) => { counts[r.language] = (counts[r.language] || 0) + 1; });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([language]) => language);
}

function countUp(el, target) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || target === 0) {
    el.textContent = target.toLocaleString();
    return;
  }
  const duration = 800;
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased).toLocaleString();
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function render(user, repos) {
  const { total, stars, forks } = calculate(user, repos);
  const tierIndex = TIERS.findIndex((t) => total >= t.min);
  const tier = TIERS[tierIndex];
  const next = tierIndex > 0 ? TIERS[tierIndex - 1] : null;

  const avatar = document.getElementById("avatar");
  avatar.src = user.avatar_url;
  avatar.alt = "Avatar of " + user.login;

  document.getElementById("name").textContent = user.name || user.login;

  const link = document.getElementById("profile-link");
  link.href = user.html_url;
  link.textContent = "@" + user.login;

  document.getElementById("bio").textContent = user.bio || "";

  document.getElementById("persona").textContent = tier.name;
  document.getElementById("line").textContent = tier.line;

  const fill = document.getElementById("meter-fill");
  fill.style.width = "0%";
  requestAnimationFrame(() => {
    fill.style.width = Math.min(100, (total / MAX_SCORE) * 100) + "%";
  });

  document.getElementById("meter-note").textContent = next
    ? (next.min - total).toLocaleString() + " points to " + next.name
    : "Top tier reached.";

  document.getElementById("s-followers").textContent = user.followers.toLocaleString();
  document.getElementById("s-repos").textContent = user.public_repos.toLocaleString();
  document.getElementById("s-stars").textContent = stars.toLocaleString();
  document.getElementById("s-forks").textContent = forks.toLocaleString();

  const langList = document.getElementById("languages");
  langList.replaceChildren();
  const langs = topLanguages(repos);
  (langs.length ? langs : ["No language data"]).forEach((lang) => {
    const li = document.createElement("li");
    li.textContent = lang;
    langList.appendChild(li);
  });

  result.hidden = false;
  countUp(document.getElementById("points"), total);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = input.value.trim().replace(/^@/, "");
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    setStatus("Enter a valid GitHub username (letters, numbers and hyphens only).", true);
    return;
  }

  button.disabled = true;
  result.hidden = true;
  setStatus("Reading " + username + "'s profile...");

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