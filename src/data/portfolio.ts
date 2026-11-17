import {
  Bot,
  Code2,
  FileSearch,
  LineChart,
  Network,
  ShieldCheck,
  TerminalSquare
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Project = {
  id: string;
  title: string;
  short: string;
  problem: string;
  built: string;
  tools: string[];
  outcome: string;
  status: string;
  link?: string;
  accent: "cyan" | "mint" | "amber" | "rose";
  icon: LucideIcon;
  demoFrames?: DemoFrame[];
  caseStudy?: {
    architecture: ArchitectureStep[];
    tradeoffs: string[];
    validation: string[];
    next: string[];
  };
};

export type ArchitectureStep = {
  label: string;
  detail: string;
};

export type DemoFrame = {
  title: string;
  eyebrow: string;
  description: string;
  metrics?: { label: string; value: string }[];
  rows: { label: string; value: string; tone?: "good" | "warn" | "neutral" }[];
};

export const profile = {
  name: "Nabil Fadili",
  headline: "Software development, testing, and applied AI.",
  mobileHeadline: "Software, testing, and AI.",
  subtitle:
    "I build practical web and Python tools and work on software engineering evaluation at Handshake AI. My projects span asset validation, OCR workflows, and computer vision.",
  location: "Dallas-Fort Worth, Texas",
  education: "B.S. Computer Science, University of Texas at Dallas, expected Spring 2027",
  aboutHeading: "Practical software, tested and explained.",
  aboutIntro:
    "I build web tools and Python workflows with an emphasis on correctness, testing, and clear documentation. At Handshake AI, my work includes software engineering task design and reviewing model-generated solutions against requirements and test evidence.",
  aboutWork:
    "My projects include AssetForge's React/TypeScript asset review workflow and EasyTeller's team-built OCR application prototype. During my 2023 Amazon internship, I developed a virtual drop-zone management web application; I returned for a second internship in 2024.",
};

export const projects: Project[] = [
  {
    id: "assetforge",
    title: "AssetForge",
    short: "Browser-based asset-folder validation and Godot-compatible manifest export.",
    problem:
      "Messy asset folders make naming conflicts, unsupported formats, and import organization harder to review before moving files into a game project.",
    built:
      "Built a React/TypeScript browser tool with file and folder import, normalized duplicate-name checks, reviewed warnings, Godot-style resource paths, and JSON manifest and import-note export.",
    tools: ["React", "TypeScript", "Vite", "Vitest", "React Testing Library"],
    outcome:
      "Published a GitHub Pages beta with domain tests and a React Testing Library UI test.",
    status: "Public beta",
    link: "https://github.com/nabil931260/assetforge",
    accent: "mint",
    icon: Code2,
    demoFrames: [
      {
        eyebrow: "Workflow summary",
        title: "Asset Review",
        description: "Summary of the public beta's asset import, validation, and export workflow.",
        metrics: [
          { label: "Interface", value: "React + TS" },
          { label: "Export", value: "JSON + notes" },
        ],
        rows: [
          { label: "Import", value: "Files and folders" },
          { label: "Review", value: "Naming, formats, duplicates" },
          { label: "Output", value: "Godot-style resource paths", tone: "good" },
        ],
      },
    ],
    caseStudy: {
      architecture: [
        { label: "Import", detail: "Browser files and folders provide asset metadata and relative paths" },
        { label: "Validate", detail: "Rules identify unsupported formats, naming issues, and normalized duplicates" },
        { label: "Review", detail: "Categories, tags, and reviewed warnings keep decisions visible" },
        { label: "Export", detail: "JSON manifest and import notes describe exportable assets" },
      ],
      tradeoffs: [
        "Kept asset review in the browser so the beta works without accounts or a backend.",
        "Separated export-blocking errors from warnings that can be reviewed without changing original files.",
      ],
      validation: [
        "Added Vitest domain tests and a React Testing Library UI test.",
        "The public demo provides sample assets for inspecting the review and export workflow.",
      ],
      next: [
        "Expand per-format metadata and import guidance.",
        "Improve validation feedback using additional real asset-folder examples.",
      ],
    },
  },
  {
    id: "lead-scanner",
    title: "Lead Research Automation Tool",
    short: "Python tool for reviewing public small-business websites and prioritizing outreach research.",
    problem:
      "Small-business research gets inconsistent when website signals, notes, and outreach status live in separate places.",
    built:
      "Built a local Python workflow that checks public websites, records visible signals, scores each lead, and writes a review-ready Markdown queue.",
    tools: ["Python", "Requests", "BeautifulSoup", "Markdown"],
    outcome:
      "Created a repeatable research process with tests, evidence columns, and manual review gates before any outreach.",
    status: "Local prototype",
    link: "https://github.com/nabil931260/ai-lead-scanner",
    accent: "mint",
    icon: FileSearch,
    demoFrames: [
      {
        eyebrow: "Generated markdown table",
        title: "Scored Leads",
        description: "Based on the repo's example output from `scripts/analyze_leads.py`.",
        metrics: [
          { label: "Scoring", value: "Rule-based" },
          { label: "Evidence", value: "Visible signals" },
        ],
        rows: [
          { label: "Signal", value: "Thin homepage content", tone: "good" },
          { label: "Opportunity", value: "Workflow cleanup candidate", tone: "neutral" },
          { label: "Review need", value: "Manual evidence check", tone: "warn" },
        ],
      },
      {
        eyebrow: "Manual review queue",
        title: "Outreach Gate",
        description: "The queue keeps draft messages review-only until contact data and evidence are checked.",
        metrics: [
          { label: "Review gate", value: "Manual" },
          { label: "Output", value: "Markdown" },
        ],
        rows: [
          { label: "Approved for draft?", value: "No", tone: "warn" },
          { label: "Evidence checked?", value: "No", tone: "warn" },
          { label: "Draft ready?", value: "Yes", tone: "good" },
        ],
      },
    ],
    caseStudy: {
      architecture: [
        { label: "Public sites", detail: "Manual seed URLs and visible website signals only" },
        { label: "Scanner", detail: "Requests and BeautifulSoup collect structured evidence" },
        { label: "Review queue", detail: "Markdown tables keep proof columns and status clear" },
        { label: "Decision gate", detail: "Manual review happens before any outreach action" },
      ],
      tradeoffs: [
        "Kept the workflow local-first so it stays easy to audit and avoids storing sensitive lead data.",
        "Used rule-based scoring and visible evidence columns so prioritization is easy to inspect.",
      ],
      validation: [
        "Tested scanner behavior and kept evidence visible in the review queue.",
        "Restricted the workflow to public business websites, avoiding private profiles and login-gated data.",
      ],
      next: [
        "Add a lightweight dashboard for reviewing batches.",
        "Add export presets for GitHub README, CSV, and outreach planning notes.",
      ],
    },
  },
  {
    id: "appetite-chat",
    title: "Appetite Knowledge Base Beta",
    short: "Private prototype for searchable underwriting appetite notes and cited answers.",
    problem:
      "Specialized eligibility notes are hard to trust when they are buried across long threads, profiles, and one-off answers.",
    built:
      "Built a local SQLite web beta with question threads, searchable source notes, CSV import, review labels, and cited answer generation.",
    tools: ["Python", "SQLite", "Full-text search", "HTML/CSS"],
    outcome:
      "Built a private prototype for importing, searching, and reusing reviewed notes with source citations.",
    status: "Private prototype",
    accent: "cyan",
    icon: Network,
    demoFrames: [
      {
        eyebrow: "Search workflow",
        title: "Appetite Search",
        description: "Mirrors the beta search form, source filters, and cited-answer workflow without exposing private data.",
        metrics: [
          { label: "Review", value: "Source citations" },
          { label: "Mode", value: "Private prototype" },
        ],
        rows: [
          { label: "Query", value: "Eligibility question + source filters" },
          { label: "Source type", value: "Reviewed notes" },
          { label: "Result", value: "Cited answer draft", tone: "good" },
        ],
      },
      {
        eyebrow: "Cited answer view",
        title: "Ask From Verified Notes",
        description: "The beta prioritizes reviewed notes and keeps informal context clearly labeled.",
        metrics: [
          { label: "Storage", value: "SQLite" },
          { label: "Review", value: "Source citations" },
        ],
        rows: [
          { label: "Basis", value: "Reviewed notes", tone: "good" },
          { label: "Source", value: "Profile + prior thread" },
          { label: "Confidence", value: "Cited answer", tone: "good" },
        ],
      },
    ],
    caseStudy: {
      architecture: [
        { label: "Imports", detail: "CSV and manually captured notes enter a local review flow" },
        { label: "SQLite", detail: "Question threads, source profiles, replies, and search index" },
        { label: "Retrieval", detail: "Full-text search finds relevant prior answers and source context" },
        { label: "Cited answer", detail: "The beta returns reusable answers with citations" },
      ],
      tradeoffs: [
        "Used SQLite to keep the beta portable and easy to review without adding operational overhead.",
        "Focused on cited answers instead of a black-box chatbot so users can verify where each answer came from.",
      ],
      validation: [
        "The review workflow keeps cited source notes available alongside answer drafts.",
        "Public summaries use illustrative workflow data; source material remains private.",
      ],
      next: [
        "Add role-based review states for draft, verified, and stale answers.",
        "Improve importer previews so messy CSV data can be corrected before it enters the knowledge base.",
      ],
    },
  },
  {
    id: "easyteller",
    title: "EasyTeller",
    short: "Team credit-application prototype with document upload and OCR workflows.",
    problem:
      "Credit and loan applications are harder to evaluate when applicants have limited conventional credit history but useful alternative financial documents.",
    built:
      "Contributed to a team credit-application prototype with a SvelteKit frontend, Python/FastAPI backend, MongoDB storage, OpenCV/Tesseract extraction, and SambaNova model calls.",
    tools: ["SvelteKit", "TypeScript", "FastAPI", "MongoDB", "Python", "OpenCV", "Tesseract", "SambaNova Cloud API"],
    outcome:
      "Built with a hackathon team to connect document upload, OCR extraction, model-assisted workflows, and application-data storage.",
    status: "Team hackathon prototype",
    link: "https://github.com/ThejasKumar100/hackutd11",
    accent: "amber",
    icon: ShieldCheck,
    demoFrames: [
      {
        eyebrow: "Svelte route",
        title: "Credit Card Application",
        description: "Based on the Svelte upload form for ID documents and proof-of-income files.",
        metrics: [
          { label: "Uploads", value: "ID + Income" },
          { label: "Backend", value: "FastAPI" },
        ],
        rows: [
          { label: "Government ID", value: "PDF / JPG / PNG" },
          { label: "Proof of Income", value: "Multiple files" },
          { label: "Submit state", value: "Uploading feedback", tone: "good" },
        ],
      },
      {
        eyebrow: "Document processing",
        title: "OCR Review Flow",
        description: "Repo backend uses OpenCV and Tesseract to extract text from uploaded application documents.",
        metrics: [
          { label: "OCR", value: "Tesseract" },
          { label: "Storage", value: "MongoDB" },
        ],
        rows: [
          { label: "Sample files", value: "Utility bill, rent receipt" },
          { label: "Extraction", value: "OpenCV + pytesseract" },
          { label: "AI assist", value: "SambaNova workflow" },
        ],
      },
    ],
    caseStudy: {
      architecture: [
        { label: "Applicant input", detail: "Credit application and supporting documents" },
        { label: "OCR", detail: "OpenCV and Tesseract extract document text" },
        { label: "AI review", detail: "External AI API assists with verification workflow" },
        { label: "Application data", detail: "MongoDB stores application data for the prototype workflow" },
      ],
      tradeoffs: [
        "Used OCR and AI as decision support rather than replacing human verification.",
        "Prioritized a working hackathon flow over long-term production integrations.",
      ],
      validation: [
        "Public source includes SvelteKit upload routes and FastAPI document-processing handlers.",
        "Document extraction uses OpenCV/Tesseract alongside SambaNova model calls.",
      ],
      next: [
        "Improve document quality checks before OCR.",
        "Add clearer reviewer confidence states and audit logs.",
      ],
    },
  },
  {
    id: "expressifai",
    title: "ExpressifAI",
    short: "Webcam-based computer vision prototype for assistive communication.",
    problem:
      "Assistive communication tools need to be responsive enough to translate expression and head-movement signals into usable intent.",
    built:
      "Built a Python/OpenCV prototype that processes live webcam input with PyTorch and torchvision models, then fuses expression and action predictions into output text.",
    tools: ["Python", "PyTorch", "CLIP", "OpenCV", "torchvision"],
    outcome:
      "Combined webcam input, CLIP action-label matching, and torchvision inference into prototype text output.",
    status: "Computer vision prototype",
    link: "https://github.com/nabil931260/ExpressifAI3",
    accent: "cyan",
    icon: Bot,
    demoFrames: [
      {
        eyebrow: "Live camera loop",
        title: "Expression Signal Panel",
        description: "Based on the repo's webcam loader, emotion model, action model, and fusion pipeline.",
        metrics: [
          { label: "Input", value: "Webcam" },
          { label: "Models", value: "PyTorch + CLIP" },
        ],
        rows: [
          { label: "Frame source", value: "Webcam stream" },
          { label: "Expression branch", value: "torchvision inference" },
          { label: "Action model", value: "CLIP label matching" },
        ],
      },
      {
        eyebrow: "Fusion output",
        title: "Expression To Message",
        description: "The project combines facial expression and action signals into a communication output.",
        metrics: [
          { label: "Input", value: "Webcam" },
          { label: "Output", value: "Prototype text" },
        ],
        rows: [
          { label: "Input", value: "Face + head movement" },
          { label: "Model fusion", value: "Emotion/action merge", tone: "good" },
          { label: "Output", value: "Assistive communication" },
        ],
      },
    ],
    caseStudy: {
      architecture: [
        { label: "Camera stream", detail: "Live webcam input provides face and head movement frames" },
        { label: "OpenCV", detail: "Frame processing extracts visual signals in real time" },
        { label: "Model inference", detail: "torchvision expression branch and CLIP action-label matching" },
        { label: "Assistive output", detail: "Classified expressions map to communication actions" },
      ],
      tradeoffs: [
        "Used OpenCV capture with separate expression and action inference before combining predictions.",
        "Kept the pipeline as an inspectable prototype for exploring assistive communication.",
      ],
      validation: [
        "Public source contains webcam capture, model inference, and prediction-to-text logic.",
        "Expression predictions remain prototype outputs requiring a trained checkpoint and evaluation before practical use.",
      ],
      next: [
        "Add calibration profiles for different users and lighting conditions.",
        "Improve setup scripts so the webcam demo is easier to run locally.",
      ],
    },
  },
  {
    id: "kickmap",
    title: "KickMap",
    short: "Campus event creation, filtered search, and sign-in with SvelteKit and Firebase.",
    problem:
      "Campus events are scattered across flyers, chats, and club pages, so students need a clearer way to discover what is happening nearby.",
    built:
      "Developed a SvelteKit/TypeScript campus event prototype with event creation, filtered event search, Firestore storage, and Firebase email/password authentication.",
    tools: ["SvelteKit", "TypeScript", "Firebase", "Firestore", "Firebase Authentication"],
    outcome: "Implemented event creation, filtered search, and authentication in the public event prototype.",
    status: "Public project",
    link: "https://github.com/nabil931260/KickMap",
    accent: "rose",
    icon: Network,
    demoFrames: [
      {
        eyebrow: "Campus discovery",
        title: "Campus Event Workflow",
        description: "Summary of the implemented SvelteKit/Firebase event creation, search, and sign-in flow.",
        metrics: [
          { label: "Stack", value: "SvelteKit" },
          { label: "Data", value: "Firebase" },
        ],
        rows: [
          { label: "Main feed", value: "Campus events" },
          { label: "Search", value: "Filtered Firestore reads" },
          { label: "Sign-in", value: "Firebase Authentication" },
        ],
      },
    ],
  },
  {
    id: "sugarsense",
    title: "SugarSense",
    short: "Educational classification prototype with a Gradio interface.",
    problem:
      "Risk-screening projects need careful framing: model output should support review, not present itself as a diagnosis.",
    built:
      "Built an educational notebook project using 768 records with eight input features, compared classification models, and created a Gradio interface to explore predictions.",
    tools: ["Python", "Pandas", "scikit-learn", "Gradio"],
    outcome: "Published educational notebooks and a Gradio prediction interface for exploring model behavior.",
    status: "Public notebook project",
    link: "https://github.com/nabil931260/Diabetes-Prediction-AIM-SP24-main",
    accent: "cyan",
    icon: LineChart,
    demoFrames: [
      {
        eyebrow: "Notebook workflow",
        title: "Model Comparison",
        description: "Based on the public diabetes prediction notebooks and classification workflow.",
        metrics: [
          { label: "Records", value: "768" },
          { label: "Inputs", value: "8 predictors" },
        ],
        rows: [
          { label: "Interface", value: "Gradio" },
          { label: "Modeling", value: "scikit-learn" },
          { label: "Purpose", value: "Educational exploration" },
        ],
      },
    ],
  },
];

export const skills = [
  {
    label: "Languages",
    icon: Code2,
    items: ["TypeScript", "JavaScript", "Python", "Java", "C/C++", "SQL", "HTML/CSS"],
  },
  {
    label: "Web / Dev Tools",
    icon: TerminalSquare,
    items: ["React", "SvelteKit", "Firebase", "MongoDB", "Vitest", "React Testing Library", "Git", "UNIX", "REST APIs", "SQLite"],
  },
  {
    label: "AI / Automation",
    icon: Bot,
    items: ["OpenCV", "Tesseract", "PyTorch", "CLIP", "SambaNova Cloud API", "OCR pipelines"],
  },
  {
    label: "Data / Quality",
    icon: LineChart,
    items: ["Pandas", "NumPy", "scikit-learn", "Matplotlib", "Gradio", "Code review", "Software testing", "Requirements gathering"],
  },
];

export const experiences = [
  {
    role: "AI Trainer & Model Evaluator",
    org: "Handshake AI",
    dates: "May 2026 - Present",
    details:
      "Work on software engineering task design, reference implementations and test cases, and review model-generated code, validation results, and documentation against task requirements.",
    proof: "Document findings with code and test evidence and write clear technical feedback.",
  },
  {
    role: "Area Manager Intern",
    org: "Amazon",
    dates: "Jun. 2023 - Aug. 2023",
    details:
      "Led development of a virtual drop-zone management web application, gathering operations-team requirements and iterating through design, implementation, testing, deployment, and user feedback.",
    proof: "Tested the application with 50+ warehouse associates concurrently during the 2023 project.",
  },
  {
    role: "Area Manager Intern",
    org: "Amazon",
    dates: "Jun. 2024 - Aug. 2024",
    details: "Returned to Amazon for a second Area Manager internship at its Fort Worth site.",
    proof: "Second internship rotation following the 2023 Jeffersonville internship.",
  },
  {
    role: "Computer Science - degree in progress",
    org: "University of Texas at Dallas",
    dates: "Expected Spring 2027",
    details:
      "B.S. Computer Science in progress, with project work in web development, computer vision, OCR workflows, and educational machine learning.",
    proof: "Expected graduation: Spring 2027.",
  },
];

export const toolStack = {
  languages: "TypeScript, JavaScript, Python, Java, C/C++, SQL",
  web: "React, SvelteKit, Firebase, MongoDB, Vitest, React Testing Library",
  ai: "OpenCV, Tesseract, PyTorch, CLIP, SambaNova Cloud API",
  data: "Pandas, NumPy, scikit-learn, Gradio, code review, testing",
};

export const contact = {
  email: "nabil.x.fadili@gmail.com",
  github: "https://github.com/nabil931260",
  linkedin: "https://linkedin.com/in/nabil-fadili9484",
  resume: "/Nabil-Resume.pdf?v=2026-10-27",
};

export const blogPosts = [
  {
    title: "AssetForge: reviewing asset folders before import",
    source: "LinkedIn build post",
    date: "May 2026",
    summary:
      "Build notes on a React/TypeScript browser tool for asset-folder validation, duplicate-name review, Godot-compatible paths, and manifest export.",
    details: [
      "Implemented file and folder import, validation rules, reviewed warnings, and JSON manifest and import-note export.",
      "Added Vitest domain tests and a React Testing Library UI test; published the beta on GitHub Pages.",
    ],
    architecture: [
      { label: "Import", detail: "Files and folders provide metadata and browser-preserved relative paths" },
      { label: "Validate", detail: "Rules flag naming issues, duplicate base names, and unsupported formats" },
      { label: "Review", detail: "Categories, tags, and reviewed warnings keep import decisions visible" },
      { label: "Export", detail: "JSON manifest and import notes describe Godot-compatible resource paths" },
    ],
    links: [
      { label: "GitHub repo", href: "https://github.com/nabil931260/assetforge" },
      {
        label: "LinkedIn post",
        href: "https://www.linkedin.com/posts/nabil-fadili9484_gamedev-godot-reactjs-ugcPost-7465099998041575425-sW2a/",
      },
    ],
  },
];

export const publicHighlights = [
  { value: projects.length.toString(), label: "projects spanning web tools, AI, data, and automation" },
  { value: "2", label: "Amazon Area Manager internships, summers 2023 and 2024" },
  { value: "React / TS", label: "asset-validation tooling with domain and UI tests" },
  { value: "AI quality", label: "software engineering evaluation at Handshake AI" },
];
