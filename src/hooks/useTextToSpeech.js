import { useState, useCallback, useRef, useEffect } from "react";

function buildResultNarration(result) {
  if (!result) return "";

  const lines = [];

  lines.push(`Your resume score is ${result.overall} out of 100.`);

  if (result.skillScore != null) {
    lines.push(
      `You matched ${result.matchedSkills.length} out of ${result.totalSkills} hard skills.`,
    );
  }

  lines.push(
    `You matched ${result.matchedKeywords.length} out of ${result.totalKeywords} keywords.`,
  );

  if (result.missingSkills.length > 0) {
    lines.push(`The missing skills are: ${result.missingSkills.join(", ")}.`);
  }

  if (result.missingKeywords.length > 0) {
    lines.push(
      `The missing keywords are: ${result.missingKeywords.join(", ")}.`,
    );
  }

  if (result.overall >= 75) {
    lines.push(
      "Your resume is a strong match. Consider adding the missing items where they genuinely fit your experience.",
    );
  } else if (result.overall >= 50) {
    lines.push(
      "Your resume is a moderate match. Try incorporating more of the missing keywords and skills into your experience descriptions.",
    );
  } else {
    lines.push(
      "Your resume needs improvement for this role. Focus on adding the missing skills and keywords where they truthfully reflect your experience.",
    );
  }

  return lines.join(" ");
}

function isEnglishVoice(voice) {
  return voice.lang.startsWith("en");
}

function scoreVoiceQuality(voice) {
  const name = voice.name.toLowerCase();
  if (name.includes("natural") || name.includes("neural")) return 5;
  if (name.includes("enhanced")) return 4;
  if (name.includes("premium")) return 4;
  if (name.includes("online")) return 3;
  if (voice.localService === false) return 2;
  return 1;
}

function sortVoicesByQuality(voices) {
  return [...voices].sort(
    (a, b) => scoreVoiceQuality(b) - scoreVoiceQuality(a),
  );
}

const STORAGE_KEY = "resume-builder-tts-voice";

function loadSavedVoiceName() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function saveVoiceName(name) {
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    /* storage unavailable */
  }
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] =
    useState(loadSavedVoiceName);
  const utteranceRef = useRef(null);

  useEffect(() => {
    function loadVoices() {
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = sortVoicesByQuality(
        allVoices.filter(isEnglishVoice),
      );
      setAvailableVoices(englishVoices);

      const savedName = loadSavedVoiceName();
      if (savedName && englishVoices.some((v) => v.name === savedName)) return;
      if (englishVoices.length > 0) {
        setSelectedVoiceName(englishVoices[0].name);
      }
    }

    loadVoices();

    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  const selectVoice = useCallback((voiceName) => {
    setSelectedVoiceName(voiceName);
    saveVoiceName(voiceName);
  }, []);

  const speak = useCallback(
    (text) => {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.lang = "en-US";

      const matchedVoice = availableVoices.find(
        (v) => v.name === selectedVoiceName,
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utteranceRef.current = utterance;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [availableVoices, selectedVoiceName],
  );

  const speakResult = useCallback(
    (result) => {
      const narration = buildResultNarration(result);
      speak(narration);
    },
    [speak],
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const previewVoice = useCallback(
    (voiceName) => {
      window.speechSynthesis.cancel();

      const voice = availableVoices.find((v) => v.name === voiceName);
      if (!voice) return;

      const utterance = new SpeechSynthesisUtterance("Test voice");
      utterance.rate = 0.95;
      utterance.pitch = 1;
      utterance.voice = voice;
      utterance.lang = voice.lang;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [availableVoices],
  );

  return {
    isSpeaking,
    speak,
    speakResult,
    stopSpeaking,
    availableVoices,
    selectedVoiceName,
    selectVoice,
    previewVoice,
  };
}
