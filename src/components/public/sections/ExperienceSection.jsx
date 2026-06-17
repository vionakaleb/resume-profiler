import { BriefcaseIcon } from "../icons.jsx";
import { SECTION_CLASS, WRAP_CLASS, HEADING_CLASS } from "./helpers.js";
import { Timeline } from "./Timeline.jsx";

export function ExperienceSection({ data }) {
  if (!Array.isArray(data.experience) || data.experience.length === 0)
    return null;
  return (
    <section id="experience" className={SECTION_CLASS}>
      <div className={WRAP_CLASS}>
        <h2 className={HEADING_CLASS}>Career Experience</h2>
        <Timeline items={data.experience} IconComponent={BriefcaseIcon} />
      </div>
    </section>
  );
}
