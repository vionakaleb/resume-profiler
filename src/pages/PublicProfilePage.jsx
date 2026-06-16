import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as resumesApi from "../api/resumes.js";
import PublicNav from "../components/public/PublicNav.jsx";
import { HomeSection } from "../components/public/sections/HomeSection.jsx";
import { AboutSection } from "../components/public/sections/AboutSection.jsx";
import { ExperienceSection } from "../components/public/sections/ExperienceSection.jsx";
import { EducationSection } from "../components/public/sections/EducationSection.jsx";
import { CertificationsSection } from "../components/public/sections/CertificationsSection.jsx";
import { ProjectsSection } from "../components/public/sections/ProjectsSection.jsx";
import { SkillsSection } from "../components/public/sections/SkillsSection.jsx";
import { ContactSection } from "../components/public/sections/ContactSection.jsx";

function normalizeUrl(url) {
  if (!url) return null;
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

function activeSections(data) {
  const list = ["home", "about"];
  if (data.experience?.length) list.push("experience");
  if (data.education?.length) list.push("education");
  if (data.certifications?.length || data.achievements?.length)
    list.push("certifications");
  if (data.projects?.length) list.push("projects");
  if (data.skills?.length || data.languages?.length) list.push("skills");
  list.push("contact");
  return list;
}

export default function PublicProfilePage() {
  const { username } = useParams();
  const [state, setState] = useState({
    status: "loading",
    data: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", data: null, error: null });

    (async () => {
      try {
        const result = await resumesApi.getPublicResume(username);
        if (cancelled) return;
        const content = result?.content || result;
        setState({ status: "ready", data: content, error: null });
      } catch (error) {
        if (cancelled) return;
        setState({
          status: error.status === 404 ? "not_found" : "error",
          data: null,
          error: error.message || "Could not load profile.",
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  useEffect(() => {
    document.documentElement.classList.add("public-profile-root");
    return () => {
      document.documentElement.classList.remove("public-profile-root");
    };
  }, []);

  if (state.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading profile...
      </div>
    );
  }

  if (state.status === "not_found") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-300">
        <h1 className="text-3xl font-extrabold text-white">
          Profile not found
        </h1>
        <p className="mt-3 text-sm text-slate-400">
          No public profile for "{username}". Check the link or ask the owner to
          share again.
        </p>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-300">
        <h1 className="text-3xl font-extrabold text-white">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm text-slate-400">{state.error}</p>
      </div>
    );
  }

  const {
    data: { resume_content: data },
  } = state;
  const cvUrl = normalizeUrl(data.website);
  const sections = activeSections(data);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <PublicNav name={data.name || username} sections={sections} />
      <main>
        <HomeSection data={data} />
        <AboutSection data={data} />
        <ExperienceSection data={data} />
        <EducationSection data={data} />
        <CertificationsSection data={data} />
        <ProjectsSection data={data} />
        <SkillsSection data={data} />
        <ContactSection data={data} cvUrl={cvUrl} />
      </main>

      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-4">
          <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} - {data.name || username}
          </p>
          <p>
            <a
              href="https://viona-kaleb.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
            >
              Generated with Viona's Resume Builder
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
