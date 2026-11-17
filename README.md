# Nabil Fadili Portfolio

This is my personal portfolio site. I built it to be more than a static resume page: it shows my projects, resume, skills, GitHub activity, and a few interactive pieces that reflect the kind of front-end work I like building.

The site presents software development, testing, and applied AI work: React/TypeScript and Python projects, software engineering evaluation at Handshake AI, and Amazon internship experience. The current public resume and site content describe a UT Dallas Computer Science degree in progress, expected Spring 2027.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Three.js / React Three Fiber
- Vercel serverless functions
- Spotify Web API
- GitHub REST API

## Features

- Scroll-based portfolio layout with animated sections
- 3D project and skill map
- Project detail drawers with case-study style breakdowns
- Recruiter snapshot view
- Structured resume view with PDF actions
- Command palette with project, skill, resume, and contact shortcuts
- Terminal-style project console
- Live GitHub activity panel
- Spotify now-playing / recently-played widget

## Running Locally

```powershell
npm install
npm run dev
```

The dev server runs through Vite. The local Spotify API route is handled by the Vite config so the Spotify widget can be tested before deployment.

## Build

```powershell
npm run build
```

## Environment Variables

The Spotify widget uses a server-side endpoint so credentials are not exposed in the browser.

Create a local `.env.local` file if you want Spotify working locally:

```env
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

For deployment, set the same variables in the hosting provider instead of committing them.

The site still works without these values. The Spotify card will just show its disconnected state.

## Project Structure

```text
api/
  spotify-now-playing.js     Serverless Spotify endpoint

public/
  Nabil-Resume.pdf           Resume file used by the resume drawer

src/
  components/                Portfolio UI components
  data/portfolio.ts          Project, skills, experience, and contact content
  utils/                     Small browser utilities

vite.config.ts               Vite config and local Spotify dev route
vercel.json                  Vercel build and security header config
```

## Deployment

This project is set up for Vercel.

Expected settings:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

The Spotify endpoint is deployed from `api/spotify-now-playing.js`.

## Content Maintenance

Public profile, experience, project, skill, contact, and highlight content lives in `src/data/portfolio.ts`. The main page, project drawers, recruiter snapshot, structured resume, terminal, and command palette share that data.

When updating content:

1. Reconcile professional facts with the reviewed general resume and the actual project implementation. Describe personal and team contributions accurately; support quantitative results with measurement evidence.
2. Keep the desktop/mobile profile copy and the title/description in `index.html` consistent. Update project selection IDs in `ResumeView.tsx` and `RecruiterMode.tsx`, and project/skill relationships in `ProjectConstellation.tsx`, when the selected work changes.
3. Replace `public/Nabil-Resume.pdf` with the reviewed public PDF and update the version query in `contact.resume`. That query prevents an older browser-cached PDF from being reused after a resume update. Role-specific application resumes remain separate from the general public resume.
4. Run lint/build and review the main page, all content views, the downloaded PDF, project links, and contact actions on desktop and mobile. Keep private source notes, confidential examples, and credentials out of commits.

The current PDF contains the general resume revised October 27, 2026. Profile and project content were reconciled November 2, 2026. The structured resume is a selected public summary; its experience and education must stay consistent with the PDF.

## Notes

A few parts of the site use live public APIs:

- GitHub activity is pulled from the public GitHub API.
- Spotify activity is pulled through the serverless API route using my Spotify refresh token.
- If the GitHub request is rate-limited, the site falls back to curated repo data.

Private notes, private project details, and credentials are not part of this repo. The public resume PDF and portfolio content are the parts intended for recruiters or visitors to see.
