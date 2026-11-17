import Navbar from "@/components/Navbar";
import { useMaintenant } from "@/hooks/useMaintenant";
import CTASection from "@/components/CTASection";
import { HeroAccueil } from "@/components/accueil/HeroAccueil";
import { BandeauMetiers } from "@/components/accueil/BandeauMetiers";
import { HistoireDefilement } from "@/components/accueil/HistoireDefilement";
import { GrilleModules } from "@/components/accueil/GrilleModules";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { faqJsonLd, organizationJsonLd, softwareAppJsonLd, websiteJsonLd } from "@/lib/seo-jsonld";
import { getActivePricing, formatPriceEUR, type PricingGrid } from "@/lib/launch";
import { mensuelEquivalent } from "@/lib/tarifs-affichage";
import { ObligationsSection } from "@/components/ObligationsSection";
import { ComparatifPapier } from "@/components/accueil/ComparatifPapier";
import { FaqSection, type FaqItem } from "@/components/FaqSection";

const COMPARATIF = [
  { critere: "Ne rien oublier", papier: "Les fiches attendent qu'on y pense.", application: "Une notification chaque matin rappelle les contrôles du jour." },
  { critere: "Qui a fait quoi", papier: "Des initiales, quand elles y sont.", application: "Chaque contrôle est daté et rattaché à la personne connectée." },
  { critere: "Écarts et actions correctives", papier: "Notés dans la marge, ou pas du tout.", application: "L'application signale l'écart et demande ce qui a été fait." },
  { critere: "Suivi par le gérant", papier: "Relire les classeurs.", application: "Un récapitulatif chaque semaine par e-mail." },
  { critere: "Le jour du contrôle sanitaire", papier: "Chercher les bonnes fiches.", application: "L'historique complet s'affiche en quelques secondes." },
];

/** Prix affichés : l'équivalent mensuel du paiement annuel en avant, le prix au mois ensuite. */
function faqAccueil(p: PricingGrid): FaqItem[] {
  const principal = formatPriceEUR(mensuelEquivalent(p.mainYearly));
  const supplementaire = formatPriceEUR(mensuelEquivalent(p.extraYearly));
  return [
    {
      question: "Qu'est-ce qu'un logiciel HACCP ?",
      answer:
        "Une application qui remplace les fiches papier de votre hygiène au quotidien : relevés de température, réceptions, nettoyage, traçabilité, huiles, étiquettes. Chaque contrôle est daté, rattaché à la personne qui l'a fait et consultable lors d'un contrôle sanitaire.",
    },
    {
      question: "LockHACCP convient-il à un petit restaurant ?",
      answer:
        "Oui. Un téléphone suffit, chaque membre de l'équipe se connecte avec son propre code, et l'abonnement est sans engagement, avec 14 jours d'essai gratuit.",
    },
    {
      question: "Combien coûte LockHACCP ?",
      answer: `${principal}/mois par établissement en paiement annuel (${formatPriceEUR(p.mainYearly)} par an), toutes fonctionnalités incluses, ou ${formatPriceEUR(p.mainMonthly)} au mois. Chaque établissement supplémentaire : ${supplementaire}/mois en annuel, ou ${formatPriceEUR(p.extraMonthly)} au mois. L'abonnement est sans engagement et se résilie depuis l'application.`,
    },
    {
      question: "Un logiciel HACCP remplace-t-il le Plan de Maîtrise Sanitaire ?",
      answer:
        "Non. Le PMS est le dossier qui décrit vos bonnes pratiques, votre plan HACCP, votre traçabilité et la gestion des non-conformités. LockHACCP sert à tenir au quotidien les enregistrements qu'il prévoit. Le PMS lui-même peut être généré gratuitement sur LockHACCP.",
    },
    {
      question: "Puis-je gérer plusieurs restaurants ?",
      answer: `Oui. Chaque établissement supplémentaire coûte ${supplementaire}/mois en paiement annuel, et l'application web propose un tableau de bord consolidé sur l'ensemble de vos sites.`,
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
  const faq = faqAccueil(pricing);

  return (
    <div className="min-h-screen">
      <Seo
        title={`Logiciel HACCP pour restaurateurs dès ${formatPriceEUR(mensuelEquivalent(pricing.mainYearly))}/mois`}
        description="Logiciel HACCP pour restaurateurs : relevés de température, traçabilité, plan de nettoyage, étiquettes, sur téléphone. Essai gratuit 14 jours sans engagement."
        path="/"
        jsonLd={[organizationJsonLd, websiteJsonLd, softwareAppJsonLd(maintenant), faqJsonLd(faq)]}
      />
      <Navbar />
      <main>
        <HeroAccueil />
        <BandeauMetiers />
        <HistoireDefilement />
        <GrilleModules />
        <ObligationsSection />
        <ComparatifPapier
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
