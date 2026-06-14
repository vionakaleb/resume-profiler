import { useState } from "react";
import Button from "../ui/Button.jsx";
import { scoreResume } from "../../lib/atsScore.js";
import Section from "../ui/Section.jsx";

function scoreColor(value) {
  if (value >= 75) return "text-emerald-500";
  if (value >= 50) return "text-amber-500";
  return "text-rose-500";
}

function ScoreRing({ value }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          className="stroke-slate-200 dark:stroke-slate-700"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-brand-400 transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold ${scoreColor(value)}`}>
          {value}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          match
        </span>
      </div>
    </div>
  );
}

function ChipGroup({ title, items, tone }) {
  if (!items.length) return null;
  const styles =
    tone === "good"
      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
      : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300";
  return (
    <div>
      <p className="label-base">
        {title} ({items.length})
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function JobMatchPanel({ data }) {
  const [job, setJob] = useState("");
  const [result, setResult] = useState(null);

  const run = () => setResult(scoreResume(data, job));

  return (
    <Section title="Job Description Match" badge={result?.overall}>
      <div className="flex flex-col overflow-auto p-5">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Job Description Match
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Paste a job post to see how your resume lines up. This is a keyword
          coverage estimate, not a real applicant tracking system.
        </p>

        <textarea
          className="input-base mt-3 min-h-[160px] flex-none resize-y leading-relaxed"
          placeholder="Paste the full job description here..."
          value={job}
          onChange={(event) => setJob(event.target.value)}
        />

        <Button
          className="mt-3"
          onClick={run}
          disabled={job.trim().length < 30}
        >
          Score my resume
        </Button>

        {result === null && job.trim().length >= 30 && (
          <p className="mt-3 text-xs text-slate-400">
            Press the button to calculate your match.
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-4">
              <ScoreRing value={result.overall} />
              <div className="space-y-2 text-sm">
                {result.skillScore != null && (
                  <p className="text-slate-600 dark:text-slate-300">
                    Hard skills:{" "}
                    <b className={scoreColor(result.skillScore)}>
                      {result.matchedSkills.length}/{result.totalSkills}
                    </b>
                  </p>
                )}
                <p className="text-slate-600 dark:text-slate-300">
                  Keywords:{" "}
                  <b className={scoreColor(result.keywordScore)}>
                    {result.matchedKeywords.length}/{result.totalKeywords}
                  </b>
                </p>
                <p className="text-xs text-slate-400">
                  Add the missing items below where they truly fit your
                  experience.
                </p>
              </div>
            </div>

            <ChipGroup
              title="Missing skills"
              items={result.missingSkills}
              tone="bad"
            />
            <ChipGroup
              title="Missing keywords"
              items={result.missingKeywords}
              tone="bad"
            />
            <ChipGroup
              title="Matched skills"
              items={result.matchedSkills}
              tone="good"
            />
          </div>
        )}
      </div>
    </Section>
  );
}
