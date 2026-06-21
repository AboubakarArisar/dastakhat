function Check() {
  return (
    <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M4 10.5l3.5 3.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Pricing() {
  const freeFeatures = [
    "All document templates",
    "Custom Markdown documents",
    "Unlimited PDF generation",
    "Hand-drawn signatures",
    "Document library & history",
    "Email delivery",
  ];

  const proFeatures = [
    "Everything in Free",
    "Multi-party signing & invites",
    "Audit trail & signed certificates",
    "Reusable saved templates",
    "Team workspaces",
    "Priority support",
  ];

  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Pricing</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Simple pricing. Free to start.</h2>
        <p className="mt-3 text-muted">
          Dastakhat is completely free to use. Paid plans with team features are on the way.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        {/* Free plan */}
        <div className="ring-gradient glass-card relative flex flex-col p-8">
          <div className="absolute right-6 top-6">
            <span className="badge badge-signed">Available now</span>
          </div>
          <h3 className="text-lg font-semibold">Free</h3>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-5xl font-bold">$0</span>
            <span className="mb-1.5 text-muted">/ forever free</span>
          </div>
          <p className="mt-2 text-sm text-muted">Everything you need to create and sign documents solo.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {freeFeatures.map((f) => (
              <li key={f} className="flex gap-2.5 text-foreground/90"><Check />{f}</li>
            ))}
          </ul>
          <a href="/create" className="btn-primary mt-8 w-full">Start for free</a>
        </div>

        {/* Pro plan (coming soon) */}
        <div className="glass-card relative flex flex-col p-8 opacity-90">
          <div className="absolute right-6 top-6">
            <span className="badge badge-draft">Coming soon</span>
          </div>
          <h3 className="text-lg font-semibold">Pro</h3>
          <div className="mt-3 flex items-end gap-1">
            <span className="text-5xl font-bold text-muted">$—</span>
            <span className="mb-1.5 text-muted">/ month</span>
          </div>
          <p className="mt-2 text-sm text-muted">For teams and multi-party signing workflows.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {proFeatures.map((f) => (
              <li key={f} className="flex gap-2.5 text-muted"><Check />{f}</li>
            ))}
          </ul>
          <button disabled aria-disabled="true" className="btn-secondary mt-8 w-full">Notify me</button>
        </div>
      </div>
    </div>
  );
}
