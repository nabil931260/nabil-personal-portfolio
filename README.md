# Nabil Fadili Portfolio

This is my personal portfolio site. I built it to be more than a static resume page: it shows my projects, resume, skills, GitHub activity, and a few interactive pieces that reflect the kind of front-end work I like building.

The site is focused on full-stack development, applied AI/ML projects, automation tools, and practical software work from my CS coursework, internships, and project builds.

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

## Notes

A few parts of the site use live public APIs:

- GitHub activity is pulled from the public GitHub API.
- Spotify activity is pulled through the serverless API route using my Spotify refresh token.
- If the GitHub request is rate-limited, the site falls back to curated repo data.

Private notes, private project details, and credentials are not part of this repo. The public resume PDF and portfolio content are the parts intended for recruiters or visitors to see.
