import { useState, useRef, useCallback } from "react";

const SCORE_COMMANDS = [
  "score my resume",
  "score my cv",
  "score resume",
  "score cv",
];

function isScoreCommand(transcript) {
  const normalized = transcript.toLowerCase().trim();
  return SCORE_COMMANDS.some((cmd) => normalized.includes(cmd));
}

function extractJobDescription(transcript) {
  const normalized = transcript.toLowerCase().trim();
  for (const cmd of SCORE_COMMANDS) {
    const commandIndex = normalized.indexOf(cmd);
    if (commandIndex !== -1) {
      const beforeCommand = transcript.slice(0, commandIndex).trim();
      const afterCommand = transcript.slice(commandIndex + cmd.length).trim();
      return beforeCommand || afterCommand;
    }
  }
  return transcript.trim();
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

export function useVoiceRecognition({ onTranscript, onScoreCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isSupported] = useState(
    () => !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  );
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef("");

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognitionRef.current = recognition;
    finalTranscriptRef.current = "";

    recognition.onresult = (event) => {
      let finalText = "";
      let interimPart = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimPart += result[0].transcript;
        }
      }

      finalTranscriptRef.current = finalText;
      setInterimText(interimPart);

      const fullTranscript = finalText + interimPart;
      if (isScoreCommand(fullTranscript)) {
        recognition.stop();
        const jobText = extractJobDescription(finalText);
        onScoreCommand?.(jobText);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
      const transcript = finalTranscriptRef.current.trim();
      if (transcript) {
        onTranscript?.(transcript);
      }
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
  }, [isSupported, onTranscript, onScoreCommand]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    interimText,
    isSupported,
    startListening,
    stopListening,
    toggleListening,
  };
}
