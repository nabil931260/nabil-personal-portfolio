# Deployment Guide

This portfolio is prepared for Vercel because the project uses a Vite static build plus the `api/spotify-now-playing.js` serverless function.

## Vercel Settings

- Framework preset: `Vite`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Root directory: this project folder

## Environment Variables

Set these in Vercel Project Settings, not in the repo:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

The site works without these values, but the Spotify card will show its setup state instead of live listening data.

## Pre-Deploy Check

Run these locally before publishing:

```powershell
npm run lint
npm run build
```

Then verify:

- `public/Nabil-Resume.pdf` is the resume you want public.
- The live site can load `/api/spotify-now-playing`.
- Project links open the intended public repositories.
- Recruiter Snapshot, Resume, project drawers, terminal, and command palette still work after deployment.
- `.env.local` is not committed.
- Logs, screenshots, local environment files, and build output are not committed.

## Post-Deploy Check

After the first deployment:

- Open the production URL on desktop and mobile.
- Confirm the Spotify card either shows a track/recent track or the disconnected state.
- Check Vercel Function logs if Spotify shows an error state.
- Confirm the resume PDF opens from the Resume drawer.
- Test `Ctrl+K`, terminal `help`, and project drawer scrolling.

## Notes

The static app is served from `dist`. The Spotify endpoint is deployed from the `api` directory as a Vercel Node function, keeping Spotify secrets on the server side.

The deploy config also sets basic browser security headers: content type sniffing protection, referrer policy, permissions policy, and a Content Security Policy scoped to this app, GitHub public repo fetches, and external HTTPS images.
