"use client";
import React from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-surface/70 bg-surface/70 backdrop-blur-md">
      <div className="site-container flex items-center justify-between px-4 py-4">
        <a href="/" className="flex items-center gap-3">
          <Image src="/lightlogo.png" alt="Signeasy logo" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" priority />
          <div className="text-lg font-semibold">Signeasy</div>
        </a>
        <nav className="flex items-center gap-4">
          <a href="/product" className="text-sm text-muted transition hover:text-foreground">Product</a>
          <a href="/create" className="text-sm text-muted transition hover:text-foreground">Create</a>
          <a href="/dashboard" className="text-sm text-muted transition hover:text-foreground">Dashboard</a>
          {session ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted">{session.user?.email || session.user?.name}</div>
              <button onClick={() => signOut()} className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-900/40 px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-slate-800/70">Sign out</button>
            </div>
          ) : (
            <button onClick={() => signIn()} className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-primary-600">Sign in</button>
          )}
        </nav>
      </div>
    </header>
  );
}
