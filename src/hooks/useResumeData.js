import { useState, useEffect, useCallback } from "react";
import { initialData } from "../data/initialData.js";
import { saveResume, loadResume, clearResume } from "../lib/resumeStorage.js";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function withDefaults(value) {
  if (!value || typeof value !== "object") return clone(initialData);
  return {
    ...initialData,
    ...value,
    experience: Array.isArray(value.experience) ? value.experience : [],
    education: Array.isArray(value.education) ? value.education : [],
    certifications: Array.isArray(value.certifications) ? value.certifications : [],
    achievements: Array.isArray(value.achievements) ? value.achievements : [],
    projects: Array.isArray(value.projects) ? value.projects : [],
    skills: Array.isArray(value.skills) ? value.skills : [],
    languages: Array.isArray(value.languages) ? value.languages : [],
  };
}

export function useResumeData() {
  const [data, setData] = useState(() => {
    const saved = loadResume();
    return withDefaults(saved || initialData);
  });

  useEffect(() => {
    saveResume(data);
  }, [data]);

  const update = useCallback((updater) => {
    setData((current) => {
      const draft = clone(current);
      updater(draft);
      return draft;
    });
  }, []);

  const importParsed = (parsed) => {
    setData((current) => withDefaults({ ...current, ...parsed }));
  };

  const loadJson = (parsed) => {
    setData(withDefaults(parsed));
  };

  const resetData = () => {
    clearResume();
    setData(clone(initialData));
  };

  return { data, update, importParsed, loadJson, resetData };
}
