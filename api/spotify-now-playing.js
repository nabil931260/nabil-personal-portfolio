const tokenEndpoint = "https://accounts.spotify.com/api/token";
const nowPlayingEndpoint = "https://api.spotify.com/v1/me/player/currently-playing";
const recentlyPlayedEndpoint = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

function getCredentials() {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) return null;
  return { clientId, clientSecret, refreshToken };
}

async function getAccessToken(credentials) {
  const basic = Buffer.from(`${credentials.clientId}:${credentials.clientSecret}`).toString("base64");
  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: credentials.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error(`Spotify token request failed: ${response.status}`);
  }

  return response.json();
}

function normalizeTrack(item, isPlaying, progressMs = 0) {
  if (!item) {
    return { isConfigured: true, isPlaying: false };
  }

  return {
    isConfigured: true,
    isPlaying,
    title: item.name,
    artist: item.artists?.map((artist) => artist.name).join(", "),
    album: item.album?.name,
    albumImageUrl: item.album?.images?.[0]?.url,
    songUrl: item.external_urls?.spotify,
    progressMs,
    durationMs: item.duration_ms,
    updatedAt: new Date().toISOString(),
  };
}

async function getRecentlyPlayed(accessToken) {
  const response = await fetch(recentlyPlayedEndpoint, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Spotify recently played request failed: ${response.status}`);
  }

  const data = await response.json();
  return normalizeTrack(data.items?.[0]?.track, false);
}

export default async function handler(request, response) {
  response.setHeader("Cache-Control", "s-maxage=25, stale-while-revalidate=60");

  const credentials = getCredentials();
  if (!credentials) {
    response.status(200).json({ isConfigured: false, isPlaying: false });
    return;
  }

  try {
    const { access_token: accessToken } = await getAccessToken(credentials);
    const spotifyResponse = await fetch(nowPlayingEndpoint, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (spotifyResponse.status === 204 || spotifyResponse.status === 202) {
      response.status(200).json(await getRecentlyPlayed(accessToken));
      return;
    }

    if (!spotifyResponse.ok) {
      throw new Error(`Spotify now playing request failed: ${spotifyResponse.status}`);
    }

    const data = await spotifyResponse.json();
    response.status(200).json(normalizeTrack(data.item, data.is_playing, data.progress_ms));
  } catch {
    response.status(500).json({
      isConfigured: true,
      isPlaying: false,
      error: "Spotify request failed",
    });
  }
}
