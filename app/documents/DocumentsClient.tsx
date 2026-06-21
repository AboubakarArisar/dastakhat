"use client";
import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import DocumentCard from "../components/DocumentCard";
import PageBackground from "../components/PageBackground";
import { getOwnerKey } from "../../lib/clientId";

type Signer = {
  role: string;
  label: string;
  name: string;
  email: string;
  token: string;
  status: string;
};

type Doc = {
  id: string;
  title?: string;
  template: string;
  client_name?: string;
  status?: string;
  signers?: Signer[];
  created_at: string;
};

type Filter = "all" | "awaiting_signature" | "completed" | "draft";

export default function DocumentsClient() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const ownerKey = getOwnerKey();
    fetch(`/api/documents?ownerKey=${encodeURIComponent(ownerKey)}`)
      .then((r) => r.json())
      .then((d) => setDocs(d.documents || []))
      .finally(() => setLoading(false));
  }, []);

  const statusOf = (d: Doc) => d.status || "draft";

  const stats = useMemo(
    () => ({
      total: docs.length,
      completed: docs.filter((d) => statusOf(d) === "completed").length,
      awaiting: docs.filter((d) => statusOf(d) === "awaiting_signature").length,
      draft: docs.filter((d) => statusOf(d) === "draft").length,
    }),
    [docs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs.filter((d) => {
      const matchesFilter = filter === "all" || statusOf(d) === filter;
      const matchesQuery =
        !q ||
        (d.title || d.template || "").toLowerCase().includes(q) ||
        (d.client_name || "").toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [docs, query, filter]);

  function handleDeleted(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  const statTiles = [
    { label: "Total documents", value: stats.total },
    { label: "Completed", value: stats.completed },
    { label: "Awaiting signature", value: stats.awaiting },
    { label: "Drafts", value: stats.draft },
  ];

  const filters: Array<{ key: Filter; label: string }> = [
    { key: "all", label: "All" },
    { key: "awaiting_signature", label: "Awaiting" },
    { key: "completed", label: "Completed" },
    { key: "draft", label: "Drafts" },
  ];

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <Navbar />
      <main className="site-container px-6 py-10">
        <div className="animate-fade-up flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Your library</span>
            <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Documents</h1>
            <p className="mt-2 text-muted">Documents you created on this device, with their signing status. (Sign in to access them anywhere — coming soon.)</p>
          </div>
          <a href="/create" className="btn-primary self-start sm:self-auto">+ New document</a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statTiles.map((t) => (
            <div key={t.label} className="glass-card p-5 transition hover:-translate-y-0.5">
              <div className="text-2xl font-bold text-foreground">{t.value}</div>
              <div className="mt-1 text-sm text-muted">{t.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by document or counterparty…"
            className="w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2.5 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 sm:max-w-xs"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                  filter === f.key
                    ? "border-primary/60 bg-primary/15 text-accent"
                    : "border-white/15 bg-white/5 text-muted hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="glass-card p-6 text-muted">Loading documents…</div>
          ) : docs.length === 0 ? (
            <div className="glass-card flex flex-col items-center gap-3 p-10 text-center">
              <div className="text-lg font-semibold text-foreground">No documents yet</div>
              <p className="max-w-sm text-muted">Create a document, send it for signature, and track its status right here.</p>
              <a href="/create" className="btn-primary mt-2">Create a document</a>
            </div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-6 text-muted">No documents match your search.</div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((d) => (
                <DocumentCard key={d.id} doc={d} onDeleted={handleDeleted} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
