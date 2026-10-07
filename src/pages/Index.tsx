import Navbar from "@/components/Navbar";
import { useMaintenant } from "@/hooks/useMaintenant";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { faqJsonLd, organizationJsonLd, softwareAppJsonLd } from "@/lib/seo-jsonld";
import { TrustBadges } from "@/components/TrustBadges";
import { getActivePricing, formatPriceEUR } from "@/lib/launch";
import { ObligationsSection } from "@/components/ObligationsSection";
import { SectionComparatif } from "@/components/SectionsContenu";
import { FaqSection, type FaqItem } from "@/components/FaqSection";

const COMPARATIF = [
  { critere: "Ne rien oublier", papier: "Les fiches attendent qu'on y pense.", application: "Une notification chaque matin rappelle les contrôles du jour." },
  { critere: "Qui a fait quoi", papier: "Des initiales, quand elles y sont.", application: "Chaque contrôle est daté et rattaché à la personne connectée." },
  { critere: "Écarts et actions correctives", papier: "Notés dans la marge, ou pas du tout.", application: "L'application signale l'écart et demande ce qui a été fait." },
  { critere: "Suivi par le gérant", papier: "Relire les classeurs.", application: "Un récapitulatif chaque semaine par e-mail." },
  { critere: "Le jour du contrôle sanitaire", papier: "Chercher les bonnes fiches.", application: "L'historique complet s'affiche en quelques secondes." },
];

function faqAccueil(principal: string, supplementaire: string): FaqItem[] {
  return [
    {
      question: "Qu'est-ce qu'un logiciel HACCP ?",
      answer:
        "Une application qui remplace les fiches papier de votre hygiène au quotidien : relevés de température, réceptions, nettoyage, traçabilité, huiles, étiquettes. Chaque contrôle est daté, rattaché à la personne qui l'a fait et consultable lors d'un contrôle sanitaire.",
    },
    {
      question: "LockHACCP convient-il à un petit restaurant ?",
      answer:
        "Oui. Un téléphone suffit, chaque membre de l'équipe se connecte avec son propre code, et l'abonnement est sans engagement, avec 1 mois d'essai gratuit.",
    },
    {
      question: "Combien coûte LockHACCP ?",
      answer: `${principal}/mois par établissement, toutes fonctionnalités incluses, et ${supplementaire}/mois par établissement supplémentaire. L'abonnement est sans engagement et se résilie depuis l'application.`,
    },
    {
      question: "Un logiciel HACCP remplace-t-il le Plan de Maîtrise Sanitaire ?",
      answer:
        "Non. Le PMS est le dossier qui décrit vos bonnes pratiques, votre plan HACCP, votre traçabilité et la gestion des non-conformités. LockHACCP sert à tenir au quotidien les enregistrements qu'il prévoit. Le PMS lui-même peut être généré gratuitement sur LockHACCP.",
    },
    {
      question: "Puis-je gérer plusieurs restaurants ?",
      answer: `Oui. Chaque établissement supplémentaire coûte ${supplementaire}/mois, et l'application web propose un tableau de bord consolidé sur l'ensemble de vos sites.`,
    },
    {
      question: "Où sont hébergées mes données ?",
      answer: "En Europe, chez Supabase, dans le respect du RGPD. Vous restez propriétaire de vos données.",
    },
  ];
}

const Index = () => {
  const maintenant = useMaintenant();
  const pricing = getActivePricing(maintenant);
  const faq = faqAccueil(formatPriceEUR(pricing.mainMonthly), formatPriceEUR(pricing.extraMonthly));

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`Logiciel HACCP pour restaurateurs à ${formatPriceEUR(pricing.mainMonthly)}/mois`}
        description="Logiciel HACCP pour restaurateurs : relevés de température, traçabilité, plan de nettoyage, étiquettes, sur téléphone. Essai gratuit 1 mois sans engagement."
        path="/"
        jsonLd={[organizationJsonLd, softwareAppJsonLd(maintenant), faqJsonLd(faq)]}
      />
      <Navbar />
      <main>
        <HeroSection />
        <section className="py-10 bg-background border-y border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <TrustBadges />
          </div>
        </section>
        <FeaturesSection />
        <BenefitsSection />
        <ObligationsSection />
        <SectionComparatif
          titre="Fiches papier ou logiciel HACCP : ce qui change"
          intro="Le papier reste accepté lors d'un contrôle. La différence se joue au quotidien, en plein service."
          lignes={COMPARATIF}
        />
        <FaqSection items={faq} title="Questions fréquentes sur le logiciel HACCP" />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
