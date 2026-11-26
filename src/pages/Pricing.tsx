import { Button } from "@/components/ui/button";
import { useMaintenant } from "@/hooks/useMaintenant";
import { useState } from "react";
import { Check, ArrowRight, Printer, Tablet, ShieldCheck, ScanLine, Bell, CalendarClock, Radio, FileText, GraduationCap, BadgeEuro } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo-jsonld";
import { SIGNUP_URL } from "@/lib/links";
import { FaqSection } from "@/components/FaqSection";
import { TrustBadges } from "@/components/TrustBadges";
import CTASection from "@/components/CTASection";
import { Accent, ListeCoches, Surtitre, TITRE_H2 } from "@/components/design/elements";
import { EcranVideo, Telephone3D } from "@/components/accueil/Telephone3D";
import { VIDEOS_APP } from "@/lib/videos-app";
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
  LECTURES_IA_PRO,
  RELECTURES_IA_PAR_MOIS,
  type PricingGrid,
} from "@/lib/launch";
import {
  CAPTEURS_EN_VENTE,
  CHEMIN_CAPTEURS,
  POINTS_CAPTEURS,
  PRIX_CAPTEUR,
  PRIX_PASSERELLE,
  lienCommandeCapteurs,
} from "@/lib/capteurs";
import { economieAnnuelle, mensuelEquivalent, type Facturation } from "@/lib/tarifs-affichage";

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

// Offre LockHACCP : tout, avec un crédit de lectures IA chaque mois.
const STANDARD_FEATURES = [
  ...MAIN_FEATURES,
  "Alertes rappels produits et DLC",
  `${RELECTURES_IA_PAR_MOIS} lectures IA par mois et par établissement (étiquettes et bons de livraison)`,
];

// Offre Pro : la même chose, avec 500 lectures IA par mois.
const PRO_FEATURES = [
  "Tout de l'offre LockHACCP",
  `${LECTURES_IA_PRO} lectures IA par mois et par établissement (étiquettes et bons de livraison)`,
  "Lot, DLC et produit remplis tout seuls, même sur les étiquettes difficiles",
  "Idéal si vous recevez beaucoup de produits",
];

/** Points qui distinguent LockHACCP, tous vérifiables dans l'application ou sur le site. */
const DIFFERENCES = [
  {
    icon: FileText,
    titre: "Votre PMS gratuit, qui configure l'application",
    texte:
      "Répondez au questionnaire en 10 minutes et recevez votre Plan de Maîtrise Sanitaire complet. À l'inscription, LockHACCP reprend vos réponses : frigos et congélateurs avec leurs températures, friteuses, zones et surfaces à nettoyer sont déjà en place.",
    lien: { to: "/plan-de-maitrise-sanitaire", libelle: "Créer mon PMS gratuit" },
  },
  {
    icon: GraduationCap,
    titre: "Conçu par un organisme de formation à l'hygiène",
    texte:
      "LockHACCP est conçu avec SF FORMATION, organisme certifié Qualiopi et autorisé par la préfecture à dispenser la formation obligatoire de 14 heures en hygiène alimentaire. Les règles de l'application sont celles que nous enseignons.",
    lien: { to: "/auteur/alan-touati", libelle: "Qui sommes-nous" },
  },
  {
    icon: Radio,
    titre: "Des capteurs achetés, pas loués",
    texte: `Passerelle ${formatPriceEUR(PRIX_PASSERELLE)} et ${formatPriceEUR(PRIX_CAPTEUR)} par capteur, payés une seule fois, livraison comprise. Pas d'abonnement capteurs : le matériel vous appartient.`,
    lien: { to: CHEMIN_CAPTEURS, libelle: "Voir les capteurs" },
  },
  {
    icon: BadgeEuro,
    titre: "Aucun frais caché",
    texte:
      "Pas de frais de mise en service, pas d'engagement, toutes les fonctionnalités dès la première offre. Prix nets : il n'y a rien à ajouter.",
    lien: null,
  },
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
  facturation: Facturation;
}

