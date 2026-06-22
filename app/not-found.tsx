import type { Metadata } from "next";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PageBackground from "./components/PageBackground";

export const metadata: Metadata = {
  title: "Page not found — Dastakhat",
  description: "The page you're looking for doesn't exist or has moved.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <PageBackground />
      <Navbar />

      <main className="site-container flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="animate-fade-up max-w-xl">
          <span className="eyebrow">Error 404</span>

          <p
            className="mt-4 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] bg-clip-text text-7xl font-bold leading-none text-transparent sm:text-8xl"
            aria-hidden="true"
          >
            404
          </p>

          <h1 className="mt-6 text-3xl font-bold sm:text-4xl">This page wandered off.</h1>
          <p className="mt-3 leading-relaxed text-muted">
            The page you&apos;re looking for doesn&apos;t exist, was moved, or maybe the link was mistyped.
            Let&apos;s get you back to signing.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="/" className="btn-primary px-5 py-2.5">Back to home</a>
            <a
              href="/create"
              className="rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-muted transition hover:bg-white/10 hover:text-foreground"
            >
              Create a document
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            <a href="/documents" className="text-muted transition hover:text-foreground">Documents</a>
            <a href="/product" className="text-muted transition hover:text-foreground">Product</a>
            <a href="/about" className="text-muted transition hover:text-foreground">About</a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
