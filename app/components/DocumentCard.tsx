"use client";
import React, { useState } from "react";

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

type Props = {
  doc: Doc;
  onDeleted?: (id: string) => void;
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; label: string }> = {
    draft: { cls: "badge-draft", label: "Draft" },
    awaiting_signature: { cls: "badge-sent", label: "Awaiting signature" },
    completed: { cls: "badge-signed", label: "Completed" },
  };
  const s = map[status] || map.draft;
  return <span className={`badge ${s.cls}`}>{s.label}</span>;
}

export default function DocumentCard({ doc, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const status = doc.status || "draft";
  const signers = doc.signers || [];
  const signedCount = signers.filter((s) => s.status === "signed").length;
  const pendingCounter = signers.find((s) => s.role === "counterparty" && s.status !== "signed");
  const isCompleted = status === "completed";

  function viewPdf() {
    window.open(`/api/documents?id=${doc.id}&inline=1`, "_blank", "noopener,noreferrer");
  }

  async function handleDownload() {
    const res = await fetch(`/api/documents?id=${doc.id}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc.title || doc.template || "document").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function copySigningLink() {
    if (!pendingCounter) return;
    const link = `${window.location.origin}/sign/${pendingCounter.token}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!to.trim()) return;
    setSending(true);
    setEmailError(null);
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: doc.id, to: to.trim() }),
      });
      const data = await res.json();
      if (data?.ok) {
        setEmailOpen(false);
        setTo("");
      } else {
        setEmailError(data?.error || "Failed to send email");
      }
    } catch (err: any) {
      setEmailError(err?.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this document permanently? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/documents?id=${doc.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data?.ok) onDeleted?.(doc.id);
      else alert("Delete failed: " + (data?.error || "unknown error"));
    } catch (err: any) {
      alert("Delete failed: " + (err?.message || err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="glass-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-accent ring-1 ring-primary/25">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 13h6M9 17h6" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-foreground">{doc.title || doc.template}</div>
            <div className="text-sm text-muted">{doc.client_name ? `with ${doc.client_name}` : "No counterparty"}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={status} />
          <span className="text-xs text-muted">{new Date(doc.created_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Signer progress */}
      {signers.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">{signedCount} of {signers.length} signed</span>
          {signers.map((s, i) => (
            <span key={i} className={`badge ${s.status === "signed" ? "badge-signed" : "badge-draft"}`}>
              {s.label}: {s.status === "signed" ? "signed" : "pending"}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {status === "awaiting_signature" && pendingCounter && (
          <button onClick={copySigningLink} className="btn-primary px-3 py-1.5 text-sm">
            {copied ? "Link copied!" : "Copy signing link"}
          </button>
        )}
        {isCompleted && (
          <>
            <button onClick={viewPdf} className="btn-secondary px-3 py-1.5 text-sm">View</button>
            <button onClick={handleDownload} className="btn-primary px-3 py-1.5 text-sm">Download</button>
            <button onClick={() => setEmailOpen((v) => !v)} className="btn-secondary px-3 py-1.5 text-sm">Email</button>
          </>
        )}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="ml-auto inline-flex items-center justify-center rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/20 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      {emailOpen && isCompleted && (
        <form onSubmit={handleSendEmail} className="mt-4 rounded-xl border border-white/10 bg-background/40 p-4">
          <label className="block text-sm font-medium text-foreground/90">Send completed PDF to</label>
          <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@email.com"
              className="block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button type="submit" disabled={sending} className="btn-primary px-4 py-2 text-sm">
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
          {emailError && <p className="mt-2 text-sm text-danger">{emailError}</p>}
        </form>
      )}
    </div>
  );
}
