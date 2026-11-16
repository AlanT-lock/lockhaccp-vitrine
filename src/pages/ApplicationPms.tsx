import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Gift, Monitor, Package, ShieldCheck, Smartphone, SprayCan, Tablet, Tag, Thermometer, WifiOff } from "lucide-react";
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
import CTASection from "@/components/CTASection";
import { Accent, CarteIllustration, Surtitre, TITRE_H2, TelephoneHero } from "@/components/design/elements";
import { VIDEOS_APP } from "@/lib/videos-app";

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
  { icone: Thermometer, texte: "Relevés de température avec rappels chaque matin, consigne par équipement et actions correctives", lien: "/fonctionnalites/temperatures" },
  { icone: SprayCan, texte: "Plan de nettoyage par zone, tâches validées et signées", lien: "/fonctionnalites/nettoyage" },
  { icone: Package, texte: "Contrôle à réception des marchandises et traçabilité des produits en photo, export PDF", lien: "/fonctionnalites/receptions" },
  { icone: Tag, texte: "Étiquettes de production (DLC, lot, allergènes), huiles de friture et check-lists d'ouverture et de fermeture", lien: "/fonctionnalites/etiquettes" },
];

/** Appareils et usages, illustrés (contenu repris du texte de la section). */
const APPAREILS = [
  { icone: Smartphone, titre: "iPhone et Android", texte: "Le commis valide le nettoyage" },
  { icone: Tablet, titre: "Tablette de cuisine", texte: "Le second fait les relevés" },
  { icone: Monitor, titre: "Ordinateur", texte: "Le gérant consulte l'historique" },
  { icone: WifiOff, titre: "Sans réseau", texte: "Chambre froide, réserve en sous-sol" },
];

/** Ce que l'inspecteur demande à voir (repris du texte de la section). */
const ATTENDUS_INSPECTEUR = [
  "La consigne de chaque équipement",
  "L'action corrective quand un relevé dépasse",
  "La preuve que le nettoyage est fait",
  "L'origine de chaque produit",
];

