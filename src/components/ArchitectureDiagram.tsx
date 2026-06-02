import { ArrowRight } from "lucide-react";
import type { ArchitectureStep } from "../data/portfolio";

type ArchitectureDiagramProps = {
  steps: ArchitectureStep[];
  compact?: boolean;
};

export function ArchitectureDiagram({ steps, compact = false }: ArchitectureDiagramProps) {
  return (
    <div className={`architecture-diagram ${compact ? "compact" : ""}`} aria-label="Project architecture flow">
      {steps.map((step, index) => (
        <div className="architecture-node-wrap" key={`${step.label}-${index}`}>
          <section className="architecture-node">
            <small>{String(index + 1).padStart(2, "0")}</small>
            <strong>{step.label}</strong>
            <p>{step.detail}</p>
          </section>
          {index < steps.length - 1 ? (
            <span className="architecture-connector" aria-hidden="true">
              <ArrowRight size={16} />
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
