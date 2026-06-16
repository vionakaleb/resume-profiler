import { normalizeUrl } from "../../../lib/exportPdf";
import { filled } from "../../../lib/exportPdf.jsx";

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
              {data?.name || "here"}
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
            {filled(data.projects) && (
              <a
                href="#projects"
                className="rounded-xl bg-slate-700/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Projects
              </a>
            )}
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