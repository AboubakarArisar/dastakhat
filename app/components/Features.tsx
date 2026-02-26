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
        <div key={it.title} className="rounded-lg p-6 bg-surface border border-surface/60 shadow-sm hover:shadow-md transform hover:-translate-y-1 transition">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-black font-semibold">{it.title[0]}</div>
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
