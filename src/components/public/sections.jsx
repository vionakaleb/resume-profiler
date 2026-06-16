import {
  BriefcaseIcon,
  GraduationIcon,
  BadgeCheckIcon,
  AwardIcon,
  MapPinIcon,
  LinkIcon,
  MailIcon,
  CodeIcon,
  BoltIcon,
  GlobeIcon,
  GitBranchIcon,
} from "./icons.jsx";

const SECTION_CLASS = "scroll-mt-20 px-6 py-20";
const WRAP_CLASS = "mx-auto max-w-6xl";
const HEADING_CLASS = "mb-12 text-center text-4xl font-extrabold text-white";

function normalizeUrl(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function filled(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function HomeSection({ data }) {
  const cvUrl = data.website ? normalizeUrl(data.website) : null;

  return (
    <section id="home" className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),_transparent_50%)]" />

      <div className="relative flex min-h-[80vh] items-center justify-center px-6 py-20">
        <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900/40 px-8 py-16 text-center backdrop-blur-sm">
          <h1 className="text-5xl font-extrabold text-white md:text-6xl">
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
              {data.name || "there"}
            </span>
          </h1>
          {filled(data.headline) && (
            <p className="mt-6 text-lg text-slate-300">{data.headline}</p>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {filled(data.linkedin) && (
              <a
                href={normalizeUrl(data.linkedin)}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-600"
              >
                LinkedIn
              </a>
            )}
            <a
              href="#projects"
              className="rounded-xl bg-slate-700/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Projects
            </a>
            {cvUrl && (
              <a
                href={cvUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl bg-slate-700/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Visit Website
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSection({ data }) {
  return (
    <section id="about" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>About Me</h2>

        <div className="grid items-start gap-10 md:grid-cols-[320px_1fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-center">
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-full border-4 border-indigo-500 bg-slate-800 text-5xl font-extrabold text-slate-400">
              {(data.name || "?")
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0]?.toUpperCase())
                .join("")}
            </div>
            <h3 className="mt-6 text-xl font-extrabold text-white">{data.name}</h3>
            {filled(data.location) && (
              <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-400">
                <MapPinIcon className="h-4 w-4 text-indigo-400" />
                {data.location}
              </p>
            )}
          </div>

          <div className="space-y-6">
            {filled(data.summary) && (
              <p className="whitespace-pre-line text-base leading-relaxed text-slate-300">
                {data.summary}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({ entry, side }) {
  const sideClass =
    side === "left"
      ? "md:col-start-1 md:pr-12 md:text-right"
      : "md:col-start-2 md:pl-12";

  return (
    <div className={`${sideClass} rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-left`}>
      <h3 className="text-lg font-extrabold text-white">{entry.org || entry.title}</h3>
      {entry.org && entry.title && (
        <p className="mt-1 text-sm text-slate-400">{entry.title}</p>
      )}
      {filled(entry.dates) && (
        <p className="mt-2 text-sm font-semibold text-indigo-400">{entry.dates}</p>
      )}
      {filled(entry.location) && (
        <p className="mt-1 text-xs text-slate-500">{entry.location}</p>
      )}
      {Array.isArray(entry.bullets) && entry.bullets.filter(filled).length > 0 && (
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-300">
          {entry.bullets.filter(filled).map((bullet, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-indigo-400">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Timeline({ items, IconComponent }) {
  return (
    <div className="relative md:grid md:grid-cols-2 md:gap-x-0">
      <div className="absolute left-4 top-0 hidden h-full w-px bg-slate-800 md:left-1/2 md:block" />
      <div className="absolute left-4 top-0 h-full w-px bg-slate-800 md:hidden" />

      {items.map((entry, index) => {
        const side = index % 2 === 0 ? "right" : "left";
        return (
          <div
            key={index}
            className="relative grid grid-cols-1 gap-6 py-6 md:grid-cols-2 md:gap-x-0"
          >
            <div className="absolute left-4 top-10 z-10 -translate-x-1/2 md:left-1/2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-500/40">
                <IconComponent className="h-5 w-5" />
              </div>
            </div>
            <div className="pl-12 md:pl-0 md:col-span-2 md:grid md:grid-cols-2 md:gap-x-0">
              <TimelineCard entry={entry} side={side} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ExperienceSection({ data }) {
  if (!Array.isArray(data.experience) || data.experience.length === 0) return null;
  return (
    <section id="experience" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Career Experience</h2>
        <Timeline items={data.experience} IconComponent={BriefcaseIcon} />
      </div>
    </section>
  );
}

export function EducationSection({ data }) {
  if (!Array.isArray(data.education) || data.education.length === 0) return null;
  return (
    <section id="education" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Education Journey</h2>
        <Timeline items={data.education} IconComponent={GraduationIcon} />
      </div>
    </section>
  );
}

function ListCard({ entry }) {
  const lines = [entry.title, entry.org, entry.dates, entry.location].filter(filled);
  const heading = lines.shift() || "";
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-5">
      <p className="text-base font-semibold text-white">{heading}</p>
      {lines.length > 0 && (
        <p className="mt-1 text-sm text-slate-400">{lines.join(" • ")}</p>
      )}
      {Array.isArray(entry.bullets) && entry.bullets.filter(filled).length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-slate-300">
          {entry.bullets.filter(filled).map((bullet, index) => (
            <li key={index} className="flex gap-2">
              <span className="text-indigo-400">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CertificationsSection({ data }) {
  const certs = Array.isArray(data.certifications) ? data.certifications : [];
  const awards = Array.isArray(data.achievements) ? data.achievements : [];
  if (certs.length === 0 && awards.length === 0) return null;

  return (
    <section id="certifications" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Certifications & Awards</h2>

        <div className="grid gap-10 md:grid-cols-2">
          {certs.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <BadgeCheckIcon className="h-7 w-7 text-indigo-400" />
                <h3 className="text-2xl font-extrabold text-white">Certifications</h3>
              </div>
              <div className="space-y-3">
                {certs.map((cert, index) => (
                  <ListCard key={index} entry={cert} />
                ))}
              </div>
            </div>
          )}

          {awards.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <AwardIcon className="h-7 w-7 text-indigo-400" />
                <h3 className="text-2xl font-extrabold text-white">Honors & Awards</h3>
              </div>
              <div className="space-y-3">
                {awards.map((item, index) => (
                  <ListCard key={index} entry={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function projectTechs(entry) {
  const fromBullets = Array.isArray(entry.bullets) ? entry.bullets.filter(filled) : [];
  if (filled(entry.location)) return entry.location.split(/[,•|]/).map((s) => s.trim()).filter(Boolean);
  if (fromBullets.length > 0) return fromBullets[0].split(/[,•|]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

export function ProjectsSection({ data }) {
  if (!Array.isArray(data.projects) || data.projects.length === 0) return null;

  return (
    <section id="projects" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Work & Projects</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.projects.map((project, index) => {
            const techs = projectTechs(project);
            const bullets = Array.isArray(project.bullets)
              ? project.bullets.filter(filled)
              : [];
            const description = bullets[bullets.length > 1 ? 1 : 0] || "";
            const link = bullets.find((line) => /^https?:\/\//i.test(line));

            return (
              <article
                key={index}
                className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40"
              >
                <div className="flex h-44 items-center justify-center bg-gradient-to-br from-indigo-900/40 to-slate-800">
                  <CodeIcon className="h-12 w-12 text-indigo-400/60" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-extrabold text-white">
                    {project.title || project.org || "Untitled project"}
                  </h3>
                  {filled(description) && (
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {description}
                    </p>
                  )}
                  {techs.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {techs.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-indigo-500/40 px-3 py-1 text-xs font-semibold text-indigo-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-auto pt-5">
                    {link && (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                      >
                        <LinkIcon className="h-4 w-4" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function skillIcon(label) {
  const text = (label || "").toLowerCase();
  if (/typescript|javascript|python|sql|php|kotlin|java/.test(text)) return BoltIcon;
  if (/react|vue|angular|next|svelte|nuxt|framework/.test(text)) return CodeIcon;
  if (/firebase|graphql|postgres|mysql|database|api|cloud/.test(text)) return GlobeIcon;
  if (/git|github|gitlab|version/.test(text)) return GitBranchIcon;
  return CodeIcon;
}

export function SkillsSection({ data }) {
  const skills = Array.isArray(data.skills) ? data.skills.filter((skill) => filled(skill?.label)) : [];
  const languages = Array.isArray(data.languages)
    ? data.languages.filter((lang) => filled(lang?.name))
    : [];

  if (skills.length === 0 && languages.length === 0) return null;

  return (
    <section id="skills" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Technologies & Skills</h2>

        {skills.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {skills.map((skill, index) => {
              const Icon = skillIcon(skill.label);
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800">
                      <Icon className="h-6 w-6 text-slate-300" />
                    </div>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-white">
                    {skill.label}
                  </h3>
                  {filled(skill.value) && (
                    <p className="mt-1 text-xs text-slate-400">{skill.value}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {languages.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-6 text-center text-2xl font-extrabold text-white">
              Languages
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {languages.map((lang, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-3 text-center"
                >
                  <p className="font-semibold text-white">{lang.name}</p>
                  {filled(lang.level) && (
                    <p className="mt-1 text-xs text-slate-400">{lang.level}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ContactSection({ data, cvUrl }) {
  const subject = encodeURIComponent(`Hello ${data.name || "there"}`);

  return (
    <section id="contact" className={SECTION_CLASS}>
      <div className={`${WRAP_CLASS} text-center`}>
        <h2 className={HEADING_CLASS}>Get In Touch</h2>

        {cvUrl && (
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Visit Website
          </a>
        )}

        <p className="mt-10 text-lg text-slate-300">
          I'm currently open to new opportunities.
        </p>
        <p className="text-lg text-slate-300">Feel free to reach me out!</p>

        {filled(data.email) && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-left">
            <div className="mb-6 flex items-center gap-3">
              <MailIcon className="h-6 w-6 text-white" />
              <h3 className="text-xl font-extrabold text-white">Send me an email</h3>
            </div>

            <ContactForm email={data.email} subject={subject} />
          </div>
        )}
      </div>
    </section>
  );
}

function ContactForm({ email, subject }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subjectLine = formData.get("subject") || subject;
    const body = formData.get("message") || "";
    const url = `mailto:${email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="subject"
        type="text"
        placeholder="Subject"
        className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
      />
      <textarea
        name="message"
        rows={5}
        placeholder="Message"
        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-600"
      >
        Send Email
      </button>
    </form>
  );
}
