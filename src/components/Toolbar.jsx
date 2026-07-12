import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button.jsx";
import { parseLinkedInPdf } from "../lib/linkedinParser.js";
import { parseResumePdf } from "../lib/resumePdfParser.js";
import { exportResumePdf } from "../lib/exportPdf.jsx";
import { exportResumeDocx } from "../lib/exportDocx.js";
import { useAuth } from "../auth/AuthContext.jsx";

export default function Toolbar({
  data,
  theme,
  onToggleTheme,
  onImport,
  onLoadJson,
  onReset,
  saveLabel,
  publicUrl,
}) {
  const pdfInput = useRef(null);
  const resumePdfInput = useRef(null);
  const jsonInput = useRef(null);
  const [status, setStatus] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportingDocx, setExportingDocx] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const handlePdf = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    setStatus({ kind: "info", text: "Reading LinkedIn PDF..." });
    try {
      const { parsed, stats } = await parseLinkedInPdf(file);
      onImport(parsed);
      setStatus({
        kind: "ok",
        text: `Imported ${stats.experience} roles, ${stats.education} schools. Please review.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error.message || "Could not read the PDF.",
      });
    }
  };

  const handleResumePdf = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    setStatus({ kind: "info", text: "Reading resume PDF..." });
    try {
      const { parsed, stats } = await parseResumePdf(file);
      onLoadJson(parsed);
      const summary = [
        `${stats.experience} experience`,
        `${stats.education} education`,
        `${stats.certifications} certifications`,
        `${stats.achievements} achievements`,
        `${stats.projects} projects`,
      ].join(", ");
      setStatus({
        kind: "ok",
        text: `Imported ${summary}. Please review.`,
      });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error.message || "Could not read the resume PDF.",
      });
    }
  };

  const handleJson = (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!parsed || typeof parsed !== "object") throw new Error("bad file");
        onLoadJson(parsed);
        setStatus({ kind: "ok", text: "Resume data loaded." });
      } catch {
        setStatus({
          kind: "error",
          text: "That is not a valid resume JSON file.",
        });
      }
    };
    reader.onerror = () =>
      setStatus({ kind: "error", text: "Could not read the file." });
    reader.readAsText(file);
  };

  const handleExport = async () => {
    setExporting(true);
    setStatus({ kind: "info", text: "Generating PDF..." });
    try {
      await exportResumePdf(data, data.name);
      setStatus({ kind: "ok", text: "PDF saved." });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error.message || "Could not generate PDF.",
      });
    } finally {
      setExporting(false);
    }
  };

  const handleExportDocx = async () => {
    setExportingDocx(true);
    setStatus({ kind: "info", text: "Generating DOCX..." });
    try {
      await exportResumeDocx(data);
      setStatus({ kind: "ok", text: "DOCX saved." });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error.message || "Could not generate DOCX.",
      });
    } finally {
      setExportingDocx(false);
    }
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "Reset all resume data to the initial state? This will erase your current edits and cannot be undone.",
    );
    if (!confirmed) return;
    onReset();
    setStatus({ kind: "ok", text: "Resume data reset to initial state." });
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account and all resume data? This cannot be undone.",
    );
    if (!confirmed) return;
    try {
      await deleteAccount();
      navigate("/register", { replace: true });
    } catch (error) {
      setStatus({
        kind: "error",
        text: error.message || "Could not delete account.",
      });
    }
  };

  const handleCopyPublic = () => {
    if (!publicUrl) return;
    navigator.clipboard
      ?.writeText(publicUrl)
      .then(() => setStatus({ kind: "ok", text: "Public URL copied." }))
      .catch(() => setStatus({ kind: "error", text: "Could not copy URL." }));
  };

  const statusColor = {
    ok: "text-emerald-600 dark:text-emerald-400",
    error: "text-rose-600 dark:text-rose-400",
    info: "text-slate-500 dark:text-slate-400",
  };

  return (
    <header className="no-print panel z-10 flex flex-wrap items-center gap-2 border-x-0 border-t-0 px-4 py-3">
      <div className="mr-auto flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400 font-extrabold text-white">
          A
        </div>
        <div className="leading-tight">
          <p className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            ATS Resume Builder
          </p>
          {status ? (
            <p
              className={`text-[11px] font-medium ${statusColor[status.kind]}`}
            >
              {status.text}
            </p>
          ) : saveLabel ? (
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {saveLabel}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-row flex-wrap items-center gap-2">
        <input
          ref={pdfInput}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={handlePdf}
        />
        <input
          ref={resumePdfInput}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={handleResumePdf}
        />
        <input
          ref={jsonInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleJson}
        />

        {publicUrl && (
          <Button
            className="hidden md:inline-flex px-2 py-1 md:px-4 md:py-2"
            variant="subtle"
            onClick={handleCopyPublic}
            title={publicUrl}
          >
            Copy public link
          </Button>
        )}

        <Button
          className="px-2 py-1 md:px-4 md:py-2"
          variant="subtle"
          onClick={() => pdfInput.current?.click()}
        >
          Load LinkedIn
        </Button>
        <Button
          className="px-2 py-1 md:px-4 md:py-2"
          variant="subtle"
          onClick={() => resumePdfInput.current?.click()}
          title="Import a PDF previously exported by this app"
        >
          Import PDF
        </Button>
        <Button
          className="px-2 py-1 md:px-4 md:py-2"
          variant="primary"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? "Generating..." : "Export PDF"}
        </Button>
        <Button
          className="px-2 py-1 md:px-4 md:py-2"
          variant="subtle"
          onClick={handleExportDocx}
          disabled={exportingDocx}
        >
          {exportingDocx ? "Generating..." : "Export DOCX"}
        </Button>
        <Button
          className="px-2 py-1 md:px-4 md:py-2"
          variant="outline"
          onClick={handleReset}
          title="Reset to initial data"
        >
          🔄
        </Button>
        <Button
          className="md:block hidden px-2 py-1 md:px-4 md:py-2"
          variant="outline"
          onClick={onToggleTheme}
          title="Toggle theme"
        >
          {theme === "dark" ? "☀" : "☾"}
        </Button>

        <div className="relative">
          <Button
            className="px-2 py-1 md:px-4 md:py-2"
            variant="outline"
            onClick={() => setMenuOpen((open) => !open)}
            title={user?.email}
          >
            {user?.full_name || user?.email || "Account"}
            <span className="ml-1 text-xs">▾</span>
          </Button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="panel absolute right-0 z-20 mt-1 w-56 rounded-xl p-2 shadow-lg">
                <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400 break-all">
                  {user?.email}
                </p>
                {publicUrl && (
                  <a
                    href={publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    View public page
                  </a>
                )}
                <button
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                >
                  Log out
                </button>
                <button
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  onClick={() => {
                    setMenuOpen(false);
                    handleDeleteAccount();
                  }}
                >
                  Delete account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
