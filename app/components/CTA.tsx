export default function CTA() {
  return (
    <section className="mt-12 rounded-2xl border border-white/10 bg-slate-900/85 p-6 shadow-xl shadow-black/20 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Start generating legal documents</h3>
          <p className="text-muted">Simple, fast, and free — fill placeholders, preview, and download PDFs in seconds.</p>
        </div>
        <div className="flex gap-3">
          <a href="/create" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600">Get Started</a>
          <a href="/product" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-900/40 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-slate-800/70">Learn More</a>
        </div>
      </div>
    </section>
  );
}
