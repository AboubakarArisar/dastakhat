export default function CTA() {
  return (
    <section className="mt-12 rounded-lg p-6 bg-surface border border-surface/60">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Start generating legal documents</h3>
          <p className="text-muted">Simple, fast, and free — fill placeholders, preview, and download PDFs in seconds.</p>
        </div>
        <div className="flex gap-3">
          <a href="/create" className="inline-block rounded bg-primary px-4 py-2 text-black">Get Started</a>
          <a href="/product" className="inline-block rounded border border-surface/50 px-4 py-2 text-muted">Learn More</a>
        </div>
      </div>
    </section>
  );
}
