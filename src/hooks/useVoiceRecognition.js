import { useState, useRef, useCallback } from "react";

const SCORE_COMMANDS = [
  "score my resume",
  "score my cv",
  "score resume",
  "score cv",
];

function detectScoreCommand(text) {
  const normalized = text.toLowerCase().trim();
  for (const cmd of SCORE_COMMANDS) {
    if (normalized.includes(cmd)) return cmd;
  }
  return null;
}

function stripCommand(text, command) {
  const index = text.toLowerCase().indexOf(command);
  if (index === -1) return text.trim();
  const before = text.slice(0, index).trim();
  const after = text.slice(index + command.length).trim();
  return [before, after].filter(Boolean).join(" ");
}

function createSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return null;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  return recognition;
}

export function useVoiceRecognition({ onTextChange, onScoreCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported] = useState(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const recognitionRef = useRef(null);
  const preExistingTextRef = useRef("");

  const startListening = useCallback(
    (existingText) => {
      if (!isSupported) return;

      const recognition = createSpeechRecognition();
      if (!recognition) return;

      recognitionRef.current = recognition;
      preExistingTextRef.current = existingText || "";

      recognition.onresult = (event) => {
        let finalPart = "";
        let interimPart = "";

        for (let i = 0; i < event.results.length; i++) {
          const segment = event.results[i];
          if (segment.isFinal) {
            finalPart += segment[0].transcript;
          } else {
            interimPart += segment[0].transcript;
          }
        }

        setInterimText(interimPart);

        const spokenSoFar = finalPart + interimPart;
        const command = detectScoreCommand(spokenSoFar);

        if (command) {
          recognition.stop();
          const cleanSpoken = stripCommand(finalPart, command);
          const merged = mergeText(preExistingTextRef.current, cleanSpoken);
          onTextChange?.(merged);
          onScoreCommand?.(merged);
          return;
        }

        const merged = mergeText(preExistingTextRef.current, finalPart);
        onTextChange?.(merged + (interimPart ? " " + interimPart : ""));
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimText("");
      };

      recognition.onerror = (event) => {
        if (event.error !== "aborted") {
          console.error("Speech recognition error:", event.error);
        }
        setIsListening(false);
        setInterimText("");
      };

      recognition.start();
      setIsListening(true);
    },
    [isSupported, onTextChange, onScoreCommand],
  );

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(
    (existingText) => {
      if (isListening) {
        stopListening();
      } else {
        startListening(existingText);
      }
    },
    [isListening, startListening, stopListening],
  );

  return {
    isListening,
    interimText,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}

function mergeText(existing, spoken) {
  if (!existing) return spoken.trim();
  if (!spoken) return existing.trim();
  const separator = existing.endsWith("\n") ? "" : "\n";
  return existing.trim() + separator + spoken.trim();
}
