import HeaderForm from "./HeaderForm.jsx";
import SummaryForm from "./SummaryForm.jsx";
import SkillsForm from "./SkillsForm.jsx";
import LanguagesForm from "./LanguagesForm.jsx";
import EntryListForm from "./EntryListForm.jsx";

export default function Editor({ data, update }) {
  return (
    <div>
      <HeaderForm data={data} update={update} />
      <SummaryForm data={data} update={update} />
      <EntryListForm
        title="Experience"
        field="experience"
        orgLabel="Company"
        addLabel="+ Add experience"
        data={data}
        update={update}
      />
      <EntryListForm
        title="Education"
        field="education"
        orgLabel="School"
        addLabel="+ Add education"
        data={data}
        update={update}
      />
      <EntryListForm
        title="Certifications"
        field="certifications"
        orgLabel="Issuer"
        addLabel="+ Add certification"
        data={data}
        update={update}
      />
      <EntryListForm
        title="Achievements"
        field="achievements"
        orgLabel="Issuer"
        addLabel="+ Add achievement"
        data={data}
        update={update}
      />
      <EntryListForm
        title="Projects"
        field="projects"
        orgLabel="Role or Stack"
        addLabel="+ Add project"
        data={data}
        update={update}
      />
      <SkillsForm data={data} update={update} />
      <LanguagesForm data={data} update={update} />
    </div>
  );
}
