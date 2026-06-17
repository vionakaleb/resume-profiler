import { MapPinIcon } from "../icons.jsx";
import { SECTION_CLASS, WRAP_CLASS, HEADING_CLASS } from "./helpers.js";
import { filled } from "../../../lib/exportPdf.jsx";

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
            <h3 className="mt-6 text-xl font-extrabold text-white">
              {data.name}
            </h3>
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