const LIEN = "font-semibold text-primary underline underline-offset-4";

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

      <main>
        {/* En-tête : le téléphone montre la visite de l'application */}
        <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
              <div className="text-center lg:col-span-7 lg:text-left">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                  <Smartphone className="h-4 w-4" />
                  iPhone, Android, tablette et ordinateur
                </p>
                <h1 className="font-heading text-[clamp(2.3rem,5.4vw,4.3rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground">
                  L'<Accent>application HACCP</Accent> pour restaurants et métiers de bouche
                </h1>
                <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
                  Vos autocontrôles HACCP sur téléphone ou tablette : relevés de température, nettoyage, réception et
                  traçabilité au quotidien, avec un historique prêt pour le contrôle. Paramétrée à partir de votre Plan de
                  Maîtrise Sanitaire, gratuit.
                </p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Button variant="hero" size="xl" asChild className="group">
                    <a href={APP_URL}>
                      Essayer l'application
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button variant="heroOutline" size="xl" asChild>
                    <Link to="/pms">Créer mon PMS gratuit</Link>
                  </Button>
                </div>
                <p className="mt-5 text-sm text-muted-foreground">
                  Vous préférez qu'on vous la montre ?{" "}
                  <Link to="/demander-demo" className={LIEN}>
                    Demander une démo
                  </Link>
                </p>
              </div>
              <div className="lg:col-span-5">
                <TelephoneHero
                  video={VIDEOS_APP.tour}
                  puces={[
                    { icone: Thermometer, titre: "Réfrigérateur cuisine · 3 °C", detail: "Conforme, relevé enregistré" },
                    { icone: SprayCan, titre: "Nettoyage du jour", detail: "Surfaces de la plonge cochées" },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/70 bg-white/60 py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <TrustBadges />
          </div>
        </section>

        {/* Ce que fait l'application */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
              <h2 className={`${TITRE_H2} lg:col-span-6`}>Ce que fait l'application HACCP</h2>
              <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-6">
                Votre Plan de Maîtrise Sanitaire décrit ce qu'il faut faire. L'application sert à le faire chaque jour et à
                en garder la trace, sans fiches papier à remplir, classer et retrouver le jour d'un contrôle.
              </p>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {POINTS.map(({ icone: Icone, texte, lien }) => (
                <li key={texte}>
                  <Link
                    to={lien}
                    className="group flex h-full items-start gap-5 rounded-3xl border border-border/80 bg-white/85 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icone className="h-6 w-6" />
                    </span>
                    <span className="pt-1 text-lg leading-relaxed text-foreground">{texte}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Sur téléphone, tablette ou ordinateur */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div>
                <Surtitre>Pour toute l'équipe</Surtitre>
                <h2 className={TITRE_H2}>Sur téléphone, tablette ou ordinateur</h2>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    L'application s'installe sur iPhone et Android, et s'utilise aussi depuis un navigateur. Le commis valide
                    le nettoyage sur son téléphone, le second fait les relevés sur la tablette de la cuisine, le gérant
                    consulte l'historique depuis son ordinateur. Chacun a son code personnel : chaque contrôle est signé par
                    la personne qui l'a fait. L'application fonctionne aussi sans réseau, dans une chambre froide ou une
                    réserve en sous-sol.
                  </p>
                  <p className="text-base">
                    Aucun matériel n'est imposé. Si vous le souhaitez, les{" "}
                    <Link to="/fonctionnalites/etiquettes" className={LIEN}>étiquettes DLC</Link>{" "}
                    s'impriment sur une étiqueteuse Brother, Zebra ou Epson, les{" "}
                    <Link to="/capteurs-connectes" className={LIEN}>capteurs de température connectés</Link>{" "}
                    s'achètent sans abonnement, et une tablette protégée pour la cuisine est proposée en location. L'offre
                    inclut {RELECTURES_IA_PAR_MOIS} lectures par intelligence artificielle par mois pour lire automatiquement
                    étiquettes et bons de livraison. Les données sont hébergées dans l'Union européenne.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {APPAREILS.map(({ icone: Icone, titre, texte }, i) => (
                  <CarteIllustration key={titre} className={`!p-6 ${i % 2 === 1 ? "translate-y-6" : ""}`}>
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        i === 3 ? "bg-secondary-light text-secondary-texte" : "bg-primary-light text-primary"
                      }`}
                    >
                      <Icone className="h-6 w-6" />
                    </span>
                    <p className="mt-5 font-heading text-lg font-bold leading-tight text-foreground">{titre}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{texte}</p>
                  </CarteIllustration>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Conçue avec un formateur en hygiène : bande bleu nuit, comme le « moment contrôle » de l'accueil */}
        <section className="relative overflow-hidden bg-[hsl(211_100%_13%)] py-20 text-white lg:py-28">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/40 blur-3xl" />
            <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
          </div>
          <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary">Le contrôle sanitaire</p>
                <h2 className="font-heading text-[clamp(1.9rem,3.8vw,3rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
                  Une application conçue avec un formateur en hygiène
                </h2>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-white/75">
                  <p>
                    LockHACCP a été créée par{" "}
                    <Link to="/auteur/alan-touati" className="font-semibold text-white underline underline-offset-4">
                      Alan Touati
                    </Link>
                    , formateur en hygiène alimentaire chez SF FORMATION. Les écrans suivent ce que l'inspecteur de la DDPP
                    demande à voir : la consigne de chaque équipement, l'action corrective quand un relevé dépasse, la preuve
                    que le nettoyage est fait, l'origine de chaque produit.
                  </p>
                  <p>
                    LockHACCP est à la fois une application mobile et un logiciel en ligne : la présentation complète du{" "}
                    <Link to="/" className="font-semibold text-white underline underline-offset-4">
                      logiciel HACCP pour restaurateurs
                    </Link>{" "}
                    est sur notre page d'accueil.
                  </p>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-7 sm:p-8">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white/90">
                    <ShieldCheck className="h-5 w-5 text-secondary" />
                    Ce que l'inspecteur demande à voir
                  </p>
                  <ol className="mt-6">
                    {ATTENDUS_INSPECTEUR.map((t, i) => (
                      <li key={t} className="flex items-center gap-4 border-b border-white/10 py-4 last:border-0">
                        <span className="font-heading text-sm font-extrabold tabular-nums text-secondary">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-white/90">{t}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PMS gratuit et essai */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Surtitre>Par où commencer</Surtitre>
                <h2 className={TITRE_H2}>Commencez par votre PMS gratuit</h2>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Répondez à un questionnaire d'environ 10 minutes : vous recevez un PMS personnalisé à votre
                    établissement, avec tableau HACCP, plan de nettoyage, fiches de traçabilité et affichages obligatoires,
                    prêts à imprimer. Réalisé avec l'expertise de SF FORMATION, organisme de formation à l'hygiène
                    alimentaire.
                  </p>
                  <p>
                    Un PMS qui n'est pas adapté à votre cuisine ne sert à rien le jour du contrôle : c'est pourquoi le vôtre
                    est construit à partir de vos zones, de vos équipements et de votre activité. Le paramétrage de
                    l'application est offert.
                  </p>
                </div>
                <Button variant="hero" size="lg" asChild className="group mt-8">
                  <Link to="/pms">
                    Créer mon PMS gratuit
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <ul className="mt-8 space-y-2 border-t border-border/80 pt-6 text-sm text-muted-foreground">
                  <li>
                    Vous comparez les outils ? Voyez notre{" "}
                    <Link to="/blog/logiciel-pms-gratuit-comparatif" className={LIEN}>comparatif des logiciels PMS gratuits</Link>.
                  </li>
                  <li>
                    Pas sûr de la différence entre les deux notions ?{" "}
                    <Link to="/blog/difference-pms-haccp" className={LIEN}>PMS et HACCP : quelle différence ?</Link>
                  </li>
                  <li>
                    Vous voulez d'abord comprendre le dossier ? Lisez notre{" "}
                    <Link to="/plan-de-maitrise-sanitaire" className={LIEN}>guide du Plan de Maîtrise Sanitaire</Link>.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-[2rem] bg-secondary p-7 text-secondary-foreground sm:p-9">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/25 blur-3xl" />
                  <div className="relative">
                    <p className="inline-flex items-center gap-2 rounded-full bg-white/35 px-4 py-1 text-sm font-semibold">
                      <Gift className="h-4 w-4" /> Essai
                    </p>
                    <h2 className="mt-5 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
                      Votre PMS paramètre l'application pour vous
                    </h2>
                    <p className="mt-4 leading-relaxed text-secondary-foreground/85">
                      L'essai de l'application est de 1 mois, sans engagement et sans carte bancaire. Il démarre le jour où
                      vous créez votre compte. Créez-le avec la même adresse e-mail que votre PMS gratuit : les réponses de
                      votre PMS sont reprises automatiquement pour paramétrer l'application.
                    </p>
                    <div className="mt-7 rounded-2xl bg-white p-5">
                      <BlocApplication />
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-border/80 bg-white/90 p-7 sm:p-9">
                  <h2 className="font-heading text-2xl font-extrabold text-foreground">Tarif de l'application HACCP</h2>
                  <p className="mt-3 flex items-baseline gap-2">
                    <span className="font-heading text-4xl font-extrabold tracking-tight text-foreground">{formatPriceEUR(tarif.mainMonthly)}</span>
                    <span className="text-muted-foreground">par mois et par établissement</span>
                  </p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    {formatPriceEUR(tarif.mainMonthly)} par mois et par établissement, toutes fonctionnalités incluses, et{" "}
                    {formatPriceEUR(tarif.extraMonthly)} par mois par établissement supplémentaire. En annuel :{" "}
                    {tarif.annualDiscountLabel}. Sans engagement, résiliable depuis l'application, sans frais caché.
                  </p>
                  <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-foreground">
                    {["Toutes fonctionnalités incluses", "Sans engagement", "Paramétrage offert"].map((t) => (
                      <li key={t} className="flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-secondary" strokeWidth={3} />
                        {t}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="lg" asChild className="mt-7">
                    <Link to="/tarifs">Voir tous les tarifs</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FaqSection items={FAQS} title="Questions sur l'application HACCP" />

        <CTASection
          titre="Prêt à passer vos contrôles HACCP sur téléphone ?"
          texte="Créez votre compte et faites vos premiers relevés dès aujourd'hui. Votre Plan de Maîtrise Sanitaire gratuit paramètre l'application pour vous."
        />

        <RelatedLinks items={TOUTES_FONCTIONNALITES} />
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationPms;
