export default function CTA() {
  return (
    <section className="sleek-panel mt-12 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Start generating legal documents</h3>
          <p className="mt-1 text-muted">Simple, fast, and free — fill placeholders, preview, and download PDFs in seconds.</p>
        </div>
        <div className="flex gap-3">
          <a href="/create" className="btn-primary">Get Started</a>
          <a href="/product" className="btn-secondary">Learn More</a>
        </div>
      </div>
    </section>
  );
}
