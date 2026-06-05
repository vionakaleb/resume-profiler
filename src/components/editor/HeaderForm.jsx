import Section from "../ui/Section.jsx";
import { TextField } from "../ui/Field.jsx";

export default function HeaderForm({ data, update }) {
  const set = (field) => (value) =>
    update((draft) => {
      draft[field] = value;
    });

  return (
    <Section title="Header & Contact">
      <TextField label="Full name" value={data.name} onChange={set("name")} />
      <TextField
        label="Headline / target role"
        value={data.headline}
        onChange={set("headline")}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TextField
          label="Location"
          value={data.location}
          onChange={set("location")}
        />
        <TextField label="Phone" value={data.phone} onChange={set("phone")} />
        <TextField label="Email" value={data.email} onChange={set("email")} />
        <TextField
          label="LinkedIn"
          value={data.linkedin}
          onChange={set("linkedin")}
        />
      </div>
      <TextField
        label="Website / Portfolio"
        value={data.website}
        onChange={set("website")}
      />
    </Section>
  );
}
