import { AnimatePresence, motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, ExternalLink, Github, Linkedin, Mail, X } from "lucide-react";
import { lazy, Suspense, type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import { blogPosts, contact, experiences, type Project, profile, projects, publicHighlights, skills, toolStack } from "../data/portfolio";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { GitHubActivityPanel } from "./GitHubActivityPanel";
import { ProjectDemoGallery } from "./ProjectDemoGallery";
import { SpotifyNowPlaying } from "./SpotifyNowPlaying";
import { TechBadge } from "./TechBadge";
import { copyTextToClipboard, getMailtoHref } from "../utils/contactActions";

const ProjectConstellation = lazy(() =>
  import("./ProjectConstellation").then((module) => ({ default: module.ProjectConstellation })),
);

type ScrollPanelProps = {
  id: string;
  children: ReactNode;
  visual?: ReactNode;
  className?: string;
};

const sectionTracks = [
  { id: "top", label: "Intro" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

function ScrollPanel({ id, children, visual, className = "" }: ScrollPanelProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 92%", "center center", "end 8%"] });
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.18, 1, 1, 0.18]);
  const y = useTransform(scrollYProgress, [0, 0.24, 0.76, 1], [92, 0, 0, -92]);
  const scale = useTransform(scrollYProgress, [0, 0.24, 0.76, 1], [0.94, 1, 1, 0.94]);
  const rotateX = useTransform(scrollYProgress, [0, 0.24, 0.76, 1], [7, 0, 0, -7]);

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`scroll-panel ${visual ? "" : "no-visual"} ${className}`}
      style={{ opacity, y, scale, rotateX, transformPerspective: 1200 }}
      aria-labelledby={`${id}-title`}
    >
      <div className="scroll-panel-copy">{children}</div>
      {visual ? <div className="scroll-panel-visual">{visual}</div> : null}
    </motion.section>
  );
}

