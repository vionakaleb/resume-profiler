import { filled } from "../../../lib/exportPdf.jsx";

function TimelineCard({ entry, side }) {
  return (
    <div
      className={`rounded-xl border border-gray-700 bg-gray-800 p-4 text-left shadow-xl transition-transform duration-300 hover:scale-[1.02] hover:shadow-indigo-500/20`}
    >
      <div className="flex gap-4 items-center">
        {entry.logo && (
          <img
            src={`/images/${entry.logo}`}
            alt={entry.org || entry.title}
            className="h-16 w-16 rounded-md"
          />
        )}
        <div>
          <h3 className="text-xl font-bold text-white">
            {entry.org || entry.title}
          </h3>
          {entry.org && entry.title && (
            <p className="text-gray-400">{entry.title}</p>
          )}
          {filled(entry.dates) && (
            <p className="text-indigo-400 font-medium text-sm mt-1">
              {entry.dates}
            </p>
          )}
          {filled(entry.location) && (
            <p className="text-xs text-gray-500 mt-0.5">{entry.location}</p>
          )}
        </div>
      </div>

      {Array.isArray(entry.bullets) &&
        entry.bullets.filter(filled).length > 0 && (
          <ul className="list-disc list-inside space-y-1 mt-3 text-gray-300 text-sm leading-relaxed">
            {entry.bullets.filter(filled).map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}
    </div>
  );
}

export function Timeline({ items, IconComponent }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 h-full w-px bg-gray-700 md:left-1/2" />

      {items.map((entry, index) => {
        const isOdd = index % 2 !== 0;

        return (
          <div
            key={index}
            className={`relative mb-12 flex items-center w-full ${
              isOdd ? "justify-start" : "justify-end"
            }`}
          >
            <div className="absolute left-1/2 -ml-5 w-10 h-10 bg-indigo-600 rounded-full border-4 border-gray-900 flex items-center justify-center shadow-lg z-10 hidden md:flex">
              <IconComponent className="h-5 w-5 text-white" />
            </div>

            <div
              className={`md:w-5/12 w-full ${
                isOdd ? "ml-auto md:mr-12" : "mr-auto md:ml-12"
              }`}
            >
              <TimelineCard entry={entry} side={isOdd ? "left" : "right"} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
