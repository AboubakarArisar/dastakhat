import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <span className="inline-flex rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">Smart legal docs</span>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Create professional legal documents in seconds</h1>
        <p className="mt-4 text-lg text-muted">NDAs, contracts, and licensing templates tailored for freelancers and creators. Fill placeholders, preview, and download PDF instantly.</p>
        <div className="flex gap-3 mt-6">
          <a href="/create" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600">Get started</a>
          <a href="/product" className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-900/40 px-5 py-3 text-sm font-medium text-foreground transition hover:bg-slate-800/70">Learn more</a>
        </div>
      </div>
      <div className="hidden h-56 w-80 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/85 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/15 sm:block">
        <Image
          src="/hero.png"
          alt="Laptop showing document creation interface"
          width={640}
          height={448}
          className="h-full w-full object-cover"
          priority
        />
      </div>
    </section>
  );
}
