function formatVoiceLabel(voice) {
  const shortLang = voice.lang.replace(/-.*/, "").toUpperCase();
  const qualityTag = getQualityTag(voice);
  const base = voice.name.replace(/\s*\(.*?\)\s*/g, " ").trim();
  return `${base} (${shortLang})${qualityTag ? ` ${qualityTag}` : ""}`;
}

function getQualityTag(voice) {
  const name = voice.name.toLowerCase();
  if (name.includes("natural") || name.includes("neural")) return "★★★";
  if (name.includes("enhanced") || name.includes("premium")) return "★★";
  if (name.includes("online") || !voice.localService) return "★";
  return "";
}

export default function VoicePicker({
  voices,
  selectedVoiceName,
  onSelect,
  onPreview,
  isSpeaking,
}) {
  if (voices.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <select
        value={selectedVoiceName}
        onChange={(event) => onSelect(event.target.value)}
        className="input-base flex-1 py-1.5 text-xs"
      >
        {voices.map((voice) => (
          <option key={voice.name} value={voice.name}>
            {formatVoiceLabel(voice)}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={() => onPreview(selectedVoiceName)}
        disabled={isSpeaking}
        title="Preview this voice"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full
          bg-slate-100 text-slate-500 transition-colors
          hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50
          dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-3.5 w-3.5"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    </div>
  );
}
