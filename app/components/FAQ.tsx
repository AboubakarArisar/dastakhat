const faqs = [
  {
    q: "Is Dastakhat really free?",
    a: "Yes. Every feature — templates, custom documents, signatures, PDF generation, and email delivery — is completely free with no credit card required. Paid team plans will come later.",
  },
  {
    q: "Are the signatures legally binding?",
    a: "Dastakhat captures a hand-drawn signature and embeds it into the final PDF, the same way many e-sign tools do. For high-stakes agreements always confirm the requirements in your jurisdiction.",
  },
  {
    q: "What document types are supported?",
    a: "Out of the box you get NDAs, freelance contracts, and licensing agreements. You can also write a fully custom document in Markdown and generate a PDF from it.",
  },
  {
    q: "Where are my documents stored?",
    a: "Generated documents are saved under Documents so you can re-download or email them later. You can delete any document at any time.",
  },
  {
    q: "Can I send a document to a client?",
    a: "Yes — from the Documents page you can email any completed PDF directly to a recipient without leaving the app.",
  },
];

export default function FAQ() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
      </div>

      <div className="mt-10 space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="glass-card group p-5 [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-medium text-foreground">
              {f.q}
              <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
