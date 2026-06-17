import { BadgeCheckIcon, AwardIcon } from "../icons.jsx";
import { SECTION_CLASS, WRAP_CLASS, HEADING_CLASS } from "./helpers.js";
import { ListCard } from "./ListCard.jsx";

export function CertificationsSection({ data }) {
  const certs = Array.isArray(data.certifications) ? data.certifications : [];
  const awards = Array.isArray(data.achievements) ? data.achievements : [];
  if (certs.length === 0 && awards.length === 0) return null;

  return (
    <section id="certifications" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Certifications & Awards</h2>

        <div className="grid gap-10 md:grid-cols-2">
          {certs.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <BadgeCheckIcon className="h-7 w-7 text-indigo-400" />
                <h3 className="text-2xl font-extrabold text-white">
                  Certifications
                </h3>
              </div>
              <div className="space-y-3">
                {certs.map((cert, index) => (
                  <ListCard key={index} entry={cert} />
                ))}
              </div>
            </div>
          )}

          {awards.length > 0 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <AwardIcon className="h-7 w-7 text-indigo-400" />
                <h3 className="text-2xl font-extrabold text-white">
                  Honors & Awards
                </h3>
              </div>
              <div className="space-y-3">
                {awards.map((item, index) => (
                  <ListCard key={index} entry={item} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
