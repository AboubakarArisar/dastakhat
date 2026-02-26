"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="w-full bg-surface border-b border-surface/60">
      <div className="site-container flex items-center justify-between py-4 px-4">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center text-black font-bold">S</div>
          <div className="text-lg font-semibold">Signeasy</div>
        </a>
        <nav className="flex items-center gap-4">
          <a href="/product" className="text-sm text-muted hover:text-foreground">Product</a>
          <a href="/create" className="text-sm text-muted hover:text-foreground">Create</a>
          <a href="/dashboard" className="text-sm text-muted hover:text-foreground">Dashboard</a>
          {session ? (
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted">{session.user?.email || session.user?.name}</div>
              <button onClick={() => signOut()} className="text-sm rounded px-3 py-1 border border-surface/50 hover:bg-surface/60">Sign out</button>
            </div>
          ) : (
            <button onClick={() => signIn()} className="text-sm rounded bg-primary px-3 py-1 text-black">Sign in</button>
          )}
        </nav>
      </div>
    </header>
  );
}
