import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageBackground from "../components/PageBackground";

export const metadata: Metadata = {
  title: "Privacy Policy — Dastakhat",
  description: "What Dastakhat collects, why, and how your documents and signatures are handled.",
};

const LAST_UPDATED = "June 22, 2026";

const SECTIONS: { heading: string; body: React.ReactNode }[] = [
  {
    heading: "1. The short version",
    body: (
      <p>
        Dastakhat helps you create and sign documents. We store what&apos;s needed to make that work —
        your document content, the names and email addresses you enter, and the signatures drawn on the
        document. We don&apos;t sell your data, and we don&apos;t use it for advertising.
      </p>
    ),
  },
  {
    heading: "2. What we collect",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <strong className="text-foreground">Document content</strong> — the text of the documents you
          create or upload, including any fields you fill in.
        </li>
        <li>
          <strong className="text-foreground">Party details</strong> — the names and email addresses you
          enter for yourself and the person you&apos;re sending the document to.
        </li>
        <li>
          <strong className="text-foreground">Signatures</strong> — the signature you draw, stored as an
          image and embedded into the final PDF, along with the time it was signed.
        </li>
        <li>
          <strong className="text-foreground">A browser key</strong> — a random anonymous identifier kept
          in your browser&apos;s local storage so your document library shows only your documents. It is
          not tied to your real identity.
        </li>
      </ul>
    ),
  },
  {
    heading: "3. What we don't collect",
    body: (
      <p>
        We don&apos;t require an account, so we don&apos;t collect passwords or profiles. We don&apos;t run
        third-party advertising trackers, and we don&apos;t sell or rent your information to anyone.
      </p>
    ),
  },
  {
    heading: "4. How signing links work",
    body: (
      <p>
        When you send a document for signature, we generate a secret link containing a random token. Anyone
        with that link can view and sign the document, so treat it like a key — only share it with the
        person meant to sign. The link grants access to that single document and nothing else.
      </p>
    ),
  },
  {
    heading: "5. Email",
    body: (
      <p>
        If email delivery is configured, we use your provided email addresses only to send the signing
        invitation and the completed document. We don&apos;t add you to a mailing list or send marketing.
        If email isn&apos;t configured, no email is sent and you simply share the link yourself.
      </p>
    ),
  },
  {
    heading: "6. Where your data lives",
    body: (
      <p>
        Documents are stored in our database (or, in self-hosted or development setups, a local file on the
        server). They remain until you delete them. Deleting a document removes its content and signatures
        from our active storage.
      </p>
    ),
  },
  {
    heading: "7. A note on the browser key",
    body: (
      <p>
        The anonymous browser key keeps your document list tidy and private to your browser, but it is a
        convenience boundary, not hardened security. Clearing your browser data resets it. When account
        sign-in is introduced, your documents will be tied to your authenticated account for stronger
        protection.
      </p>
    ),
  },
  {
    heading: "8. Your choices",
    body: (
      <p>
        You can delete any document from your Documents page at any time. You can clear your browser&apos;s
        local storage to remove the browser key. If you need help removing data you can&apos;t reach
        yourself, contact us.
      </p>
    ),
  },
  {
    heading: "9. Changes to this policy",
    body: (
      <p>
        We may update this policy as the product evolves. When we make material changes, we&apos;ll update
        the date at the top of this page.
      </p>
    ),
  },
  {
    heading: "10. Contact",
    body: (
      <p>
        Questions about privacy? Reach out at{" "}
        <a href="mailto:hello@dastakhat.app" className="text-accent underline-offset-2 hover:underline">
          hello@dastakhat.app
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PageBackground />
      <Navbar />

      <main className="site-container max-w-3xl px-6 py-16">
        <div className="animate-fade-up">
          <span className="eyebrow">Legal</span>
          <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Privacy Policy</h1>
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
          Dastakhat is a tool for creating and signing documents, not a law firm. Nothing here is legal
          advice. Whether a signed document is enforceable depends on your jurisdiction and circumstances.
        </p>
      </main>

      <Footer />
    </div>
  );
}
