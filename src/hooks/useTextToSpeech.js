import { useState, useCallback, useRef } from "react";

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

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const speak = useCallback((text) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.lang = "en-US";
    utteranceRef.current = utterance;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

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

  return { isSpeaking, speak, speakResult, stopSpeaking };
}
