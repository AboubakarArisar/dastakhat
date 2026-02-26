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
    <div className="border p-4 rounded bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="font-medium">{doc.template}</div>
          <div className="text-sm text-gray-600">{doc.client_name}</div>
        </div>
        <div className="text-sm text-gray-500">{new Date(doc.created_at).toLocaleString()}</div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={handleDownload} className="rounded border px-3 py-1">Download</button>
        <button onClick={handleSendEmail} className="rounded border px-3 py-1">Send Email</button>
      </div>
    </div>
  );
}
