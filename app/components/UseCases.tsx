// Honest social-proof substitute (no fake company logos): who it's for.
export default function UseCases() {
  const items = ["Freelancers", "Designers", "Agencies", "Consultants", "Photographers", "Developers"];
  return (
    <div className="border-y border-white/8 py-8">
      <p className="text-center text-xs uppercase tracking-[0.18em] text-muted">Built for the people who send their own contracts</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {items.map((it) => (
          <span key={it} className="text-lg font-semibold text-foreground/40 transition hover:text-foreground/70">
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
