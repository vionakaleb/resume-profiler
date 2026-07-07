import { useState, useCallback } from "react";
import Button from "../ui/Button.jsx";
import MicButton from "../ui/MicButton.jsx";
import SpeakerButton from "../ui/SpeakerButton.jsx";
import VoicePicker from "../ui/VoicePicker.jsx";
import { scoreResume } from "../../lib/atsScore.js";
import { useVoiceRecognition } from "../../hooks/useVoiceRecognition.js";
import { useTextToSpeech } from "../../hooks/useTextToSpeech.js";
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

  const {
    isSpeaking,
    speakResult,
    stopSpeaking,
    availableVoices,
    selectedVoiceName,
    selectVoice,
    previewVoice,
  } = useTextToSpeech();

  const runScore = useCallback(
    (jobText) => {
      const textToScore = jobText || job;
      if (textToScore.trim().length < 30) return null;
      const scored = scoreResume(data, textToScore);
      setResult(scored);
      return scored;
    },
    [data, job],
  );

  const handleTextChange = useCallback((newText) => {
    setJob(newText);
  }, []);

  const handleScoreCommand = useCallback(
    (currentText) => {
      if (currentText.trim().length < 30) return;
      const scored = scoreResume(data, currentText);
      setResult(scored);
      speakResult(scored);
    },
    [data, speakResult],
  );

  const { isListening, interimText, isSupported, toggleListening } =
    useVoiceRecognition({
      onTextChange: handleTextChange,
      onScoreCommand: handleScoreCommand,
    });

  const handleMicToggle = () => {
    toggleListening(job);
  };

  const handleReadResult = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakResult(result);
    }
  };

  return (
    <Section title="Job Description Match" badge={result?.overall}>
      <div className="flex flex-col overflow-auto p-5">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          Job Description Match
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          Paste a job post or{" "}
          {isSupported && (
            <span className="font-medium text-brand-600 dark:text-brand-300">
              dictate it by voice
            </span>
          )}
          {isSupported && " "}
          to see how your resume lines up. This is a keyword coverage estimate,
          not a real applicant tracking system.
        </p>

        <div className="relative mt-3">
          <textarea
            className="input-base min-h-[160px] w-full flex-none resize-y pr-12 leading-relaxed"
            placeholder="Paste the full job description here..."
            value={job}
            onChange={(event) => setJob(event.target.value)}
          />
          {isSupported && (
            <div className="absolute right-2 top-2">
              <MicButton isListening={isListening} onClick={handleMicToggle} />
            </div>
          )}
        </div>

        {isListening && (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 dark:bg-brand-500/10">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-500" />
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Listening... Dictate your job description, then say{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-300">
                &quot;Score my resume&quot;
              </span>{" "}
              or{" "}
              <span className="font-semibold text-brand-600 dark:text-brand-300">
                &quot;Score my CV&quot;
              </span>
            </span>
          </div>
        )}

        {interimText && isListening && (
          <p className="mt-1 rounded bg-slate-50 px-2 py-1 text-xs italic text-slate-400 dark:bg-slate-800">
            {interimText}
          </p>
        )}

        <Button
          className="mt-3"
          onClick={() => runScore()}
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

            <div className="space-y-2 flex-col gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <SpeakerButton
                  isSpeaking={isSpeaking}
                  onClick={handleReadResult}
                />
                <span className="text-xs text-slate-600 dark:text-slate-400">
                  {isSpeaking ? "Reading results..." : "Read results aloud"}
                </span>
              </div>
              <VoicePicker
                voices={availableVoices}
                selectedVoiceName={selectedVoiceName}
                onSelect={selectVoice}
                onPreview={previewVoice}
                isSpeaking={isSpeaking}
              />
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
