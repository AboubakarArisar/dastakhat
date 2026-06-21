export default function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Pick a template",
      desc: "Choose an NDA, freelance contract, or licensing agreement — or start a custom document from scratch.",
    },
    {
      n: "2",
      title: "Fill & sign",
      desc: "Replace placeholders with your details and draw a legally-styled signature right in the browser.",
    },
    {
      n: "3",
      title: "Download or email",
      desc: "Generate a clean, paginated PDF and download it instantly or email it straight to your client.",
    },
  ];

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">How it works</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Three steps to a signed document</h2>
        <p className="mt-3 text-muted">No legal team, no clunky software. Just fill, sign, and send.</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="glass-card p-7 transition-all duration-300 hover:-translate-y-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#60a5fa] text-lg font-bold text-white shadow-lg shadow-[0_10px_24px_rgba(59,130,246,0.3)]">
              {s.n}
            </div>
            <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
