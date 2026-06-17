import { LinkIcon, CodeIcon } from "../icons.jsx";
import { SECTION_CLASS, WRAP_CLASS, HEADING_CLASS } from "./helpers.js";
import { filled } from "../../../lib/exportPdf.jsx";

function projectTechs(entry) {
  const fromBullets = Array.isArray(entry.bullets)
    ? entry.bullets.filter(filled)
    : [];
  if (filled(entry.location))
    return entry.location
      .split(/[,•|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  if (fromBullets.length > 0)
    return fromBullets[0]
      .split(/[,•|]/)
      .map((s) => s.trim())
      .filter(Boolean);
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
