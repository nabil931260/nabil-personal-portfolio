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
  headline: "CS student building full-stack, AI, and operations tools.",
  subtitle:
    "Computer Science student at UT Dallas with experience across full-stack development, machine learning, computer vision, operations tooling, and fintech projects.",
  location: "Dallas-Fort Worth, Texas",
  education: "B.S. Computer Science, University of Texas at Dallas, expected Dec. 2026",
};

export const projects: Project[] = [
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
    status: "Working local prototype",
    link: "https://github.com/nabil931260/ai-lead-scanner",
    accent: "mint",
    icon: FileSearch,
    demoFrames: [
      {
        eyebrow: "Generated markdown table",
        title: "Scored Leads",
        description: "Based on the repo's example output from `scripts/analyze_leads.py`.",
        metrics: [
          { label: "Top score", value: "75" },
          { label: "Confidence", value: "Medium" },
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
        "Used deterministic review columns instead of fully automated scoring so weak evidence is easy to catch.",
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
    short: "Private working beta for searchable underwriting appetite notes and cited answers.",
    problem:
      "Specialized eligibility notes are hard to trust when they are buried across long threads, profiles, and one-off answers.",
    built:
      "Built a local SQLite web beta with question threads, searchable source notes, CSV import, review labels, and cited answer generation.",
    tools: ["Python", "SQLite", "Full-text search", "HTML/CSS"],
    outcome:
      "Delivered a working private beta with 10 passing unit and web smoke tests.",
    status: "Working private beta",
    accent: "cyan",
    icon: Network,
    demoFrames: [
      {
        eyebrow: "Search workflow",
        title: "Appetite Search",
        description: "Mirrors the beta search form, source filters, and cited-answer workflow without exposing private data.",
        metrics: [
          { label: "Tests", value: "10" },
          { label: "Mode", value: "Private beta" },
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
          { label: "Tests", value: "10" },
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
        "Delivered the beta with 10 passing unit and web smoke tests.",
        "Tested the core loop from question capture to searchable answer reuse.",
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
    short: "OCR-based credit application support for unbanked users.",
    problem:
      "Credit and loan applications are harder to evaluate when applicants have limited conventional credit history but useful alternative financial documents.",
    built:
      "Built a Svelte/FastAPI application that accepts supporting documents, extracts text with OCR, and uses an AI-assisted review flow for document validation.",
    tools: ["OpenCV", "Tesseract", "SambaNova Cloud API", "Svelte", "Python"],
    outcome:
      "Processed 25+ test applications with 80% OCR accuracy and reduced manual verification time by 40% in testing.",
    status: "Hackathon/project build",
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
          { label: "OCR", value: "80%" },
          { label: "Apps tested", value: "25+" },
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
        { label: "Decision support", detail: "Outputs support faster manual review" },
      ],
      tradeoffs: [
        "Used OCR and AI as decision support rather than replacing human verification.",
        "Prioritized a working hackathon flow over long-term production integrations.",
      ],
      validation: [
        "Processed 25+ test applications in the project test set.",
        "Measured 80% OCR accuracy and a 40% reduction in manual verification time during testing.",
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
    short: "Real-time computer vision for assistive communication.",
    problem:
      "Assistive communication tools need to be responsive enough to translate expression and head-movement signals into usable intent.",
    built:
      "Built a Python/OpenCV prototype that processes live webcam input with PyTorch and torchvision models, then fuses expression and action predictions into output text.",
    tools: ["Python", "OpenCV", "PyTorch", "torchvision", "Computer vision"],
    outcome:
      "Reached 85% controlled-test accuracy, under 200ms latency, and supported testing with 15+ users.",
    status: "Portfolio project",
    link: "https://github.com/nabil931260/ExpressifAI3",
    accent: "cyan",
    icon: Bot,
    demoFrames: [
      {
        eyebrow: "Live camera loop",
        title: "Expression Signal Panel",
        description: "Based on the repo's webcam loader, emotion model, action model, and fusion pipeline.",
        metrics: [
          { label: "Latency", value: "<200ms" },
          { label: "Accuracy", value: "85%" },
        ],
        rows: [
          { label: "Frame source", value: "Webcam stream" },
          { label: "Emotion model", value: "Facial expression signal" },
          { label: "Action model", value: "Head/action intent" },
        ],
      },
      {
        eyebrow: "Fusion output",
        title: "Expression To Message",
        description: "The project combines facial expression and action signals into a communication output.",
        metrics: [
          { label: "Latency", value: "<200ms" },
          { label: "Users", value: "15+" },
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
        { label: "Vision model", detail: "PyTorch and torchvision classify expression and action signals" },
        { label: "Assistive output", detail: "Classified expressions map to communication actions" },
      ],
      tradeoffs: [
        "Optimized for low-friction interaction rather than complex calibration.",
        "Kept latency visible as a core quality metric because responsiveness matters for assistive use.",
      ],
      validation: [
        "Reached 85% controlled-test accuracy and under 200ms latency.",
        "Tested with 15+ users during project validation.",
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
    short: "Svelte/Firebase campus event discovery and digital billboard concept.",
    problem:
      "Campus events are scattered across flyers, chats, and club pages, so students need a clearer way to discover what is happening nearby.",
    built:
      "Built a Svelte/Firebase event discovery concept with event browsing, organizer posting, map/list context, and RSVP-oriented workflows.",
    tools: ["TypeScript", "SvelteKit", "Firebase", "HTML/CSS", "Maps", "Product design"],
    outcome: "Public TypeScript repository available on GitHub.",
    status: "Public project",
    link: "https://github.com/nabil931260/KickMap",
    accent: "rose",
    icon: Network,
    demoFrames: [
      {
        eyebrow: "Campus discovery",
        title: "Event Map + Feed",
        description: "Based on the public Svelte/Firebase event discovery repository and event organizer concept.",
        metrics: [
          { label: "Stack", value: "SvelteKit" },
          { label: "Data", value: "Firebase" },
        ],
        rows: [
          { label: "Main feed", value: "Campus events" },
          { label: "Context", value: "Map/list discovery" },
          { label: "Action", value: "RSVP-oriented flow" },
        ],
      },
    ],
  },
  {
    id: "sugarsense",
    title: "SugarSense",
    short: "Diabetes prediction/classification notebook project.",
    problem:
      "Risk-screening projects need careful framing: model output should support review, not present itself as a diagnosis.",
    built:
      "Built a notebook-based classification project that explores diabetes risk signals, compares model behavior, and presents the output as decision support.",
    tools: ["Python", "scikit-learn", "Pandas", "ML models"],
    outcome: "Public notebook repository available on GitHub.",
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
          { label: "Format", value: "Jupyter" },
          { label: "Task", value: "Classification" },
        ],
        rows: [
          { label: "Features", value: "Clinical risk signals" },
          { label: "Modeling", value: "scikit-learn" },
          { label: "Output", value: "Risk prediction" },
        ],
      },
    ],
  },
];

export const skills = [
  {
    label: "Languages",
    icon: Code2,
    items: ["TypeScript", "JavaScript", "Python", "Java", "C/C++", "SQL", "HTML/CSS", "MIPS"],
  },
  {
    label: "Web / Dev Tools",
    icon: TerminalSquare,
    items: ["React", "SvelteKit", "Firebase", "MongoDB", "Git", "UNIX", "REST APIs", "SQLite"],
  },
  {
    label: "AI / Automation",
    icon: Bot,
    items: ["OpenCV", "Tesseract", "PyTorch", "SambaNova Cloud API", "OCR pipelines"],
  },
  {
    label: "Data / Finance / Ops",
    icon: LineChart,
    items: ["Pandas", "NumPy", "scikit-learn", "PyTorch", "TensorFlow", "Matplotlib", "OCR workflows", "Requirements gathering"],
  },
];

export const experiences = [
  {
    role: "Area Manager Intern",
    org: "Amazon",
    dates: "Jun. 2023 - Aug. 2023; Jun. 2024 - Aug. 2024",
    details:
      "Completed two Area Manager internships focused on operations execution, cross-functional communication, process improvement, and technical problem-solving in a high-throughput environment.",
    proof: "Applied operations, communication, and process-improvement experience in a fast-paced fulfillment environment.",
  },
  {
    role: "Computer Science Student",
    org: "University of Texas at Dallas",
    dates: "Expected Dec. 2026",
    details:
      "Focused on full-stack software, AI/ML projects, workflow automation, and tools that connect technical systems to practical users.",
    proof: "Project work spans computer vision, fintech OCR, campus tools, ML classification, and operations tooling.",
  },
];

export const toolStack = {
  languages: "TypeScript, JavaScript, Python, Java, C/C++, SQL",
  web: "React, SvelteKit, Firebase, SQLite, REST APIs",
  ai: "OpenCV, Tesseract, PyTorch, SambaNova Cloud API",
  data: "Pandas, NumPy, scikit-learn, PyTorch, TensorFlow, Matplotlib",
};

export const contact = {
  email: "nabil.x.fadili@gmail.com",
  github: "https://github.com/nabil931260",
  linkedin: "https://linkedin.com/in/nabil-fadili9484",
  resume: "/Nabil-Resume.pdf",
};

export const blogPosts = [
  {
    title: "AssetForge: turning asset iteration into a front-end workflow",
    source: "LinkedIn build post",
    date: "May 2026",
    summary:
      "Build notes on turning AssetForge into a TypeScript front-end for generating, previewing, and iterating on game and web assets.",
    details: [
      "Focused on front-end product feel: fast feedback, clean controls, and a visual workspace that feels useful instead of decorative.",
      "Built as a public TypeScript project with the same kind of interaction polish I want in my portfolio work.",
    ],
    architecture: [
      { label: "Prompt/input", detail: "User controls define the asset direction and constraints" },
      { label: "Workspace", detail: "The front end keeps generation, preview, and selection in one flow" },
      { label: "Preview loop", detail: "Fast visual comparison makes iteration feel like a design tool" },
      { label: "Export", detail: "Chosen assets move toward reuse in game or web projects" },
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
  { value: "6", label: "selected projects across web, AI, data, and automation" },
  { value: "2", label: "Amazon Area Manager internship rotations" },
  { value: "85%", label: "controlled-test accuracy for ExpressifAI" },
  { value: "10", label: "tests passing for private beta project" },
];
