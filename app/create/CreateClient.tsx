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
        <h1 className="text-2xl font-semibold mb-4 text-foreground">Create Document</h1>

        <div className="mb-4 flex gap-2">
          <button onClick={() => setTab("template")} className={`px-4 py-2 rounded ${tab === "template" ? "bg-foreground text-background" : "border"}`}>From Template</button>
          <button onClick={() => setTab("custom")} className={`px-4 py-2 rounded ${tab === "custom" ? "bg-foreground text-background" : "border"}`}>Custom Document</button>
        </div>

        {tab === "template" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium">Template</label>
              <select className="mt-1 block w-full rounded border px-3 py-2" onChange={(e) => setSelected(e.target.value)}>
                <option value="">Select template</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <div className="mt-3 text-sm text-gray-600">Tip: fill the placeholders and Preview before generating.</div>
            </div>
            <div className="sm:col-span-2">
              {selected ? (
                <div className="space-y-4">
                  <TemplateForm templateText={templateText} templateId={selected} onGenerated={(b64) => setPdfBase64(b64)} onPreview={(m) => setMergedPreview(m)} />
                  <div>
                    <button onClick={() => { if (mergedPreview) { const blob = new Blob([mergedPreview], { type: 'text/markdown' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `preview-${selected}.md`; a.click(); URL.revokeObjectURL(url); } }} className="mr-2 rounded border border-primary/20 px-3 py-1 text-primary hover:bg-surface/50 transition">Download Preview</button>
                    {pdfBase64 && (
                      <a href={`data:application/pdf;base64,${pdfBase64}`} download={`document-${selected}.pdf`} className="inline-block rounded bg-primary px-4 py-2 text-black font-medium">Download PDF</a>
                    )}
                  </div>
                  {mergedPreview && (
                    <div className="mt-4 border rounded p-3 bg-white">
                      <h4 className="font-medium">Preview</h4>
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">{mergedPreview}</pre>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600">Choose a template to edit placeholders.</div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium">Custom document (Markdown)</label>
            <textarea value={customText} onChange={(e) => setCustomText(e.target.value)} className="mt-1 block w-full rounded border p-3 h-64" />
            <div className="mt-3 flex gap-2">
              <button onClick={handleGenerateCustom} className="rounded bg-foreground px-4 py-2 text-background">Generate PDF</button>
              <button onClick={() => {
                const blob = new Blob([customText], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `custom-doc.md`;
                a.click();
                URL.revokeObjectURL(url);
              }} className="rounded border px-4 py-2">Download Markdown</button>
            </div>
            {pdfBase64 && (
              <div className="mt-4">
                <a href={`data:application/pdf;base64,${pdfBase64}`} download={`document-custom.pdf`} className="inline-block rounded bg-foreground px-4 py-2 text-background">Download PDF</a>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
