import { Float, Html, Line, OrbitControls, Ring, Sphere, Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { projects } from "../data/portfolio";

type GraphNode = {
  id: string;
  label: string;
  kind: "project" | "language" | "tool";
  color: string;
  position: [number, number, number];
};

const projectNodes: GraphNode[] = [
  { id: "expressifai", label: "ExpressifAI", kind: "project", color: "#62d9ef", position: [-2.9, 1.35, 1.05] },
  { id: "easyteller", label: "EasyTeller", kind: "project", color: "#f2c770", position: [2.75, 1.15, -1.15] },
  { id: "appetite", label: "Appetite Beta", kind: "project", color: "#73f0c2", position: [-2.65, -1.2, -1.35] },
  { id: "lead-scanner", label: "Lead Scanner", kind: "project", color: "#73f0c2", position: [2.85, -1.25, 1.1] },
  { id: "kickmap", label: "KickMap", kind: "project", color: "#eb7089", position: [0.15, 2.12, -1.9] },
  { id: "sugarsense", label: "SugarSense", kind: "project", color: "#62d9ef", position: [-0.25, -2.12, 1.75] },
];

const skillNodes: GraphNode[] = [
  { id: "python", label: "Python", kind: "language", color: "#73f0c2", position: [-0.45, 0.18, 0.72] },
  { id: "typescript", label: "TypeScript", kind: "language", color: "#62d9ef", position: [0.82, 0.78, -0.55] },
  { id: "sql", label: "SQL", kind: "language", color: "#73f0c2", position: [-1.05, -0.68, -0.92] },
  { id: "htmlcss", label: "HTML/CSS", kind: "language", color: "#f2c770", position: [1.18, -0.5, 0.82] },
  { id: "opencv", label: "OpenCV", kind: "tool", color: "#62d9ef", position: [-1.55, 1.02, 0.28] },
  { id: "svelte", label: "Svelte", kind: "tool", color: "#f2c770", position: [1.72, 1.15, -0.15] },
  { id: "firebase", label: "Firebase", kind: "tool", color: "#f2c770", position: [2.18, 0.18, -1.35] },
  { id: "sqlite", label: "SQLite", kind: "tool", color: "#73f0c2", position: [-1.58, -1.22, -0.45] },
  { id: "ml", label: "ML models", kind: "tool", color: "#eb7089", position: [0.55, -1.18, 0.35] },
  { id: "maps", label: "Maps / events", kind: "tool", color: "#eb7089", position: [1.12, 1.62, -1.05] },
  { id: "automation", label: "Automation", kind: "tool", color: "#73f0c2", position: [1.68, -1.62, 0.55] },
];

const graphNodes = [...projectNodes, ...skillNodes];

const graphEdges: Array<[string, string]> = [
  ["expressifai", "python"],
  ["expressifai", "opencv"],
  ["expressifai", "ml"],
  ["easyteller", "python"],
  ["easyteller", "opencv"],
  ["easyteller", "svelte"],
  ["appetite", "python"],
  ["appetite", "sqlite"],
  ["appetite", "sql"],
  ["appetite", "htmlcss"],
  ["lead-scanner", "python"],
  ["lead-scanner", "automation"],
  ["kickmap", "typescript"],
  ["kickmap", "htmlcss"],
  ["kickmap", "svelte"],
  ["kickmap", "firebase"],
  ["kickmap", "maps"],
  ["sugarsense", "python"],
  ["sugarsense", "ml"],
];

const projectIdMap: Record<string, string> = {
  appetite: "appetite-chat",
  easyteller: "easyteller",
  expressifai: "expressifai",
  kickmap: "kickmap",
  "lead-scanner": "lead-scanner",
  sugarsense: "sugarsense",
};

const graphProjectIdMap = new Map(Object.entries(projectIdMap).map(([graphId, projectId]) => [projectId, graphId]));

const skillGraphIdMap: Record<string, string[]> = {
  TypeScript: ["typescript"],
  JavaScript: ["typescript", "htmlcss"],
  Python: ["python"],
  SQL: ["sql", "sqlite"],
  "HTML/CSS": ["htmlcss"],
  React: ["typescript", "htmlcss"],
  SvelteKit: ["svelte"],
  Firebase: ["firebase"],
  MongoDB: ["automation"],
  "REST APIs": ["automation"],
  SQLite: ["sqlite", "sql"],
  OpenCV: ["opencv"],
  Tesseract: ["opencv"],
  PyTorch: ["ml", "python"],
  "SambaNova Cloud API": ["automation"],
  "OCR pipelines": ["opencv"],
  Pandas: ["python", "ml"],
  NumPy: ["python", "ml"],
  "scikit-learn": ["ml", "python"],
  TensorFlow: ["ml", "python"],
  Matplotlib: ["ml", "python"],
  "OCR workflows": ["opencv"],
  "Requirements gathering": ["automation", "sqlite"],
};

const orbitRings = [
  { radius: 2.25, color: "#73f0c2", rotation: [1.25, 0.18, 0.45] as [number, number, number] },
  { radius: 3.05, color: "#62d9ef", rotation: [1.12, -0.42, -0.18] as [number, number, number] },
  { radius: 3.75, color: "#f2c770", rotation: [1.45, 0.35, 1.05] as [number, number, number] },
];

function isConnected(activeId: string | null, nodeId: string) {
  if (!activeId) return true;
  if (activeId === nodeId) return true;
  return graphEdges.some(([from, to]) => (from === activeId && to === nodeId) || (to === activeId && from === nodeId));
}

function isEdgeActive(activeId: string | null, from: string, to: string) {
  if (!activeId) return true;
  return from === activeId || to === activeId;
}

function isFocusConnected(focusIds: Set<string>, nodeId: string) {
  if (focusIds.size === 0) return true;
  if (focusIds.has(nodeId)) return true;
  return graphEdges.some(([from, to]) => {
    return (focusIds.has(from) && to === nodeId) || (focusIds.has(to) && from === nodeId);
  });
}

function isFocusEdgeActive(focusIds: Set<string>, from: string, to: string) {
  if (focusIds.size === 0) return true;
  return focusIds.has(from) || focusIds.has(to);
}

type ConstellationSceneProps = {
  activeId: string | null;
  focusIds: Set<string>;
  onActivate: (id: string | null) => void;
  onProjectSelect?: (projectId: string) => void;
};

function ConstellationScene({ activeId, focusIds, onActivate, onProjectSelect }: ConstellationSceneProps) {
  const groupRef = useRef<Group>(null);
  const points = useMemo(() => {
    return new Map(graphNodes.map((node) => [node.id, node]));
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.075;
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.00028) * 0.12;
    groupRef.current.rotation.z = Math.cos(Date.now() * 0.00022) * 0.045;
  });

  return (
    <>
      <ambientLight intensity={0.58} />
      <pointLight position={[2.8, 4.5, 5.5]} intensity={52} color="#62d9ef" />
      <pointLight position={[-4, -2.4, 3.2]} intensity={24} color="#73f0c2" />
      <pointLight position={[0, 0, -4]} intensity={18} color="#f2c770" />
      <Stars radius={50} depth={30} count={620} factor={2.4} fade speed={0.22} />
      <Float speed={1.05} rotationIntensity={0.32} floatIntensity={0.28}>
        <group ref={groupRef}>
          {orbitRings.map((ring) => (
            <Ring key={`${ring.color}-${ring.radius}`} args={[ring.radius, ring.radius + 0.01, 160]} rotation={ring.rotation}>
              <meshBasicMaterial color={ring.color} transparent opacity={0.16} />
            </Ring>
          ))}
          {graphEdges.map(([from, to]) => {
            const start = points.get(from);
            const end = points.get(to);
            if (!start || !end) return null;
            const edgeActive = activeId ? isEdgeActive(activeId, from, to) : isFocusEdgeActive(focusIds, from, to);
            return (
              <Line
                key={`${from}-${to}`}
                points={[start.position, end.position]}
                color={edgeActive ? (end.kind === "language" ? "#73f0c2" : "#8bdff0") : "#41505a"}
                lineWidth={edgeActive && end.kind === "language" ? 2.2 : edgeActive ? 1.25 : 0.65}
                transparent
                opacity={edgeActive ? (end.kind === "language" ? 0.76 : 0.48) : 0.1}
              />
            );
          })}
          {graphNodes.map((node) => {
            const nodeActive = activeId ? isConnected(activeId, node.id) : isFocusConnected(focusIds, node.id);
            const isSelected = activeId === node.id || focusIds.has(node.id);
            return (
              <group
                key={node.id}
                position={node.position}
                onPointerOver={(event) => {
                  event.stopPropagation();
                  onActivate(node.id);
                  document.body.style.cursor = "pointer";
                }}
                onPointerOut={() => {
                  onActivate(null);
                  document.body.style.cursor = "";
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  onActivate(node.id);
                  if (node.kind === "project") {
                    onProjectSelect?.(projectIdMap[node.id] ?? node.id);
                  }
                }}
              >
                <Sphere args={[node.kind === "project" ? (isSelected ? 0.17 : 0.13) : isSelected ? 0.105 : 0.078, 32, 32]}>
                  <meshStandardMaterial
                    color={nodeActive ? node.color : "#33404a"}
                    emissive={nodeActive ? node.color : "#101820"}
                    emissiveIntensity={isSelected ? 2.3 : nodeActive ? 1.45 : 0.35}
                    transparent
                    opacity={nodeActive ? 1 : 0.42}
                  />
                </Sphere>
                <Html distanceFactor={7.4} transform>
                  <button
                    className={`graph-label ${node.kind} ${nodeActive ? "active" : "dimmed"} ${isSelected ? "selected" : ""}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onActivate(node.id);
                      if (node.kind === "project") {
                        onProjectSelect?.(projectIdMap[node.id] ?? node.id);
                      }
                    }}
                  >
                    {node.label}
                  </button>
                </Html>
              </group>
            );
          })}
        </group>
      </Float>
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.38} />
    </>
  );
}

type ProjectConstellationProps = {
  mode?: "hero" | "overlay";
  selectedSkill?: string | null;
  selectedProjectIds?: string[];
  onProjectSelect?: (projectId: string) => void;
};

export function ProjectConstellation({
  mode = "hero",
  selectedSkill = null,
  selectedProjectIds = [],
  onProjectSelect,
}: ProjectConstellationProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const focusIds = useMemo(() => {
    const next = new Set<string>();

    for (const id of skillGraphIdMap[selectedSkill ?? ""] ?? []) {
      next.add(id);
    }

    for (const projectId of selectedProjectIds) {
      const graphId = graphProjectIdMap.get(projectId);
      if (graphId) next.add(graphId);
    }

    return next;
  }, [selectedProjectIds, selectedSkill]);
  const activeNode = graphNodes.find((node) => node.id === activeId) ?? null;
  const focusedSkillNodes = selectedSkill
    ? (skillGraphIdMap[selectedSkill] ?? [])
        .map((id) => graphNodes.find((node) => node.id === id)?.label)
        .filter(Boolean)
    : [];
  const activeProject = activeNode?.kind === "project" ? projects.find((project) => project.id === (projectIdMap[activeNode.id] ?? activeNode.id)) : null;
  const connectedNodes = activeNode
    ? graphEdges
        .filter(([from, to]) => from === activeNode.id || to === activeNode.id)
        .map(([from, to]) => (from === activeNode.id ? to : from))
        .map((id) => graphNodes.find((node) => node.id === id)?.label)
        .filter(Boolean)
    : [];

  return (
    <div className={`project-constellation ${mode}`} aria-label="Project-to-language connection map">
      <Canvas camera={{ position: [0, 0.42, 7.4], fov: 46 }} dpr={[1, 1.75]}>
        <ConstellationScene
          activeId={activeId}
          focusIds={focusIds}
          onActivate={setActiveId}
          onProjectSelect={onProjectSelect}
        />
      </Canvas>
      <div className={`constellation-info-panel ${activeNode || selectedSkill ? "expanded" : "compact"}`}>
        <span>{activeNode ? activeNode.kind : selectedSkill ? "Skill filter" : "Interactive map"}</span>
        <strong>{activeNode?.label ?? selectedSkill ?? "Hover a node"}</strong>
        <p>
          {activeProject?.short ??
            (selectedSkill
              ? `Highlighting ${selectedProjectIds.length} connected project${selectedProjectIds.length === 1 ? "" : "s"} through ${focusedSkillNodes.join(", ") || selectedSkill}.`
              : null) ??
            (connectedNodes.length > 0
              ? `Connected to ${connectedNodes.join(", ")}.`
              : "Hover projects, languages, or tools to trace how the portfolio fits together.")}
        </p>
      </div>
      <div className="constellation-caption">
        <span>Project-to-language map</span>
        <strong>{selectedSkill ? `${selectedSkill} connections` : "selected projects / core tools"}</strong>
      </div>
    </div>
  );
}
