import { filled } from "../../../lib/exportPdf.jsx";

export function ListCard({ entry }) {
  const lines = [entry.title, entry.org, entry.dates, entry.location].filter(
    filled,
  );
  const heading = lines.shift() || "";
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-5">
      <p className="text-base font-semibold text-white">{heading}</p>
      {lines.length > 0 && (
        <p className="mt-1 text-sm text-slate-400">{lines.join(" • ")}</p>
      )}
      {Array.isArray(entry.bullets) &&
        entry.bullets.filter(filled).length > 0 && (
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
