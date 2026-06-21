export default function Features() {
  return (
    <div>
      <div className="mx-auto max-w-2xl text-center">
        <span className="eyebrow">Features</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Everything you need to close the deal</h2>
        <p className="mt-3 text-muted">From first draft to signed PDF — without the clunky enterprise software.</p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {/* Showcase card */}
        <div className="ring-gradient glass-card lg:col-span-2 p-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-accent ring-1 ring-primary/25">
            <IconSign />
          </div>
          <h3 className="mt-5 text-xl font-semibold">True two-party e-signing</h3>
          <p className="mt-2 max-w-lg leading-relaxed text-muted">
            Each party signs only their own block — you during creation, your client from a private link.
            No forging, no confusion, with timestamps recorded for both.
          </p>

          {/* mini flow */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="badge badge-signed">1</span> You sign &amp; send
            </span>
            <Arrow />
            <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="badge badge-sent">2</span> Client signs
            </span>
            <Arrow />
            <span className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="badge badge-signed">3</span> Both get the PDF
            </span>
          </div>
        </div>

        {/* Signatures */}
        <Card icon={<IconPen />} title="Hand-drawn signatures">
          Sign with a mouse, trackpad, or finger. Signatures are embedded straight into the final PDF.
        </Card>

        {/* Templates */}
        <Card icon={<IconDoc />} title="Ready-made templates">
          NDAs, freelance contracts, and licensing agreements — worded for creators, with guided fields.
        </Card>

        {/* PDF */}
        <Card icon={<IconPdf />} title="Instant polished PDFs">
          Clean, paginated, print-ready documents generated server-side in a single click.
        </Card>

        {/* Library + email */}
        <Card icon={<IconLibrary />} title="Library & email delivery">
          Every document is saved with its status. Re-download or email the finished PDF anytime.
        </Card>
      </div>
    </div>
  );
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-accent ring-1 ring-primary/25">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{children}</p>
    </div>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function IconSign() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" {...s}><path d="M3 18c3 0 4-9 6-9s2 6 4 6 2-4 4-4" /><path d="M3 21h18" /></svg>;
}
function IconPen() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" {...s}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
}
function IconDoc() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" {...s}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>;
}
function IconPdf() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" {...s}><path d="M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5" /><path d="M5 17v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" /></svg>;
}
function IconLibrary() {
  return <svg viewBox="0 0 24 24" className="h-5 w-5" {...s}><rect x="3" y="4" width="5" height="16" rx="1" /><rect x="10" y="4" width="5" height="16" rx="1" /><path d="M17 5l4 1-3 14-4-1" /></svg>;
}
