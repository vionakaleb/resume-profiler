import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ExternalHyperlink,
  TabStopPosition,
  TabStopType,
  convertInchesToTwip,
  SectionType,
} from "docx";
import { saveAs } from "file-saver";
import { filled, normalizeUrl } from "./exportPdf.jsx";

const BRAND_COLOR = "1e3a5f";
const TEXT_COLOR = "111111";
const MUTED_COLOR = "555555";
const FONT = "Calibri";
const FONT_SIZE_NAME = 28;
const FONT_SIZE_SECTION = 13;
const FONT_SIZE_BODY = 11;
const FONT_SIZE_SMALL = 10;
const SEP = "  |  ";

function stripUrl(url) {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function entryHasContent(entry) {
  return (
    filled(entry.title) ||
    filled(entry.org) ||
    filled(entry.dates) ||
    (entry.bullets || []).some(filled)
  );
}

function buildContactRuns(data) {
  const parts = [];

  const addSep = () => {
    if (parts.length > 0) {
      parts.push(
        new TextRun({
          text: SEP,
          font: FONT,
          size: FONT_SIZE_SMALL * 2,
          color: MUTED_COLOR,
        }),
      );
    }
  };

  if (filled(data.location)) {
    addSep();
    parts.push(
      new TextRun({
        text: data.location,
        font: FONT,
        size: FONT_SIZE_SMALL * 2,
        color: MUTED_COLOR,
      }),
    );
  }

  if (filled(data.phone)) {
    addSep();
    parts.push(
      new TextRun({
        text: data.phone,
        font: FONT,
        size: FONT_SIZE_SMALL * 2,
        color: MUTED_COLOR,
      }),
    );
  }

  if (filled(data.email)) {
    addSep();
    parts.push(
      new TextRun({
        text: data.email,
        font: FONT,
        size: FONT_SIZE_SMALL * 2,
        color: MUTED_COLOR,
      }),
    );
  }

  return parts;
}

function buildContactLinks(data) {
  const links = [];

  if (filled(data.linkedin)) {
    links.push(
      new ExternalHyperlink({
        link: normalizeUrl(data.linkedin),
        children: [
          new TextRun({
            text: stripUrl(data.linkedin),
            font: FONT,
            size: FONT_SIZE_SMALL * 2,
            color: BRAND_COLOR,
            underline: {},
          }),
        ],
      }),
    );
  }

  if (filled(data.website)) {
    links.push(
      new ExternalHyperlink({
        link: normalizeUrl(data.website),
        children: [
          new TextRun({
            text: stripUrl(data.website),
            font: FONT,
            size: FONT_SIZE_SMALL * 2,
            color: BRAND_COLOR,
            underline: {},
          }),
        ],
      }),
    );
  }

  return links;
}

function sectionHeading(title) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 80 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 6,
        color: BRAND_COLOR,
      },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        font: FONT,
        size: FONT_SIZE_SECTION * 2,
        bold: true,
        color: BRAND_COLOR,
        characterSpacing: 60,
      }),
    ],
  });
}

function buildEntryParagraphs(entry) {
  const paragraphs = [];

  const titleRuns = [];
  if (filled(entry.title)) {
    titleRuns.push(
      new TextRun({
        text: entry.title,
        font: FONT,
        size: FONT_SIZE_BODY * 2,
        bold: true,
        color: TEXT_COLOR,
      }),
    );
  }

  if (filled(entry.dates)) {
    titleRuns.push(
      new TextRun({
        text: "\t",
      }),
    );
    titleRuns.push(
      new TextRun({
        text: entry.dates,
        font: FONT,
        size: FONT_SIZE_SMALL * 2,
        color: MUTED_COLOR,
      }),
    );
  }

  if (titleRuns.length > 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 0 },
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        children: titleRuns,
      }),
    );
  }

  const hasSub = filled(entry.org) || filled(entry.location);
  if (hasSub) {
    const subRuns = [];
    if (filled(entry.org)) {
      subRuns.push(
        new TextRun({
          text: entry.org,
          font: FONT,
          size: FONT_SIZE_SMALL * 2,
          bold: true,
          color: BRAND_COLOR,
        }),
      );
    }
    if (filled(entry.org) && filled(entry.location)) {
      subRuns.push(
        new TextRun({
          text: SEP,
          font: FONT,
          size: FONT_SIZE_SMALL * 2,
          color: MUTED_COLOR,
        }),
      );
    }
    if (filled(entry.location)) {
      subRuns.push(
        new TextRun({
          text: entry.location,
          font: FONT,
          size: FONT_SIZE_SMALL * 2,
          color: "333333",
        }),
      );
    }
    paragraphs.push(
      new Paragraph({
        spacing: { before: 40, after: 40 },
        children: subRuns,
      }),
    );
  }

  const bullets = (entry.bullets || []).filter(filled);
  for (const bullet of bullets) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 20, after: 20 },
        indent: { left: convertInchesToTwip(0.25) },
        children: [
          new TextRun({
            text: "•  ",
            font: FONT,
            size: FONT_SIZE_BODY * 2,
            color: TEXT_COLOR,
          }),
          new TextRun({
            text: bullet,
            font: FONT,
            size: FONT_SIZE_BODY * 2,
            color: TEXT_COLOR,
          }),
        ],
      }),
    );
  }

  return paragraphs;
}

