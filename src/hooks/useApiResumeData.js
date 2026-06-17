import { useState, useEffect, useCallback, useRef } from "react";
import { initialData } from "../data/initialData.js";
import * as resumesApi from "../api/resumes.js";

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

const SAVE_DEBOUNCE_MS = 800;

export function useApiResumeData() {
  const [data, setData] = useState(() => clone(initialData));
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const saveTimer = useRef(null);
  const skipNextSave = useRef(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resumes = await resumesApi.listResumes();
        if (cancelled) return;

        if (Array.isArray(resumes) && resumes.length > 0) {
          const first = resumes[0];
          const full = await resumesApi.getResume(first.id);
          if (cancelled) return;
          setResumeId(full.id);
          setData(withDefaults(full.content));
        } else {
          const created = await resumesApi.createResume({
            title: "My Resume",
            content: clone(initialData),
          });
          if (cancelled) return;
          setResumeId(created.id);
          setData(withDefaults(created.content));
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
      } finally {
        if (!cancelled) {
          skipNextSave.current = true;
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading || !resumeId) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("pending");

    saveTimer.current = setTimeout(async () => {
      try {
        setSaveState("saving");
        await resumesApi.updateResume(resumeId, { content: data });
        setSaveState("saved");
      } catch (error) {
        console.error("Failed to save resume:", error);
        setSaveState("error");
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, resumeId, loading]);

  const update = useCallback((updater) => {
    setData((current) => {
      const draft = clone(current);
      updater(draft);
      return draft;
    });
  }, []);

  const importParsed = useCallback((parsed) => {
    setData((current) => withDefaults({ ...current, ...parsed }));
  }, []);

  const loadJson = useCallback((parsed) => {
    setData(withDefaults(parsed));
  }, []);

  const resetData = useCallback(() => {
    setData(clone(initialData));
  }, []);

  return { data, update, importParsed, loadJson, resetData, loading, saveState };
}
