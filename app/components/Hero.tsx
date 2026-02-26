import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex flex-col gap-10 py-14 sm:flex-row sm:items-center sm:justify-between">
      <div className="max-w-2xl">
        <span className="inline-flex rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">Smart legal docs</span>
        <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">Create professional legal documents in seconds</h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">NDAs, contracts, and licensing templates tailored for freelancers and creators. Fill placeholders, preview, and download PDF instantly.</p>
        <div className="mt-7 flex gap-3">
          <a href="/create" className="btn-primary">Get started</a>
          <a href="/product" className="btn-secondary">Learn more</a>
        </div>
      </div>
      <div className="sleek-panel hidden h-56 w-80 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/20 sm:block">
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
