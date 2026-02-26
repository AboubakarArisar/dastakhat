export default function Hero() {
  return (
    <section className="flex flex-col items-start gap-6 py-12">
      <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">Professional legal documents for freelancers — instantly</h1>
      <p className="text-lg text-gray-600 max-w-2xl">Generate NDAs, freelance contracts, and licensing agreements with customizable templates. Download PDFs instantly and track created documents in your dashboard.</p>
      <div className="flex gap-3 mt-4">
        <a href="/create" className="inline-block rounded border border-foreground px-4 py-2 text-foreground">Create Document</a>
        <a href="/dashboard" className="inline-block rounded bg-foreground px-4 py-2 text-background">Dashboard</a>
      </div>
    </section>
  );
}
