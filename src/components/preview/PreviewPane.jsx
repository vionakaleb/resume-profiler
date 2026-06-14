import ResumePage from "./ResumePage.jsx";

export default function PreviewPane({ data }) {
  return (
    <div className="flex-1 overflow-auto bg-slate-200/70 p-6 dark:bg-slate-900/60">
      <div className="resume-print mx-auto w-fit">
        <ResumePage data={data} />
      </div>
    </div>
  );
}
