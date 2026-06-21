// A self-contained, CSS/SVG mockup of the signing experience — no screenshot
// needed. Gives the landing page a real "product" feel.
export default function ProductMockup() {
  return (
    <div className="relative">
      {/* glow behind the window */}
      <div className="glow -inset-6 bg-primary/30" style={{ height: "70%", top: "10%" }} />

      <div className="glass-card relative overflow-hidden animate-float">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          <div className="ml-3 flex-1">
            <div className="mx-auto flex w-fit items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-[11px] text-muted">
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
              dastakhat.app/sign
            </div>
          </div>
        </div>

        {/* body */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-accent">Non-Disclosure Agreement</div>
              <div className="mt-1 text-sm text-muted">Between Acme Studio &amp; Globex Inc.</div>
            </div>
            <span className="badge badge-sent">Awaiting signature</span>
          </div>

          {/* faux document lines */}
          <div className="mt-4 space-y-2.5 rounded-xl border border-white/8 bg-background/40 p-4">
            <div className="h-2 w-3/4 rounded bg-white/12" />
            <div className="h-2 w-full rounded bg-white/8" />
            <div className="h-2 w-5/6 rounded bg-white/8" />
            <div className="h-2 w-2/3 rounded bg-white/8" />

            {/* signature row */}
            <div className="mt-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
              <div className="text-[11px] font-medium text-accent">Receiving Party signature</div>
              <svg viewBox="0 0 240 60" className="mt-1 h-12 w-44 text-white">
                <path
                  className="sig-path"
                  d="M6 40 C 26 6, 40 60, 58 30 S 92 4, 110 36 C 124 58, 140 10, 158 32 S 196 50, 234 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted">
              <span className="badge badge-signed">Acme: signed</span>
              <span className="badge badge-draft">Globex: pending</span>
            </div>
            <div className="rounded-lg bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary/30">
              Agree &amp; Sign
            </div>
          </div>
        </div>
      </div>

      {/* floating chips */}
      <div className="absolute -left-5 top-10 hidden rounded-xl border border-white/10 bg-surface/80 px-3 py-2 text-xs font-medium text-foreground shadow-xl backdrop-blur sm:block animate-float" style={{ animationDelay: "1.2s" }}>
        <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-success" /> Document completed
      </div>
      <div className="absolute -right-4 bottom-12 hidden rounded-xl border border-white/10 bg-surface/80 px-3 py-2 text-xs font-medium text-foreground shadow-xl backdrop-blur sm:block animate-float" style={{ animationDelay: "0.6s" }}>
        ✍️ Signed in 42s
      </div>
    </div>
  );
}
