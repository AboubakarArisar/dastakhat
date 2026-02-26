export default function Promo() {
  const previews = [
    { title: "NDA sample", desc: "Small excerpt of an NDA", bg: "bg-gray-50" },
    { title: "Contract sample", desc: "Payment terms and timeline", bg: "bg-gray-50" },
    { title: "License sample", desc: "Usage rights preview", bg: "bg-gray-50" },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Template previews</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {previews.map((p) => (
          <div key={p.title} className={`rounded border p-4 ${p.bg}`}>
            <div className="h-36 w-full rounded bg-white border border-dashed flex items-center justify-center text-gray-400">Screenshot</div>
            <h3 className="font-medium mt-3">{p.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
