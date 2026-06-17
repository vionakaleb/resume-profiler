import { GraduationIcon } from "../icons.jsx";
import { SECTION_CLASS, WRAP_CLASS, HEADING_CLASS } from "./helpers.js";
import { Timeline } from "./Timeline.jsx";

export function EducationSection({ data }) {
  if (!Array.isArray(data.education) || data.education.length === 0)
    return null;
  return (
    <section id="education" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Education Journey</h2>
        <Timeline items={data.education} IconComponent={GraduationIcon} />
      </div>
    </section>
  );
}