function ScrollDisc() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 1440]);
  const [activeSection, setActiveSection] = useState(sectionTracks[0]);
  const activeIndex = Math.max(0, sectionTracks.findIndex((section) => section.id === activeSection.id));
  const pointerAngle = (activeIndex / sectionTracks.length) * 360 - 90;

  useEffect(() => {
    function updateActiveSection() {
      const viewportAnchor = window.innerHeight * 0.42;
      let current = sectionTracks[0];

      for (const section of sectionTracks) {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= viewportAnchor) {
          current = section;
        }
      }

      setActiveSection(current);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, []);

  function jumpToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="scroll-disc" aria-label={`Current section: ${activeSection.label}`}>
      <div className="scroll-disc-wrap">
        <span
          className="scroll-disc-pointer"
          style={{ "--pointer-angle": `${pointerAngle}deg` } as CSSProperties}
          aria-hidden="true"
        />
        <motion.button
          className="scroll-disc-record"
          style={{ rotate }}
          onClick={() => jumpToSection(activeSection.id)}
          aria-label={`Jump to ${activeSection.label}`}
        >
          <span className="scroll-disc-groove one" />
          <span className="scroll-disc-groove two" />
          <span className="scroll-disc-groove three" />
          <span className="scroll-disc-marker" />
        </motion.button>
        <div className="scroll-disc-tracks" aria-label="Section navigation">
          {sectionTracks.map((section, index) => {
            const angle = (index / sectionTracks.length) * 360 - 90;
            const isActive = section.id === activeSection.id;
            return (
              <button
                key={section.id}
                className={isActive ? "active" : ""}
                style={{ "--track-angle": `${angle}deg` } as CSSProperties}
                onClick={() => jumpToSection(section.id)}
                aria-label={`Jump to ${section.label}`}
              >
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <span className="scroll-disc-label">
        <small>Now viewing</small>
        <strong>{activeSection.label}</strong>
      </span>
    </div>
  );
}

function HighlightCard() {
  return (
    <div className="hero-card">
      <h2>Career Highlights</h2>
      <div className="metric-strip" aria-label="Portfolio highlights">
        {publicHighlights.map((item) => (
          <div key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectMapFallback() {
  return (
    <div className="project-constellation overlay project-map-fallback" aria-label="Loading project map">
      <div>
        <span />
        <span />
        <span />
      </div>
      <section>
        <small>Project-to-language map</small>
        <strong>Loading 3D graph</strong>
      </section>
    </div>
  );
}

const skillAliases: Record<string, string[]> = {
  TypeScript: ["typescript", "ts", "assetforge", "kickmap"],
  JavaScript: ["javascript", "js"],
  Python: ["python", "opencv", "pandas", "numpy", "beautifulsoup", "requests", "tesseract"],
  SQL: ["sql", "sqlite", "full-text search"],
  "HTML/CSS": ["html", "css"],
  React: ["react"],
  SvelteKit: ["svelte", "sveltekit"],
  Firebase: ["firebase"],
  MongoDB: ["mongodb"],
  "REST APIs": ["api", "sambanova cloud api"],
  SQLite: ["sqlite", "sql", "full-text search"],
  OpenCV: ["opencv", "computer vision"],
  Tesseract: ["tesseract", "ocr"],
  PyTorch: ["pytorch", "torchvision", "computer vision"],
  "SambaNova Cloud API": ["sambanova cloud api"],
  "OCR pipelines": ["ocr", "tesseract", "document extraction"],
  Pandas: ["pandas", "dataframe"],
  NumPy: ["numpy"],
  "scikit-learn": ["scikit-learn", "classification"],
  TensorFlow: ["tensorflow"],
  Matplotlib: ["matplotlib"],
  "OCR workflows": ["ocr", "document", "tesseract"],
  "Requirements gathering": ["requirements", "operations", "workflow"],
};

function normalizeSkillText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, " ").trim();
}

function projectMatchesSkill(project: Project, skill: string | null) {
  if (!skill) return true;

  const terms = [skill, ...(skillAliases[skill] ?? [])].map(normalizeSkillText).filter(Boolean);
  const projectText = normalizeSkillText(
    [
      project.title,
      project.short,
      project.problem,
      project.built,
      project.outcome,
      project.status,
      project.tools.join(" "),
    ].join(" "),
  );

  return terms.some((term) => projectText.includes(term));
}

type ProjectDetailDrawerProps = {
  project: Project;
  onClose: () => void;
};

function ProjectDetailDrawer({ project, onClose }: ProjectDetailDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!project) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, project]);

  useEffect(() => {
    drawerRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [project.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const Icon = project.icon;

  return (
    <motion.div
      className="project-detail-backdrop"
      role="presentation"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.aside
        ref={drawerRef}
        className={`project-detail-drawer ${project.accent}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-detail-title"
        initial={{ opacity: 0, x: 46, scale: 0.982 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 28, scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.82 }}
        onClick={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>
              <Icon size={20} />
            </span>
            <section>
              <small>{project.status}</small>
              <h2 id="project-detail-title">{project.title}</h2>
            </section>
          </div>
          <button onClick={onClose} aria-label="Close project details">
            <X size={18} />
          </button>
        </header>

        <section className="project-detail-intro">
          <p className="project-detail-summary">{project.short}</p>
          <div className="project-detail-meta" aria-label={`${project.title} quick facts`}>
            <span>{project.status}</span>
            <span>{project.tools.slice(0, 4).join(" / ")}</span>
            <span>{project.link ? "Public repo available" : "Summary only"}</span>
          </div>
        </section>

        <div className="project-detail-proof" aria-label={`${project.title} project summary`}>
          <section>
            <small>Status</small>
            <strong>{project.status}</strong>
          </section>
          <section>
            <small>Core stack</small>
            <strong>{project.tools.slice(0, 3).join(" / ")}</strong>
          </section>
          <section>
            <small>Public link</small>
            <strong>{project.link ? "Available" : "Not published"}</strong>
          </section>
        </div>

        {project.demoFrames ? (
          <section className="project-demo-section">
            <small>Demo gallery</small>
            <ProjectDemoGallery frames={project.demoFrames} />
          </section>
        ) : null}

        {project.caseStudy ? (
          <section className="project-case-study">
            <small>Architecture</small>
            <ArchitectureDiagram steps={project.caseStudy.architecture} compact />
          </section>
        ) : null}

        <section className="project-case-narrative" aria-label={`${project.title} case study`}>
          <article>
            <span>01</span>
            <h3>Challenge</h3>
            <p>{project.problem}</p>
          </article>
          <article>
            <span>02</span>
            <h3>Build</h3>
            <p>{project.built}</p>
          </article>
          <article>
            <span>03</span>
            <h3>Result</h3>
            <p>{project.outcome}</p>
          </article>
        </section>

          {project.caseStudy ? (
            <section className="project-decision-grid" aria-label={`${project.title} decisions and validation`}>
              <article>
                <h3>Technical decisions</h3>
                <ul>
                  {project.caseStudy.tradeoffs.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Validation</h3>
                <ul>
                  {project.caseStudy.validation.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
              <article>
                <h3>Next iteration</h3>
                <ul>
                  {project.caseStudy.next.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={15} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </section>
          ) : null}

        <div className="project-detail-stack" aria-label={`${project.title} tools`}>
          {project.tools.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>

        <div className="project-detail-actions">
          {project.link ? (
            <a href={project.link} target="_blank" rel="noreferrer">
              Open project <ExternalLink size={16} />
            </a>
          ) : (
            <span>Repo not public</span>
          )}
        </div>
      </motion.aside>
    </motion.div>
  );
}

export function ScrollExperience() {
  const { scrollYProgress } = useScroll();
  const progressScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.35 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
  const matchingProjects = projects.filter((project) => projectMatchesSkill(project, selectedSkill));

  useEffect(() => {
    function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
      const id = hash.replace("#", "");
      const target = document.getElementById(id);
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(top, 0), behavior });
    }

    function onAnchorClick(event: MouseEvent) {
      const link = (event.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!link || !link.hash) return;
      if (!document.getElementById(link.hash.slice(1))) return;

      event.preventDefault();
      window.history.pushState(null, "", link.hash);
      scrollToHash(link.hash);
    }

    if (window.location.hash) {
      window.setTimeout(() => scrollToHash(window.location.hash, "auto"), 120);
    }

    document.addEventListener("click", onAnchorClick);
    return () => document.removeEventListener("click", onAnchorClick);
  }, []);

  useEffect(() => {
    function onOpenProject(event: Event) {
      const projectId = (event as CustomEvent<string>).detail;
      const project = projects.find((item) => item.id === projectId);
      if (!project) return;

      setSelectedProject(project);
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function onFilterSkill(event: Event) {
      const skill = (event as CustomEvent<string | null>).detail;
      setSelectedSkill(skill);
      document.getElementById(skill ? "projects" : "skills")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    window.addEventListener("portfolio-project-open", onOpenProject);
    window.addEventListener("portfolio-skill-filter", onFilterSkill);
    return () => {
      window.removeEventListener("portfolio-project-open", onOpenProject);
      window.removeEventListener("portfolio-skill-filter", onFilterSkill);
    };
  }, []);

  function toggleSkillFilter(skill: string) {
    const nextSkill = selectedSkill === skill ? null : skill;
    setSelectedSkill(nextSkill);

    if (nextSkill) {
      window.setTimeout(() => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    }
  }

  async function copyContactEmail() {
    try {
      await copyTextToClipboard(contact.email);
      setIsEmailCopied(true);
      window.setTimeout(() => setIsEmailCopied(false), 1600);
    } catch {
      window.location.assign(getMailtoHref(contact.email));
    }
  }

  function openRecruiterSnapshot() {
    window.dispatchEvent(new Event("portfolio-recruiter-open"));
  }

  function openResumeView() {
    window.dispatchEvent(new Event("portfolio-resume-open"));
  }

  return (
    <>
      <motion.div className="scroll-progress-rail" style={{ scaleY: progressScale }} aria-hidden="true" />
      <ScrollDisc />
      <AnimatePresence>
        {selectedProject ? (
          <ProjectDetailDrawer key={selectedProject.id} project={selectedProject} onClose={() => setSelectedProject(null)} />
        ) : null}
      </AnimatePresence>
      <section className="scroll-experience" aria-label="Portfolio overview">
      <ScrollPanel
        id="top"
        className="hero-panel"
        visual={
          <div className="visual-stack hero-highlight-stack">
            <HighlightCard />
          </div>
        }
      >
        <p className="hero-label">{profile.education}</p>
        <h1 id="top-title">
          <span className="desktop-title">{profile.headline}</span>
          <span className="mobile-title">CS student building practical tools.</span>
        </h1>
        <p>{profile.subtitle}</p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            View Projects <ArrowUpRight size={18} />
          </a>
          <button className="button" type="button" onClick={openResumeView}>
            Resume <BriefcaseBusiness size={18} />
          </button>
          <a className="button ghost" href="#contact">
            Contact <Mail size={18} />
          </a>
        </div>
      </ScrollPanel>

      <ScrollPanel
        id="about"
      >
        <div className="section-kicker">About</div>
        <h2 id="about-title">Full-stack engineering, applied AI, and practical product thinking.</h2>
        <div className="about-grid">
          <p>
            I am a Computer Science student at UT Dallas focused on building software that solves practical
            workflow problems. My experience includes full-stack applications, machine learning projects,
            computer vision, OCR pipelines, and operational tools.
          </p>
          <p>
            I care about projects that can be explained clearly: what problem existed, what was built, which
            tools were used, and how the result was tested. That approach shows up in my Amazon internship
            work, portfolio projects, and current automation prototypes.
          </p>
        </div>
      </ScrollPanel>

      <ScrollPanel
        id="projects"
        visual={
          <div className="visual-stack">
            <Suspense fallback={<ProjectMapFallback />}>
              <ProjectConstellation
                mode="overlay"
                selectedSkill={selectedSkill}
                selectedProjectIds={selectedSkill ? matchingProjects.map((project) => project.id) : []}
                onProjectSelect={(projectId) => {
                  const project = projects.find((item) => item.id === projectId);
                  if (project) setSelectedProject(project);
                }}
              />
            </Suspense>
          </div>
        }
      >
        <div className="section-kicker">Projects</div>
        <h2 id="projects-title">Selected work with a clear build story.</h2>
        {selectedSkill ? (
          <div className="project-filter-status" role="status" aria-live="polite">
            <span>
              Filtering by <strong>{selectedSkill}</strong>
            </span>
            <span>{matchingProjects.length} connected project{matchingProjects.length === 1 ? "" : "s"}</span>
            <button type="button" onClick={() => setSelectedSkill(null)}>
              Clear
            </button>
          </div>
        ) : null}
        <div className="portfolio-panel-grid">
          {projects.map((project) => {
            const Icon = project.icon;
            const matchesSelectedSkill = projectMatchesSkill(project, selectedSkill);
            return (
              <motion.button
                key={project.id}
                className={`portfolio-panel-card ${project.accent} ${
                  selectedSkill ? (matchesSelectedSkill ? "skill-match" : "skill-dimmed") : ""
                }`}
                onClick={() => setSelectedProject(project)}
                aria-label={`View details for ${project.title}`}
                whileHover={{ y: -5, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
              >
                <div>
                  <Icon size={18} />
                  <span>{project.status}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.short}</p>
                {project.demoFrames ? <ProjectDemoGallery frames={project.demoFrames.slice(0, 1)} compact /> : null}
                <small>{project.tools.slice(0, 4).join(" / ")}</small>
                {selectedSkill && matchesSelectedSkill ? <em>{selectedSkill} connection</em> : null}
              </motion.button>
            );
          })}
        </div>
      </ScrollPanel>

      <ScrollPanel id="skills">
        <div className="section-kicker">Skills</div>
        <h2 id="skills-title">Technical stack.</h2>
        <div className="skill-filter-note">
          <span>Click a skill to see which projects use it.</span>
          {selectedSkill ? (
            <button type="button" onClick={() => setSelectedSkill(null)}>
              Clear {selectedSkill}
            </button>
          ) : null}
        </div>
        <div className="portfolio-skill-grid">
          {skills.map((group) => {
            const Icon = group.icon;
            return (
              <article className="skill-card" key={group.label}>
                <Icon size={22} />
                <h3>{group.label}</h3>
                <div>
                  {group.items.map((item) => (
                    <TechBadge key={item} name={item} active={selectedSkill === item} onClick={toggleSkillFilter} />
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <div className="stack-line compact">
          <span>{toolStack.languages}</span>
          <span>{toolStack.web}</span>
          <span>{toolStack.ai}</span>
          <span>{toolStack.data}</span>
        </div>
      </ScrollPanel>

      <ScrollPanel id="experience" className="experience-panel">
        <div className="section-kicker">Experience</div>
        <h2 id="experience-title">Education and experience.</h2>
        <div className="timeline compact">
          {experiences.map((item) => (
            <article key={`${item.role}-${item.org}`}>
              <div>
                <BriefcaseBusiness size={20} />
              </div>
              <section>
                <span>{item.dates}</span>
                <h3>
                  {item.role} - {item.org}
                </h3>
                <p>{item.details}</p>
                <strong>{item.proof}</strong>
              </section>
            </article>
          ))}
        </div>
      </ScrollPanel>

      <ScrollPanel
        id="blog"
        visual={
          <div className="visual-stack live-signal-stack">
            <SpotifyNowPlaying />
            <GitHubActivityPanel />
          </div>
        }
      >
        <div className="section-kicker">Technical Blog</div>
        <h2 id="blog-title">Build notes and public technical writing.</h2>
        <div className="blog-list">
          {blogPosts.map((post) => (
            <article className="blog-card" key={post.title}>
              <div>
                <span>{post.source}</span>
                <small>{post.date}</small>
              </div>
              <h3>{post.title}</h3>
              <p>{post.summary}</p>
              <ul>
                {post.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              {"architecture" in post ? <ArchitectureDiagram steps={post.architecture} compact /> : null}
              <footer>
                {post.links.map((link) => (
                  <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                    {link.label} <ExternalLink size={14} />
                  </a>
                ))}
              </footer>
            </article>
          ))}
        </div>
      </ScrollPanel>

      <ScrollPanel
        id="contact"
      >
        <div className="section-kicker">Contact</div>
        <h2 id="contact-title">A focused place to review my projects, resume, and public profiles.</h2>
        <p className="scroll-page-intro">
          For project code, background, or resume details, these are the cleanest places to start.
        </p>
        <div className="contact-actions">
          <button className="button primary" type="button" onClick={copyContactEmail}>
            <Mail size={18} /> {isEmailCopied ? "Email copied" : "Copy Email"}
          </button>
          <a className="button" href={contact.github} target="_blank" rel="noreferrer">
            <Github size={18} /> GitHub
          </a>
          <a className="button" href={contact.linkedin} target="_blank" rel="noreferrer">
            <Linkedin size={18} /> LinkedIn
          </a>
          <button className="button ghost" type="button" onClick={openResumeView}>
            <BriefcaseBusiness size={18} /> Resume
          </button>
          <button className="button ghost" type="button" onClick={openRecruiterSnapshot}>
            Recruiter Snapshot
          </button>
          <a className="button ghost" href={getMailtoHref(contact.email)}>
            Compose Email
          </a>
        </div>
      </ScrollPanel>
      </section>
    </>
  );
}
