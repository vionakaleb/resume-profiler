import { extractPdfItems } from "./pdfText.js";
import { blankEntry } from "../data/initialData.js";

const LINE_TOLERANCE = 3;

const SECTIONS = {
  summary: ["summary"],
  experience: ["professional experience", "experience", "work experience"],
  education: ["education"],
  certifications: ["certifications", "certification"],
  achievements: ["achievements", "honors-awards", "honors & awards", "awards"],
  projects: ["projects", "project"],
  skills: ["technical skills", "skills"],
  languages: ["languages"],
};

const HEADING_TO_KEY = {};
for (const [key, names] of Object.entries(SECTIONS)) {
  for (const name of names) HEADING_TO_KEY[name] = key;
}

const DATE_TAIL =
  /\s+((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}\s*[\u2013\-]\s*(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4})|\d{4}\s*[\u2013\-]\s*(?:Present|\d{4})|\d{4})$/;

const SEP_REGEX = /\s*\|\s*/;

function groupLines(items) {
  const rows = [];
  for (const item of items) {
    const existing = rows.find((row) => Math.abs(row.y - item.y) <= LINE_TOLERANCE);
    if (existing) {
      existing.parts.push(item);
    } else {
      rows.push({ y: item.y, parts: [item] });
    }
  }
  return rows
    .sort((a, b) => a.y - b.y)
    .map((row) => {
      const sorted = row.parts.sort((a, b) => a.x - b.x);
      const pieces = [];
      for (let i = 0; i < sorted.length; i += 1) {
        if (i === 0) {
          pieces.push(sorted[i].text);
        } else {
          const prev = sorted[i - 1];
          const gap = sorted[i].x - (prev.x + (prev.width || 0));
          pieces.push(gap > 3 ? "\t" : " ");
          pieces.push(sorted[i].text);
        }
      }
      const text = pieces
        .join("")
        .replace(/[ ]+/g, " ")
        .replace(/\s*\t\s*/g, "\t")
        .trim();
      return { text, parts: sorted };
    })
    .filter((row) => row.text.length > 0);
}

function flattenPages(pages) {
  const all = [];
  for (const page of pages) {
    all.push(...groupLines(page.items));
  }
  return all;
}

function isPageFooter(text) {
  return /^Page \d+ of \d+$/i.test(text) || /^\d+\s*\/\s*\d+$/.test(text);
}

function cleanText(text) {
  return text.replace(/\t/g, " ").replace(/[ ]+/g, " ").trim();
}

function collapseLetterSpacing(text) {
  return text.replace(/\b([A-Za-z]{1,2})(?:[ ]([A-Za-z]{1,2})){2,}\b/g, (match) =>
    match.replace(/[ ]/g, ""),
  );
}

const HEADING_KEYS_BY_COMPACT = {};
for (const [key, names] of Object.entries(SECTIONS)) {
  for (const name of names) {
    HEADING_KEYS_BY_COMPACT[name.replace(/\s+/g, "").toLowerCase()] = key;
  }
}

