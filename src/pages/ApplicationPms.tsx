import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gift, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { FaqSection, type FaqItem } from "@/components/FaqSection";
import { TrustBadges } from "@/components/TrustBadges";
import { RelatedLinks } from "@/components/RelatedLinks";
import { BlocApplication } from "@/components/BlocApplication";
import { TOUTES_FONCTIONNALITES } from "@/lib/fonctionnalites-liens";
import { breadcrumbJsonLd, faqJsonLd, softwareAppJsonLd } from "@/lib/seo-jsonld";
import { useMaintenant } from "@/hooks/useMaintenant";
import { formatPriceEUR, getActivePricing } from "@/lib/launch";
import { APP_URL } from "@/lib/links";

const FAQS: FaqItem[] = [
  {
    question: "Qu'est-ce qu'une application PMS ?",
    answer:
      "Le Plan de Maîtrise Sanitaire (PMS) est le dossier d'hygiène d'un établissement alimentaire. Une application PMS remplace les fiches papier de ce dossier : relevés de température, plan de nettoyage, traçabilité, avec un historique prêt pour le contrôle.",
  },
  {
    question: "Le PMS est-il gratuit ?",
    answer:
      "Oui, le générateur de PMS de LockHACCP est gratuit. Vous répondez à un questionnaire d'environ 10 minutes et vous recevez un dossier adapté à votre établissement : tableau HACCP, plan de nettoyage, fiches de traçabilité et affichages obligatoires, prêts à imprimer.",
  },
  {
    question: "Faut-il l'application pour utiliser le PMS ?",
    answer:
      "Non. Le dossier s'imprime et se remplit à la main. L'application remplace simplement les fiches papier : relevés sur téléphone ou tablette, rappels, photos des étiquettes et historique consultable.",
  },
  {
    question: "Quelle appli HACCP et PMS choisir ?",
    answer:
      "Comparez le prix affiché, la durée d'essai, la présence d'un PMS adapté à votre établissement et l'aide au paramétrage. LockHACCP propose un PMS personnalisé gratuit et le paramétrage de l'application offert. Notre comparatif détaille les solutions du marché.",
  },
  {
    question: "Quelle différence entre le PMS gratuit et l'application ?",
    answer:
      "Le PMS gratuit est le dossier documentaire : il décrit ce qu'il faut faire. L'application sert à le faire vivre au quotidien et à garder la preuve de chaque contrôle.",
  },
  {
    question: "Combien de temps puis-je essayer l'application ?",
    answer:
      "L'essai est de 1 mois, sans engagement et sans carte bancaire. Si vous créez d'abord votre PMS gratuit sur le site, l'essai passe à 2 mois.",
  },
];

const POINTS = [
  "Relevés de température avec rappels chaque matin",
  "Plan de nettoyage par zone, tâches validées et signées",
  "Traçabilité des produits en photo, export PDF ou Excel",
  "Contrôle à réception, étiquettes de production, huiles de friture et check-lists",
];

const ApplicationPms = () => {
  const maintenant = useMaintenant();
  const tarif = getActivePricing(maintenant);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Appli HACCP et PMS pour restaurants"
        description="Appli HACCP et PMS pour restaurants : températures, nettoyage, traçabilité sur téléphone. PMS personnalisé gratuit, paramétrage offert et 2 mois d'essai."
        path="/application-pms"
        jsonLd={[
          softwareAppJsonLd(maintenant),
          breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Application PMS", path: "/application-pms" }]),
          faqJsonLd(FAQS),
        ]}
      />
      <Navbar />

      <section className="pt-32 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
            L'appli <span className="text-primary">HACCP et PMS</span> de LockHACCP
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Le Plan de Maîtrise Sanitaire de votre établissement, sur téléphone ou tablette : relevés, nettoyage et
            traçabilité au quotidien, avec un historique prêt pour le contrôle.
          </p>
          <div className="flex flex-col items-center sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <a href={APP_URL}>
                Essayer l'application
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/pms">Créer mon PMS gratuit</Link>
            </Button>
            <Button variant="heroOutline" size="xl" asChild>
              <Link to="/demander-demo">Demander une démo</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ce que fait l'application PMS</h2>
          <p className="text-muted-foreground mb-6">
            Le PMS décrit ce qu'il faut faire. L'application sert à le faire chaque jour et à en garder la trace, sans fiches
            papier à remplir, classer et retrouver le jour d'un contrôle.
          </p>
          <ul className="space-y-3">
            {POINTS.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Commencez par votre PMS gratuit</h2>
          <p className="text-muted-foreground mb-4">
            Répondez à un questionnaire d'environ 10 minutes : vous recevez un PMS personnalisé à votre établissement, avec
            tableau HACCP, plan de nettoyage, fiches de traçabilité et affichages obligatoires, prêts à imprimer. Réalisé
            avec l'expertise de SF FORMATION, organisme de formation à l'hygiène alimentaire.
          </p>
          <p className="text-muted-foreground mb-4">
            Un PMS qui n'est pas adapté à votre cuisine ne sert à rien le jour du contrôle : c'est pourquoi le vôtre est
            construit à partir de vos zones, de vos équipements et de votre activité. Le paramétrage de l'application est
            offert.
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/pms">
              Créer mon PMS gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Vous comparez les outils ? Voyez notre{" "}
            <Link to="/blog/logiciel-pms-gratuit-comparatif" className="text-primary underline underline-offset-4">comparatif des logiciels PMS gratuits</Link>.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Vous voulez d'abord comprendre le dossier ? Lisez notre{" "}
            <Link to="/plan-de-maitrise-sanitaire" className="text-primary underline underline-offset-4">guide du Plan de Maîtrise Sanitaire</Link>.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
              <Gift className="h-4 w-4" /> Essai
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              2 mois d'essai offerts avec votre PMS
            </h2>
            <p className="text-muted-foreground">
              Sans votre PMS, l'essai de l'application est de 1 mois, sans engagement et sans carte bancaire. Si vous créez
              d'abord votre PMS gratuit sur le site, l'essai passe à 2 mois.
            </p>
            <BlocApplication />
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Tarif de l'application</h2>
          <p className="text-muted-foreground mb-4">
            {formatPriceEUR(tarif.mainMonthly)} par mois et par établissement, toutes fonctionnalités incluses, et{" "}
            {formatPriceEUR(tarif.extraMonthly)} par mois par établissement supplémentaire. Sans engagement, résiliable depuis
            l'application.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/tarifs">Voir tous les tarifs</Link>
          </Button>
        </div>
      </section>

      <FaqSection items={FAQS} title="Questions sur l'application PMS" />
      <RelatedLinks items={TOUTES_FONCTIONNALITES} />
      <Footer />
    </div>
  );
};

export default ApplicationPms;
