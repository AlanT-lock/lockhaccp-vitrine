import { Button } from "@/components/ui/button";
import { useMaintenant } from "@/hooks/useMaintenant";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Printer, Tablet, ShieldCheck, ScanLine, Bell, CalendarClock, Radio } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo-jsonld";
import { APP_URL } from "@/lib/links";
import { FaqSection } from "@/components/FaqSection";
import { TrustBadges } from "@/components/TrustBadges";
import { SectionReglementation } from "@/components/SectionsContenu";
import { RelatedLinks } from "@/components/RelatedLinks";
import { SOURCES } from "@/lib/sources-reglementaires";
import {
  isLaunchOfferActive,
  LAUNCH_PRICING,
  CURRENT_PRICING,
  LAUNCH_OFFER_END_LABEL,
  CURRENT_PRICING_START_LABEL,
  formatPriceEUR,
  MENTION_TVA,
  PRO_EN_VENTE,
  PRO_PRICING,
  RELECTURES_IA_PAR_MOIS,
  type PricingGrid,
} from "@/lib/launch";
import {
  CAPTEURS_EN_VENTE,
  CHEMIN_CAPTEURS,
  POINTS_CAPTEURS,
  PRIX_CAPTEUR_ANNUEL,
  PRIX_CAPTEUR_MENSUEL,
  lienCommandeCapteurs,
} from "@/lib/capteurs";

const MAIN_FEATURES = [
  "Relevé de température, avec rappels",
  "Contrôle à réception",
  "Traçabilité",
  "Plan de nettoyage, avec rappels",
  "T° produit : refroidissement, congélation, réchauffement",
  "Huile de friture",
  "CheckList personnalisée",
  "Production et impression d'étiquettes",
  "Historique complet et rapport de contrôle DDPP",
  "Rapport hebdomadaire par email",
];

// Offre LockHACCP : tout, avec un crédit de relectures IA chaque mois.
const STANDARD_FEATURES = [
  ...MAIN_FEATURES,
  "Alertes rappels produits et DLC",
  `${RELECTURES_IA_PAR_MOIS} relectures IA d'étiquettes par mois et par établissement`,
];

// Offre Pro : la même chose, avec les relectures IA illimitées.
const PRO_FEATURES = [
  "Tout de l'offre LockHACCP",
  "Relectures IA d'étiquettes illimitées",
  "Lot, DLC et produit remplis tout seuls, même sur les étiquettes difficiles",
  "Idéal si vous recevez beaucoup de produits",
];

interface PricingGridCardProps {
  pricing: PricingGrid;
  title: string;
  badgeLabel: string;
  note: string;
  highlighted: boolean;
  showCta: boolean;
  features: string[];
  ctaLabel?: string;
}

