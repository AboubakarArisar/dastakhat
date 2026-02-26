import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-16">
        <Hero />
        <Features />
        {/* <Promo /> */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
