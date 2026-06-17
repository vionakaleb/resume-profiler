import { MailIcon } from "../icons.jsx";
import { SECTION_CLASS, WRAP_CLASS, HEADING_CLASS } from "./helpers.js";
import { filled } from "../../../lib/exportPdf.jsx";

export function ContactSection({ data, cvUrl }) {
  const subject = encodeURIComponent(`Hello ${data.name || "there"}`);

  return (
    <section id="contact" className={SECTION_CLASS}>
      <div className={`${WRAP_CLASS} text-center`}>
        <h2 className={HEADING_CLASS}>Get In Touch</h2>

        {cvUrl && (
          <a
            href={cvUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-700/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Visit Website
          </a>
        )}

        <p className="mt-10 text-lg text-slate-300">
          I'm currently open to new opportunities.
        </p>
        <p className="text-lg text-slate-300">Feel free to reach me out!</p>

        {filled(data.email) && (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-left">
            <div className="mb-6 flex items-center gap-3">
              <MailIcon className="h-6 w-6 text-white" />
              <h3 className="text-xl font-extrabold text-white">
                Send me an email
              </h3>
            </div>

            <ContactForm email={data.email} subject={subject} />
          </div>
        )}
      </div>
    </section>
  );
}

function ContactForm({ email, subject }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const subjectLine = formData.get("subject") || subject;
    const body = formData.get("message") || "";
    const url = `mailto:${email}?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="subject"
        type="text"
        placeholder="Subject"
        className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
      />
      <textarea
        name="message"
        rows={5}
        placeholder="Message"
        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 focus:outline-none"
      />
      <button
        type="submit"
        className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition hover:bg-indigo-600"
      >
        Send Email
      </button>
    </form>
  );
}