function buildDocumentChildren(data) {
  const children = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: (data.name || "").toUpperCase(),
          font: FONT,
          size: FONT_SIZE_NAME * 2,
          bold: true,
          color: BRAND_COLOR,
          characterSpacing: 100,
        }),
      ],
    }),
  );

  if (filled(data.headline)) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({
            text: data.headline.toUpperCase(),
            font: FONT,
            size: FONT_SIZE_BODY * 2,
            bold: true,
            color: TEXT_COLOR,
            characterSpacing: 60,
          }),
        ],
      }),
    );
  }

  const contactRuns = buildContactRuns(data);
  if (contactRuns.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: contactRuns,
      }),
    );
  }

  const contactLinks = buildContactLinks(data);
  if (contactLinks.length > 0) {
    const linkChildren = [];
    contactLinks.forEach((link, index) => {
      if (index > 0) {
        linkChildren.push(
          new TextRun({
            text: SEP,
            font: FONT,
            size: FONT_SIZE_SMALL * 2,
            color: MUTED_COLOR,
          }),
        );
      }
      linkChildren.push(link);
    });
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: linkChildren,
      }),
    );
  }

  if (filled(data.summary)) {
    children.push(sectionHeading("Summary"));
    children.push(
      new Paragraph({
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: data.summary,
            font: FONT,
            size: FONT_SIZE_BODY * 2,
            color: TEXT_COLOR,
          }),
        ],
      }),
    );
  }

  const experience = (data.experience || []).filter(entryHasContent);
  if (experience.length > 0) {
    children.push(sectionHeading("Experience"));
    for (const entry of experience) {
      children.push(...buildEntryParagraphs(entry));
    }
  }

  const education = (data.education || []).filter(entryHasContent);
  if (education.length > 0) {
    children.push(sectionHeading("Education"));
    for (const entry of education) {
      children.push(...buildEntryParagraphs(entry));
    }
  }

  const certifications = (data.certifications || []).filter(entryHasContent);
  if (certifications.length > 0) {
    children.push(sectionHeading("Certifications"));
    for (const entry of certifications) {
      children.push(...buildEntryParagraphs(entry));
    }
  }

  const achievements = (data.achievements || []).filter(entryHasContent);
  if (achievements.length > 0) {
    children.push(sectionHeading("Achievements"));
    for (const entry of achievements) {
      children.push(...buildEntryParagraphs(entry));
    }
  }

  const projects = (data.projects || []).filter(entryHasContent);
  if (projects.length > 0) {
    children.push(sectionHeading("Projects"));
    for (const entry of projects) {
      children.push(...buildEntryParagraphs(entry));
    }
  }

  const skills = (data.skills || []).filter(
    (s) => filled(s.label) || filled(s.value),
  );
  if (skills.length > 0) {
    children.push(sectionHeading("Technical Skills"));
    for (const skill of skills) {
      const runs = [];
      if (filled(skill.label)) {
        runs.push(
          new TextRun({
            text: `${skill.label}: `,
            font: FONT,
            size: FONT_SIZE_BODY * 2,
            bold: true,
            color: TEXT_COLOR,
          }),
        );
      }
      if (filled(skill.value)) {
        runs.push(
          new TextRun({
            text: skill.value,
            font: FONT,
            size: FONT_SIZE_BODY * 2,
            color: TEXT_COLOR,
          }),
        );
      }
      children.push(
        new Paragraph({
          spacing: { before: 20, after: 20 },
          children: runs,
        }),
      );
    }
  }

  const languages = (data.languages || []).filter(
    (l) => filled(l.name) || filled(l.level),
  );
  if (languages.length > 0) {
    children.push(sectionHeading("Languages"));
    const langRuns = [];
    languages.forEach((lang, index) => {
      if (index > 0) {
        langRuns.push(
          new TextRun({
            text: "   ",
            font: FONT,
            size: FONT_SIZE_BODY * 2,
          }),
        );
      }
      langRuns.push(
        new TextRun({
          text: lang.name,
          font: FONT,
          size: FONT_SIZE_BODY * 2,
          bold: true,
          color: TEXT_COLOR,
        }),
      );
      if (filled(lang.level)) {
        langRuns.push(
          new TextRun({
            text: `: ${lang.level}`,
            font: FONT,
            size: FONT_SIZE_BODY * 2,
            color: TEXT_COLOR,
          }),
        );
      }
    });
    children.push(
      new Paragraph({
        spacing: { before: 20, after: 20 },
        children: langRuns,
      }),
    );
  }

  return children;
}

function slugify(name) {
  return (
    (name || "resume")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "resume"
  );
}

export async function exportResumeDocx(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Resume data is missing.");
  }

  const document = new Document({
    title: `${data.name || "Resume"} - Resume`,
    creator: data.name || "Resume",
    sections: [
      {
        properties: {
          type: SectionType.CONTINUOUS,
          page: {
            size: {
              width: 12240,
              height: 15840,
            },
            margin: {
              top: convertInchesToTwip(0.6),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.7),
              right: convertInchesToTwip(0.7),
            },
          },
        },
        children: buildDocumentChildren(data),
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  const filename = `${slugify(data.name)}.docx`;
  saveAs(blob, filename);
}
