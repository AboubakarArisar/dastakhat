import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-surface/40 py-12 backdrop-blur-sm">
      <div className="site-container grid gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <a href="/" className="flex items-center">
            <Image src="/lightlogo.png" alt="Dastakhat" width={2043} height={770} className="h-10 w-auto" />
          </a>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Create, sign, and send professional legal documents in seconds. Built for freelancers and creators.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Product</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href="/#features" className="text-muted transition hover:text-foreground">Features</a></li>
            <li><a href="/#pricing" className="text-muted transition hover:text-foreground">Pricing</a></li>
            <li><a href="/create" className="text-muted transition hover:text-foreground">Create document</a></li>
            <li><a href="/documents" className="text-muted transition hover:text-foreground">Documents</a></li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-semibold text-foreground">Company</div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><a href="/product" className="text-muted transition hover:text-foreground">About</a></li>
            <li><a href="/privacy" className="text-muted transition hover:text-foreground">Privacy</a></li>
            <li><a href="/terms" className="text-muted transition hover:text-foreground">Terms</a></li>
          </ul>
        </div>
      </div>

      <div className="site-container mt-10 flex flex-col gap-3 border-t border-white/10 px-6 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>© {new Date().getFullYear()} Dastakhat — Built for freelancers &amp; creators</div>
        <div className="inline-flex items-center gap-2">
          <span className="badge badge-signed">Free to use</span>
        </div>
      </div>
    </footer>
  );
}
