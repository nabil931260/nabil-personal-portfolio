import { Music2, Radio } from "lucide-react";
import { useEffect, useState } from "react";

type SpotifyTrack = {
  isConfigured: boolean;
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
  updatedAt?: string;
};

function formatProgress(progressMs?: number, durationMs?: number) {
  if (!progressMs || !durationMs) return 0;
  return Math.min(100, Math.round((progressMs / durationMs) * 100));
}

export function SpotifyNowPlaying() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTrack() {
      try {
        const response = await fetch("/api/spotify-now-playing", { cache: "no-store" });
        const data = (await response.json()) as SpotifyTrack;
        if (isMounted) setTrack(data);
      } catch {
        if (isMounted) setTrack({ isConfigured: false, isPlaying: false });
      }
    }

    void loadTrack();
    const timer = window.setInterval(loadTrack, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const progress = formatProgress(track?.progressMs, track?.durationMs);
  const hasTrack = Boolean(track?.title && track.artist);

  return (
    <aside className="spotify-card" aria-label="Spotify now playing">
      <div className="spotify-card-header">
        <span>
          <Radio size={16} />
          Spotify Live
        </span>
        <small>{track?.isPlaying ? "Now playing" : hasTrack ? "Recently played" : "Ready"}</small>
      </div>

      <div className="spotify-track">
        {track?.albumImageUrl ? (
          <img src={track.albumImageUrl} alt="" loading="lazy" />
        ) : (
          <div className="spotify-fallback-art" aria-hidden="true">
            <Music2 size={28} />
          </div>
        )}
        <section>
          <strong>{hasTrack ? track?.title : "Listening status"}</strong>
          <p>{hasTrack ? track?.artist : "Live Spotify activity appears here when a track is available."}</p>
          {track?.album ? <small>{track.album}</small> : null}
        </section>
      </div>

      <div className="spotify-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="spotify-actions">
        {track?.songUrl ? (
          <a href={track.songUrl} target="_blank" rel="noreferrer">
            Open in Spotify
          </a>
        ) : (
          <span>Updates every 30 seconds</span>
        )}
      </div>
    </aside>
  );
}
