"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TemplateForm from "../components/TemplateForm";

export default function CreateClient() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [templateText, setTemplateText] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [mergedPreview, setMergedPreview] = useState<string | null>(null);
  const [tab, setTab] = useState<"template" | "custom">("template");
  const [customText, setCustomText] = useState<string>("# New Document\n\nWrite your document here...");

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/api/templates/${selected}`).then((r) => r.json()).then((d) => setTemplateText(d.text || ""));
  }, [selected]);

  async function handleGenerateCustom() {
    const res = await fetch("/api/generate-pdf-from-text", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: customText, title: "custom" }),
    });
    const data = await res.json();
    if (data?.pdfBase64) setPdfBase64(data.pdfBase64);
  }

  return (
    <div>
      <Navbar />
      <main className="site-container p-6">
        <h1 className="mb-4 text-3xl font-semibold text-foreground">Create Document</h1>

        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab("template")} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${tab === "template" ? "bg-primary text-black" : "border border-surface/60 bg-background/25 text-foreground hover:bg-surface/60"}`}>From Template</button>
          <button onClick={() => setTab("custom")} className={`rounded-lg px-4 py-2.5 text-sm font-medium transition ${tab === "custom" ? "bg-primary text-black" : "border border-surface/60 bg-background/25 text-foreground hover:bg-surface/60"}`}>Custom Document</button>
        </div>

        {tab === "template" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl shadow-black/20 backdrop-blur-md">
              <label className="block text-sm font-medium text-foreground/90">Template</label>
              <select className="mt-1 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2.5 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" onChange={(e) => setSelected(e.target.value)}>
                <option value="">Select template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="mt-3 text-sm text-muted">Tip: fill the placeholders and Preview before generating.</div>
            </div>
            <div className="sm:col-span-2">
              {selected ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-xl shadow-black/20 backdrop-blur-md">
                    <TemplateForm templateText={templateText} templateId={selected} onGenerated={(b64) => setPdfBase64(b64)} onPreview={(m) => setMergedPreview(m)} />
                  </div>
                  <div>
                    <button onClick={() => { if (mergedPreview) { const blob = new Blob([mergedPreview], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `preview-${selected}.md`; a.click(); URL.revokeObjectURL(url); } }} className="mr-2 inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2 text-sm font-medium text-foreground transition hover:bg-slate-800/70">Download Preview</button>
                    {pdfBase64 && (
                      <a href={`data:application/pdf;base64,${pdfBase64}`} download={`document-${selected}.pdf`} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600">Download PDF</a>
                    )}
                  </div>
                  {mergedPreview && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-slate-900/60 p-3 shadow-lg shadow-black/15 backdrop-blur-md">
                      <h4 className="font-medium">Preview</h4>
                      <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-lg bg-background/40 p-3 text-sm text-foreground">{mergedPreview}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted">Choose a template to edit placeholders.</div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-foreground/90">Custom document (Markdown)</label>
            <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} className="mt-1 block h-64 w-full rounded-lg border border-white/15 bg-slate-900/40 p-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" />
            <div className="mt-3 flex gap-2">
              <button onClick={handleGenerateCustom} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600">Generate PDF</button>
              <button onClick={() => {
                const blob = new Blob([customText], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `custom-doc.md`;
                a.click();
                URL.revokeObjectURL(url);
              }} className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-slate-900/40 px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-slate-800/70">Download Markdown</button>
            </div>
            {pdfBase64 && (
              <div className="mt-4">
                <a href={`data:application/pdf;base64,${pdfBase64}`} download={`document-custom.pdf`} className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600">Download PDF</a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
