"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";

export default function DashboardClient() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/documents")
      .then((r) => r.json())
      .then((d) => setDocs(d.documents || []));
  }, []);

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="mb-4 text-3xl font-semibold text-foreground">Dashboard</h1>
        {docs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 text-muted shadow-xl shadow-black/20 backdrop-blur-md">No documents yet. Create one to get started.</div>
        ) : (
          <div className="grid gap-4">
            {docs.map((d) => (
              <DocumentCard key={d.id} doc={d} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
