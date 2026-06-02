import { BriefcaseBusiness, Code2, Command, Copy, ExternalLink, FileText, FolderOpen, Mail, Search, Terminal, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { contact, projects, skills } from "../data/portfolio";
import { copyTextToClipboard, getMailtoHref } from "../utils/contactActions";

type QuickAction = {
  label: string;
  description: string;
  value: string;
  group: "Navigate" | "Projects" | "Skills" | "Actions" | "Links";
  icon: LucideIcon;
  run: () => void;
};

const sectionLinks = [
  { label: "Projects", id: "projects", description: "Selected work and project map" },
  { label: "Skills", id: "skills", description: "Languages, tools, AI, and data stack" },
  { label: "Experience", id: "experience", description: "Education and internship experience" },
  { label: "Technical Blog", id: "blog", description: "AssetForge write-up and Spotify API panel" },
  { label: "Contact", id: "contact", description: "Email, GitHub, LinkedIn, and resume" },
];

export function QuickNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);

  const closePalette = useCallback(() => {
    setIsOpen(false);
    setQuery("");
    setStatus(null);
  }, []);

  const jumpTo = useCallback(
    (id: string) => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      closePalette();
    },
    [closePalette],
  );

  const openProject = useCallback(
    (projectId: string) => {
      window.dispatchEvent(new CustomEvent("portfolio-project-open", { detail: projectId }));
      closePalette();
    },
    [closePalette],
  );

  const filterSkill = useCallback(
    (skill: string | null) => {
      window.dispatchEvent(new CustomEvent("portfolio-skill-filter", { detail: skill }));
      closePalette();
    },
    [closePalette],
  );

  const copyEmail = useCallback(async () => {
    try {
      await copyTextToClipboard(contact.email);
      setStatus("Email copied");
      window.setTimeout(closePalette, 450);
    } catch {
      window.location.assign(getMailtoHref(contact.email));
      closePalette();
    }
  }, [closePalette]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsOpen((current) => !current);
      }
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const actions = useMemo<QuickAction[]>(() => {
    const jumpAction = (label: string, id: string, description: string): QuickAction => ({
      label,
      description,
      value: `${label} ${description} ${id}`.toLowerCase(),
      group: "Navigate",
      icon: FolderOpen,
      run: () => jumpTo(id),
    });

    return [
      ...sectionLinks.map((section) => jumpAction(section.label, section.id, section.description)),
      {
        label: "Recruiter View",
        description: "Open a scannable resume, projects, skills, and contact snapshot",
        value: "recruiter view hiring resume summary snapshot",
        group: "Actions",
        icon: BriefcaseBusiness,
        run: () => {
          window.dispatchEvent(new Event("portfolio-recruiter-open"));
          closePalette();
        },
      },
      ...projects.flatMap((project): QuickAction[] => [
        {
          label: `Open ${project.title}`,
          description: `${project.status} - details drawer`,
          value: `${project.title} ${project.id} details project ${project.status} ${project.tools.join(" ")}`.toLowerCase(),
          group: "Projects",
          icon: project.icon,
          run: () => openProject(project.id),
        },
        ...(project.link
          ? [
              {
                label: `${project.title} repo`,
                description: "Open public GitHub repository",
                value: `${project.title} ${project.id} github repo code ${project.tools.join(" ")}`.toLowerCase(),
                group: "Projects" as const,
                icon: ExternalLink,
                run: () => {
                  window.open(project.link, "_blank", "noreferrer");
                  closePalette();
                },
              },
            ]
          : []),
      ]),
      ...skills.flatMap((group) =>
        group.items.map(
          (skill): QuickAction => ({
            label: `Filter by ${skill}`,
            description: `${group.label} skill filter`,
            value: `${skill} ${group.label} filter skill technology stack projects`.toLowerCase(),
            group: "Skills",
            icon: Code2,
            run: () => filterSkill(skill),
          }),
        ),
      ),
      {
        label: "Clear skill filter",
        description: "Show all projects again",
        value: "clear reset remove skill filter all projects",
        group: "Skills",
        icon: X,
        run: () => filterSkill(null),
      },
      {
        label: "Open Project Console",
        description: "Terminal-style shortcuts for projects and links",
        value: "terminal console command project",
        group: "Actions",
        icon: Terminal,
        run: () => {
          window.dispatchEvent(new Event("portfolio-terminal-open"));
          closePalette();
        },
      },
      {
        label: "Copy Email",
        description: contact.email,
        value: `copy email contact mail ${contact.email}`,
        group: "Actions",
        icon: Copy,
        run: copyEmail,
      },
      {
        label: "Email",
        description: `Copy ${contact.email}`,
        value: `email copy contact mail ${contact.email}`,
        group: "Links",
        icon: Mail,
        run: copyEmail,
      },
      {
        label: "Compose Email",
        description: "Open default mail app if one is configured",
        value: `compose email mailto contact ${contact.email}`,
        group: "Links",
        icon: Mail,
        run: () => {
          window.location.assign(getMailtoHref(contact.email));
          closePalette();
        },
      },
      {
        label: "GitHub",
        description: "Public repositories",
        value: "github repositories code",
        group: "Links",
        icon: ExternalLink,
        run: () => {
          window.open(contact.github, "_blank", "noreferrer");
          closePalette();
        },
      },
      {
        label: "LinkedIn",
        description: "Professional profile",
        value: "linkedin profile",
        group: "Links",
        icon: ExternalLink,
        run: () => {
          window.open(contact.linkedin, "_blank", "noreferrer");
          closePalette();
        },
      },
      {
        label: "Resume",
        description: "Open the structured resume view and PDF actions",
        value: "resume structured view pdf download",
        group: "Links",
        icon: FileText,
        run: () => {
          window.dispatchEvent(new Event("portfolio-resume-open"));
          closePalette();
        },
      },
    ];
  }, [closePalette, copyEmail, filterSkill, jumpTo, openProject]);

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return actions.slice(0, 9);
    return actions.filter((action) => action.value.includes(normalizedQuery)).slice(0, 9);
  }, [actions, query]);

  function runAction(action: QuickAction) {
    action.run();
  }

  return (
    <>
      <button className="quick-nav-button" onClick={() => setIsOpen(true)} aria-label="Open quick navigation">
        <Command size={16} />
        <span>Ctrl K</span>
      </button>

      {isOpen && (
        <div className="quick-nav-backdrop" role="dialog" aria-modal="true" aria-label="Quick navigation">
          <div className="quick-nav">
            <div className="quick-nav-search">
              <Search size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && matches[0]) {
                    event.preventDefault();
                    runAction(matches[0]);
                  }
                }}
                autoFocus
                placeholder="Open project, filter skill, copy email..."
                aria-label="Search portfolio actions"
              />
              <button onClick={() => setIsOpen(false)} aria-label="Close quick navigation">
                <X size={18} />
              </button>
            </div>
            <div className="quick-nav-list">
              {matches.map((action) => (
                <button key={`${action.label}-${action.description}`} onClick={() => runAction(action)}>
                  <action.icon size={16} />
                  <span>
                    <strong>{action.label}</strong>
                    <small>{action.description}</small>
                  </span>
                  <small>{action.group}</small>
                </button>
              ))}
              {matches.length === 0 ? <p className="quick-nav-empty">No matching actions.</p> : null}
            </div>
            <footer className="quick-nav-footer">
              <span>Enter: run first result</span>
              <span>Esc: close</span>
              {status ? <strong>{status}</strong> : null}
            </footer>
          </div>
        </div>
      )}
    </>
  );
}
