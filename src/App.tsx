import { SpeedInsights } from "@vercel/speed-insights/react";
import { QuickNav } from "./components/QuickNav";
import { ProjectTerminal } from "./components/ProjectTerminal";
import { RecruiterMode } from "./components/RecruiterMode";
import { ResumeView } from "./components/ResumeView";
import { ScrollExperience } from "./components/ScrollExperience";
import { useEffect, useRef, useState } from "react";

export function App() {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY.current;
      const sectionIds = ["top", "about", "projects", "skills", "experience", "blog", "contact"];
      let currentSection = "top";

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= window.innerHeight * 0.42) {
          currentSection = id;
        }
      }

      setIsHeaderHidden(isScrollingDown && currentScrollY > 120);
      setActiveSection(currentSection);
      lastScrollY.current = currentScrollY;
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const view = new URLSearchParams(window.location.search).get("view");
    if (view !== "resume" && view !== "recruiter") return;

    window.setTimeout(() => {
      window.dispatchEvent(new Event(view === "resume" ? "portfolio-resume-open" : "portfolio-recruiter-open"));
    }, 350);
  }, []);

  return (
    <main>
      <SpeedInsights />
      <QuickNav />
      <ProjectTerminal />
      <ResumeView />
      <header className={`site-header ${isHeaderHidden ? "hidden" : ""}`}>
        <a href="#top" className="brand" aria-label="Nabil Fadili home">
          <span>NF</span>
          <strong>Nabil Fadili</strong>
        </a>
        <nav aria-label="Primary navigation">
          <a className={activeSection === "projects" ? "active" : ""} href="#projects">Projects</a>
          <a className={activeSection === "skills" ? "active" : ""} href="#skills">Skills</a>
          <a className={activeSection === "experience" ? "active" : ""} href="#experience">Experience</a>
          <a className={activeSection === "blog" ? "active" : ""} href="#blog">Blog</a>
          <a className={activeSection === "contact" ? "active" : ""} href="#contact">Contact</a>
        </nav>
        <RecruiterMode />
      </header>

      <ScrollExperience />
    </main>
  );
}
