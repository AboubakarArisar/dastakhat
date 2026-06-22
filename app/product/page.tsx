import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBackground from "../components/PageBackground";

export const metadata: Metadata = {
  title: "Product — Dastakhat",
  description:
    "What you can do with Dastakhat: templates, guided fields, hand-drawn signatures, two-party signing, and polished PDFs.",
};

const HIGHLIGHTS = [
  {
    title: "Ready-made templates",
    body: "NDAs, freelance contracts, and licensing agreements worded for creators. Fill the blanks and you're ready to send.",
  },
  {
    title: "Guided fields",
    body: "Placeholders become labelled inputs with examples and hints — no more guessing what “governing law” means.",
  },
  {
    title: "Hand-drawn signatures",
    body: "Sign with a mouse, trackpad, or finger. Your signature is embedded straight into the final PDF.",
  },
  {
    title: "True two-party signing",
    body: "You sign your block during creation; your counterparty signs theirs from a private link. No login required for them.",
  },
  {
    title: "Polished PDFs",
    body: "Server-side generation produces paginated, print-ready documents you can download or email.",
  },
  {
    title: "Document library",
    body: "Every document is saved with its status — Awaiting signature to Completed — scoped privately to your browser.",
  },
];

export default function ProductPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PageBackground />
      <Navbar />

      <main className="site-container px-6 py-16">
        <div className="animate-fade-up max-w-3xl">
          <span className="eyebrow">Product</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">
            Everything you need to send and sign — nothing you don&apos;t.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Dastakhat helps freelancers and creators create and sign professional documents quickly. Here&apos;s
            what you can do with it today.
          </p>
        </div>

        <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="glass-card p-6 transition hover:-translate-y-0.5">
              <h3 className="text-lg font-semibold text-foreground">{h.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{h.body}</p>
            </div>
          ))}
        </section>

        <div className="mt-12 flex flex-wrap items-center gap-3">
          <a href="/create" className="btn-primary px-5 py-2.5">Create your first document</a>
          <a
            href="/about"
            className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-white/10 hover:text-foreground"
          >
            Why we built this
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
