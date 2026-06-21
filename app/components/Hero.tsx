import ProductMockup from "./ProductMockup";

export default function Hero() {
  return (
    <section className="relative grid grid-cols-1 items-center gap-14 py-16 lg:grid-cols-2 lg:py-24">
      <div className="relative z-10 max-w-2xl">
        <span className="pill animate-fade-up">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          E-signatures for freelancers &amp; creators
        </span>
        <h1 className="animate-fade-up delay-1 mt-6 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
          Send a contract.<br />Get it <span className="gradient-text">signed.</span>
        </h1>
        <p className="animate-fade-up delay-2 mt-6 text-lg leading-relaxed text-muted">
          Create an NDA, freelance contract, or licensing agreement, sign your part, and share a link.
          Your client signs theirs — and everyone gets a polished, completed PDF.
        </p>
        <div className="animate-fade-up delay-3 mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="/create" className="btn-primary">
            Create a document
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="/#how" className="btn-secondary">See how it works</a>
        </div>
        <div className="animate-fade-up delay-4 mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
          <span className="inline-flex items-center gap-2"><Check /> Free to use</span>
          <span className="inline-flex items-center gap-2"><Check /> No credit card</span>
          <span className="inline-flex items-center gap-2"><Check /> No account to sign</span>
        </div>
      </div>

      <div className="relative z-10 animate-fade-up delay-2">
        <ProductMockup />
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-success" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 10.5l3.5 3.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
