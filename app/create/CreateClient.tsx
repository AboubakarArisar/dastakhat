"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import SigningRequestForm from "../components/SigningRequestForm";
import PageBackground from "../components/PageBackground";
import { getOwnerKey } from "../../lib/clientId";

export default function CreateClient() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [templateText, setTemplateText] = useState("");
  const [templateLoadError, setTemplateLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<"template" | "custom">("template");

  const [customText, setCustomText] = useState<string>("# New Document\n\nWrite your document here...");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []));
  }, []);

  useEffect(() => {
    if (!selected) {
      setTemplateText("");
      return;
    }
    setTemplateText("");
    setTemplateLoadError(null);
    fetch(`/api/templates/${selected}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d?.error || "Failed to load template");
        setTemplateText(d.text || "");
      })
      .catch((err) => {
        setTemplateText("");
        setTemplateLoadError(err?.message || "Failed to load template");
      });
  }, [selected]);

  // Generate a PDF from the Markdown and download it straight away.
  async function handleDownloadPdf() {
    setGenerating(true);
    setCustomError(null);
    try {
      const res = await fetch("/api/generate-pdf-from-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: customText, title: "custom", ownerKey: getOwnerKey() }),
      });
      const data = await res.json();
      if (!res.ok || !data?.pdfBase64) throw new Error(data?.error || "Failed to generate PDF");
      setPdfBase64(data.pdfBase64);
      const a = document.createElement("a");
      a.href = `data:application/pdf;base64,${data.pdfBase64}`;
      a.download = "document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err: any) {
      setCustomError(err?.message || "Failed to generate PDF");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <PageBackground />
      <Navbar />
      <main className="site-container px-6 py-10">
        <div className="animate-fade-up">
          <span className="eyebrow">Create</span>
          <h1 className="mt-2 text-3xl font-bold text-foreground sm:text-4xl">Create a document</h1>
          <p className="mt-2 text-muted">
            Pick a template to send for signature, or write a custom document and download it yourself.
          </p>
        </div>

        <div className="mt-6 mb-6 flex gap-2">
          <button
            onClick={() => setTab("template")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              tab === "template"
                ? "border-primary/60 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white shadow-lg shadow-[0_10px_24px_rgba(59,130,246,0.3)]"
                : "border-white/15 bg-white/5 text-muted hover:bg-white/10 hover:text-foreground"
            }`}
          >
            Template → send to sign
          </button>
          <button
            onClick={() => setTab("custom")}
            className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
              tab === "custom"
                ? "border-primary/60 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] text-white shadow-lg shadow-[0_10px_24px_rgba(59,130,246,0.3)]"
                : "border-white/15 bg-white/5 text-muted hover:bg-white/10 hover:text-foreground"
            }`}
          >
            Custom document
          </button>
        </div>

        {tab === "template" ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <div className="glass-card p-5">
                <label className="block text-sm font-medium text-foreground/90">Template</label>
                <select
                  value={selected}
                  className="mt-1 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">Select a template</option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <div className="mt-3 text-sm text-muted">
                  Fill in the details, sign your part, and send a link to the other party to sign theirs.
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {templateLoadError ? (
                <div className="rounded-lg border border-rose-400/35 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {templateLoadError}
                </div>
              ) : selected && templateText ? (
                <SigningRequestForm templateId={selected} templateText={templateText} />
              ) : (
                <div className="glass-card p-8 text-center text-muted">Choose a template to get started.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">
            <label className="block text-sm font-medium text-foreground/90">Custom document</label>
            <p className="mt-1 text-sm text-muted">Write your content below — it’s converted into a clean, formatted PDF when you download.</p>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              className="mt-2 block h-64 w-full rounded-lg border border-white/15 bg-slate-900/40 p-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button onClick={handleDownloadPdf} disabled={generating} className="btn-primary">
                {generating ? "Preparing PDF…" : "Download PDF"}
              </button>
              {pdfBase64 && !generating && (
                <span className="text-sm text-emerald-300">PDF ready — saved to your downloads.</span>
              )}
            </div>
            {customError && (
              <div className="mt-3 rounded-lg border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{customError}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
