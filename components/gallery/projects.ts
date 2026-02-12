export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  links: { label: string; url: string }[];
  color: string;
  folder: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  projects: Project[];
}

export const folders: Folder[] = [
  {
    id: "folder-1",
    name: "Main Projects",
    color: "#c8a96e",
    projects: [
      {
        id: "medease",
        title: "MedEase",
        description:
          "An AI-powered EHR summarizer that transforms complex medical records into clear, patient-friendly summaries using Google Gemini. Includes a drug interaction checker.",
        techStack: ["React", "Vite", "FastAPI", "Google Gemini", "TypeScript"],
        links: [
          { label: "Live Demo", url: "https://med-ease-harineek24.vercel.app" },
          { label: "GitHub", url: "https://github.com/harineek24/medEase" },
        ],
        color: "#4a90d9",
        folder: "Main Projects",
      },
      {
        id: "project-2",
        title: "Portfolio v2",
        description: "A modern portfolio website with interactive animations and responsive design.",
        techStack: ["Next.js", "Three.js", "Framer Motion"],
        links: [],
        color: "#e74c3c",
        folder: "Main Projects",
      },
      {
        id: "project-3",
        title: "TaskFlow",
        description: "A productivity app for managing tasks with drag-and-drop Kanban boards and real-time collaboration.",
        techStack: ["React", "Firebase", "TypeScript"],
        links: [],
        color: "#2ecc71",
        folder: "Main Projects",
      },
      {
        id: "project-4",
        title: "CodeSnippets",
        description: "A developer tool for saving, organizing, and sharing code snippets with syntax highlighting.",
        techStack: ["Vue.js", "Supabase", "Prism.js"],
        links: [],
        color: "#9b59b6",
        folder: "Main Projects",
      },
      {
        id: "project-5",
        title: "WeatherLens",
        description: "A weather visualization app with interactive maps and 7-day forecasts using real-time API data.",
        techStack: ["React", "OpenWeather API", "Mapbox"],
        links: [],
        color: "#f39c12",
        folder: "Main Projects",
      },
      {
        id: "project-6",
        title: "DevConnect",
        description: "A social networking platform for developers to share projects, collaborate, and find teammates.",
        techStack: ["Next.js", "PostgreSQL", "Prisma"],
        links: [],
        color: "#1abc9c",
        folder: "Main Projects",
      },
    ],
  },
  {
    id: "folder-2",
    name: "Experiments",
    color: "#8b5e3c",
    projects: [],
  },
  {
    id: "folder-3",
    name: "Open Source",
    color: "#5c7a3b",
    projects: [],
  },
  {
    id: "folder-4",
    name: "Client Work",
    color: "#3b5c7a",
    projects: [],
  },
  {
    id: "folder-5",
    name: "Hackathons",
    color: "#7a3b5c",
    projects: [],
  },
  {
    id: "folder-6",
    name: "Learning",
    color: "#5c3b7a",
    projects: [],
  },
];

// Flatten all projects with positions for gallery placement
export function getAllDisplayItems(): (Project | Folder)[] {
  return folders;
}

// Positions for artwork on the walls
// Left wall: x = -3.8, Right wall: x = 3.8
// Spread along z axis
export interface ArtworkPosition {
  position: [number, number, number];
  rotation: [number, number, number];
  folder: Folder;
}

export function getArtworkPositions(): ArtworkPosition[] {
  const positions: ArtworkPosition[] = [];
  const leftWallX = -3.85;
  const rightWallX = 3.85;
  const artY = 2.5;

  // Left wall paintings (face right, rotation y = π/2)
  const leftFolders = folders.slice(0, 3);
  leftFolders.forEach((folder, i) => {
    const z = -8 + i * 8;
    positions.push({
      position: [leftWallX, artY, z],
      rotation: [0, Math.PI / 2, 0],
      folder,
    });
  });

  // Right wall paintings (face left, rotation y = -π/2)
  const rightFolders = folders.slice(3, 6);
  rightFolders.forEach((folder, i) => {
    const z = -8 + i * 8;
    positions.push({
      position: [rightWallX, artY, z],
      rotation: [0, -Math.PI / 2, 0],
      folder,
    });
  });

  return positions;
}