const PricingGridCard = ({ pricing, title, badgeLabel, note, highlighted, showCta, features, ctaLabel }: PricingGridCardProps) => (
  <div
    className={`relative rounded-2xl p-6 flex flex-col ${
      highlighted
        ? "bg-primary text-primary-foreground shadow-xl border-2 border-secondary z-10"
        : "bg-card border border-border shadow-card"
    }`}
  >
    <Badge
      className="w-fit mb-3"
      variant={highlighted ? "secondary" : "outline"}
    >
      {badgeLabel}
    </Badge>

    <h3 className={`font-heading text-xl font-bold mb-1 ${highlighted ? "text-primary-foreground" : "text-foreground"}`}>
      {title}
    </h3>
    <p className={`text-sm mb-6 ${highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
      {note}
    </p>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p className={`text-xs mb-1 ${highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          Établissement principal
        </p>
        <p className={`text-2xl font-bold ${highlighted ? "text-primary-foreground" : "text-foreground"}`}>
          {formatPriceEUR(pricing.mainMonthly)}
          <span className={`text-sm font-normal ${highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            /mois TTC
          </span>
        </p>
        <p className={`text-xs ${highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {formatPriceEUR(pricing.mainYearly)}/an TTC
        </p>
      </div>
      <div>
        <p className={`text-xs mb-1 ${highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          Établissement supplémentaire
        </p>
        <p className={`text-2xl font-bold ${highlighted ? "text-primary-foreground" : "text-foreground"}`}>
          {formatPriceEUR(pricing.extraMonthly)}
          <span className={`text-sm font-normal ${highlighted ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
            /mois TTC
          </span>
        </p>
        <p className={`text-xs ${highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {formatPriceEUR(pricing.extraYearly)}/an TTC
        </p>
      </div>
    </div>

    <p className={`text-xs mb-6 p-2 rounded-lg ${highlighted ? "bg-primary-foreground/10 text-primary-foreground/80" : "bg-muted text-muted-foreground"}`}>
      Paiement annuel : {pricing.annualDiscountLabel}
    </p>

    <ul className="space-y-2 mb-6 flex-grow">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-2">
          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlighted ? "text-secondary" : "text-primary"}`} />
          <span className={`text-sm ${highlighted ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
            {feature}
          </span>
        </li>
      ))}
    </ul>

    {showCta && (
      <Button className="w-full" variant={highlighted ? "accent" : "outline"} asChild>
        <a href={APP_URL} className="mt-auto">
          {ctaLabel ?? "Essayer 1 mois gratuit"}
        </a>
      </Button>
    )}
  </div>
);

const Pricing = () => {
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: plansRef, isVisible: plansVisible } = useScrollAnimation();
  const { ref: optionsRef, isVisible: optionsVisible } = useScrollAnimation();

  const maintenant = useMaintenant();
  const launchActive = isLaunchOfferActive(maintenant);
  const activePricing = launchActive ? LAUNCH_PRICING : CURRENT_PRICING;

  const pricingFaqAnswer = launchActive
    ? `LockHACCP est à ${formatPriceEUR(LAUNCH_PRICING.mainMonthly)}/mois pour un établissement, toutes fonctionnalités incluses, et ${formatPriceEUR(LAUNCH_PRICING.extraMonthly)}/mois par établissement supplémentaire. C'est le tarif de l'offre de lancement : il est garanti à vie pour toute souscription avant le ${LAUNCH_OFFER_END_LABEL}, y compris si vous ajoutez un établissement plus tard. À partir du ${CURRENT_PRICING_START_LABEL}, le tarif standard sera de ${formatPriceEUR(CURRENT_PRICING.mainMonthly)}/mois.`
    : `LockHACCP est à ${formatPriceEUR(CURRENT_PRICING.mainMonthly)}/mois pour un établissement, toutes fonctionnalités incluses. Chaque établissement supplémentaire est à ${formatPriceEUR(CURRENT_PRICING.extraMonthly)}/mois. En paiement annuel, profitez de ${CURRENT_PRICING.annualDiscountLabel}.`;

  const FAQS = [
    {
      question: "Combien coûte LockHACCP ?",
      answer: pricingFaqAnswer,
    },
    {
      question: "Que change l'offre Pro ?",
      answer: `L'offre Pro, à ${formatPriceEUR(PRO_PRICING.mainMonthly)}/mois par établissement, comprend tout LockHACCP avec des relectures IA d'étiquettes illimitées. L'offre LockHACCP en comprend ${RELECTURES_IA_PAR_MOIS} par mois et par établissement. Dans les deux offres, la lecture sur l'appareil (code-barres, texte de l'étiquette) est gratuite et illimitée, et les alertes rappels produits et DLC sont incluses.`,
    },
    {
      question: "Combien coûtent les capteurs de température connectés ?",
      answer: `${formatPriceEUR(PRIX_CAPTEUR_MENSUEL)} TTC par capteur et par mois (ou ${formatPriceEUR(PRIX_CAPTEUR_ANNUEL)} par an), passerelle incluse, sans engagement et sans frais de mise en service. L'option s'ajoute à votre abonnement LockHACCP : un capteur par frigo, chambre froide ou congélateur.`,
    },
    {
      question: "Les prix sont-ils HT ou TTC ?",
      answer: `Tous nos prix sont TTC : il n'y a rien à ajouter. ${MENTION_TVA}.`,
    },
    {
      question: "Y a-t-il un essai gratuit ?",
      answer:
        "Oui, LockHACCP propose 1 mois d'essai gratuit, sans engagement et sans carte bancaire. Vous pouvez tester toutes les fonctionnalités avant de vous abonner.",
    },
    {
      question: "LockHACCP est-il conforme aux exigences de la DDPP ?",
      answer:
        "Oui. LockHACCP suit les principes de la méthode HACCP et permet de générer des rapports conformes aux contrôles sanitaires de la DDPP (Direction Départementale de la Protection des Populations).",
    },
    {
      question: "Faut-il du matériel spécifique ?",
      answer:
        "Non, LockHACCP fonctionne sur smartphone, tablette et ordinateur depuis un navigateur. En option, nous louons une étiqueteuse professionnelle et une tablette protégée pour la cuisine.",
    },
    {
      question: "Mes données sont-elles sécurisées et hébergées en Europe ?",
      answer:
        "Oui, vos données sont hébergées en Europe (Supabase) et nous respectons strictement le RGPD. Vous restez propriétaire de vos données à tout moment.",
    },
    {
      question: "Comment résilier mon abonnement ?",
      answer:
        "Depuis l'application, à tout moment. L'abonnement est sans engagement et sans préavis.",
    },
  ];

  const additionalOptions = [
    {
      icon: Printer,
      name: "Étiqueteuse",
      description: "Imprimez vos étiquettes de production directement depuis l'application",
      includes: [
        "Étiqueteuse professionnelle fournie",
        "Impression directe depuis l'application",
        "Nom, DLC, n° de lot et allergènes sur l'étiquette",
        "Location, sans achat de matériel",
      ],
    },
    {
      icon: Tablet,
      name: "Tablette avec protection",
      description: "Tablette professionnelle résistante pour une utilisation en cuisine",
      includes: [
        "Tablette fournie avec sa protection",
        "Pensée pour un usage en cuisine",
        "Location, sans achat de matériel",
      ],
    },
  ];

  const proCard = (
    <PricingGridCard
      pricing={PRO_PRICING}
      title="Pro"
      badgeLabel={PRO_EN_VENTE ? "IA illimitée" : "Bientôt disponible"}
      note="Relectures IA d'étiquettes illimitées"
      highlighted={false}
      showCta
      features={PRO_FEATURES}
      ctaLabel={PRO_EN_VENTE ? "Essayer 1 mois gratuit" : "Essayer LockHACCP gratuitement"}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`Tarifs LockHACCP : logiciel HACCP à ${formatPriceEUR(activePricing.mainMonthly)}/mois`}
        description={`LockHACCP à ${formatPriceEUR(activePricing.mainMonthly)}/mois TTC par établissement, ou Pro à ${formatPriceEUR(PRO_PRICING.mainMonthly)}/mois avec lecture IA des étiquettes illimitée. Essai gratuit 1 mois sans engagement.`}
        path="/tarifs"
        jsonLd={[
          softwareAppJsonLd(maintenant),
          breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Tarifs", path: "/tarifs" }]),
          faqJsonLd(FAQS),
        ]}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={headerRef}
            className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
              headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 mb-6">
              <span className="text-sm font-semibold text-primary">Essai gratuit de 1 mois</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Tarifs du <span className="text-primary">logiciel HACCP</span>, adaptés à votre établissement
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Commencez gratuitement pendant 1 mois, sans engagement. Découvrez toutes les fonctionnalités et choisissez l'offre qui vous convient.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/demander-demo">
                Demander une démo gratuite
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-6 bg-primary/5 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <p className="text-foreground">
            <strong>Nouveau :</strong> générez gratuitement le Plan de Maîtrise Sanitaire de votre établissement —
            affichages obligatoires, tableau HACCP et registres.{" "}
            <Link to="/pms" className="font-semibold text-primary underline underline-offset-4">Créer mon PMS gratuit</Link>
          </p>
        </div>
      </section>

      <section className="py-8 bg-background border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="sr-only">Nos formules</h2>
          <div
            ref={plansRef}
            className={`grid gap-6 mx-auto transition-all duration-500 ${
              plansVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            } ${launchActive ? "md:grid-cols-3 max-w-6xl" : "md:grid-cols-2 max-w-4xl"}`}
          >
            {launchActive ? (
              <>
                <PricingGridCard
                  pricing={LAUNCH_PRICING}
                  title="Offre de lancement"
                  badgeLabel="Garanti à vie"
                  note={`Jusqu'au ${LAUNCH_OFFER_END_LABEL} inclus`}
                  highlighted
                  showCta
                  features={STANDARD_FEATURES}
                />
                <PricingGridCard
                  pricing={CURRENT_PRICING}
                  title="Tarif à venir"
                  badgeLabel={`À partir du ${CURRENT_PRICING_START_LABEL}`}
                  note="Grille standard, après l'offre de lancement"
                  highlighted={false}
                  showCta={false}
                  features={STANDARD_FEATURES}
                />
                {proCard}
              </>
            ) : (
              <>
                <PricingGridCard
                  pricing={CURRENT_PRICING}
                  title="LockHACCP"
                  badgeLabel="Toutes fonctionnalités incluses"
                  note="Pour votre établissement"
                  highlighted
                  showCta
                  features={STANDARD_FEATURES}
                />
                {proCard}
              </>
            )}
          </div>

          <p className="max-w-4xl mx-auto mt-6 text-center text-sm text-muted-foreground">
            Tous les prix sont TTC. {MENTION_TVA}.
          </p>

          {launchActive && (
            <div className="max-w-4xl mx-auto mt-6 flex items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary-light p-4">
              <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <strong>Engagement de lancement :</strong> cette offre se termine le {LAUNCH_OFFER_END_LABEL}. Le tarif de lancement reste acquis à vie à tout restaurateur qui souscrit avant cette date — y compris si vous ajoutez un établissement supplémentaire plus tard.
              </p>
            </div>
          )}

          <div className="max-w-4xl mx-auto mt-6 text-center">
            <Link to="/contact-entreprise" className="text-sm text-primary hover:underline">
              Plusieurs établissements à équiper ? Parlez-en à notre équipe →
            </Link>
          </div>
        </div>
      </section>

      {/* L'IA dans LockHACCP */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4 text-center">
            Ce que fait l'IA pour vous
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Vous prenez déjà la photo de l'étiquette. LockHACCP la fait travailler pour vous.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ScanLine, titre: "Lecture des étiquettes", texte: "Le produit, le lot et la DLC se remplissent tout seuls. Vous validez d'un toucher." },
              { icon: Bell, titre: "Rappels produits", texte: "Si un produit que vous avez reçu est rappelé, vous êtes prévenu." },
              { icon: CalendarClock, titre: "DLC", texte: "La liste des produits à utiliser en priorité, sans rien saisir." },
            ].map((p) => (
              <div key={p.titre} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <p.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{p.titre}</h3>
                <p className="text-sm text-muted-foreground">{p.texte}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center mt-6">
            La lecture sur votre appareil est gratuite et illimitée dans les deux offres. Quand une étiquette est
            difficile à lire, une relecture IA prend le relais : {RELECTURES_IA_PAR_MOIS} par mois et par établissement
            avec l'offre LockHACCP, illimitée avec l'offre Pro.
          </p>
        </div>
      </section>

      {/* Option Capteurs connectés */}
      <section id="capteurs" className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-primary/10 mb-4">
                <Radio className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Option{CAPTEURS_EN_VENTE ? "" : " : bientôt disponible"}
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Capteurs connectés
              </h2>
              <p className="text-muted-foreground mb-6">
                Un capteur dans chaque frigo ou congélateur mesure la température toutes les 10 minutes. Si elle
                sort des limites, vous êtes prévenu, même la nuit et le week-end. Les relevés s'écrivent tout seuls
                dans votre registre.
              </p>
              <Link
                to={CHEMIN_CAPTEURS}
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
              >
                Tout savoir sur les capteurs connectés
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-card rounded-2xl p-6 border border-border shadow-card flex flex-col">
              <p className="text-3xl font-bold text-foreground">
                {formatPriceEUR(PRIX_CAPTEUR_MENSUEL)}
                <span className="text-sm font-normal text-muted-foreground"> TTC par capteur et par mois</span>
              </p>
              <p className="text-xs text-muted-foreground mb-5">
                ou {formatPriceEUR(PRIX_CAPTEUR_ANNUEL)} TTC par capteur et par an, passerelle incluse
              </p>
              <ul className="space-y-2 mb-6">
                {POINTS_CAPTEURS.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ul>
              {(() => {
                const lien = lienCommandeCapteurs();
                return (
                  <Button className="w-full" variant="accent" asChild>
                    {lien.externe ? <a href={lien.href}>{lien.libelle}</a> : <Link to={lien.href}>{lien.libelle}</Link>}
                  </Button>
                );
              })()}
              <p className="text-xs text-muted-foreground mt-3 text-center">{MENTION_TVA}.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Options */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Matériel en option
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Une étiqueteuse et une tablette pour la cuisine, en location,
              sans achat de matériel.
            </p>
          </div>

          <div
            ref={optionsRef}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {additionalOptions.map((option, index) => (
              <div
                key={option.name}
                className={`bg-card rounded-2xl p-6 border border-border shadow-card transition-all duration-500 ${
                  optionsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center mb-4">
                  <option.icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="font-heading text-lg font-bold text-foreground mb-2">
                  {option.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {option.description}
                </p>

                <ul className="space-y-2 mb-4">
                  {option.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/demander-demo">
                    En savoir plus
                  </Link>
                </Button>
              </div>
            ))}
          </div>

        </div>
      </section>

      <SectionReglementation
        titre="La méthode HACCP, et pourquoi elle vous concerne"
        intro="Depuis 2006, le règlement européen 852/2004 oblige tout restaurant à appliquer une démarche fondée sur les principes HACCP et à garder la trace de ses contrôles. Ces enregistrements sont ce que l'inspecteur de la DDPP feuillette en premier, et c'est ce que LockHACCP tient pour vous au quotidien."
        points={[
          { titre: "Repérer les dangers", texte: "Biologiques, chimiques, physiques et allergènes, de la livraison à l'assiette." },
          { titre: "Surveiller les points critiques", texte: "Stockage au froid, cuisson, refroidissement, maintien au chaud : des limites à respecter et à mesurer." },
          { titre: "Corriger les écarts", texte: "Chaque dépassement appelle une action, notée sur le moment, avec la personne qui l'a faite." },
          { titre: "Garder la preuve", texte: "Relevés, réceptions, nettoyage, actions correctives : sans enregistrement, rien ne prouve que la méthode est appliquée." },
        ]}
        sources={[SOURCES.hygiene852, SOURCES.arrete2009]}
      />

      <FaqSection
        items={FAQS}
        title="Questions fréquentes sur les tarifs"
        description="Tout ce qu'il faut savoir avant de choisir votre formule."
      />

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Prêt à simplifier votre conformité HACCP ?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Profitez de 1 mois d'essai gratuit et découvrez comment LockHACCP peut transformer votre quotidien.
          </p>
          <Button variant="accent" size="xl" asChild>
            <Link to="/demander-demo">
              Demander une démo gratuite
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <RelatedLinks
        items={[
          { to: "/", label: "Le logiciel HACCP pour restaurateurs", description: "Toutes les fonctionnalités de LockHACCP." },
          { to: "/blog/methode-haccp-guide-complet", label: "Les 7 principes HACCP", description: "La méthode expliquée avec des exemples de cuisine." },
          { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
        ]}
      />

      <Footer />
    </div>
  );
};

export default Pricing;
