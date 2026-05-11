import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { organizationJsonLd, softwareAppJsonLd } from "@/lib/seo-jsonld";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo title="LockHACCP - Logiciel HACCP pour restaurants" description="Solution digitale tout-en-un pour la conformité HACCP : relevés de température, traçabilité, plan de nettoyage, étiquettes. Essai gratuit." path="/" jsonLd={[organizationJsonLd, softwareAppJsonLd]} />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
