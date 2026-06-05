import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

const SEP = "  |  ";

const styles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 36,
    paddingHorizontal: 50,
    fontSize: 10.5,
    fontFamily: "Helvetica",
    color: "#111111",
    lineHeight: 1.4,
  },
  name: {
    fontSize: 26,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 6,
  },
  headline: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111111",
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 3,
    marginTop: 16,
    marginBottom: 8,
  },
  contact: {
    fontSize: 10,
    color: "#555555",
    textAlign: "center",
    marginBottom: 8,
  },
  contactLink: {
    color: "#1e3a5f",
    textDecoration: "underline",
  },
  section: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 0.75,
    borderBottomColor: "#1e3a5f",
    borderBottomStyle: "solid",
  },
  summary: {
    marginBottom: 4,
  },
  entry: {
    marginBottom: 10,
  },
  entryHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    flex: 1,
    paddingRight: 8,
  },
  entryDate: {
    fontSize: 10,
    color: "#555555",
  },
  entrySub: {
    fontSize: 10,
    marginTop: 2,
    marginBottom: 4,
  },
  entryOrg: {
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  entryLoc: {
    color: "#333333",
  },
  bulletRow: {
    flexDirection: "row",
    marginTop: 2,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 10,
  },
  bulletText: {
    flex: 1,
  },
  skill: {
    marginBottom: 2,
  },
  skillLabel: {
    fontFamily: "Helvetica-Bold",
  },
  langs: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  langItem: {
    marginRight: 10,
  },
  langName: {
    fontFamily: "Helvetica-Bold",
  },
});

const filled = (value) => typeof value === "string" && value.trim().length > 0;

function normalizeUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function displayUrl(url) {
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

function ContactLine({ data }) {
  const parts = [];

  if (filled(data.location)) {
    parts.push(<Text key="loc">{data.location}</Text>);
  }
  if (filled(data.phone)) {
    parts.push(<Text key="phone">{data.phone}</Text>);
  }
  if (filled(data.email)) {
    parts.push(<Text key="email">{data.email}</Text>);
  }
  if (filled(data.linkedin)) {
    parts.push(
      <Link
        key="li"
        src={normalizeUrl(data.linkedin)}
        style={styles.contactLink}
      >
        {displayUrl(data.linkedin)}
      </Link>,
    );
  }
  if (filled(data.website)) {
    parts.push(
      <Link
        key="web"
        src={normalizeUrl(data.website)}
        style={styles.contactLink}
      >
        {displayUrl(data.website)}
      </Link>,
    );
  }

  if (!parts.length) return null;

  return (
    <Text style={styles.contact}>
      {parts.map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <Text>{SEP}</Text>}
          {part}
        </React.Fragment>
      ))}
    </Text>
  );
}

function Entry({ entry }) {
  const bullets = (entry.bullets || []).filter(filled);
  const hasSub = filled(entry.org) || filled(entry.location);

  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.entryHead}>
        <Text style={styles.entryTitle}>{entry.title}</Text>
        {filled(entry.dates) && (
          <Text style={styles.entryDate}>{entry.dates}</Text>
        )}
      </View>

      {hasSub && (
        <Text style={styles.entrySub}>
          {filled(entry.org) && (
            <Text style={styles.entryOrg}>{entry.org}</Text>
          )}
          {filled(entry.org) && filled(entry.location) && <Text>{SEP}</Text>}
          {filled(entry.location) && (
            <Text style={styles.entryLoc}>{entry.location}</Text>
          )}
        </Text>
      )}

      {bullets.map((bullet, index) => (
        <View key={index} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
    </View>
  );
}

function ResumeDocument({ data }) {
  const skills = data.skills.filter((s) => filled(s.label) || filled(s.value));
  const experience = data.experience.filter(entryHasContent);
  const education = data.education.filter(entryHasContent);
  const languages = data.languages.filter(
    (l) => filled(l.name) || filled(l.level),
  );

  return (
    <Document
      title={`${data.name || "Resume"} - Resume`}
      author={data.name || "Resume"}
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{data.name}</Text>
        {filled(data.headline) && (
          <Text style={styles.headline}>{data.headline}</Text>
        )}
        <ContactLine data={data} />

        {filled(data.summary) && (
          <>
            <Text style={styles.section}>Summary</Text>
            <Text style={styles.summary}>{data.summary}</Text>
          </>
        )}

        {experience.length > 0 && (
          <>
            <Text style={styles.section}>Professional Experience</Text>
            {experience.map((entry, index) => (
              <Entry key={index} entry={entry} />
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <Text style={styles.section}>Education</Text>
            {education.map((entry, index) => (
              <Entry key={index} entry={entry} />
            ))}
          </>
        )}

        {skills.length > 0 && (
          <>
            <Text style={styles.section}>Technical Skills</Text>
            {skills.map((skill, index) => (
              <Text key={index} style={styles.skill}>
                {filled(skill.label) && (
                  <Text style={styles.skillLabel}>{skill.label}: </Text>
                )}
                <Text>{skill.value}</Text>
              </Text>
            ))}
          </>
        )}

        {languages.length > 0 && (
          <>
            <Text style={styles.section}>Languages</Text>
            <Text style={styles.langs}>
              {languages.map((lang, index) => (
                <Text key={index} style={styles.langItem}>
                  <Text style={styles.langName}>{lang.name}</Text>
                  {filled(lang.level) ? `: ${lang.level}` : ""}
                  {index < languages.length - 1 ? "   " : ""}
                </Text>
              ))}
            </Text>
          </>
        )}
      </Page>
    </Document>
  );
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

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function exportResumePdf(elementOrData, maybeName) {
  const isDomElement =
    elementOrData &&
    typeof elementOrData === "object" &&
    "nodeType" in elementOrData;

  if (isDomElement) {
    throw new Error(
      "exportResumePdf now requires resume data, not a DOM element. Pass `data` from Toolbar.",
    );
  }

  const data = elementOrData;
  if (!data || typeof data !== "object") {
    throw new Error("Resume data is missing.");
  }

  const filename = `${slugify(maybeName || data.name)}.pdf`;
  const blob = await pdf(<ResumeDocument data={data} />).toBlob();
  triggerDownload(blob, filename);
}
