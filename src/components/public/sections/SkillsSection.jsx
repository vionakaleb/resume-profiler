import { CodeIcon, BoltIcon, GlobeIcon, GitBranchIcon } from "../icons.jsx";
import { SECTION_CLASS, WRAP_CLASS, HEADING_CLASS } from "./helpers.js";
import { filled } from "../../../lib/exportPdf.jsx";

function skillIcon(label) {
  const text = (label || "").toLowerCase();
  if (/typescript|javascript|python|sql|php|kotlin|java/.test(text))
    return BoltIcon;
  if (/react|vue|angular|next|svelte|nuxt|framework/.test(text))
    return CodeIcon;
  if (/firebase|graphql|postgres|mysql|database|api|cloud/.test(text))
    return GlobeIcon;
  if (/git|github|gitlab|version/.test(text)) return GitBranchIcon;
  return CodeIcon;
}

export function SkillsSection({ data }) {
  const skills = Array.isArray(data.skills)
    ? data.skills.filter((skill) => filled(skill?.label))
    : [];
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
