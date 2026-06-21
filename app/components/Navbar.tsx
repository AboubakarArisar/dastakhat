import React from "react";
import Image from "next/image";

// Auth UI temporarily removed from the frontend. The sign-in/out flow can be
// restored later (re-add useSession + the Sign in / Sign out buttons).
export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/10 bg-surface/70 backdrop-blur-md">
      <div className="site-container flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center">
          <Image src="/lightlogo.png" alt="Dastakhat" width={2043} height={770} priority className="h-10 w-auto sm:h-11" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          <a href="/#how" className="text-sm text-muted transition hover:text-foreground">How it works</a>
          <a href="/#features" className="text-sm text-muted transition hover:text-foreground">Features</a>
          <a href="/#pricing" className="text-sm text-muted transition hover:text-foreground">Pricing</a>
          <a href="/product" className="text-sm text-muted transition hover:text-foreground">Product</a>
        </nav>

        <div className="flex items-center gap-3">
          <a href="/documents" className="hidden text-sm text-muted transition hover:text-foreground sm:inline">Documents</a>
          <a href="/create" className="btn-primary px-4 py-1.5 text-sm">Start free</a>
        </div>
      </div>
    </header>
  );
}
