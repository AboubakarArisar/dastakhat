export default function Hero() {
  return (
    <section className="flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Create professional legal documents in seconds</h1>
        <p className="text-lg text-muted mt-3">NDAs, contracts, and licensing templates tailored for freelancers and creators. Fill placeholders, preview, and download PDF instantly.</p>
        <div className="flex gap-3 mt-6">
          <a href="/create" className="inline-block rounded bg-primary px-5 py-3 text-black font-medium">Get started</a>
          <a href="/product" className="inline-block rounded border border-surface/50 px-4 py-3 text-foreground">Learn more</a>
        </div>
      </div>
      <div className="hidden sm:block w-80 h-56 rounded-lg bg-gradient-to-br from-surface to-card flex items-center justify-center text-muted">
        <div className="text-center px-4">Illustration<br/>Placeholder</div>
      </div>
    </section>
  );
}
