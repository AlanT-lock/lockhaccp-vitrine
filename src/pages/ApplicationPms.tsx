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
import { formatPriceEUR, getActivePricing, RELECTURES_IA_PAR_MOIS } from "@/lib/launch";
import { APP_URL } from "@/lib/links";

const FAQS: FaqItem[] = [
  {
    question: "Qu'est-ce qu'une application HACCP ?",
    answer:
      "C'est une application qui remplace les fiches papier de vos autocontrôles HACCP : relevés de température, plan de nettoyage, contrôle à réception, traçabilité, étiquettes. Chaque contrôle est daté et signé, et l'historique est prêt pour l'inspecteur. Ces fiches font partie de votre Plan de Maîtrise Sanitaire (PMS), le dossier d'hygiène de l'établissement.",
  },
  {
    question: "Existe-t-il une application HACCP gratuite ?",
    answer:
      "Le Plan de Maîtrise Sanitaire de LockHACCP est gratuit, et l'application s'essaie 1 mois sans engagement et sans carte bancaire. Ensuite, l'application est payante, avec un prix affiché sur le site. Méfiez-vous des applications « gratuites » qui facturent la mise en place, le matériel ou chaque établissement supplémentaire : comparez le coût total sur un an.",
  },
  {
    question: "L'application HACCP fonctionne-t-elle sur tablette et sur ordinateur ?",
    answer:
      "Oui. LockHACCP s'installe sur iPhone et Android, et s'utilise aussi depuis un navigateur sur tablette ou ordinateur. Chaque membre de l'équipe a son code personnel, pour que chaque contrôle soit signé par la bonne personne. Une tablette protégée pour la cuisine est proposée en location, en option.",
  },
  {
    question: "L'application HACCP fonctionne-t-elle sans réseau ?",
    answer:
      "Oui. L'application fonctionne hors connexion : vous pouvez faire vos relevés de température ou valider le nettoyage dans une chambre froide, une réserve en sous-sol ou une cuisine où le réseau passe mal.",
  },
  {
    question: "Où sont hébergées les données de l'application ?",
    answer:
      "Dans l'Union européenne, conformément au RGPD. Vos relevés et votre historique restent consultables et exportables en PDF pour un contrôle.",
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
    question: "Comment choisir une application HACCP ?",
    answer:
      "Comparez le prix affiché par mois et par établissement, la durée d'essai, l'engagement, le matériel imposé ou non, la présence d'un PMS adapté à votre établissement et l'aide au paramétrage. LockHACCP propose un PMS personnalisé gratuit, le paramétrage de l'application offert, sans engagement ni matériel imposé. Notre comparatif détaille les solutions du marché.",
  },
  {
    question: "Quelle différence entre le PMS gratuit et l'application ?",
    answer:
      "Le PMS gratuit est le dossier documentaire : il décrit ce qu'il faut faire. L'application sert à le faire vivre au quotidien et à garder la preuve de chaque contrôle.",
  },
  {
    question: "Combien de temps puis-je essayer l'application ?",
    answer:
      "L'essai est de 1 mois, sans engagement et sans carte bancaire. Il démarre le jour où vous créez votre compte. Si vous avez d'abord créé votre PMS gratuit sur le site avec la même adresse e-mail, l'application est paramétrée automatiquement à partir de votre PMS.",
  },
];

const POINTS = [
  "Relevés de température avec rappels chaque matin, consigne par équipement et actions correctives",
  "Plan de nettoyage par zone, tâches validées et signées",
  "Contrôle à réception des marchandises et traçabilité des produits en photo, export PDF",
  "Étiquettes de production (DLC, lot, allergènes), huiles de friture et check-lists d'ouverture et de fermeture",
];

