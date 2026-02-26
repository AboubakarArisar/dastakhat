"use client";
import React from "react";

export default function DocumentCard({ doc }: { doc: any }) {
  async function handleDownload() {
    const res = await fetch(`/api/documents?id=${doc.id}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `document-${doc.id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleSendEmail() {
    const to = prompt("Recipient email address:");
    if (!to) return;
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: doc.id, to }),
    });
    const data = await res.json();
    if (data?.ok) alert("Email sent");
    else alert("Email failed: " + (data?.error || JSON.stringify(data)));
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/15">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="font-semibold text-foreground">{doc.template}</div>
          <div className="text-sm text-muted">{doc.client_name || '—'}</div>
        </div>
        <div className="text-sm text-muted">{new Date(doc.created_at).toLocaleString()}</div>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={handleDownload} className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition hover:bg-primary-600">Download</button>
        <button onClick={handleSendEmail} className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-slate-800/70">Send Email</button>
      </div>
    </div>
  );
}
