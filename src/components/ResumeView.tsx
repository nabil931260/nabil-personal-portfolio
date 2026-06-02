import { AnimatePresence, motion } from "framer-motion";
import { Copy, Download, ExternalLink, Github, GraduationCap, Linkedin, Mail, MapPin, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { contact, experiences, profile, projects, publicHighlights, skills } from "../data/portfolio";
import { copyTextToClipboard, getMailtoHref } from "../utils/contactActions";
import { useModalFocus } from "../utils/modalFocus";
import { TechBadge } from "./TechBadge";

const resumeProjectIds = ["lead-scanner", "easyteller", "expressifai", "kickmap"];

export function ResumeView() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeResumeView = useCallback(() => setIsOpen(false), []);
  const modalRef = useModalFocus<HTMLElement>(isOpen, closeResumeView);
  const resumeProjects = useMemo(
    () => resumeProjectIds.map((id) => projects.find((project) => project.id === id)).filter(Boolean),
    [],
  );
  const coreSkills = useMemo(
    () =>
      skills.map((group) => ({
        ...group,
        items: group.items.slice(0, 6),
      })),
    [],
  );

  useEffect(() => {
    function openResumeView() {
      setIsOpen(true);
    }

    window.addEventListener("portfolio-resume-open", openResumeView);
    return () => window.removeEventListener("portfolio-resume-open", openResumeView);
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

  const panel = (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="resume-backdrop"
          role="presentation"
          onClick={closeResumeView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <motion.aside
            ref={modalRef}
            className="resume-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="resume-title"
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 18, scale: 0.985, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 12, scale: 0.99, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
          >
            <header className="resume-panel-header">
              <div>
                <span>Resume</span>
                <h2 id="resume-title">{profile.name}</h2>
                <p>{profile.headline}</p>
              </div>
              <button type="button" onClick={closeResumeView} aria-label="Close resume view">
                <X size={18} />
              </button>
            </header>

            <div className="resume-shell">
              <section className="resume-document" aria-label="Structured resume preview">
                <div className="resume-page">
                  <header className="resume-page-hero">
                    <div>
                      <span>Portfolio resume</span>
                      <h3>{profile.name}</h3>
                      <p>{profile.subtitle}</p>
                    </div>
                    <dl>
                      <div>
                        <dt>
                          <GraduationCap size={14} /> Education
                        </dt>
                        <dd>{profile.education}</dd>
                      </div>
                      <div>
                        <dt>
                          <MapPin size={14} /> Location
                        </dt>
                        <dd>{profile.location}</dd>
                      </div>
                    </dl>
                  </header>

                  <div className="resume-contact-row">
                    <a href={getMailtoHref(contact.email)}>
                      <Mail size={15} /> {contact.email}
                    </a>
                    <a href={contact.github} target="_blank" rel="noreferrer">
                      <Github size={15} /> GitHub
                    </a>
                    <a href={contact.linkedin} target="_blank" rel="noreferrer">
                      <Linkedin size={15} /> LinkedIn
                    </a>
                  </div>

                  <section className="resume-block">
                    <h3>Summary</h3>
                    <p>{profile.subtitle}</p>
                  </section>

                  <section className="resume-highlight-grid" aria-label="Resume proof points">
                    {publicHighlights.map((item) => (
                      <article key={item.label}>
                        <strong>{item.value}</strong>
                        <span>{item.label}</span>
                      </article>
                    ))}
                  </section>

                  <section className="resume-block">
                    <h3>Experience</h3>
                    <div className="resume-timeline">
                      {experiences.map((item) => (
                        <article key={`${item.role}-${item.org}`}>
                          <div>
                            <strong>
                              {item.role} - {item.org}
                            </strong>
                            <span>{item.dates}</span>
                          </div>
                          <p>{item.details}</p>
                        </article>
                      ))}
                    </div>
                  </section>

                  <section className="resume-block">
                    <h3>Selected projects</h3>
                    <div className="resume-projects">
                      {resumeProjects.map((project) =>
                        project ? (
                          <article key={project.id}>
                            <div>
                              <strong>{project.title}</strong>
                              <span>{project.status}</span>
                            </div>
                            <p>{project.outcome}</p>
                            <small>{project.tools.slice(0, 5).join(" / ")}</small>
                            {project.link ? (
                              <a href={project.link} target="_blank" rel="noreferrer">
                                Repo <ExternalLink size={13} />
                              </a>
                            ) : null}
                          </article>
                        ) : null,
                      )}
                    </div>
                  </section>

                  <section className="resume-block">
                    <h3>Skills</h3>
                    <div className="resume-skill-groups">
                      {coreSkills.map((group) => (
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
              </section>

              <aside className="resume-pdf-rail" aria-label="Resume PDF actions">
                <div className="resume-pdf-card">
                  <span>PDF</span>
                  <strong>Nabil-Resume.pdf</strong>
                  <p>Use the structured view for quick scanning, or open the PDF when an application needs the file.</p>
                  <div>
                    <a className="button primary" href={contact.resume} download>
                      <Download size={16} /> Download
                    </a>
                    <a className="button ghost" href={contact.resume} target="_blank" rel="noreferrer">
                      Open PDF <ExternalLink size={16} />
                    </a>
                    <button className="button ghost" type="button" onClick={copyEmail}>
                      <Copy size={16} /> {copied ? "Copied" : "Copy Email"}
                    </button>
                  </div>
                </div>
                <iframe title="Resume PDF preview" src={contact.resume} loading="lazy" />
              </aside>
            </div>
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return typeof document === "undefined" ? null : createPortal(panel, document.body);
}
