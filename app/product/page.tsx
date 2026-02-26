import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-semibold">Product</h1>
        <p className="text-gray-600 mt-2">Signeasy helps freelancers and creators create professional legal documents quickly. Below are the product highlights and what you can do.</p>

        <section className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="border rounded p-6">
            <h3 className="font-medium">Templates</h3>
            <p className="text-gray-600 mt-2">Prebuilt templates for NDAs, freelance contracts, and licensing agreements. Easy placeholder replacement for quick generation.</p>
          </div>
          <div className="border rounded p-6">
            <h3 className="font-medium">PDF Generation</h3>
            <p className="text-gray-600 mt-2">Server-side PDF generation for reliable downloads and attachments.</p>
          </div>
          <div className="border rounded p-6">
            <h3 className="font-medium">Document Tracking</h3>
            <p className="text-gray-600 mt-2">History view in the dashboard with metadata and download links.</p>
          </div>
          <div className="border rounded p-6">
            <h3 className="font-medium">Email</h3>
            <p className="text-gray-600 mt-2">Optional email sending via SMTP for delivering signed documents to clients.</p>
          </div>
        </section>

        <div className="mt-8">
          <a href="/create" className="inline-block rounded bg-foreground px-4 py-2 text-background">Create your first document</a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
