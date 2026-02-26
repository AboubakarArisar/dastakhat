export default function CTA() {
  return (
    <section className="mt-12 bg-white border rounded p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-xl font-medium">Start generating legal documents</h3>
          <p className="text-gray-600">Simple, fast, and free — get started with the templates and download PDFs in seconds.</p>
        </div>
        <div className="flex gap-3">
          <a href="/create" className="inline-block rounded bg-foreground px-4 py-2 text-background">Get Started</a>
          <a href="/product" className="inline-block rounded border px-4 py-2">Learn More</a>
        </div>
      </div>
    </section>
  );
}
