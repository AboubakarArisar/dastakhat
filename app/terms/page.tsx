import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBackground from "../components/PageBackground";

export const metadata: Metadata = {
  title: "Terms of Service — Dastakhat",
  description: "The terms for using Dastakhat to create and sign documents.",
};

const LAST_UPDATED = "June 22, 2026";

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. Agreement to these terms",
    body: (
      <p>
        By using Dastakhat, you agree to these terms. If you don&apos;t agree, please don&apos;t use the
        service. We may update these terms as the product grows; continued use after a change means you
        accept the updated terms.
      </p>
    ),
  },
  {
    heading: "2. What Dastakhat is",
    body: (
      <p>
        Dastakhat is a tool for creating documents from templates or custom text, signing them, and sharing
        them for others to sign. It is provided free of charge today. Some features may move to a paid plan
        in the future, and we&apos;ll make that clear before any charge applies.
      </p>
    ),
  },
  {
    heading: "3. Not legal advice",
    body: (
      <p>
        Dastakhat is <strong className="text-foreground">not a law firm</strong> and does not provide legal
        advice. Templates are starting points, not guarantees. Whether a document is valid, binding, or
        enforceable depends on your jurisdiction, the parties, and the circumstances. For anything
        important, consult a qualified lawyer.
      </p>
    ),
  },
  {
    heading: "4. Your responsibilities",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>You&apos;re responsible for the content of the documents you create and send.</li>
        <li>You confirm you have the right to send a document to the people you send it to.</li>
        <li>
          You&apos;ll only request signatures from people who have agreed to sign, and you&apos;ll keep
          signing links private.
        </li>
        <li>You won&apos;t use Dastakhat for anything unlawful, fraudulent, or abusive.</li>
      </ul>
    ),
  },
  {
    heading: "5. Electronic signatures",
    body: (
      <p>
        A signature drawn and submitted through Dastakhat is intended to represent the signer&apos;s intent
        to agree to the document. You are responsible for ensuring electronic signatures are appropriate and
        legally sufficient for your use. We record the time each party signs to support that record, but we
        make no guarantee of legal admissibility.
      </p>
    ),
  },
  {
    heading: "6. Accounts and access",
    body: (
      <p>
        Dastakhat currently works without an account, using an anonymous key stored in your browser to keep
        your document list separate. This is a convenience, not a security guarantee. You&apos;re responsible
        for the device and browser you use, and for who you share signing links with.
      </p>
    ),
  },
  {
    heading: "7. Availability",
    body: (
      <p>
        We aim to keep Dastakhat running smoothly, but the service is provided &ldquo;as is&rdquo; and
        &ldquo;as available.&rdquo; We may change, suspend, or discontinue features at any time. We
        don&apos;t guarantee uninterrupted or error-free operation.
      </p>
    ),
  },
  {
    heading: "8. Limitation of liability",
    body: (
      <p>
        To the fullest extent permitted by law, Dastakhat and its makers are not liable for any indirect,
        incidental, or consequential damages, or for any loss of data, profits, or business arising from
        your use of the service. The service is free, and your use of it is at your own risk.
      </p>
    ),
  },
  {
    heading: "9. Termination",
    body: (
      <p>
        You can stop using Dastakhat at any time and delete your documents from the Documents page. We may
        suspend or limit access if these terms are violated or if needed to protect the service or its
        users.
      </p>
    ),
  },
  {
    heading: "10. Contact",
    body: (
      <p>
        Questions about these terms? Reach out at{" "}
        <a href="mailto:aboubakar.dev@gmail.com" className="text-accent underline-offset-2 hover:underline">
          aboubakar.dev@gmail.com
        </a>
        .
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PageBackground />
      <Navbar />

      <main className="site-container max-w-3xl px-6 py-16">
        <div className="animate-fade-up">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Terms of Service</h1>
          <p className="mt-3 text-muted">Last updated {LAST_UPDATED}</p>
        </div>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold text-foreground">{s.heading}</h2>
              <div className="mt-2 leading-relaxed text-muted">{s.body}</div>
            </section>
          ))}
        </div>

        <p className="mt-12 rounded-xl border border-white/10 bg-white/5 p-4 text-sm leading-relaxed text-muted">
          By using Dastakhat you acknowledge that it is a document tool, not a substitute for legal counsel.
        </p>
      </main>

      <Footer />
    </div>
  );
}
