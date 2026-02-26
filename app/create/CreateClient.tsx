"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TemplateForm from "../components/TemplateForm";

export default function CreateClient() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [templateText, setTemplateText] = useState("");
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/templates")
      .then((r) => r.json())
      .then((d) => setTemplates(d.templates || []));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`/templates/${selected}.md`).then((r) => r.text()).then((t) => setTemplateText(t));
  }, [selected]);

  return (
    <div>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Create Document</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium">Template</label>
            <select className="mt-1 block w-full rounded border px-3 py-2" onChange={(e) => setSelected(e.target.value)}>
              <option value="">Select template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            {selected ? (
              <div className="space-y-4">
                <TemplateForm templateText={templateText} templateId={selected} onGenerated={(b64) => setPdfBase64(b64)} />
                {pdfBase64 && (
                  <a href={`data:application/pdf;base64,${pdfBase64}`} download={`document-${selected}.pdf`} className="inline-block rounded bg-foreground px-4 py-2 text-background">Download PDF</a>
                )}
              </div>
            ) : (
              <div className="text-gray-600">Choose a template to edit placeholders.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
