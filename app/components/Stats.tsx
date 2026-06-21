export default function Stats() {
  const stats = [
    { value: "3", label: "Ready-made templates" },
    { value: "<60s", label: "Blank to signed PDF" },
    { value: "2", label: "Parties, each signing their own" },
    { value: "$0", label: "Free to use" },
  ];

  return (
    <div className="glass-card grid grid-cols-2 divide-white/8 p-2 sm:grid-cols-4 sm:divide-x">
      {stats.map((sItem) => (
        <div key={sItem.label} className="px-6 py-6 text-center">
          <div className="text-3xl font-bold gradient-text sm:text-4xl">{sItem.value}</div>
          <div className="mt-1 text-sm text-muted">{sItem.label}</div>
        </div>
      ))}
    </div>
  );
}
