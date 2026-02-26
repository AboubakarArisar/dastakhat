"use client";
import React, { useMemo, useState } from "react";

type Props = {
  templateText: string;
  templateId: string;
  onGenerated: (pdfBase64: string) => void;
};

export default function TemplateForm({ templateText, templateId, onGenerated }: Props) {
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
        <button type="submit" className="rounded bg-foreground px-4 py-2 text-background" disabled={loading}>
          {loading ? "Generating..." : "Generate PDF"}
        </button>
      </div>
    </form>
  );
}
