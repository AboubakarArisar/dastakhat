"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";

type Props = {
  templateText: string;
  templateId: string;
  onGenerated: (pdfBase64: string) => void;
  onPreview?: (mergedText: string) => void;
};

type SignatureCanvasProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function SignatureCanvas({ label, value, onChange }: SignatureCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasSignature, setHasSignature] = useState<boolean>(Boolean(value));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0f172a";

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!value) {
      setHasSignature(false);
      return;
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      setHasSignature(true);
    };
    img.src = value;
  }, [value]);

  function getScaledPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function startDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getScaledPoint(event);
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function draw(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getScaledPoint(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function endDrawing(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawingRef.current = false;
    canvas.releasePointerCapture(event.pointerId);
    onChange(canvas.toDataURL("image/png"));
    setHasSignature(true);
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onChange("");
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground/90">{label}</label>
      <div className="mt-1 rounded-lg border border-white/15 bg-white p-2">
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          className="h-40 w-full touch-none rounded bg-white"
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={endDrawing}
          onPointerLeave={endDrawing}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted">Draw with mouse, trackpad, or touch.</span>
        <button type="button" onClick={clearSignature} className="btn-secondary px-2 py-1 text-xs">
          Clear
        </button>
      </div>
      {!hasSignature && <p className="mt-1 text-xs text-amber-300">Signature is required.</p>}
    </div>
  );
}

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

  function isSignatureField(fieldName: string) {
    return /signature/i.test(fieldName);
  }

  function isDateField(fieldName: string) {
    return /(^|[_-])date([_-]|$)|date/i.test(fieldName);
  }

  function formatFieldLabel(fieldName: string) {
    const normalized = fieldName
      .replace(/[_-]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (normalized.length === 0) return fieldName;

    return normalized
      .map((part, index) => {
        const lower = part.toLowerCase();
        if (index === 0) return lower;
        return lower.charAt(0).toUpperCase() + lower.slice(1);
      })
      .join("");
  }

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
      const displayValue = isSignatureField(key)
        ? (fields[key] ? "[signature provided]" : "")
        : String(fields[key] ?? "");
      const k = escapeRegex(key);
      const re = new RegExp(`{{\\s*${k}\\s*}}|{\\s*${k}\\s*}`, "g");
      text = text.replace(re, displayValue);
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
            {isSignatureField(p) ? (
              <SignatureCanvas
                label={formatFieldLabel(p)}
                value={fields[p]}
                onChange={(nextValue) => setFields((prev) => ({ ...prev, [p]: nextValue }))}
              />
            ) : (
              <>
                <label className="block text-sm font-medium text-foreground/90">{formatFieldLabel(p)}</label>
                <input
                  type={isDateField(p) ? "date" : "text"}
                  value={fields[p]}
                  onChange={(e) => setFields((prev) => ({ ...prev, [p]: e.target.value }))}
                  required
                  className="mt-1 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2.5 text-white outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </>
            )}
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
