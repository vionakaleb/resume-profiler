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
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveState, setSaveState] = useState("idle");
  const saveTimer = useRef(null);
  const skipNextSave = useRef(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const resumesList = await resumesApi.listResumes();
        if (cancelled) return;
        setResumes(resumesList);

        if (Array.isArray(resumesList) && resumesList.length > 0) {
          const first = resumesList[0];
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

  const saveResume = useCallback(async () => {
    if (!resumeId) return;
    try {
      setSaveState("saving");
      await resumesApi.updateResume(resumeId, { content: data });
      setSaveState("saved");
    } catch (error) {
      console.error("Failed to save resume:", error);
      setSaveState("error");
    }
  }, [data, resumeId]);

  const switchResume = useCallback(async (id) => {
    try {
      setLoading(true);
      const full = await resumesApi.getResume(id);
      setResumeId(full.id);
      setData(withDefaults(full.content));
    } catch (error) {
      console.error("Failed to switch resume:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const createResume = useCallback(async (isPublic) => {
    try {
      setLoading(true);
      const created = await resumesApi.createResume({
        title: isPublic ? "Public Resume" : "Private Resume",
        content: clone(initialData),
        isPublic,
      });

      // Refresh the resumes list
      const updatedList = await resumesApi.listResumes();
      setResumes(updatedList);

      setResumeId(created.id);
      setData(withDefaults(created.content));
    } catch (error) {
      console.error("Failed to create resume:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  return { data, update, importParsed, loadJson, resetData, loading, saveState, resumes, resumeId, switchResume, saveResume, createResume };
}
