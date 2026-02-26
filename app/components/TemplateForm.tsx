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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
            <label className="block text-sm font-medium text-gray-700">{p.replace(/_/g, " ")}</label>
            <input
              value={fields[p]}
              onChange={(e) => setFields({ ...fields, [p]: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={handlePreview} className="rounded border border-primary/20 px-3 py-2 text-primary hover:bg-surface/50 transition">Preview</button>
        <button type="submit" className="rounded bg-primary px-4 py-2 text-black font-medium" disabled={loading}>
          {loading ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </form>
  );
}
