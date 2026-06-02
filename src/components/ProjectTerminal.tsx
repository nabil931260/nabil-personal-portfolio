import { Maximize2, Terminal, X } from "lucide-react";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { contact, profile, projects, skills } from "../data/portfolio";
import { copyTextToClipboard, getMailtoHref } from "../utils/contactActions";

type TerminalLine = {
  kind: "input" | "output" | "error";
  text: string;
};

const introLines: TerminalLine[] = [
  { kind: "output", text: "Portfolio console ready. Type `help` for commands." },
  { kind: "output", text: "Try `projects`, `stack expressifai`, `details lead-scanner`, or `email`." },
];

const sectionIds = ["top", "about", "projects", "skills", "experience", "blog", "contact"];
const baseCommands = [
  "help",
  "about",
  "projects",
  "skills",
  "contact",
  "github",
  "linkedin",
  "resume",
  "email",
  "compose email",
  "copy email",
  "clear",
];

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function findProject(query: string) {
  const normalized = normalize(query);
  return projects.find((project) => project.id === normalized || normalize(project.title).includes(normalized));
}

function getHelpLines() {
  return [
    "help - show available commands",
    "about - short profile summary",
    "projects - list project IDs",
    "stack <project> - show tools for a project",
    "details <project> - show problem, build, and outcome",
    "why <project> - alias for details",
    "open <section|project> - jump to a section or project link",
    "skills - summarize skill groups",
    "contact - show email and public links",
    "email / copy email - copy the email address",
    "compose email - open your default mail app if configured",
    "clear - reset the console",
  ];
}

