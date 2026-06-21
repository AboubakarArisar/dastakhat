export default function CTA() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-[#16243f] to-[#0e1830] p-10 text-center shadow-2xl shadow-black/30 sm:p-14">
      <div className="absolute -top-20 left-1/2 -z-0 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
      <div className="relative">
        <h3 className="text-3xl font-bold sm:text-4xl">Ready to create your first document?</h3>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Free to use — fill placeholders, sign by hand, and download a polished PDF in under a minute.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a href="/create" className="btn-primary">Start for free</a>
          <a href="/#pricing" className="btn-secondary">View pricing</a>
        </div>
      </div>
    </section>
  );
}
