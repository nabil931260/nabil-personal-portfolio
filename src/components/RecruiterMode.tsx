import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { contact, experiences, profile, projects, publicHighlights, skills } from "../data/portfolio";
import { copyTextToClipboard, getMailtoHref } from "../utils/contactActions";
import { useModalFocus } from "../utils/modalFocus";
import { TechBadge } from "./TechBadge";

const priorityProjectIds = ["lead-scanner", "easyteller", "expressifai", "kickmap"];

const reviewPath = [
  {
    label: "Best first read",
    value: "Project case studies",
    detail: "Open the project drawers for implementation choices, validation notes, and next steps.",
  },
  {
    label: "Strongest fit",
    value: "Front-end systems + applied AI",
    detail: "React/Svelte interfaces paired with Python, OCR, computer vision, automation, and practical product workflows.",
  },
  {
    label: "Work signal",
    value: "Operations-minded builder",
    detail: "Two Amazon internship rotations and project work shaped around practical operations problems.",
  },
];

export function RecruiterMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRecruiterMode = useCallback(() => setIsOpen(false), []);
  const modalRef = useModalFocus<HTMLElement>(isOpen, closeRecruiterMode);
  const priorityProjects = useMemo(
    () => priorityProjectIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean),
    [],
  );
  const skillGroups = useMemo(
    () =>
      skills.map((group) => ({
        ...group,
        items: group.items.slice(0, 7),
      })),
    [],
  );

  useEffect(() => {
    function openRecruiterMode() {
      setIsOpen(true);
    }

    window.addEventListener("portfolio-recruiter-open", openRecruiterMode);
    return () => window.removeEventListener("portfolio-recruiter-open", openRecruiterMode);
  }, []);

  async function copyEmail() {
    try {
      await copyTextToClipboard(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.assign(getMailtoHref(contact.email));
    }
  }

  function openResumeView() {
    closeRecruiterMode();
    window.dispatchEvent(new Event("portfolio-resume-open"));
  }

  const panel = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="recruiter-backdrop"
          role="presentation"
          onClick={closeRecruiterMode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.aside
            ref={modalRef}
            className="recruiter-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recruiter-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: -18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ type: "spring", stiffness: 280, damping: 34, mass: 0.85 }}
          >
            <header className="recruiter-panel-header">
              <div className="recruiter-identity">
                <span>Recruiter snapshot</span>
                <h2 id="recruiter-title">{profile.name}</h2>
                <p>{profile.headline}</p>
                <div className="recruiter-tags" aria-label="Candidate basics">
                  <span>
                    <GraduationCap size={14} /> {profile.education}
                  </span>
                  <span>
                    <MapPin size={14} /> {profile.location}
                  </span>
                </div>
              </div>
              <button type="button" onClick={closeRecruiterMode} aria-label="Close recruiter view">
                <X size={18} />
              </button>
            </header>

            <section className="recruiter-summary">
              <div>
                <span>Profile focus</span>
                <p>{profile.subtitle}</p>
              </div>
              <div className="recruiter-actions">
                <button className="is-primary" type="button" onClick={openResumeView}>
                  <Download size={16} /> Resume
                </button>
                <a href={contact.github} target="_blank" rel="noreferrer">
                  <Github size={16} /> GitHub
                </a>
                <a href={contact.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <button type="button" onClick={copyEmail}>
                  <Copy size={16} /> {copied ? "Copied" : "Copy email"}
                </button>
              </div>
            </section>

            <section className="recruiter-review-path" aria-label="Recommended recruiter review path">
              {reviewPath.map((item) => (
                <article key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </section>

            <section className="recruiter-metrics" aria-label="Portfolio proof points">
              {publicHighlights.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </section>

            <div className="recruiter-grid">
              <section>
                <div className="recruiter-section-title">
                  <Code2 size={16} />
                  <h3>Best project starting points</h3>
                </div>
                <div className="recruiter-project-list">
                  {priorityProjects.map((project) =>
                    project ? (
                      <article key={project.id}>
                        <div>
                          <strong>{project.title}</strong>
                          <span>{project.status}</span>
                        </div>
                        <p>{project.short}</p>
                        <small>{project.tools.slice(0, 5).join(" / ")}</small>
                        {project.link ? (
                          <a href={project.link} target="_blank" rel="noreferrer">
                            Open repo <ExternalLink size={13} />
                          </a>
                        ) : null}
                      </article>
                    ) : null,
                  )}
                </div>
              </section>

              <section>
                <div className="recruiter-section-title">
                  <BriefcaseBusiness size={16} />
                  <h3>Experience</h3>
                </div>
                <div className="recruiter-experience-list">
                  {experiences.map((item) => (
                    <article key={`${item.role}-${item.org}`}>
                      <span>{item.dates}</span>
                      <strong>
                        {item.role} - {item.org}
                      </strong>
                      <p>{item.details}</p>
                    </article>
                  ))}
                </div>

                <div className="recruiter-section-title">
                  <Code2 size={16} />
                  <h3>Stack by category</h3>
                </div>
                <div className="recruiter-skill-groups">
                  {skillGroups.map((group) => (
                    <article key={group.label}>
                      <strong>{group.label}</strong>
                      <div>
                        {group.items.map((skill) => (
                          <TechBadge key={skill} name={skill} />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <footer className="recruiter-footer">
              <a href={getMailtoHref(contact.email)}>
                <Mail size={15} /> {contact.email}
              </a>
              <span>Resume PDF and project repos open in a new tab.</span>
            </footer>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        className="recruiter-toggle"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <BriefcaseBusiness size={15} />
        <span>Recruiter View</span>
      </button>

      {typeof document === "undefined" ? null : createPortal(panel, document.body)}
    </>
  );
}
