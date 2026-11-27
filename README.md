# Git Aura Check

Enter any GitHub username and get an aura score built from public profile stats. Every result shows exactly how the score was calculated.

**Live demo:** https://adarshpatil-07.github.io/git-aura-check/

## What it does

- Looks up a public GitHub profile through the GitHub REST API.
- Calculates an aura score from followers, stars, forks, repo count and account age.
- Shows a tier (from "Just landed" to "Legend"), a progress bar, a full score breakdown and the user's most used languages.

## How to use
1. Open the live demo.
2. Enter a GitHub username.
3. See the aura score and breakdown.

## GitHub API endpoints used

| Endpoint | Used for |
| --- | --- |
| `GET /users/{username}` | Name, avatar, followers, public repo count, account creation date |
| `GET /users/{username}/repos?per_page=100&type=owner` | Stars, forks and languages across the user's own repos |

No authentication is used. Only public data is read.

## How the score works

| Part | Points |
| --- | --- |
| Followers | 3 per follower |
| Stars on own repos | 2 per star |
| Forks of own repos | 1 per fork |
| Public repos | 1 per repo, up to 100 |
| Account age | 15 per year |

Forked repos are not counted for stars, forks or languages.

| Total points | Tier |
| --- | --- |
| 1500+ | Legend |
| 700 to 1499 | Architect |
| 300 to 699 | Rising builder |
| 100 to 299 | Active |
| 30 to 99 | Getting started |
| 0 to 29 | Just landed |

This is for fun. It is not a measure of how good a developer someone is.

## Tech stack

- HTML, CSS and vanilla JavaScript
- No framework, no build step, no dependencies

## Project structure

```
git-aura-check/
  index.html   page structure
  style.css    styling
  script.js    API calls, score calculation, rendering
  README.md
```

## Run locally

```bash
git clone https://github.com/adarshpatil-07/git-aura-check.git
cd git-aura-check
```

Open `index.html` in your browser. To use a local server instead:

```bash
npx serve .
```

## Deploy

**Vercel:** import the repo, leave the framework preset as "Other", and deploy. No build command is needed.

**GitHub Pages:** go to Settings, then Pages, choose the `main` branch and the root folder, and save.

## Limitations

- GitHub allows 60 unauthenticated API requests per hour per IP address. If the limit is reached, the app shows a message with the time it resets.
- Only the first 100 repos are read, so star and fork counts for users with more than 100 repos are partial.
- Private repos and private contributions are not included.

## Support

Questions or bugs: open an issue on this repo or email adarshpatil.tech07@gmail.com.

## Author

Adarsh Patil. [GitHub](https://github.com/adarshpatil-07) | [LinkedIn](https://linkedin.com/in/adarshpatil07)

## License

MIT
