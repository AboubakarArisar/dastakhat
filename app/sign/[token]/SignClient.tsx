"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SignaturePad from "../../components/SignaturePad";
import PageBackground from "../../components/PageBackground";

type Party = { label: string; name: string; status: string };
type DocInfo = {
  documentName: string;
  status: string;
  signerLabel: string;
  signerName: string;
  alreadySigned: boolean;
  preview: string;
  parties: Party[];
};

export default function SignClient({ token }: { token: string }) {
  const [info, setInfo] = useState<DocInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [signature, setSignature] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ completed: boolean } | null>(null);

  useEffect(() => {
    fetch(`/api/sign/${token}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d?.error || "Invalid link");
        return d;
      })
      .then(setInfo)
      .catch((e) => setLoadError(e?.message || "Invalid link"));
  }, [token]);

  async function handleSign() {
    if (!signature || !agreed) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/sign/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signatureDataUrl: signature }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to submit");
      setDone({ completed: Boolean(data.completed) });
    } catch (e: any) {
      setError(e?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  }

  async function downloadCompleted() {
    const res = await fetch(`/api/sign/${token}`, { method: "PUT" });
    const data = await res.json();
    if (data?.pdfBase64) {
      const a = document.createElement("a");
      a.href = `data:application/pdf;base64,${data.pdfBase64}`;
      a.download = `${(data.documentName || "document").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf`;
      a.click();
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PageBackground />
      <header className="border-b border-white/10 bg-surface/70 backdrop-blur-md">
        <div className="site-container flex items-center px-6 py-4">
          <Image src="/lightlogo.png" alt="Dastakhat" width={2043} height={770} className="h-10 w-auto" />
        </div>
      </header>

      <main className="site-container max-w-3xl px-6 py-10">
        {loadError ? (
          <div className="glass-card p-8 text-center">
            <h1 className="text-2xl font-bold">Link not valid</h1>
            <p className="mt-2 text-muted">{loadError}</p>
          </div>
        ) : !info ? (
          <div className="glass-card p-8 text-muted">Loading document…</div>
        ) : done ? (
          <div className="glass-card p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-success/30">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold">Thank you — you’ve signed</h1>
            <p className="mt-2 text-muted">
              {done.completed
                ? "All parties have now signed. The completed document is ready."
                : "Your signature was recorded. We’ll finalize once everyone has signed."}
            </p>
            {done.completed && (
              <button onClick={downloadCompleted} className="btn-primary mt-6">Download signed PDF</button>
            )}
          </div>
        ) : info.alreadySigned ? (
          <div className="glass-card p-8 text-center">
            <h1 className="text-2xl font-bold">You’ve already signed this</h1>
            <p className="mt-2 text-muted">No further action is needed for “{info.documentName}”.</p>
            {info.status === "completed" && (
              <button onClick={downloadCompleted} className="btn-primary mt-6">Download signed PDF</button>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <span className="pill">Signature requested</span>
              <h1 className="mt-3 text-3xl font-bold">{info.documentName}</h1>
              <p className="mt-2 text-muted">
                You’re signing as <strong className="text-foreground">{info.signerLabel}</strong>
                {info.signerName ? ` (${info.signerName})` : ""}. Review the document, then add your signature below.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {info.parties.map((p, i) => (
                  <span key={i} className={`badge ${p.status === "signed" ? "badge-signed" : "badge-draft"}`}>
                    {p.label}: {p.status === "signed" ? "signed" : "pending"}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-card p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">Document</h2>
              <pre className="mt-3 max-h-[28rem] overflow-auto whitespace-pre-wrap rounded-lg bg-background/40 p-4 text-sm leading-relaxed text-foreground">{info.preview}</pre>
            </div>

            <div className="glass-card mt-6 p-5">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">Your signature</h2>
              <div className="mt-3">
                <SignaturePad label={`Sign as ${info.signerLabel}`} value={signature} onChange={setSignature} />
              </div>

              <label className="mt-4 flex items-start gap-2.5 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#3b82f6]"
                />
                <span>I have reviewed this document and agree to be bound by it. My drawn signature is my legal signature.</span>
              </label>

              {error && <div className="mt-3 rounded-lg border border-danger/35 bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>}

              <button
                onClick={handleSign}
                disabled={submitting || !signature || !agreed}
                className="btn-primary mt-5"
              >
                {submitting ? "Submitting…" : "Agree & Sign"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
