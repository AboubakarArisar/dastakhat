"use client";
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <nav className="w-full border-b bg-white px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="font-semibold">Signeasy MVP</div>
        <div className="flex items-center gap-3">
          <a href="/create" className="text-sm text-foreground">Create Document</a>
          {session ? (
            <>
              <div className="text-sm">{session.user?.email || session.user?.name}</div>
              <button onClick={() => signOut()} className="text-sm">Sign out</button>
            </>
          ) : (
            <button onClick={() => signIn()} className="text-sm">Sign in</button>
          )}
        </div>
      </div>
    </nav>
  );
}
