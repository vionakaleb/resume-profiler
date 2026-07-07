export default function MicButton({ isListening, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={isListening ? "Stop listening" : "Start voice input"}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors
        disabled:cursor-not-allowed disabled:opacity-50
        ${
          isListening
            ? "bg-rose-500 text-white hover:bg-rose-600"
            : "bg-brand-50 text-brand-600 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
        }`}
    >
      {isListening && (
        <span className="absolute inset-0 animate-ping rounded-full bg-rose-400 opacity-30" />
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative h-5 w-5"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    </button>
  );
}
