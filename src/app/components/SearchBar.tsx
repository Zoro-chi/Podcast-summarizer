export default function SearchBar({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}) {
  return (
    <input
      type="text"
      placeholder="Search podcasts..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (onEnter && (e.key === "Enter" || e.keyCode === 13)) {
          onEnter();
        }
      }}
      className="rounded-full px-4 py-2 bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all w-full max-w-xs"
    />
  );
}
