import { useState } from "react";
import Toolbar from "./components/Toolbar.jsx";
import Editor from "./components/editor/Editor.jsx";
import PreviewPane from "./components/preview/PreviewPane.jsx";
import JobMatchPanel from "./components/jobmatch/JobMatchPanel.jsx";
import { useTheme } from "./hooks/useTheme.js";
import { useResumeData } from "./hooks/useResumeData.js";

const TABS = [
  { id: "edit", label: "Edit" },
  { id: "preview", label: "Preview" },
];

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { data, update, importParsed, loadJson } = useResumeData();
  const [tab, setTab] = useState("edit");

  return (
    <div className="app-bg flex h-screen flex-col">
      <Toolbar
        data={data}
        theme={theme}
        onToggleTheme={toggleTheme}
        onImport={importParsed}
        onLoadJson={loadJson}
      />

      <nav className="no-print flex gap-1 border-b border-slate-200 bg-white px-3 py-2 lg:hidden dark:border-slate-800 dark:bg-slate-900">
        {TABS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
              tab === item.id
                ? "bg-brand-400 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main className="flex min-h-0 flex-1">
        <section
          className={`thin-scroll w-full overflow-auto border-r border-slate-200 bg-slate-50 p-4
            lg:block lg:w-[420px] lg:shrink-0 dark:border-slate-800 dark:bg-slate-900/40
            ${tab === "edit" ? "block" : "hidden"}`}
        >
          <Editor data={data} update={update} />
          <JobMatchPanel data={data} />

          <div className="mx-auto max-w-7xl px-6 pb-10 pt-4">
            <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              © Viona Z. A. Kaleb
            </p>
            <p>
              <a
                href="https://viona-kaleb.vercel.app/"
                target="_blank"
                className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
              >
                https://viona-kaleb.vercel.app/
              </a>
            </p>
          </div>
        </section>

        <section
          className={`min-w-0 flex-1 lg:flex ${tab === "preview" ? "flex" : "hidden lg:flex"}`}
        >
          <PreviewPane data={data} />
        </section>
      </main>
    </div>
  );
}