/** Carte d'une formule. En annuel, l'équivalent mensuel en grand et le montant facturé dessous. */
const PricingGridCard = ({ pricing, title, badgeLabel, note, highlighted, showCta, features, ctaLabel, facturation }: PricingGridCardProps) => {
  const annuel = facturation === "annuel";
  const prixPrincipal = annuel ? mensuelEquivalent(pricing.mainYearly) : pricing.mainMonthly;
  const prixSupplementaire = annuel ? mensuelEquivalent(pricing.extraYearly) : pricing.extraMonthly;
  const doux = highlighted ? "text-white/70" : "text-muted-foreground";
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[2rem] p-7 sm:p-9 ${
        highlighted
          ? "bg-primary text-white shadow-[0_40px_80px_-40px_hsl(211_100%_26%/0.8)] ring-2 ring-secondary/70"
          : "border border-border/80 bg-white/90 shadow-[0_30px_70px_-45px_hsl(211_100%_20%/0.45)]"
      }`}
    >
      {highlighted && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[hsl(211_100%_45%)]/40 blur-3xl" />
        </div>
      )}
      <div className="relative flex flex-1 flex-col">
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${
            highlighted ? "bg-secondary text-secondary-foreground" : "bg-primary-light text-primary"
          }`}
        >
          {badgeLabel}
        </span>
        <h3 className={`mt-5 font-heading text-2xl font-extrabold ${highlighted ? "text-white" : "text-foreground"}`}>{title}</h3>
        <p className={`mt-1 text-sm ${doux}`}>{note}</p>

        <div className="mt-7">
          <p className={`text-xs font-semibold uppercase tracking-wider ${doux}`}>Établissement principal</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className={`font-heading text-5xl font-extrabold tracking-tight ${highlighted ? "text-white" : "text-foreground"}`}>
              {formatPriceEUR(prixPrincipal)}
            </span>
            <span className={`text-sm ${doux}`}>/mois TTC</span>
          </p>
          <p className={`mt-1 text-sm ${doux}`}>
            {annuel
              ? `soit ${formatPriceEUR(pricing.mainYearly)} par an`
              : `ou ${formatPriceEUR(mensuelEquivalent(pricing.mainYearly))}/mois en annuel`}
          </p>
        </div>

        <div className={`mt-5 flex items-center justify-between gap-4 rounded-2xl px-4 py-3 text-sm ${highlighted ? "bg-white/10" : "bg-[hsl(220_33%_97%)]"}`}>
          <span className={doux}>Établissement supplémentaire</span>
          <span className="text-right">
            <span className={`font-bold ${highlighted ? "text-white" : "text-foreground"}`}>{formatPriceEUR(prixSupplementaire)}/mois</span>
            <span className={`block text-xs ${doux}`}>
              {annuel ? `soit ${formatPriceEUR(pricing.extraYearly)} par an` : `ou ${formatPriceEUR(mensuelEquivalent(pricing.extraYearly))}/mois en annuel`}
            </span>
          </span>
        </div>

        <p className={`mt-4 text-sm font-medium ${highlighted ? "text-secondary" : "text-secondary-texte"}`}>
          {annuel
            ? `Paiement annuel : ${formatPriceEUR(economieAnnuelle(pricing.mainMonthly, pricing.mainYearly))} économisés par an sur l'établissement principal`
            : "Paiement mensuel, sans engagement, résiliable à tout moment"}
        </p>

        {showCta && (
          <Button variant={highlighted ? "accent" : "hero"} size="lg" asChild className="group mt-7 w-full">
            <a href={SIGNUP_URL}>
              {ctaLabel ?? "Essayer 14 jours gratuitement"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        )}

        <ul className={`mt-8 space-y-3 border-t pt-7 text-sm ${highlighted ? "border-white/15" : "border-border/80"}`}>
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  highlighted ? "bg-secondary" : "bg-primary-light"
                }`}
              >
                <Check className={`h-3 w-3 ${highlighted ? "text-secondary-foreground" : "text-primary"}`} strokeWidth={3} />
              </span>
              <span className={highlighted ? "text-white/90" : "text-foreground"}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

/** Choix du rythme de paiement : pastille qui glisse sous l'option choisie. */
function ChoixFacturation({ valeur, onChange }: { valeur: Facturation; onChange: (f: Facturation) => void }) {
  const options = [
    { valeur: "annuel", libelle: "Annuel", detail: "2 mois offerts" },
    { valeur: "mensuel", libelle: "Mensuel", detail: null },
  ] as const;
  return (
    <div role="group" aria-label="Rythme de paiement" className="relative inline-grid grid-cols-2 rounded-full border border-border/80 bg-white/90 p-1.5 shadow-sm">
      <span
        aria-hidden="true"
        className={`absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-primary shadow-[0_8px_20px_-8px_hsl(211_100%_26%/0.7)] transition-transform duration-300 ease-out ${
          valeur === "mensuel" ? "translate-x-full" : ""
        }`}
      />
      {options.map((o) => (
        <button
          key={o.valeur}
          type="button"
          aria-pressed={valeur === o.valeur}
          onClick={() => onChange(o.valeur)}
          className={`relative z-10 flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition-colors sm:gap-2 sm:px-7 ${
            valeur === o.valeur ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.libelle}
          {o.detail && (
            <span
              className={`whitespace-nowrap rounded-full px-1.5 py-0.5 text-[0.68rem] font-bold sm:px-2 sm:text-[0.7rem] ${
                valeur === o.valeur ? "bg-secondary text-secondary-foreground" : "bg-secondary-light text-secondary-texte"
              }`}
            >
              {o.detail}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

const Pricing = () => {
  const [facturation, setFacturation] = useState<Facturation>("annuel");
  const maintenant = useMaintenant();
  const launchActive = isLaunchOfferActive(maintenant);
  const activePricing = launchActive ? LAUNCH_PRICING : CURRENT_PRICING;
  const pricingFaqAnswer = launchActive
    ? `LockHACCP est à ${formatPriceEUR(LAUNCH_PRICING.mainMonthly)}/mois pour un établissement, toutes fonctionnalités incluses, et ${formatPriceEUR(LAUNCH_PRICING.extraMonthly)}/mois par établissement supplémentaire. C'est le tarif de l'offre de lancement : il est garanti à vie pour toute souscription avant le ${LAUNCH_OFFER_END_LABEL}, y compris si vous ajoutez un établissement plus tard. À partir du ${CURRENT_PRICING_START_LABEL}, le tarif standard sera de ${formatPriceEUR(CURRENT_PRICING.mainMonthly)}/mois.`
    : `LockHACCP est à ${formatPriceEUR(CURRENT_PRICING.mainYearly)} par an pour un établissement, soit ${formatPriceEUR(mensuelEquivalent(CURRENT_PRICING.mainYearly))} par mois, toutes fonctionnalités incluses. Au mois, sans engagement, c'est ${formatPriceEUR(CURRENT_PRICING.mainMonthly)}. Chaque établissement supplémentaire est à ${formatPriceEUR(CURRENT_PRICING.extraYearly)} par an ou ${formatPriceEUR(CURRENT_PRICING.extraMonthly)} par mois.`;

  const FAQS = [
    {
      question: "Combien coûte LockHACCP ?",
      answer: pricingFaqAnswer,
    },
    {
      question: "Que change l'offre Pro ?",
      answer: `L'offre Pro, à ${formatPriceEUR(mensuelEquivalent(PRO_PRICING.mainYearly))}/mois par établissement en paiement annuel (${formatPriceEUR(PRO_PRICING.mainYearly)} par an) ou ${formatPriceEUR(PRO_PRICING.mainMonthly)} au mois, comprend tout LockHACCP avec ${LECTURES_IA_PRO} lectures IA par mois et par établissement (étiquettes et bons de livraison). L'offre LockHACCP en comprend ${RELECTURES_IA_PAR_MOIS}. Dans les deux offres, la lecture sur l'appareil (code-barres, texte de l'étiquette) est gratuite et illimitée, et les alertes rappels produits et DLC sont incluses.`,
    },
    {
      question: "Combien coûtent les capteurs de température connectés ?",
      answer: `Le kit se paie une seule fois : ${formatPriceEUR(PRIX_PASSERELLE)} pour la passerelle (une par établissement) et ${formatPriceEUR(PRIX_CAPTEUR)} par capteur, livraison comprise. Pas d'abonnement capteurs, et le matériel vous appartient. Un capteur par frigo, chambre froide ou congélateur. Les relevés automatiques et les alertes fonctionnent avec votre abonnement LockHACCP, ou pendant votre période d'essai.`,
    },
    {
      question: "Les prix sont-ils HT ou TTC ?",
      answer: `Tous nos prix sont TTC : il n'y a rien à ajouter. ${MENTION_TVA}.`,
    },
    {
      question: "Y a-t-il un essai gratuit ?",
      answer:
        "Oui, LockHACCP propose 14 jours d'essai gratuit, sans engagement et sans carte bancaire. Vous pouvez tester toutes les fonctionnalités avant de vous abonner.",
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
      badgeLabel={PRO_EN_VENTE ? `${LECTURES_IA_PRO} lectures IA` : "Bientôt disponible"}
      note={`${LECTURES_IA_PRO} lectures IA par mois et par établissement`}
      highlighted={false}
      showCta
      features={PRO_FEATURES}
      ctaLabel={PRO_EN_VENTE ? "Essayer 14 jours gratuitement" : "Essayer LockHACCP gratuitement"}
      facturation={facturation}
    />
  );

  const lienCapteurs = lienCommandeCapteurs();

  return (
    <div className="min-h-screen">
      <Seo
        title={`Tarifs LockHACCP : logiciel HACCP dès ${formatPriceEUR(mensuelEquivalent(activePricing.mainYearly))}/mois`}
        description={`LockHACCP dès ${formatPriceEUR(mensuelEquivalent(activePricing.mainYearly))}/mois TTC en annuel (${formatPriceEUR(activePricing.mainYearly)}/an) ou ${formatPriceEUR(activePricing.mainMonthly)} au mois. PMS gratuit qui configure l'app. Essai gratuit 14 jours sans engagement.`}
        path="/tarifs"
        jsonLd={[
          softwareAppJsonLd(maintenant),
          breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Tarifs", path: "/tarifs" }]),
          faqJsonLd(FAQS),
        ]}
      />
      <Navbar />

      <main>
        {/* En-tête et formules : les prix sont visibles dès l'arrivée sur la page */}
        <section className="pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Essai gratuit de 14 jours
              </p>
              <h1 className="font-heading text-[clamp(2.3rem,5.4vw,4.3rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground">
                Tarifs du <Accent>logiciel HACCP</Accent>, adaptés à votre établissement
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Commencez gratuitement pendant 14 jours, sans engagement. Découvrez toutes les fonctionnalités et choisissez
                l'offre qui vous convient.
              </p>
              <Link
                to="/demander-demo"
                className="group mt-6 inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
              >
                Demander une démo gratuite
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <h2 className="sr-only">Nos formules</h2>
            <div className="mt-12 flex justify-center">
              <ChoixFacturation valeur={facturation} onChange={setFacturation} />
            </div>

            <div className={`mx-auto mt-10 grid items-start gap-6 ${launchActive ? "max-w-6xl lg:grid-cols-3" : "max-w-5xl md:grid-cols-2"}`}>
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
                    facturation={facturation}
                  />
                  <PricingGridCard
                    pricing={CURRENT_PRICING}
                    title="Tarif à venir"
                    badgeLabel={`À partir du ${CURRENT_PRICING_START_LABEL}`}
                    note="Grille standard, après l'offre de lancement"
                    highlighted={false}
                    showCta={false}
                    features={STANDARD_FEATURES}
                    facturation={facturation}
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
                    facturation={facturation}
                  />
                  {proCard}
                </>
              )}
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">Tous les prix sont TTC. {MENTION_TVA}.</p>

            {launchActive && (
              <div className="mx-auto mt-6 flex max-w-3xl items-start gap-3 rounded-2xl border border-secondary/30 bg-secondary-light/60 p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary-texte" />
                <p className="text-sm text-foreground">
                  <strong>Engagement de lancement :</strong> cette offre se termine le {LAUNCH_OFFER_END_LABEL}. Le tarif de
                  lancement reste acquis à vie à tout restaurateur qui souscrit avant cette date — y compris si vous ajoutez un
                  établissement supplémentaire plus tard.
                </p>
              </div>
            )}

            <div className="mx-auto mt-8 flex max-w-5xl flex-col items-stretch gap-4 md:flex-row">
              <Link
                to="/plan-de-maitrise-sanitaire"
                className="group flex flex-1 items-center gap-4 rounded-2xl border border-border/80 bg-white/85 p-5 transition-colors hover:border-secondary/50"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-white">
                  <FileText className="h-5 w-5" />
                </span>
                <span className="text-sm text-foreground">
                  <strong>Nouveau :</strong> générez gratuitement le Plan de Maîtrise Sanitaire de votre établissement :
                  affichages obligatoires, tableau HACCP et registres.{" "}
                  <span className="font-semibold text-primary underline underline-offset-4">Créer mon PMS gratuit</span>
                </span>
              </Link>
              <Link
                to="/contact-entreprise"
                className="group flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-white/85 p-5 text-sm font-semibold text-primary transition-colors hover:border-primary/40 md:w-80"
              >
                Plusieurs établissements à équiper ? Parlez-en à notre équipe
                <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <TrustBadges className="mt-14" />
          </div>
        </section>

        {/* Ce que les autres n'ont pas */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
              <h2 className={`${TITRE_H2} lg:col-span-7`}>Ce que vous ne trouverez pas ailleurs</h2>
              <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5">
                Comparez ce qui est compris dans le prix, pas seulement le prix.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {DIFFERENCES.map((d, i) => (
                <div
                  key={d.titre}
                  className={`flex flex-col rounded-3xl p-7 sm:p-8 ${
                    i === 0 ? "bg-secondary text-secondary-foreground" : "border border-border/80 bg-white/85"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      i === 0 ? "bg-white/30 text-secondary-foreground" : "bg-primary-light text-primary"
                    }`}
                  >
                    <d.icon className="h-6 w-6" />
                  </span>
                  <h3 className={`mt-6 font-heading text-xl font-bold ${i === 0 ? "text-secondary-foreground" : "text-foreground"}`}>{d.titre}</h3>
                  <p className={`mt-3 flex-1 leading-relaxed ${i === 0 ? "text-secondary-foreground/85" : "text-muted-foreground"}`}>{d.texte}</p>
                  {d.lien && (
                    <Link
                      to={d.lien.to}
                      className={`group mt-5 inline-flex items-center gap-1.5 font-semibold ${i === 0 ? "text-secondary-foreground underline underline-offset-4" : "text-primary"}`}
                    >
                      {d.lien.libelle}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* L'IA dans LockHACCP : la vidéo montre la lecture automatique d'un bon de livraison */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
              <div className="mx-auto w-[14rem] sm:w-[15.5rem] lg:order-2 lg:col-span-5 lg:w-[17rem]">
                <Telephone3D inclinaison="gauche" suivreSouris>
                  <EcranVideo video={VIDEOS_APP.reception} />
                </Telephone3D>
              </div>
              <div className="lg:order-1 lg:col-span-7">
                <Surtitre>L'IA dans LockHACCP</Surtitre>
                <h2 className={TITRE_H2}>Ce que fait l'IA pour vous</h2>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                  Vous prenez déjà la photo de l'étiquette. LockHACCP la fait travailler pour vous.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    { icon: ScanLine, titre: "Lecture des étiquettes", texte: "Le produit, le lot et la DLC se remplissent tout seuls. Vous validez d'un toucher." },
                    { icon: Bell, titre: "Rappels produits", texte: "Si un produit que vous avez reçu est rappelé, vous êtes prévenu." },
                    { icon: CalendarClock, titre: "DLC", texte: "La liste des produits à utiliser en priorité, sans rien saisir." },
                  ].map((p) => (
                    <li key={p.titre} className="flex gap-4 rounded-2xl border border-border/80 bg-white/85 p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <p.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-foreground">{p.titre}</h3>
                        <p className="mt-1 text-muted-foreground">{p.texte}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                  La lecture des étiquettes sur votre appareil est gratuite et illimitée dans les deux offres. Quand une
                  étiquette est difficile à lire, ou pour lire un bon de livraison, l'IA prend le relais : {RELECTURES_IA_PAR_MOIS}{" "}
                  lectures par mois et par établissement avec l'offre LockHACCP, {LECTURES_IA_PRO} avec l'offre Pro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Option Capteurs connectés */}
        <section id="capteurs" className="py-12 lg:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-border/80 bg-white/90 shadow-[0_30px_70px_-45px_hsl(211_100%_20%/0.45)] lg:grid-cols-2">
              <div className="p-8 sm:p-12">
                <span className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1.5 text-sm font-semibold text-primary">
                  <Radio className="h-4 w-4" />
                  Option{CAPTEURS_EN_VENTE ? "" : " : bientôt disponible"}
                </span>
                <h2 className="mt-5 font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground">
                  Capteurs connectés
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Un capteur dans chaque frigo ou congélateur mesure la température toutes les 10 minutes. Si elle sort des
                  limites, vous êtes prévenu, même la nuit et le week-end. Les relevés s'écrivent tout seuls dans votre
                  registre.
                </p>
                <Link to={CHEMIN_CAPTEURS} className="group mt-6 inline-flex items-center gap-2 font-semibold text-primary">
                  Tout savoir sur les capteurs connectés
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="relative overflow-hidden bg-[hsl(211_100%_13%)] p-8 text-white sm:p-12">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-secondary/25 blur-3xl" />
                <div className="relative">
                  <p className="flex items-baseline gap-2">
                    <span className="font-heading text-5xl font-extrabold tracking-tight text-secondary">{formatPriceEUR(PRIX_CAPTEUR)}</span>
                    <span className="text-white/75">par capteur, paiement unique</span>
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    + {formatPriceEUR(PRIX_PASSERELLE)} pour la passerelle, une seule fois par établissement
                  </p>
                  <ul className="mt-7 space-y-3 text-sm">
                    {POINTS_CAPTEURS.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" strokeWidth={3} />
                        <span className="text-white/90">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="accent" size="lg" asChild className="mt-8 w-full sm:w-auto">
                    {lienCapteurs.externe ? <a href={lienCapteurs.href}>{lienCapteurs.libelle}</a> : <Link to={lienCapteurs.href}>{lienCapteurs.libelle}</Link>}
                  </Button>
                  <p className="mt-4 text-xs text-white/55">{MENTION_TVA}.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Matériel en option */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:items-end">
              <h2 className={`${TITRE_H2} lg:col-span-7`}>Matériel en option</h2>
              <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5">
                Une étiqueteuse et une tablette pour la cuisine, en location, sans achat de matériel.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {additionalOptions.map((option) => (
                <div key={option.name} className="flex flex-col rounded-3xl border border-border/80 bg-white/85 p-7 sm:p-8">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <option.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 font-heading text-xl font-bold text-foreground">{option.name}</h3>
                  <p className="mt-2 text-muted-foreground">{option.description}</p>
                  <div className="mt-6 flex-1">
                    <ListeCoches items={option.includes} />
                  </div>
                  <Button variant="outline" asChild className="mt-7 w-fit">
                    <Link to="/demander-demo">En savoir plus</Link>
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

        <FaqSection items={FAQS} title="Questions fréquentes sur les tarifs" description="Tout ce qu'il faut savoir avant de choisir votre formule." />

        <CTASection
          texte="Profitez de 14 jours d'essai gratuit et découvrez comment LockHACCP peut transformer votre quotidien."
        />

        <RelatedLinks
          items={[
            { to: "/", label: "Le logiciel HACCP pour restaurateurs", description: "Toutes les fonctionnalités de LockHACCP." },
            { to: "/blog/methode-haccp-guide-complet", label: "Les 7 principes HACCP", description: "La méthode expliquée avec des exemples de cuisine." },
            { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
