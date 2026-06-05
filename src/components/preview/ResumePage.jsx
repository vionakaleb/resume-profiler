import { SECTION_SEP } from "../../data/initialData.js";

const filled = (value) => typeof value === "string" && value.trim().length > 0;

function normalizeUrl(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function displayUrl(url) {
  return url.replace(/^https?:\/\//i, "").replace(/\/$/, "");
}

function ContactLine({ data }) {
  const items = [];
  if (filled(data.location)) items.push(<span key="loc">{data.location}</span>);
  if (filled(data.phone)) items.push(<span key="phone">{data.phone}</span>);
  if (filled(data.email))
    items.push(
      <span key="email" className="break-all">
        {data.email}
      </span>,
    );
  if (filled(data.linkedin))
    items.push(
      <a
        key="li"
        href={normalizeUrl(data.linkedin)}
        className="break-all text-blue-700 hover:underline"
      >
        {displayUrl(data.linkedin)}
      </a>,
    );
  if (filled(data.website))
    items.push(
      <a
        key="web"
        href={normalizeUrl(data.website)}
        className="break-all text-blue-700 hover:underline"
      >
        {displayUrl(data.website)}
      </a>,
    );
  if (!items.length) return null;

  return (
    <p className="mt-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm text-gray-700 text-center">
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-x-2">
          {index > 0 && <span className="text-gray-400">{SECTION_SEP}</span>}
          {item}
        </span>
      ))}
    </p>
  );
}

function Entry({ entry }) {
  const bullets = (entry.bullets || []).filter(filled);
  return (
    <div className="mb-4 break-inside-avoid">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-y-0.5">
        <span className="font-bold text-sm sm:text-base text-gray-900">
          {entry.title}
        </span>
        <span className="text-xs sm:text-sm text-gray-600">{entry.dates}</span>
      </div>
      {(filled(entry.org) || filled(entry.location)) && (
        <p className="mt-0.5 text-xs sm:text-sm text-gray-800">
          <b className="text-blue-900">{entry.org}</b>
          {filled(entry.location) && (
            <span className="text-gray-600">
              <span className="mx-1">{SECTION_SEP}</span>
              {entry.location}
            </span>
          )}
        </p>
      )}
      {bullets.length > 0 && (
        <ul className="mt-2 pl-5 list-disc space-y-1 text-xs sm:text-sm text-gray-800">
          {bullets.map((bullet, index) => (
            <li key={index} className="leading-relaxed break-words">
              {bullet}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function entryHasContent(entry) {
  return (
    filled(entry.title) ||
    filled(entry.org) ||
    filled(entry.dates) ||
    (entry.bullets || []).some(filled)
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="mt-5 mb-2 pb-1 border-b border-blue-900 text-sm sm:text-base font-bold uppercase tracking-wider text-blue-900">
      {children}
    </h2>
  );
}

export default function ResumePage({ data }) {
  const skills = data.skills.filter((s) => filled(s.label) || filled(s.value));
  const experience = data.experience.filter(entryHasContent);
  const education = data.education.filter(entryHasContent);
  const languages = data.languages.filter(
    (l) => filled(l.name) || filled(l.level),
  );

  return (
    <main className="resume-page w-full max-w-[800px] mx-auto bg-white text-gray-900 px-4 py-6 sm:px-10 sm:py-10 break-words">
      <p className="text-2xl sm:text-4xl font-extrabold tracking-wide text-blue-900 text-center break-words">
        {data.name}
      </p>
      {filled(data.headline) && (
        <p className="mt-1 text-sm sm:text-base font-semibold uppercase tracking-widest text-gray-700 text-center">
          {data.headline}
        </p>
      )}
      <ContactLine data={data} />

      {filled(data.summary) && (
        <>
          <SectionHeading>Summary</SectionHeading>
          <p className="text-xs sm:text-sm leading-relaxed text-gray-800">
            {data.summary}
          </p>
        </>
      )}

      {experience.length > 0 && (
        <>
          <SectionHeading>Professional Experience</SectionHeading>
          {experience.map((entry, index) => (
            <Entry key={index} entry={entry} />
          ))}
        </>
      )}

      {education.length > 0 && (
        <>
          <SectionHeading>Education</SectionHeading>
          {education.map((entry, index) => (
            <Entry key={index} entry={entry} />
          ))}
        </>
      )}

      {skills.length > 0 && (
        <>
          <SectionHeading>Technical Skills</SectionHeading>
          <div className="space-y-1">
            {skills.map((skill, index) => (
              <p
                key={index}
                className="text-xs sm:text-sm text-gray-800 break-words"
              >
                {filled(skill.label) ? (
                  <b className="text-gray-900">{skill.label}: </b>
                ) : null}
                {skill.value}
              </p>
            ))}
          </div>
        </>
      )}

      {languages.length > 0 && (
        <>
          <SectionHeading>Languages</SectionHeading>
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-800">
            {languages.map((lang, index) => (
              <span key={index} className="lang-item">
                <b>{lang.name}</b>
                {filled(lang.level) ? `: ${lang.level}` : ""}
              </span>
            ))}
          </p>
        </>
      )}
    </main>
  );
}
