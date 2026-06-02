import { Code2, GitFork, Github, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type GitHubRepo = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count?: number;
  forks_count?: number;
  updated_at?: string;
  fork: boolean;
};

const curatedRepos: GitHubRepo[] = [
  {
    name: "assetforge",
    html_url: "https://github.com/nabil931260/assetforge",
    description: "Browser-based asset pipeline inspector for Godot-style game projects.",
    language: "TypeScript",
    fork: false,
  },
  {
    name: "ai-lead-scanner",
    html_url: "https://github.com/nabil931260/ai-lead-scanner",
    description: "Local-first lead scanner for public small-business outreach research.",
    language: "Python",
    fork: false,
  },
  {
    name: "KickMap",
    html_url: "https://github.com/nabil931260/KickMap",
    description: "Svelte/Firebase campus event discovery and map/list workflow concept.",
    language: "TypeScript",
    fork: false,
  },
];

function formatUpdatedAt(value: string) {
  const updated = new Date(value).getTime();
  const now = Date.now();
  const diffDays = Math.round((updated - now) / 86_400_000);

  if (Number.isNaN(diffDays)) return "recently";
  if (Math.abs(diffDays) < 1) return "today";

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (Math.abs(diffDays) < 45) return formatter.format(diffDays, "day");

  const diffMonths = Math.round(diffDays / 30);
  return formatter.format(diffMonths, "month");
}

export function GitHubActivityPanel() {
  const [repos, setRepos] = useState<GitHubRepo[]>(curatedRepos);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadRepos() {
      try {
        const response = await fetch("https://api.github.com/users/nabil931260/repos?per_page=12&sort=updated", {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
        const data = (await response.json()) as GitHubRepo[];
        const publicRepos = data.filter((repo) => !repo.fork && repo.name !== "nabil931260").slice(0, 5);

        if (isMounted && publicRepos.length > 0) {
          setRepos(publicRepos);
          setIsLive(true);
        }
      } catch {
        if (isMounted) setIsLive(false);
      }
    }

    void loadRepos();
    return () => {
      isMounted = false;
    };
  }, []);

  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    repos.forEach((repo) => {
      if (!repo.language) return;
      counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [repos]);

  return (
    <aside className="github-card" aria-label="Live GitHub activity">
      <header className="github-card-header">
        <span>
          <Github size={16} />
          GitHub Live
        </span>
        <small>{isLive ? "Public API" : "Curated repos"}</small>
      </header>

      <div className="github-language-strip" aria-label="Recent repository languages">
        {languages.map(([language, count]) => (
          <span key={language}>
            <Code2 size={13} />
            {language}
            <b>{count}</b>
          </span>
        ))}
      </div>

      <div className="github-repo-list">
        {repos.slice(0, 4).map((repo) => (
          <a href={repo.html_url} target="_blank" rel="noreferrer" key={repo.name}>
            <section>
              <strong>{repo.name}</strong>
              <p>{repo.description ?? "No public description set"}</p>
            </section>
            <footer>
              <span>{repo.language ?? "Repo"}</span>
              {isLive ? (
                <>
                  <span>
                    <Star size={12} />
                    {repo.stargazers_count ?? 0}
                  </span>
                  <span>
                    <GitFork size={12} />
                    {repo.forks_count ?? 0}
                  </span>
                  {repo.updated_at ? <small>{formatUpdatedAt(repo.updated_at)}</small> : null}
                </>
              ) : (
                <small>Public repo</small>
              )}
            </footer>
          </a>
        ))}
      </div>
    </aside>
  );
}