function normalizeHeading(text) {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function compactHeading(text) {
  return text.toLowerCase().replace(/[\s\W_]+/g, "");
}

function findHeadingKey(text) {
  if (text.length > 60) return null;
  const norm = normalizeHeading(text);
  if (HEADING_TO_KEY[norm]) return HEADING_TO_KEY[norm];
  const compact = compactHeading(text);
  if (HEADING_KEYS_BY_COMPACT[compact]) return HEADING_KEYS_BY_COMPACT[compact];
  return null;
}

function splitTitleAndDates(text) {
  const match = text.match(DATE_TAIL);
  if (!match) return { title: cleanText(text), dates: "" };
  const dates = match[1].replace(/\s*[\u2013\-]\s*/, " \u2013 ").trim();
  const title = cleanText(text.slice(0, match.index));
  return { title, dates };
}

function splitOrgAndLocation(text) {
  if (SEP_REGEX.test(text)) {
    const [org, ...rest] = text.split(SEP_REGEX);
    return { org: cleanText(org), location: cleanText(rest.join(" | ")) };
  }
  return { org: cleanText(text), location: "" };
}

function isBulletLine(text) {
  return /^[\u2022\-]\s+/.test(text);
}

function stripBullet(text) {
  return cleanText(text.replace(/^[\u2022\-]\s+/, ""));
}

function parseHeader(lines, firstHeadingIndex) {
  const preheader = lines.slice(0, firstHeadingIndex).filter((l) => !isPageFooter(l.text));
  if (!preheader.length) {
    return { name: "", headline: "", contact: [] };
  }

  const name = preheader[0].text.replace(/\t/g, " ").replace(/\s+/g, " ").trim();
  let headline = "";
  let contactStart = 1;

  if (preheader.length > 1 && !SEP_REGEX.test(preheader[1].text)) {
    const second = preheader[1].text.trim();
    if (second && second === second.toUpperCase()) {
      headline = collapseLetterSpacing(second).replace(/\t/g, " ").replace(/\s+/g, " ").trim();
      contactStart = 2;
    }
  }

  const contactLines = preheader.slice(contactStart).map((l) => cleanText(l.text));
  const contactText = contactLines.join(" | ");
  const contactParts = contactText.split(SEP_REGEX).map((p) => p.trim()).filter(Boolean);

  return { name, headline, contact: contactParts };
}

function classifyContact(parts) {
  const result = { location: "", phone: "", email: "", linkedin: "", website: "" };
  for (const part of parts) {
    if (!part) continue;
    if (/@/.test(part) && !/^https?:/i.test(part)) {
      result.email = part;
      continue;
    }
    if (/linkedin\.com/i.test(part)) {
      result.linkedin = part;
      continue;
    }
    if (/^https?:\/\//i.test(part) || /\.(com|net|org|io|dev|app|me|co)(\/|$)/i.test(part)) {
      result.website = part;
      continue;
    }
    if (/^[+\d][\d\s\-().]{5,}$/.test(part)) {
      result.phone = part;
      continue;
    }
    if (!result.location) {
      result.location = part;
    }
  }
  return result;
}

function sectionBlocks(lines) {
  const blocks = {};
  let firstHeadingIndex = -1;
  let currentKey = null;
  let currentLines = [];

  const flush = () => {
    if (currentKey) {
      if (!blocks[currentKey]) blocks[currentKey] = [];
      blocks[currentKey].push(...currentLines);
    }
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (isPageFooter(line.text)) continue;
    const key = findHeadingKey(line.text);
    if (key) {
      if (firstHeadingIndex < 0) firstHeadingIndex = i;
      flush();
      currentKey = key;
      currentLines = [];
    } else if (currentKey) {
      currentLines.push(line);
    }
  }
  flush();

  return { blocks, firstHeadingIndex };
}

function parseEntries(blockLines) {
  const entries = [];
  let current = null;

  const pushCurrent = () => {
    if (!current) return;
    if (!current.bullets.length) current.bullets = [""];
    entries.push(current);
  };

  for (let i = 0; i < blockLines.length; i += 1) {
    const text = blockLines[i].text;
    if (isBulletLine(text)) {
      if (!current) {
        current = blankEntry();
        current.bullets = [];
      }
      current.bullets.push(stripBullet(text));
      continue;
    }

    const next = blockLines[i + 1];
    const looksLikeHead = DATE_TAIL.test(text) ||
      (next && SEP_REGEX.test(next.text) && !isBulletLine(next.text));

    if (looksLikeHead || !current) {
      pushCurrent();
      current = blankEntry();
      current.bullets = [];
      const { title, dates } = splitTitleAndDates(text);
      current.title = title;
      current.dates = dates;
      if (next && !isBulletLine(next.text) && !DATE_TAIL.test(next.text)) {
        const { org, location } = splitOrgAndLocation(next.text);
        if (org || location) {
          current.org = org;
          current.location = location;
          i += 1;
        }
      }
    } else {
      if (current.bullets.length) {
        current.bullets[current.bullets.length - 1] += ` ${text}`;
      } else {
        current.bullets.push(text);
      }
    }
  }
  pushCurrent();
  return entries;
}

function parseSummary(blockLines) {
  return blockLines
    .map((l) => l.text)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSkills(blockLines) {
  const skills = [];
  for (const line of blockLines) {
    const text = cleanText(line.text);
    const colon = text.indexOf(":");
    if (colon > 0 && colon < 40) {
      skills.push({
        label: text.slice(0, colon).trim(),
        value: text.slice(colon + 1).trim(),
      });
    } else {
      skills.push({ label: "", value: text });
    }
  }
  return skills;
}

function parseLanguages(blockLines) {
  const text = blockLines.map((l) => l.text).join("\t");
  const rawParts = text.split(/[\t]+|\s{2,}|,\s+/);
  const parts = rawParts.map((p) => cleanText(p)).filter(Boolean);
  const langs = [];
  for (const part of parts) {
    const colon = part.indexOf(":");
    if (colon > 0) {
      langs.push({
        name: part.slice(0, colon).trim(),
        level: part.slice(colon + 1).trim(),
      });
    } else {
      langs.push({ name: part, level: "" });
    }
  }
  return langs;
}

export async function parseResumePdf(file) {
  const pages = await extractPdfItems(file);
  if (!pages.length) throw new Error("The PDF has no readable text.");

  const lines = flattenPages(pages);
  if (!lines.length) {
    throw new Error("Could not read any text from this PDF.");
  }

  const { blocks, firstHeadingIndex } = sectionBlocks(lines);
  if (firstHeadingIndex < 0) {
    throw new Error(
      "No section headings found. Make sure this is a PDF exported by this app.",
    );
  }

  const header = parseHeader(lines, firstHeadingIndex);
  const contact = classifyContact(header.contact);

  const parsed = {
    name: header.name,
    headline: header.headline,
    ...contact,
    summary: blocks.summary ? parseSummary(blocks.summary) : "",
    experience: blocks.experience ? parseEntries(blocks.experience) : [],
    education: blocks.education ? parseEntries(blocks.education) : [],
    certifications: blocks.certifications ? parseEntries(blocks.certifications) : [],
    achievements: blocks.achievements ? parseEntries(blocks.achievements) : [],
    projects: blocks.projects ? parseEntries(blocks.projects) : [],
    skills: blocks.skills ? parseSkills(blocks.skills) : [],
    languages: blocks.languages ? parseLanguages(blocks.languages) : [],
  };

  const stats = {
    experience: parsed.experience.length,
    education: parsed.education.length,
    certifications: parsed.certifications.length,
    achievements: parsed.achievements.length,
    projects: parsed.projects.length,
    skills: parsed.skills.length,
  };

  return { parsed, stats };
}
