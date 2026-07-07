import { SKILL_DICTIONARY } from "./skills.js";

const EXTRA_DISPLAY_TERMS = {
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
  remix: "Remix",
  nuxt: "Nuxt",
  deno: "Deno",
  bun: "Bun",
};

function buildMishearingMap() {
  const map = {};

  for (const [skill, { display, mishearings }] of Object.entries(
    SKILL_DICTIONARY,
  )) {
    map[skill] = display;
    for (const variant of mishearings) {
      map[variant] = display;
    }
  }

  return map;
}

function buildSingleWordFixes() {
  const fixes = {};

  for (const [skill, { display }] of Object.entries(SKILL_DICTIONARY)) {
    if (!skill.includes(" ") && !skill.includes(".") && !skill.includes("/")) {
      fixes[skill] = display;
    }
  }

  Object.assign(fixes, EXTRA_DISPLAY_TERMS);

  return fixes;
}

const MISHEARING_MAP = buildMishearingMap();
const SINGLE_WORD_FIXES = buildSingleWordFixes();

const SORTED_PHRASES = Object.keys(MISHEARING_MAP).sort(
  (a, b) => b.length - a.length,
);

export function correctSpeechText(rawText) {
  if (!rawText) return "";

  let corrected = rawText;

  for (const phrase of SORTED_PHRASES) {
    const regex = new RegExp(escapeRegex(phrase), "gi");
    corrected = corrected.replace(regex, MISHEARING_MAP[phrase]);
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
