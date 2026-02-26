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
        <div key={it.title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/15">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white">{it.title[0]}</div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{it.title}</h3>
              <p className="text-muted mt-2">{it.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
