import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

declare const process: {
  cwd: () => string;
  env: Record<string, string | undefined>;
};

declare const Buffer: {
  from: (input: string) => { toString: (encoding: string) => string };
};

const tokenEndpoint = "https://accounts.spotify.com/api/token";
const nowPlayingEndpoint = "https://api.spotify.com/v1/me/player/currently-playing";
const recentlyPlayedEndpoint = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

type SpotifyItem = {
  name?: string;
  artists?: { name: string }[];
  album?: {
    name?: string;
    images?: { url: string }[];
  };
  external_urls?: {
    spotify?: string;
  };
  duration_ms?: number;
};

function sendJson(res: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body: string) => void }, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

function normalizeTrack(item: SpotifyItem | undefined, isPlaying: boolean, progressMs = 0) {
  if (!item) return { isConfigured: true, isPlaying: false };

  return {
    isConfigured: true,
    isPlaying,
    title: item.name,
    artist: item.artists?.map((artist: { name: string }) => artist.name).join(", "),
    album: item.album?.name,
    albumImageUrl: item.album?.images?.[0]?.url,
    songUrl: item.external_urls?.spotify,
    progressMs,
    durationMs: item.duration_ms,
    updatedAt: new Date().toISOString(),
  };
}

function spotifyDevApi(mode: string): Plugin {
  const env = loadEnv(mode, process.cwd(), "SPOTIFY_");

  return {
    name: "spotify-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/spotify-now-playing", async (_req, res) => {
        const clientId = env.SPOTIFY_CLIENT_ID || process.env.SPOTIFY_CLIENT_ID;
        const clientSecret = env.SPOTIFY_CLIENT_SECRET || process.env.SPOTIFY_CLIENT_SECRET;
        const refreshToken = env.SPOTIFY_REFRESH_TOKEN || process.env.SPOTIFY_REFRESH_TOKEN;

        if (!clientId || !clientSecret || !refreshToken) {
          sendJson(res, 200, { isConfigured: false, isPlaying: false });
          return;
        }

        try {
          const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
          const tokenResponse = await fetch(tokenEndpoint, {
            method: "POST",
            headers: {
              Authorization: `Basic ${basic}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: refreshToken,
            }),
          });

          if (!tokenResponse.ok) throw new Error(`Spotify token request failed: ${tokenResponse.status}`);

          const { access_token: accessToken } = await tokenResponse.json();
          const nowPlayingResponse = await fetch(nowPlayingEndpoint, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (nowPlayingResponse.status === 204 || nowPlayingResponse.status === 202) {
            const recentResponse = await fetch(recentlyPlayedEndpoint, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const recentData = recentResponse.ok ? await recentResponse.json() : null;
            sendJson(res, 200, normalizeTrack(recentData?.items?.[0]?.track, false));
            return;
          }

          if (!nowPlayingResponse.ok) throw new Error(`Spotify now playing request failed: ${nowPlayingResponse.status}`);

          const data = await nowPlayingResponse.json();
          sendJson(res, 200, normalizeTrack(data.item, data.is_playing, data.progress_ms));
        } catch {
          sendJson(res, 500, {
            isConfigured: true,
            isPlaying: false,
            error: "Spotify request failed",
          });
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), spotifyDevApi(mode)],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf("node_modules/three") >= 0 || id.indexOf("node_modules\\three") >= 0) return "three";
          if (
            id.indexOf("node_modules/@react-three") >= 0 ||
            id.indexOf("node_modules\\@react-three") >= 0 ||
            id.indexOf("node_modules/maath") >= 0 ||
            id.indexOf("node_modules\\maath") >= 0
          ) {
            return "r3f";
          }
        },
      },
    },
  },
}));
