export default function Features() {
  const items = [
    { title: "Ready-made templates", desc: "NDA, Freelance Contracts, Licensing — curated for creators." },
    { title: "Customizable fields", desc: "Replace placeholders for client, dates, payment terms and more." },
    { title: "Instant PDF", desc: "Server-side PDF generation and one-click download." },
    { title: "Document history", desc: "Track previously generated documents in your dashboard." },
  ];

  return (
    <section className="mt-12 grid gap-6 sm:grid-cols-2">
      {items.map((it) => (
        <div key={it.title} className="sleek-panel p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/20">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-sm font-semibold text-white shadow-lg shadow-[0_10px_24px_rgba(59,130,246,0.25)]">{it.title[0]}</div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{it.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{it.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
