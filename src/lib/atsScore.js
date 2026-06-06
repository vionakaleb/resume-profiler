import { STOPWORDS, KNOWN_SKILLS } from "./skills.js";

function resumeToText(data) {
  const flattenEntries = (list) =>
    (list || []).flatMap((e) => [e.title, e.org, e.location, ...(e.bullets || [])]);
  const parts = [
    data.name,
    data.headline,
    data.summary,
    ...data.skills.map((s) => `${s.label} ${s.value}`),
    ...flattenEntries(data.experience),
    ...flattenEntries(data.education),
    ...flattenEntries(data.certifications),
    ...flattenEntries(data.achievements),
    ...flattenEntries(data.projects),
    ...data.languages.map((l) => `${l.name} ${l.level}`),
  ];
  return parts.join(" ").toLowerCase();
}

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z][a-z+.#]*[a-z+#]|[a-z]/g) || []).filter(
    (token) => token.length >= 3 && !STOPWORDS.has(token),
  );
}

function topKeywords(jobText, limit) {
  const counts = new Map();
  for (const token of tokenize(jobText)) {
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

function phrasesInText(phrases, text) {
  const haystack = text.toLowerCase();
  return phrases.filter((phrase) => haystack.includes(phrase.toLowerCase()));
}

export function scoreResume(data, jobDescription) {
  const job = (jobDescription || "").trim();
  if (job.length < 30) return null;

  const resumeText = resumeToText(data);

  const requiredSkills = phrasesInText(KNOWN_SKILLS, job);
  const matchedSkills = phrasesInText(requiredSkills, resumeText);
  const missingSkills = requiredSkills.filter(
    (skill) => !matchedSkills.includes(skill),
  );

  const keywords = topKeywords(job, 25);
  const matchedKeywords = keywords.filter((word) => resumeText.includes(word));
  const missingKeywords = keywords.filter(
    (word) => !resumeText.includes(word),
  );

  const skillScore = requiredSkills.length
    ? matchedSkills.length / requiredSkills.length
    : null;
  const keywordScore = keywords.length
    ? matchedKeywords.length / keywords.length
    : 0;

  const overall =
    skillScore == null
      ? Math.round(keywordScore * 100)
      : Math.round((skillScore * 0.6 + keywordScore * 0.4) * 100);

  return {
    overall,
    skillScore: skillScore == null ? null : Math.round(skillScore * 100),
    keywordScore: Math.round(keywordScore * 100),
    matchedSkills,
    missingSkills,
    matchedKeywords,
    missingKeywords,
    totalSkills: requiredSkills.length,
    totalKeywords: keywords.length,
  };
}
