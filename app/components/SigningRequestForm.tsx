"use client";
import React, { useEffect, useMemo, useState } from "react";
import SignaturePad from "./SignaturePad";
import {
  extractPlaceholders,
  isSignatureField,
  isDateField,
  formatFieldLabel,
  getFieldMeta,
  getTemplateConfig,
  SignerSlot,
} from "../../lib/signers";
import { getOwnerKey } from "../../lib/clientId";

type Props = {
  templateId: string;
  templateText: string;
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-white/90">
      <path
        d="M7 3a1 1 0 0 1 1 1v1h8V4a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1V4a1 1 0 0 1 1-1Zm12 8H5v8h14v-8Zm0-4H5v2h14V7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function SigningRequestForm({ templateId, templateText }: Props) {
  const config = getTemplateConfig(templateId);
  const ownerSlot: SignerSlot | null = config?.signers.find((s) => s.role === "owner") || null;
  const counterSlot: SignerSlot | null = config?.signers.find((s) => s.role === "counterparty") || null;

  const placeholders = useMemo(() => extractPlaceholders(templateText), [templateText]);
  const textFields = useMemo(() => placeholders.filter((p) => !isSignatureField(p)), [placeholders]);

  const [fields, setFields] = useState<Record<string, string>>({});
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [ownerSignature, setOwnerSignature] = useState("");
  const [counterpartyName, setCounterpartyName] = useState("");
  const [counterpartyEmail, setCounterpartyEmail] = useState("");

  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ link: string; emailed: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // reset when template changes
    setFields({});
    setOwnerSignature("");
    setResult(null);
    setError(null);
  }, [templateId]);

  const missingText = textFields.filter((p) => !getFieldMeta(p).optional && !String(fields[p] ?? "").trim());
  const canSend =
    Boolean(config) &&
    missingText.length === 0 &&
    Boolean(ownerSignature) &&
    counterpartyEmail.trim().length > 0;

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/documents/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId,
          fields,
          ownerKey: getOwnerKey(),
          ownerName,
          ownerEmail,
          ownerSignature,
          counterpartyName,
          counterpartyEmail,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send");
      setResult({ link: data.link, emailed: Boolean(data.emailed) });
    } catch (err: any) {
      setError(err?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  }

  async function copyLink() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  if (!config || !ownerSlot || !counterSlot) {
    return (
      <div className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        This template isn’t set up for two-party signing yet.
      </div>
    );
  }

  // Success state — show the shareable link
  if (result) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-2 text-emerald-200">
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 10.5l3.5 3.5L16 5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-semibold">Sent for signature</span>
          </div>
          <p className="mt-2 text-sm text-emerald-100/80">
            Share this link with <strong>{counterpartyName || "the other party"}</strong>. They’ll review the
            document and add their signature. Once they sign, the completed PDF appears under Documents.
            {result.emailed ? " We also emailed it to them." : ""}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            readOnly
            value={result.link}
            className="block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2.5 text-sm text-foreground outline-none"
            onFocus={(e) => e.currentTarget.select()}
          />
          <button onClick={copyLink} className="btn-primary px-4 py-2.5 text-sm">
            {copied ? "Copied!" : "Copy link"}
          </button>
        </div>

        <div className="flex gap-3">
          <a href="/documents" className="btn-secondary">View documents</a>
          <button onClick={() => { setResult(null); setOwnerSignature(""); }} className="btn-secondary">
            Create another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-6">
      {/* 1. Document details */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">1. Document details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {textFields.map((p) => {
            const meta = getFieldMeta(p);
            const label = meta.label || formatFieldLabel(p);
            return (
              <div key={p}>
                <label className="block text-sm font-medium text-foreground/90">
                  {label}
                  {meta.optional && <span className="ml-1 text-xs font-normal text-muted">(optional)</span>}
                </label>
                <div className={isDateField(p) ? "relative" : ""}>
                  <input
                    type={isDateField(p) ? "date" : "text"}
                    value={fields[p] ?? ""}
                    placeholder={meta.placeholder}
                    onChange={(e) => setFields((prev) => ({ ...prev, [p]: e.target.value }))}
                    required={!meta.optional}
                    className={`mt-1 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2.5 text-white outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 ${
                      isDateField(p) ? "date-input-dark pr-11" : ""
                    }`}
                  />
                  {isDateField(p) && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                      <CalendarIcon />
                    </span>
                  )}
                </div>
                {meta.hint && <p className="mt-1 text-xs text-muted">{meta.hint}</p>}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Parties */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">2. Who’s signing</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="glass-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">You — {ownerSlot.label}</div>
            <input
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder="Your name"
              className="mt-2 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              placeholder="Your email (to receive the final copy)"
              className="mt-2 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="glass-card p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted">Them — {counterSlot.label}</div>
            <input
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              placeholder="Their name"
              className="mt-2 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <input
              type="email"
              required
              value={counterpartyEmail}
              onChange={(e) => setCounterpartyEmail(e.target.value)}
              placeholder="Their email (required)"
              className="mt-2 block w-full rounded-lg border border-white/15 bg-slate-900/40 px-3 py-2 text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      {/* 3. Owner signature */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">3. Your signature</h3>
        <SignaturePad
          label={`Sign as ${ownerSlot.label}`}
          value={ownerSignature}
          onChange={setOwnerSignature}
        />
      </section>

      {error && <div className="rounded-lg border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>}

      {!canSend && (
        <div className="rounded-lg border border-amber-400/35 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
          Fill all document fields, add the counterparty email, and sign your block to send.
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={sending || !canSend} className="btn-primary">
          {sending ? "Sending…" : "Send for signature"}
        </button>
      </div>
    </form>
  );
}
