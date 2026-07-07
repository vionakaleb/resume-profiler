import { KNOWN_SKILLS } from "./skills.js";

const MISHEARING_MAP = {
  "react native": "React Native",
  "react js": "React",
  "react.js": "React",
  "next js": "Next.js",
  "next.js": "Next.js",
  "next yes": "Next.js",
  "node js": "Node.js",
  "node.js": "Node.js",
  "no js": "Node.js",
  "note js": "Node.js",
  "three js": "Three.js",
  "three.js": "Three.js",
  "view js": "Vue.js",
  "vue js": "Vue.js",
  "vue.js": "Vue.js",
  "ci cd": "CI/CD",
  "ci/cd": "CI/CD",
  "power bi": "Power BI",
  "power by": "Power BI",
  "no sql": "NoSQL",
  "my sql": "MySQL",
  "post gress": "PostgreSQL",
  postgres: "PostgreSQL",
  "post gress sql": "PostgreSQL",
  "postgre sql": "PostgreSQL",
  "machine learning": "Machine Learning",
  "testing library": "Testing Library",
  "web socket": "WebSocket",
  "web gl": "WebGL",
  "graph ql": "GraphQL",
  "graph cool": "GraphQL",
};

const SINGLE_WORD_FIXES = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  react: "React",
  angular: "Angular",
  vue: "Vue",
  svelte: "Svelte",
  redux: "Redux",
  express: "Express",
  graphql: "GraphQL",
  php: "PHP",
  python: "Python",
  java: "Java",
  golang: "Golang",
  rust: "Rust",
  html: "HTML",
  css: "CSS",
  sass: "Sass",
  tailwind: "Tailwind",
  bootstrap: "Bootstrap",
  webpack: "Webpack",
  vite: "Vite",
  jest: "Jest",
  cypress: "Cypress",
  playwright: "Playwright",
  mongodb: "MongoDB",
  redis: "Redis",
  firebase: "Firebase",
  aws: "AWS",
  azure: "Azure",
  gcp: "GCP",
  docker: "Docker",
  kubernetes: "Kubernetes",
  git: "Git",
  github: "GitHub",
  gitlab: "GitLab",
  agile: "Agile",
  scrum: "Scrum",
  figma: "Figma",
  sql: "SQL",
  nosql: "NoSQL",
  microservices: "Microservices",
  responsive: "Responsive",
  accessibility: "Accessibility",
  websocket: "WebSocket",
  webgl: "WebGL",
  api: "API",
  apis: "APIs",
  ui: "UI",
  ux: "UX",
  seo: "SEO",
  npm: "npm",
  yarn: "Yarn",
  pnpm: "pnpm",
  prisma: "Prisma",
  fastify: "Fastify",
  django: "Django",
  flask: "Flask",
  laravel: "Laravel",
  spring: "Spring",
  kotlin: "Kotlin",
  swift: "Swift",
  flutter: "Flutter",
  dart: "Dart",
};

const PHONETIC_CORRECTIONS = [
  { pattern: /\bview\b/gi, replacement: "Vue" },
  { pattern: /\breact?\b/gi, replacement: "React" },
  { pattern: /\bnext\b/gi, replacement: "Next.js" },
  { pattern: /\bnode\b/gi, replacement: "Node.js" },
  { pattern: /\bno[dt]e?\s*j\.?s\.?\b/gi, replacement: "Node.js" },
  { pattern: /\bnext\s*j\.?s\.?\b/gi, replacement: "Next.js" },
  { pattern: /\bthree\s*j\.?s\.?\b/gi, replacement: "Three.js" },
  { pattern: /\bvue?\s*j\.?s\.?\b/gi, replacement: "Vue.js" },
  { pattern: /\btype\s*script\b/gi, replacement: "TypeScript" },
  { pattern: /\bjava\s*script\b/gi, replacement: "JavaScript" },
  { pattern: /\bgraph\s*q\.?l\.?\b/gi, replacement: "GraphQL" },
  { pattern: /\bpost\s*gres?\s*(?:sql)?\b/gi, replacement: "PostgreSQL" },
  { pattern: /\bmy\s*s\.?q\.?l\.?\b/gi, replacement: "MySQL" },
  { pattern: /\bmongo\s*d\.?b\.?\b/gi, replacement: "MongoDB" },
  { pattern: /\bkubernetes\b/gi, replacement: "Kubernetes" },
  { pattern: /\bkube\b/gi, replacement: "Kubernetes" },
  { pattern: /\bdocker\b/gi, replacement: "Docker" },
  { pattern: /\btail\s*wind\b/gi, replacement: "Tailwind" },
  { pattern: /\bweb\s*pack\b/gi, replacement: "Webpack" },
  { pattern: /\bfire\s*base\b/gi, replacement: "Firebase" },
  { pattern: /\bredis\b/gi, replacement: "Redis" },
  { pattern: /\bprisma\b/gi, replacement: "Prisma" },
  { pattern: /\bfastify\b/gi, replacement: "Fastify" },
];

export function correctSpeechText(rawText) {
  if (!rawText) return "";

  let corrected = rawText;

  const sortedPhrases = Object.keys(MISHEARING_MAP).sort(
    (a, b) => b.length - a.length,
  );

  for (const phrase of sortedPhrases) {
    const regex = new RegExp(escapeRegex(phrase), "gi");
    corrected = corrected.replace(regex, MISHEARING_MAP[phrase]);
  }

  for (const { pattern, replacement } of PHONETIC_CORRECTIONS) {
    corrected = corrected.replace(pattern, replacement);
  }

  corrected = corrected.replace(/\b\w+\b/g, (word) => {
    const lower = word.toLowerCase();
    return SINGLE_WORD_FIXES[lower] || word;
  });

  corrected = removeDuplicateTerms(corrected);

  return corrected.trim();
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeDuplicateTerms(text) {
  return text.replace(/\b(\S+)\s+\1\b/gi, "$1");
}
