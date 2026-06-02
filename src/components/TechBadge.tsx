const deviconBase = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

function customIcon(label: string, accent = "#62d9ef", background = "#071015", textColor = accent) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img"><rect width="64" height="64" rx="14" fill="${background}"/><rect x="7" y="7" width="50" height="50" rx="10" fill="none" stroke="${accent}" stroke-width="3"/><text x="32" y="38" text-anchor="middle" fill="${textColor}" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="800">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const logoMap: Record<string, { src: string; label?: string }> = {
  TypeScript: { src: `${deviconBase}/typescript/typescript-original.svg` },
  JavaScript: { src: `${deviconBase}/javascript/javascript-original.svg` },
  Python: { src: `${deviconBase}/python/python-original.svg` },
  Java: { src: `${deviconBase}/java/java-original.svg` },
  "C/C++": { src: `${deviconBase}/cplusplus/cplusplus-original.svg`, label: "C++" },
  SQL: { src: `${deviconBase}/postgresql/postgresql-original.svg` },
  "HTML/CSS": { src: `${deviconBase}/html5/html5-original.svg`, label: "HTML" },
  React: { src: `${deviconBase}/react/react-original.svg` },
  SvelteKit: { src: `${deviconBase}/svelte/svelte-original.svg` },
  Firebase: { src: `${deviconBase}/firebase/firebase-original.svg` },
  MongoDB: { src: `${deviconBase}/mongodb/mongodb-original.svg` },
  Git: { src: `${deviconBase}/git/git-original.svg` },
  UNIX: { src: `${deviconBase}/linux/linux-original.svg` },
  "REST APIs": { src: customIcon("API", "#73f0c2") },
  SQLite: { src: `${deviconBase}/sqlite/sqlite-original.svg` },
  OpenCV: { src: `${deviconBase}/opencv/opencv-original.svg` },
  Tesseract: { src: customIcon("OCR", "#62d9ef") },
  "SambaNova Cloud API": { src: customIcon("SN", "#eb7089"), label: "SambaNova" },
  "OCR pipelines": { src: customIcon("OCR", "#62d9ef") },
  Pandas: { src: `${deviconBase}/pandas/pandas-original.svg` },
  NumPy: { src: `${deviconBase}/numpy/numpy-original.svg` },
  "scikit-learn": { src: `${deviconBase}/scikitlearn/scikitlearn-original.svg` },
  PyTorch: { src: `${deviconBase}/pytorch/pytorch-original.svg` },
  TensorFlow: { src: `${deviconBase}/tensorflow/tensorflow-original.svg` },
  Matplotlib: { src: `${deviconBase}/matplotlib/matplotlib-original.svg` },
  "OCR workflows": { src: customIcon("OCR", "#62d9ef") },
  "Requirements gathering": { src: customIcon("REQ", "#73f0c2") },
  MIPS: { src: customIcon("MIPS", "#111111", "#f4cf21", "#111111") },
};

function getInitials(label: string) {
  return label
    .split(/[\s/-]+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

type TechBadgeProps = {
  name: string;
  active?: boolean;
  onClick?: (name: string) => void;
};

export function TechBadge({ name, active = false, onClick }: TechBadgeProps) {
  const logo = logoMap[name];
  const content = (
    <>
      {logo ? (
        <img src={logo.src} alt="" loading="lazy" decoding="async" />
      ) : (
        <i aria-hidden="true">{getInitials(name)}</i>
      )}
      <span>{name}</span>
    </>
  );

  if (onClick) {
    return (
      <button
        className={`tech-badge tech-badge-button ${active ? "active" : ""}`}
        type="button"
        onClick={() => onClick(name)}
        aria-pressed={active}
      >
        {content}
      </button>
    );
  }

  return (
    <span className="tech-badge">
      {content}
    </span>
  );
}
