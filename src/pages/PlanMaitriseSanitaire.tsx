import { Link } from "react-router-dom";
import { Check, FileText, Folder, FolderOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/FaqSection";
import Classeur from "@/components/pms/Classeur";
import { faqJsonLd } from "@/lib/seo-jsonld";
import { METIERS } from "@/lib/pms/genere/metiers";
import { ARBORESCENCE, FAQ_PMS, NB_DOCUMENTS_EXEMPLE } from "@/lib/pms/presentation";
import appTemperatures from "@/assets/pms/app-temperatures.webp";

const GENERATEUR = "/pms";
const ACTION = "Créer mon PMS gratuitement";

const TEXTES_DE_REFERENCE = [
  {
    texte: "Règlement (CE) n° 852/2004, article 5",
    objet: "Procédures fondées sur les principes HACCP et conservation des enregistrements.",
  },
  {
    texte: "Règlement (CE) n° 178/2002, article 18",
    objet: "Traçabilité : savoir de qui vous recevez chaque denrée.",
  },
  {
    texte: "Règlement (UE) n° 1169/2011",
    objet: "Information du consommateur sur les 14 allergènes.",
  },
  {
    texte: "Code rural, article L. 233-4",
    objet: "Une personne formée à l'hygiène alimentaire en restauration commerciale.",
  },
];

const ETAPES = [
  {
    titre: "Décrivez votre activité",
    texte:
      "Votre métier, vos préparations, vos modes de vente, puis vos équipements froids, vos friteuses et vos zones de nettoyage.",
  },
  {
    titre: "Recevez votre dossier",
    texte: "Les PDF arrivent par e-mail, rangés comme un classeur : CCP, nettoyage, traçabilité, affichage.",
  },
  {
    titre: "Imprimez et remplissez",
    texte:
      "Les fiches se remplissent chaque jour, à la main ou dans l'application. Les affiches vont au mur.",
  },
];

type Cellule = string | { texte: string; fort?: boolean };
const COMPARATIF: { critere: string; generique: Cellule; payant: Cellule; lockhaccp: Cellule }[] = [
  { critere: "Prix", generique: "Gratuit", payant: "49 à 149 €", lockhaccp: { texte: "Gratuit", fort: true } },
  {
    critere: "Adapté à vos équipements et à vos zones",
    generique: "Non, à adapter vous-même",
    payant: "Selon l'offre",
    lockhaccp: { texte: "Oui, d'après vos réponses", fort: true },
  },
  {
    critere: "Fiches d'enregistrement prêtes à imprimer",
    generique: "Rarement",
    payant: "Oui",
    lockhaccp: { texte: "Une par équipement, friteuse et zone", fort: true },
  },
  { critere: "Délai", generique: "Immédiat", payant: "Immédiat à quelques jours", lockhaccp: "10 minutes" },
  {
    critere: "Registres tenus sur téléphone",
    generique: "Non",
    payant: "Non",
    lockhaccp: { texte: "Oui, avec l'application", fort: true },
  },
];

const texteCellule = (c: Cellule) => (typeof c === "string" ? c : c.texte);

const BoutonGenerateur = ({ clair = false }: { clair?: boolean }) => (
  <Button
    asChild
    size="xl"
    variant={clair ? "outline" : "hero"}
    className={clair ? "border-0 bg-white text-primary hover:bg-white/90 hover:text-primary" : "w-full sm:w-auto"}
  >
    <Link to={GENERATEUR}>{ACTION}</Link>
  </Button>
);

const PlanMaitriseSanitaire = () => (
  <div className="min-h-screen bg-background">
    <Seo
      title="Plan de Maîtrise Sanitaire (PMS) gratuit et personnalisé"
      description="Créez gratuitement votre Plan de Maîtrise Sanitaire : tableau des CCP, plan de nettoyage, fiches de traçabilité et affichages obligatoires adaptés à votre établissement. Dossier PDF en 10 minutes."
      path="/plan-de-maitrise-sanitaire"
      jsonLd={faqJsonLd(FAQ_PMS)}
    />
    <Navbar />

    <main id="main-content">
      {/* En-tête : la promesse à gauche, le vrai dossier à droite */}
      <section className="pb-16 pt-32 sm:pt-36 lg:pb-24 lg:pt-40">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-10 lg:px-8">
          <div className="min-w-0 lg:col-span-5">
            <h1 className="font-heading text-[2.4rem] font-extrabold leading-[1.06] tracking-[-0.02em] text-foreground sm:text-5xl lg:text-[3.1rem]">
              Plan de Maîtrise Sanitaire gratuit, fait pour votre établissement
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted-foreground">
              Répondez à quelques questions sur votre métier et vos équipements. Vous recevez par e-mail le
              tableau des CCP, le plan de nettoyage, les fiches de traçabilité et les affichages obligatoires,
              prêts à imprimer.
            </p>
            <div className="mt-8">
              <BoutonGenerateur />
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-foreground/80">
              {["Environ 10 minutes", "Dossier PDF par e-mail", "Sans carte bancaire"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[30rem] border-l-2 border-secondary pl-4 text-sm leading-relaxed text-muted-foreground">
              Contenu conçu avec SF FORMATION, organisme de formation à l'hygiène alimentaire certifié Qualiopi.
            </p>
          </div>

          <div className="min-w-0 lg:col-span-7">
            <Classeur />
            <p className="mt-4 text-center text-xs text-muted-foreground lg:text-left">
              Pages réelles d'un dossier généré pour un restaurant : 2 services, 4 équipements froids, 1 friteuse.
            </p>
          </div>
        </div>
      </section>

      {/* Définition, avec les textes de référence en marge */}
      <section className="border-y border-border bg-[#F4F7FA] py-20 lg:py-28">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <article className="lg:col-span-7">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Qu'est-ce qu'un Plan de Maîtrise Sanitaire ?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground">
              Le Plan de Maîtrise Sanitaire (PMS) est le dossier qui décrit comment votre établissement garantit
              la sécurité des aliments qu'il sert, et qui prouve, registres à l'appui, que ces règles sont
              appliquées au quotidien.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Il repose sur trois piliers :</p>
            <dl className="mt-6 space-y-6">
              {[
                [
                  "Les bonnes pratiques d'hygiène",
                  "Tenue et lavage des mains, nettoyage et désinfection, maîtrise des températures, réception des marchandises.",
                ],
                [
                  "L'analyse des dangers selon la méthode HACCP",
                  "Les points critiques de votre activité, leurs seuils, leur surveillance et la mesure à prendre en cas d'écart.",
                ],
                [
                  "La traçabilité et la gestion des non-conformités",
                  "Les enregistrements qui montrent ce qui a été contrôlé, quand, par qui, et ce qui a été fait en cas de problème.",
                ],
              ].map(([terme, definition]) => (
                <div key={terme} className="grid gap-1 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="font-heading font-semibold text-foreground">{terme}</dt>
                  <dd className="leading-relaxed text-muted-foreground">{definition}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 leading-relaxed text-muted-foreground">
              Lors d'un contrôle sanitaire, l'inspecteur de la DDPP demande à voir ce dossier et les relevés des
              dernières semaines. Un PMS adapté à votre activité, et des fiches réellement remplies, sont la
              meilleure réponse.
            </p>
          </article>

          <aside className="lg:col-span-4 lg:col-start-9" aria-labelledby="titre-textes">
            <h3 id="titre-textes" className="font-heading text-base font-semibold text-foreground">
              Ce que disent les textes
            </h3>
            <ul className="mt-5 space-y-5">
              {TEXTES_DE_REFERENCE.map((t) => (
                <li key={t.texte} className="border-l-2 border-primary/25 pl-4">
                  <p className="text-sm font-semibold text-foreground">{t.texte}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.objet}</p>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Inventaire réel du dossier */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:items-start lg:px-8">
          <div className="lg:col-span-5 lg:sticky lg:top-36">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Le contenu de votre dossier, fichier par fichier
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Voici le dossier reçu par un restaurant de deux services. Le vôtre suit vos réponses : une fiche de
              relevé par équipement froid, une fiche par friteuse, une fiche de nettoyage par zone, et seulement
              les affichages qui concernent votre activité.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Pas de pages de théorie à lire : uniquement ce qui sert au quotidien et ce que l'on vous demandera
              lors d'un contrôle.
            </p>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_48px_-28px_rgba(0,38,77,.35)]">
              <div className="flex items-center justify-between gap-4 border-b border-border bg-[#F4F7FA] px-5 py-3.5">
                <span className="flex min-w-0 items-center gap-2.5 font-semibold text-foreground">
                  <FolderOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="truncate">PMS - Le Bistrot Exemple</span>
                </span>
                <span className="shrink-0 text-sm text-muted-foreground">{NB_DOCUMENTS_EXEMPLE} documents</span>
              </div>
              <ul className="px-3 py-3 text-sm sm:px-5">
                {ARBORESCENCE.map((groupe) => (
                  <li key={groupe.dossier || "racine"}>
                    {groupe.dossier && (
                      <p className="mt-3 flex items-center gap-2.5 px-2 py-1.5 font-semibold text-foreground">
                        <Folder className="h-4 w-4 shrink-0 text-secondary" aria-hidden="true" />
                        {groupe.dossier}
                        <span className="font-normal text-muted-foreground">({groupe.fichiers.length})</span>
                      </p>
                    )}
                    <ul className={groupe.dossier ? "ml-[1.05rem] border-l border-border pl-3" : undefined}>
                      {groupe.fichiers.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 rounded-md px-2 py-1.5 text-foreground/85">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span>{f.replace(/\.pdf$/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Les trois étapes (une vraie séquence) */}
      <section className="border-t border-border py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-2xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trois étapes, sans rendez-vous ni consultant
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
            {ETAPES.map((e, i) => (
              <li key={e.titre} className="relative border-t-2 border-border pt-6 md:pr-10">
                <span aria-hidden="true" className="absolute -top-[2px] left-0 h-[2px] w-16 bg-primary" />
                <span aria-hidden="true" className="font-heading text-5xl font-extrabold leading-none text-primary">
                  {i + 1}
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
                  <span className="sr-only">Étape {i + 1} : </span>
                  {e.titre}
                </h3>
                <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">{e.texte}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <BoutonGenerateur />
          </div>
        </div>
      </section>

      {/* Métiers couverts */}
      <section className="bg-[#F4F7FA] py-20 lg:py-28">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Neuf métiers, neuf dossiers différents
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Un poissonnier n'a pas les mêmes points critiques qu'une crèche ou un glacier. Le questionnaire
              et le dossier changent avec le métier choisi.
            </p>
          </div>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {METIERS.map((m) => (
              <div key={m.id} className="border-t border-border pt-4">
                <dt className="font-heading font-semibold text-foreground">{m.libelle}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Comparatif */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="max-w-2xl font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Modèle gratuit, PMS payant ou LockHACCP ?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Les trois façons les plus courantes d'obtenir un PMS, comparées sur ce qui compte le jour du contrôle.
          </p>
          <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">Comparatif des façons d'obtenir un Plan de Maîtrise Sanitaire</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[28%] bg-white px-5 py-4 font-semibold text-muted-foreground">
                    <span className="sr-only">Critère</span>
                  </th>
                  <th scope="col" className="bg-white px-5 py-4 font-heading font-semibold text-foreground">
                    Modèle générique gratuit
                  </th>
                  <th scope="col" className="bg-white px-5 py-4 font-heading font-semibold text-foreground">
                    PMS rédigé en ligne
                  </th>
                  <th scope="col" className="bg-primary px-5 py-4 font-heading font-semibold text-primary-foreground">
                    LockHACCP
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARATIF.map((ligne) => (
                  <tr key={ligne.critere} className="border-b border-border last:border-b-0">
                    <th scope="row" className="bg-white px-5 py-4 font-medium text-foreground">
                      {ligne.critere}
                    </th>
                    <td className="bg-white px-5 py-4 text-muted-foreground">{texteCellule(ligne.generique)}</td>
                    <td className="bg-white px-5 py-4 text-muted-foreground">{texteCellule(ligne.payant)}</td>
                    <td
                      className={[
                        "bg-primary-light px-5 py-4 text-foreground",
                        typeof ligne.lockhaccp !== "string" && ligne.lockhaccp.fort ? "font-semibold" : "",
                      ].join(" ")}
                    >
                      {texteCellule(ligne.lockhaccp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Le papier ou l'application */}
      <section className="border-t border-border bg-[#F4F7FA] py-20 lg:py-24">
        <div className="container mx-auto grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Le classeur papier, ou l'application
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Le jour du contrôle, l'inspecteur demande les relevés des dernières semaines. Avec LockHACCP, ils
              sont sur votre téléphone : températures, nettoyage validé zone par zone, photos des étiquettes,
              rappels quand une tâche est oubliée.
            </p>
            <p className="mt-6 font-semibold text-foreground">
              Avec votre PMS, l'application vous est offerte pendant 2 mois.
            </p>
            <Link
              to="/fonctionnalites/temperatures"
              className="mt-6 inline-block font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Voir les relevés de températures dans l'application
            </Link>
          </div>
          <div className="flex justify-center lg:col-span-5 lg:col-start-8">
            <img
              src={appTemperatures}
              alt="Écran de relevé des températures dans l'application LockHACCP"
              width={560}
              height={782}
              loading="lazy"
              decoding="async"
              className="w-full max-w-sm rounded-3xl shadow-[0_30px_60px_-30px_rgba(0,38,77,.55)]"
            />
          </div>
        </div>
      </section>

      <FaqSection items={FAQ_PMS} title="Questions fréquentes sur le PMS" />

      {/* Dernier appel */}
      <section className="bg-primary py-20 text-primary-foreground lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Votre PMS prêt avant le prochain contrôle
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
                Dix minutes de questions, un dossier complet dans votre boîte e-mail.
              </p>
            </div>
            <div className="shrink-0">
              <BoutonGenerateur clair />
            </div>
          </div>
        </div>
      </section>
    </main>

    <Footer />
  </div>
);

export default PlanMaitriseSanitaire;
