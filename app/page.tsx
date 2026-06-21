import Navbar from "./components/Navbar";
import PageBackground from "./components/PageBackground";
import Hero from "./components/Hero";
import UseCases from "./components/UseCases";
import Stats from "./components/Stats";
import HowItWorks from "./components/HowItWorks";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <PageBackground />
      <Navbar />

      <main>
        <section className="site-container px-6">
          <Hero />
          <UseCases />
          <div className="py-10">
            <Stats />
          </div>
        </section>

        <section id="how" className="site-container px-6 py-12">
          <HowItWorks />
        </section>

        <section id="features" className="site-container px-6 py-12">
          <Features />
        </section>

        <section id="pricing" className="site-container px-6 py-12">
          <Pricing />
        </section>

        <section id="faq" className="site-container px-6 py-12">
          <FAQ />
        </section>

        <section className="site-container px-6 py-16">
          <CTA />
        </section>
      </main>

      <Footer />
    </div>
  );
}
