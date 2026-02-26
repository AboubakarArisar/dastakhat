"use client";
import React, { useMemo, useState, useEffect } from "react";

type Props = {
  templateText: string;
  templateId: string;
  onGenerated: (pdfBase64: string) => void;
  onPreview?: (mergedText: string) => void;
};

export default function TemplateForm({ templateText, templateId, onGenerated, onPreview }: Props) {
  const placeholders = useMemo(() => {
    const re = /{{\s*([a-zA-Z0-9_\-]+)\s*}}/g;
    const set = new Set<string>();
    let m;
    while ((m = re.exec(templateText))) set.add(m[1]);
    return Array.from(set);
  }, [templateText]);

  const [fields, setFields] = useState<Record<string,string>>(() => {
    const obj: Record<string,string> = {};
    placeholders.forEach((p) => (obj[p] = ""));
    return obj;
  });

  useEffect(() => {
    // when template changes, ensure fields contains all placeholders (preserve existing values)
    setFields((prev) => {
      const next: Record<string,string> = { ...prev };
      placeholders.forEach((p) => {
        if (!(p in next)) next[p] = "";
      });
      // remove keys that are no longer present
      Object.keys(next).forEach((k) => { if (!placeholders.includes(k)) delete next[k]; });
      return next;
    });
  }, [placeholders]);

  const [loading, setLoading] = useState(false);
  const missingFields = placeholders.filter((p) => !String(fields[p] ?? "").trim());
  const canGenerate = placeholders.length > 0 && missingFields.length === 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canGenerate) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, fields }),
      });
      const data = await res.json();
      if (data.pdfBase64) onGenerated(data.pdfBase64);
    } finally {
      setLoading(false);
    }
  }

  function buildMerged() {
    let text = templateText || "";
    function escapeRegex(s: string) {
      return s.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
    }
    for (const key of Object.keys(fields || {})) {
      const k = escapeRegex(key);
      const re = new RegExp(`{{\\s*${k}\\s*}}|{\\s*${k}\\s*}`, "g");
      text = text.replace(re, String(fields[key] ?? ""));
    }
    return text;
  }

  function handlePreview() {
    const merged = buildMerged();
    if (onPreview) onPreview(merged);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {placeholders.map((p) => (
          <div key={p}>
            <label className="block text-sm font-medium text-foreground/90">{p.replace(/_/g, " ")}</label>
            <input
              value={fields[p]}
              onChange={(e) => setFields({ ...fields, [p]: e.target.value })}
              required
              className="mt-1 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2.5 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>
      {placeholders.length === 0 ? (
        <div className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          No placeholders found in this template.
        </div>
      ) : missingFields.length > 0 ? (
        <div className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Fill all required values before generating PDF.
        </div>
      ) : (
        <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
          All template values provided. Ready to generate.
        </div>
      )}
      <div className="flex gap-2">
        <button type="button" onClick={handlePreview} className="btn-secondary">Preview</button>
        <button type="submit" className="btn-primary" disabled={loading || !canGenerate}>
          {loading ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </form>
  );
}
