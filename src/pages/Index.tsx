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
      <Seo title="LockHACCP - Logiciel HACCP pour restaurants à 14,90€/mois" description="Logiciel HACCP n°1 simplifié pour la restauration : températures, traçabilité, plan de nettoyage, étiquettes. Essai gratuit 3 mois sans engagement." path="/" jsonLd={organizationJsonLd, softwareAppJsonLd} />
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
