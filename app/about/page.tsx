import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBackground from "../components/PageBackground";

export const metadata: Metadata = {
  title: "About — Dastakhat",
  description:
    "Why Dastakhat exists: a tiny, friendly e-signature tool built for freelancers and creators who send their own paperwork.",
};

const VALUES = [
  {
    title: "Simple by default",
    body: "Most people don't need enterprise signing software. They need to send one contract and get it signed. We keep the path from blank page to signed PDF as short as it can be.",
  },
  {
    title: "Free while we grow",
    body: "Dastakhat is free to use today. A paid Pro plan with multi-party signing and audit trails will come later — but the core stays accessible.",
  },
  {
    title: "Honest about what it is",
    body: "We don't pretend to be a legal department. Dastakhat helps you create and sign documents; it doesn't give legal advice or guarantee enforceability in your jurisdiction.",
  },
  {
    title: "Yours, not ours",
    body: "Your documents belong to you. We store what's needed to make signing work and nothing we'd be uncomfortable explaining to you directly.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PageBackground />
      <Navbar />

      <main className="site-container px-6 py-16">
        <div className="animate-fade-up max-w-3xl">
          <span className="eyebrow">About</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Signing paperwork shouldn&apos;t need a sales call.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Dastakhat — <span lang="ur">دستخط</span>, the Urdu word for &ldquo;signature&rdquo; — started from a
            simple frustration: sending a freelance contract or an NDA was somehow more complicated than
            doing the actual work. The tools were built for big teams, priced per seat, and buried the one
            thing you wanted behind a dozen you didn&apos;t.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            So this is the opposite of that. Pick a template, fill in the blanks, sign your part, and send a
            link. The other person signs theirs, and you both get a clean PDF. No accounts to chase, no
            per-seat pricing, no upsell maze.
          </p>
        </div>

        <section className="mt-14">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">What we care about</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="glass-card p-6">
                <h3 className="text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 glass-card p-8 ring-gradient">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold">The one idea that makes it work</h2>
            <p className="mt-3 leading-relaxed text-muted">
              A signature belongs to <strong className="text-foreground">one specific person</strong>. The
              owner only ever signs the owner&apos;s block; the counterparty only ever signs theirs. Nobody
              draws both. That small distinction is the difference between real signing and one person
              scribbling two squiggles — and it&apos;s the heart of how Dastakhat is built.
            </p>
          </div>
        </section>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a href="/create" className="btn-primary px-5 py-2.5">Create your first document</a>
          <a
            href="/product"
            className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-white/10 hover:text-foreground"
          >
            See what it does
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
