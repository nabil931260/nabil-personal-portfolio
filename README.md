# Personal Portfolio Site

Portfolio site for Nabil Fadili, focused on resume, projects, skills, experience, and professional links.

## Stack

- Vite
- React
- TypeScript
- Framer Motion
- React Three Fiber / Drei
- Three.js
- Lucide React
- Spotify Web API
- GitHub REST API

## Run Locally

```powershell
cd "D:\Obsidian\Central\03 Projects\Personal Portfolio Site"
npm install
npm run dev
```

## Build

```powershell
npm run build
```

## Deploy

This project includes `vercel.json` and `.vercelignore` for a Vercel deployment. Use:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: `Central/03 Projects/Personal Portfolio Site` if deploying from the full vault repository

See `DEPLOYMENT.md` for the full deploy checklist.

## Portfolio Features

- Full-page animated portfolio sections for projects, skills, experience, blog, and contact.
- Recruiter snapshot modal for a fast hiring-oriented overview.
- Structured resume drawer with contact links, proof points, selected projects, skill groups, PDF preview, and PDF download.
- Keyboard-accessible modal behavior for Escape, Tab, and Shift+Tab.
- Interactive terminal, command palette, project map, skill filtering, GitHub activity, and Spotify now-playing panel.

## Spotify Now Playing

The site includes a server-side API endpoint at `api/spotify-now-playing.js`. It keeps Spotify secrets out of the browser and returns the current track, or the most recent track when nothing is playing.

Set these environment variables in the deployment environment:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

Use `.env.example` as the variable checklist. Do not commit real Spotify credentials.

The frontend polls `/api/spotify-now-playing` every 30 seconds. Vite serves this endpoint locally during `npm run dev`, and `api/spotify-now-playing.js` serves it in a serverless deployment. Without those variables, the Spotify card shows that it is not connected.

## GitHub Activity

The Technical Blog section also reads public repository activity from the GitHub REST API for `nabil931260`. It uses no token and falls back to curated public repo data if GitHub rate-limits the browser request.

## Content Sources

The portfolio content is based on verified resume and project notes in the Obsidian vault:

- Career application materials
- Master resume notes
- Project portfolio notes
- Key metrics
- Private beta project notes, summarized without source data
- AI Lead Scanner project notes
- Amazon internship resume notes
- Public GitHub repositories under `nabil931260`

Public repo links were added only where there was a clear match:

- `ai-lead-scanner`
- `KickMap`
- `Diabetes-Prediction-AIM-SP24-main`
- `ExpressifAI3`
- `assetforge`

EasyTeller keeps the existing public team/collaborator repository link.

## Privacy Notes

- Proprietary Amazon project/system details are intentionally excluded.
- Private vault notes, lead lists, client-specific information, keys, tokens, addresses, and private emails are not published.
- The public contact email used on the site is `nabil.x.fadili@gmail.com`.

## Publishing Checklist

- Review the resume PDF in `public/Nabil-Resume.pdf`.
- Confirm the structured resume drawer matches the PDF before publishing.
- Test the Recruiter View and Resume drawer on desktop and mobile.
- Test keyboard behavior: Escape closes modals, Tab stays inside the active modal, and focus returns to the opener.
- Confirm all project descriptions are accurate before deployment.
- Confirm the EasyTeller team repo is the preferred public link.
- Replace or remove any project that should not be published before deployment.
- Add Spotify environment variables in the deployment provider if the now-playing widget should be live.
- Keep `.env.local` private and never commit refresh tokens or API secrets.

## Deployment Notes

This project is ready for a Vite-compatible static/serverless deployment. The static portfolio is built from `npm run build`; the Spotify endpoint requires a platform that supports the `api/spotify-now-playing.js` serverless function or an equivalent route. If the endpoint is not deployed, the Spotify card stays in its disconnected state.
