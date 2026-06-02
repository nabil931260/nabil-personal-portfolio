import { MonitorPlay } from "lucide-react";
import type { DemoFrame } from "../data/portfolio";

type ProjectDemoGalleryProps = {
  frames: DemoFrame[];
  compact?: boolean;
};

export function ProjectDemoGallery({ frames, compact = false }: ProjectDemoGalleryProps) {
  if (frames.length === 0) return null;

  return (
    <div className={`project-demo-gallery ${compact ? "compact" : ""}`} aria-label="Project demo gallery">
      {frames.map((frame) => (
        <article className="demo-frame" key={`${frame.eyebrow}-${frame.title}`}>
          <header>
            <span>
              <MonitorPlay size={14} />
              {frame.eyebrow}
            </span>
            <strong>{frame.title}</strong>
          </header>

          {!compact ? <p>{frame.description}</p> : null}

          {!compact ? (
            <div className={`demo-metrics ${frame.metrics ? "" : "empty"}`} aria-hidden={frame.metrics ? undefined : true}>
              {frame.metrics?.map((metric) => (
                <section key={metric.label}>
                  <small>{metric.label}</small>
                  <b>{metric.value}</b>
                </section>
              ))}
            </div>
          ) : frame.metrics ? (
            <div className="demo-metrics">
              {frame.metrics.map((metric) => (
                <section key={metric.label}>
                  <small>{metric.label}</small>
                  <b>{metric.value}</b>
                </section>
              ))}
            </div>
          ) : null}

          <div className="demo-rows">
            {frame.rows.map((row) => (
              <div className={row.tone ?? "neutral"} key={`${row.label}-${row.value}`}>
                <span>{row.label}</span>
                <strong>{row.value}</strong>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
