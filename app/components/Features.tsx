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
        <div key={it.title} className="border rounded p-6">
          <h3 className="font-medium text-lg">{it.title}</h3>
          <p className="text-gray-600 mt-2">{it.desc}</p>
        </div>
      ))}
    </section>
  );
}