export function ProjectTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>(introLines);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function openTerminal() {
      setIsOpen(true);
      window.setTimeout(() => inputRef.current?.focus(), 80);
    }

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    window.addEventListener("portfolio-terminal-open", openTerminal);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("portfolio-terminal-open", openTerminal);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const projectIds = useMemo(() => projects.map((project) => project.id).join(", "), []);
  const suggestions = useMemo(
    () => [
      ...baseCommands,
      ...sectionIds.map((section) => `open ${section}`),
      ...projects.flatMap((project) => [`stack ${project.id}`, `why ${project.id}`, `open ${project.id}`]),
    ],
    [],
  );
  const visibleSuggestions = useMemo(() => {
    const query = normalize(value);
    if (!query) return suggestions.slice(0, 6);
    return suggestions.filter((suggestion) => suggestion.includes(query)).slice(0, 6);
  }, [suggestions, value]);

  function pushCommand(command: string) {
    const trimmed = command.trim();
    if (!trimmed) return;

    const [rawAction, ...rest] = trimmed.split(" ");
    const action = normalize(rawAction);
    const target = rest.join(" ");
    const nextLines: TerminalLine[] = [{ kind: "input", text: trimmed }];

    if (action === "clear") {
      setLines(introLines);
      return;
    }

    if (action === "help") {
      nextLines.push(...getHelpLines().map((text) => ({ kind: "output" as const, text })));
    } else if (action === "about") {
      nextLines.push({ kind: "output", text: `${profile.name}: ${profile.headline}` });
      nextLines.push({ kind: "output", text: profile.subtitle });
    } else if (action === "projects") {
      nextLines.push({ kind: "output", text: projectIds });
    } else if (action === "skills") {
      nextLines.push(...skills.map((group) => ({ kind: "output" as const, text: `${group.label}: ${group.items.join(", ")}` })));
    } else if (action === "contact") {
      nextLines.push({ kind: "output", text: `Email: ${contact.email}` });
      nextLines.push({ kind: "output", text: `GitHub: ${contact.github}` });
      nextLines.push({ kind: "output", text: `LinkedIn: ${contact.linkedin}` });
      nextLines.push({ kind: "output", text: "Resume: type `resume` to open the structured resume view." });
    } else if (action === "github") {
      window.open(contact.github, "_blank", "noreferrer");
      nextLines.push({ kind: "output", text: "Opening GitHub." });
    } else if (action === "linkedin") {
      window.open(contact.linkedin, "_blank", "noreferrer");
      nextLines.push({ kind: "output", text: "Opening LinkedIn." });
    } else if (action === "resume") {
      window.dispatchEvent(new Event("portfolio-resume-open"));
      nextLines.push({ kind: "output", text: "Opening structured resume view with PDF actions." });
    } else if (action === "email") {
      void copyTextToClipboard(contact.email);
      nextLines.push({ kind: "output", text: `Copied ${contact.email}. Use compose email to open your mail app.` });
    } else if (action === "compose" && normalize(target) === "email") {
      window.location.assign(getMailtoHref(contact.email));
      nextLines.push({ kind: "output", text: `Opening email draft to ${contact.email}.` });
    } else if (action === "copy" && normalize(target) === "email") {
      void copyTextToClipboard(contact.email);
      nextLines.push({ kind: "output", text: `Copied ${contact.email}.` });
    } else if (action === "stack" || action === "why" || action === "details") {
      const project = findProject(target);
      if (!project) {
        nextLines.push({ kind: "error", text: `Project not found. Try one of: ${projectIds}` });
      } else if (action === "stack") {
        nextLines.push({ kind: "output", text: `${project.title}: ${project.tools.join(" / ")}` });
      } else {
        nextLines.push({ kind: "output", text: `Problem: ${project.problem}` });
        nextLines.push({ kind: "output", text: `Built: ${project.built}` });
        nextLines.push({ kind: "output", text: `Outcome: ${project.outcome}` });
      }
    } else if (action === "open") {
      const section = normalize(target);
      const project = findProject(target);
      if (project?.link) {
        window.open(project.link, "_blank", "noreferrer");
        nextLines.push({ kind: "output", text: `Opening ${project.title} link.` });
      } else if (project) {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
        nextLines.push({ kind: "output", text: `${project.title} has no public link yet. Jumping to Projects.` });
      } else if (sectionIds.includes(section)) {
        document.getElementById(section)?.scrollIntoView({ behavior: "smooth", block: "start" });
        nextLines.push({ kind: "output", text: `Jumping to #${section}.` });
      } else {
        nextLines.push({ kind: "error", text: "Use `open projects`, `open skills`, or `open <project-id>`." });
      }
    } else {
      nextLines.push({ kind: "error", text: `Unknown command: ${rawAction}. Type \`help\`.` });
    }

    setLines((current) => [...current, ...nextLines].slice(-18));
  }

  function submitCommand(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = value.trim();
    pushCommand(command);
    if (command) {
      setHistory((current) => [...current.filter((item) => item !== command), command].slice(-20));
    }
    setHistoryIndex(null);
    setValue("");
  }

  function completeCommand() {
    const query = normalize(value);
    const firstMatch = suggestions.find((suggestion) => suggestion.startsWith(query));
    if (firstMatch) setValue(firstMatch);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      completeCommand();
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(nextIndex);
      setValue(history[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(nextIndex);
        setValue(history[nextIndex]);
      }
    }
  }

  return (
    <>
      <button
        className="terminal-launcher"
        onClick={() => {
          setIsOpen(true);
          window.setTimeout(() => inputRef.current?.focus(), 80);
        }}
        aria-label="Open project terminal"
      >
        <Terminal size={16} />
        <span>Project Console</span>
      </button>

      {isOpen && (
        <section className="project-terminal" aria-label="Project console">
          <header>
            <div>
              <Terminal size={16} />
              <span>portfolio:/projects</span>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close project terminal">
              <X size={16} />
            </button>
          </header>
          <div className="terminal-output" onClick={() => inputRef.current?.focus()}>
            {lines.map((line, index) => (
              <p className={line.kind} key={`${line.text}-${index}`}>
                {line.kind === "input" ? "> " : ""}
                {line.text}
              </p>
            ))}
          </div>
          <div className="terminal-suggestions" aria-label="Suggested terminal commands">
            {visibleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  setValue(suggestion);
                  inputRef.current?.focus();
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
          <form onSubmit={submitCommand}>
            <span>&gt;</span>
            <input
              ref={inputRef}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="help"
              aria-label="Terminal command"
            />
            <button type="submit" aria-label="Run terminal command">
              <Maximize2 size={15} />
            </button>
          </form>
          <div className="terminal-hints" aria-label="Terminal keyboard shortcuts">
            <span>Tab: Autocomplete</span>
            <span>Arrow Keys: History</span>
          </div>
        </section>
      )}
    </>
  );
}
