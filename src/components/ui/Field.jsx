export function TextField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      {label && <span className="label-base">{label}</span>}
      <input
        className="input-base"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function TextAreaField({ label, value, onChange, placeholder, rows = 4 }) {
  return (
    <label className="block w-full">
      {label && <span className="label-base">{label}</span>}
      <textarea
        className="input-base resize-y leading-relaxed"
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
