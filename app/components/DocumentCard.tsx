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
    <div className="rounded-lg p-4 bg-card border border-surface/50 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="font-semibold text-foreground">{doc.template}</div>
          <div className="text-sm text-muted">{doc.client_name || '—'}</div>
        </div>
        <div className="text-sm text-muted">{new Date(doc.created_at).toLocaleString()}</div>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={handleDownload} className="rounded px-3 py-2 bg-primary text-black font-medium hover:bg-primary-600 transition">Download</button>
        <button onClick={handleSendEmail} className="rounded px-3 py-2 border border-surface/50 text-muted hover:bg-surface/60 transition">Send Email</button>
      </div>
    </div>
  );
}
