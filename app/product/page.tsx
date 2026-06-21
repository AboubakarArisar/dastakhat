import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-semibold">Product</h1>
        <p className="mt-3 max-w-3xl text-muted">Dastakhat helps freelancers and creators create and sign professional legal documents quickly. Below are the product highlights and what you can do.</p>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/15">
            <h3 className="font-medium">Templates</h3>
            <p className="mt-2 text-muted">Prebuilt templates for NDAs, freelance contracts, and licensing agreements. Easy placeholder replacement for quick generation.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/15">
            <h3 className="font-medium">PDF Generation</h3>
            <p className="mt-2 text-muted">Server-side PDF generation for reliable downloads and attachments.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/15">
            <h3 className="font-medium">Document Tracking</h3>
            <p className="mt-2 text-muted">History view under Documents with status and download links.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 shadow-xl shadow-black/20 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/15">
            <h3 className="font-medium">Email</h3>
            <p className="mt-2 text-muted">Optional email sending via SMTP for delivering signed documents to clients.</p>
          </div>
        </section>

        <div className="mt-8">
          <a href="/create" className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-600">Create your first document</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
