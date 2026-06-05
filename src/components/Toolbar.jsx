import { useRef, useState } from "react";
import Button from "./ui/Button.jsx";
import { parseLinkedInPdf } from "../lib/linkedinParser.js";
import { exportResumePdf } from "../lib/exportPdf.jsx";

function downloadFile(name, text, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Toolbar({
  data,
  theme,
  onToggleTheme,
  onImport,
  onLoadJson,
}) {
  const pdfInput = useRef(null);
  const jsonInput = useRef(null);
  const [status, setStatus] = useState(null);
  const [exporting, setExporting] = useState(false);

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
          {status && (
            <p
              className={`text-[11px] font-medium ${statusColor[status.kind]}`}
            >
              {status.text}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-row gap-2">
        <input
          ref={pdfInput}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={handlePdf}
        />
        <input
          ref={jsonInput}
          type="file"
          accept="application/json,.json"
          hidden
          onChange={handleJson}
        />

        <Button variant="subtle" onClick={() => pdfInput.current?.click()}>
          Import LinkedIn PDF
        </Button>
        <Button variant="primary" onClick={handleExport} disabled={exporting}>
          {exporting ? "Generating..." : "Export PDF"}
        </Button>
        <Button variant="outline" onClick={onToggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀" : "☾"}
        </Button>
      </div>
    </header>
  );
}