const ApplicationPms = () => {
  const maintenant = useMaintenant();
  const tarif = getActivePricing(maintenant);

  return (
    <div className="min-h-screen">
      <Seo
        title="Application HACCP sur téléphone et tablette"
        description="Application HACCP pour restaurants et métiers de bouche : températures, nettoyage, traçabilité, étiquettes. iPhone, Android, tablette. Essai 1 mois."
        path="/application-pms"
        jsonLd={[
          softwareAppJsonLd(maintenant),
          breadcrumbJsonLd([{ name: "Accueil", path: "/" }, { name: "Application HACCP", path: "/application-pms" }]),
          faqJsonLd(FAQS),
        ]}
      />
      <Navbar />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-6">
            L'<span className="text-primary">application HACCP</span> pour restaurants et métiers de bouche
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Vos autocontrôles HACCP sur téléphone ou tablette : relevés de température, nettoyage, réception et
            traçabilité au quotidien, avec un historique prêt pour le contrôle. Paramétrée à partir de votre Plan de
            Maîtrise Sanitaire, gratuit.
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

      <section className="py-8 border-y border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TrustBadges />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Ce que fait l'application HACCP</h2>
          <p className="text-muted-foreground mb-6">
            Votre Plan de Maîtrise Sanitaire décrit ce qu'il faut faire. L'application sert à le faire chaque jour et à en
            garder la trace, sans fiches papier à remplir, classer et retrouver le jour d'un contrôle.
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

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <h2 className="font-heading text-3xl font-bold text-foreground">Sur téléphone, tablette ou ordinateur</h2>
          <p className="text-muted-foreground">
            L'application s'installe sur iPhone et Android, et s'utilise aussi depuis un navigateur. Le commis valide le
            nettoyage sur son téléphone, le second fait les relevés sur la tablette de la cuisine, le gérant consulte
            l'historique depuis son ordinateur. Chacun a son code personnel : chaque contrôle est signé par la personne
            qui l'a fait. L'application fonctionne aussi sans réseau, dans une chambre froide ou une réserve en sous-sol.
          </p>
          <p className="text-muted-foreground">
            Aucun matériel n'est imposé. Si vous le souhaitez, les{" "}
            <Link to="/fonctionnalites/etiquettes" className="text-primary underline underline-offset-4">étiquettes DLC</Link>{" "}
            s'impriment sur une étiqueteuse Brother, Zebra ou Epson, les{" "}
            <Link to="/capteurs-connectes" className="text-primary underline underline-offset-4">capteurs de température connectés</Link>{" "}
            s'achètent sans abonnement, et une tablette protégée pour la cuisine est proposée en location. L'offre inclut{" "}
            {RELECTURES_IA_PAR_MOIS} lectures par intelligence artificielle par mois pour lire automatiquement étiquettes et
            bons de livraison. Les données sont hébergées dans l'Union européenne.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-4">
          <h2 className="font-heading text-3xl font-bold text-foreground">Une application conçue avec un formateur en hygiène</h2>
          <p className="text-muted-foreground">
            LockHACCP a été créée par{" "}
            <Link to="/auteur/alan-touati" className="text-primary underline underline-offset-4">Alan Touati</Link>,
            formateur en hygiène alimentaire chez SF FORMATION. Les écrans suivent ce que l'inspecteur de la DDPP demande
            à voir : la consigne de chaque équipement, l'action corrective quand un relevé dépasse, la preuve que le
            nettoyage est fait, l'origine de chaque produit.
          </p>
          <p className="text-muted-foreground">
            LockHACCP est à la fois une application mobile et un logiciel en ligne : la présentation complète du{" "}
            <Link to="/" className="text-primary underline underline-offset-4">logiciel HACCP pour restaurateurs</Link>{" "}
            est sur notre page d'accueil.
          </p>
        </div>
      </section>

      <section className="py-16">
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
            Pas sûr de la différence entre les deux notions ?{" "}
            <Link to="/blog/difference-pms-haccp" className="text-primary underline underline-offset-4">PMS et HACCP : quelle différence ?</Link>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Vous voulez d'abord comprendre le dossier ? Lisez notre{" "}
            <Link to="/plan-de-maitrise-sanitaire" className="text-primary underline underline-offset-4">guide du Plan de Maîtrise Sanitaire</Link>.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 space-y-4">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
              <Gift className="h-4 w-4" /> Essai
            </p>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
              Votre PMS paramètre l'application pour vous
            </h2>
            <p className="text-muted-foreground">
              L'essai de l'application est de 1 mois, sans engagement et sans carte bancaire. Il démarre le jour où vous
              créez votre compte. Créez-le avec la même adresse e-mail que votre PMS gratuit : les réponses de votre PMS
              sont reprises automatiquement pour paramétrer l'application.
            </p>
            <BlocApplication />
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Tarif de l'application HACCP</h2>
          <p className="text-muted-foreground mb-4">
            {formatPriceEUR(tarif.mainMonthly)} par mois et par établissement, toutes fonctionnalités incluses, et{" "}
            {formatPriceEUR(tarif.extraMonthly)} par mois par établissement supplémentaire. En annuel : {tarif.annualDiscountLabel}.
            Sans engagement, résiliable depuis l'application, sans frais caché.
          </p>
          <Button variant="outline" size="lg" asChild>
            <Link to="/tarifs">Voir tous les tarifs</Link>
          </Button>
        </div>
      </section>

      <FaqSection items={FAQS} title="Questions sur l'application HACCP" />
      <RelatedLinks items={TOUTES_FONCTIONNALITES} />
      <Footer />
    </div>
  );
};

export default ApplicationPms;
