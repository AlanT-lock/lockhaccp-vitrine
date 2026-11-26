import { useState, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, FileText, Folder, FolderOpen, Gift } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { FaqSection } from "@/components/FaqSection";
import Classeur from "@/components/pms/Classeur";
import { QuestionnairePms } from "@/components/pms/QuestionnairePms";
import { faqJsonLd } from "@/lib/seo-jsonld";
import { METIERS } from "@/lib/pms/genere/metiers";
import { ARBORESCENCE, FAQ_PMS, NB_DOCUMENTS_EXEMPLE } from "@/lib/pms/presentation";
import { Accent, Surtitre, TITRE_H2 } from "@/components/design/elements";
import { EcranVideo, Telephone3D } from "@/components/accueil/Telephone3D";
import { VIDEOS_APP } from "@/lib/videos-app";
import tableauCcp from "@/assets/pms/tableau-ccp-petit.webp";
import releveTemperature from "@/assets/pms/releve-temperature-petit.webp";
import planNettoyage from "@/assets/pms/plan-nettoyage-petit.webp";

// Le générateur est sur cette page même (bloc #questionnaire) : /pms redirige ici.
const ANCRE_QUESTIONNAIRE = "questionnaire";
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

const ERREURS_PMS = [
  {
    titre: "Un modèle recopié qui ne colle pas à la cuisine",
    texte:
      "Des surfaces qui n'existent pas, des fréquences que personne ne suit : au bout de deux semaines, le dossier ne correspond plus à rien. Le PMS doit décrire vos équipements et vos zones réels.",
  },
  {
    titre: "Des fiches remplies d'un coup en fin de semaine",
    texte:
      "Une écriture identique, un stylo identique, des températures toutes parfaites : ça se voit. Un relevé fait sur le moment, même avec un écart, est plus crédible.",
  },
  {
    titre: "Des écarts sans action corrective",
    texte:
      "Une chambre froide à 7 °C sans rien noter à côté pose problème. La même valeur suivie de « porte mal fermée, produits contrôlés à cœur, recontrôle à 3 °C » montre une cuisine qui maîtrise.",
  },
  {
    titre: "Une fiche démentie par ce que voit l'inspecteur",
    texte:
      "Une hotte cochée propre chaque jour qui goutte de graisse, c'est pire que pas de fiche du tout. L'inspecteur compare toujours les papiers à la cuisine.",
  },
  {
    titre: "Un thermomètre jamais vérifié",
    texte:
      "Une fois par mois, le test du point de glace doit afficher 0 °C, à un degré près. Notez la date : c'est une question que l'inspecteur pose.",
  },
  {
    titre: "Pas d'attestation de formation à présenter",
    texte:
      "En restauration commerciale, au moins une personne de l'établissement doit avoir suivi la formation de 14 heures en hygiène alimentaire (article L. 233-4 du code rural). Gardez l'attestation à portée de main.",
  },
];

const texteCellule = (c: Cellule) => (typeof c === "string" ? c : c.texte);

/** Remonte en douceur jusqu'au questionnaire, en haut de la page. */
function allerAuQuestionnaire(e: MouseEvent<HTMLAnchorElement>) {
  const cible = document.getElementById(ANCRE_QUESTIONNAIRE);
  if (!cible) return;
  e.preventDefault();
  cible.scrollIntoView({ behavior: "smooth", block: "start" });
}

const BoutonGenerateur = ({ variante = "hero", className = "" }: { variante?: "hero" | "accent"; className?: string }) => (
  <Button asChild size="xl" variant={variante} className={`group w-full sm:w-auto ${className}`}>
    <a href={`#${ANCRE_QUESTIONNAIRE}`} onClick={allerAuQuestionnaire}>
      {ACTION}
      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
    </a>
  </Button>
);

const PlanMaitriseSanitaire = () => {
  // Pendant le questionnaire (après le choix du métier), la présentation s'efface : le visiteur
  // ne voit que les questions, sur fond blanc uni, à la même adresse.
  const [enCours, setEnCours] = useState(false);

  return (
  <div className={`min-h-screen ${enCours ? "bg-background" : ""}`}>
    <Seo
      title="Plan de Maîtrise Sanitaire (PMS) gratuit"
      description="Créez gratuitement votre Plan de Maîtrise Sanitaire : tableau des CCP, plan de nettoyage, traçabilité et affichages obligatoires. Dossier PDF en 10 minutes."
      path="/plan-de-maitrise-sanitaire"
      jsonLd={faqJsonLd(FAQ_PMS)}
    />
    <Navbar />

    <main id="main-content">
      {/* En-tête : la promesse à gauche, le questionnaire du générateur à droite */}
      <section className={enCours ? "pb-16 pt-28 sm:pt-32 lg:pt-36" : "pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-36"}>
        <div
          className={
            enCours
              ? "container mx-auto max-w-3xl px-4 sm:px-6"
              : "container mx-auto grid grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:items-start lg:gap-10 lg:px-8"
          }
        >
          {!enCours && (
            <div className="min-w-0 lg:col-span-5 lg:pt-6">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                <Gift className="h-4 w-4" />
                Gratuit, sans carte bancaire
              </p>
              <h1 className="font-heading text-[clamp(2.3rem,4.6vw,3.7rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-foreground">
                <Accent>Plan de Maîtrise Sanitaire gratuit</Accent>, fait pour votre établissement
              </h1>
              <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted-foreground">
                Répondez à quelques questions sur votre métier et vos équipements. Vous recevez par e-mail le
                tableau des CCP, le plan de nettoyage, les fiches de traçabilité et les affichages obligatoires,
                prêts à imprimer.
              </p>
              {/* Sur mobile, le questionnaire est plus bas : un bouton y mène directement. */}
              <div className="mt-7 lg:hidden">
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
          )}

          <div id={ANCRE_QUESTIONNAIRE} className={enCours ? "scroll-mt-28" : "min-w-0 scroll-mt-28 lg:col-span-7"}>
            <div className="rounded-[2rem] border border-white/80 bg-white/95 p-5 shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-8">
              {enCours ? (
                <p className="mb-6 font-heading text-lg font-bold text-foreground">Votre Plan de Maîtrise Sanitaire gratuit</p>
              ) : (
                <h2 className="mb-6 font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground sm:text-[1.7rem]">
                  Créez votre PMS : choisissez votre métier
                </h2>
              )}
              <QuestionnairePms onEnCours={setEnCours} />
            </div>
          </div>
        </div>
      </section>

      {!enCours && (
      <>
      {/* Les vraies pages d'un dossier généré */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto grid grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <Surtitre>Le résultat</Surtitre>
            <h2 className={TITRE_H2}>Les vraies pages de votre futur dossier</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Pages réelles d'un dossier généré pour un restaurant : 2 services, 4 équipements froids, 1 friteuse.
            </p>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <Classeur />
          </div>
        </div>
      </section>

      {/* Définition, avec les textes de référence en marge */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <article className="lg:col-span-7">
            <h2 className={TITRE_H2}>
              Qu'est-ce qu'un Plan de Maîtrise Sanitaire ?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground">
              Le Plan de Maîtrise Sanitaire (PMS) est le dossier qui décrit comment votre établissement garantit
              la sécurité des aliments qu'il sert, et qui prouve, registres à l'appui, que ces règles sont
              appliquées au quotidien.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">Il repose sur trois piliers :</p>
            <dl className="mt-6 space-y-3">
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
                <div key={terme} className="grid gap-1 rounded-2xl border border-border/80 bg-white/80 p-5 sm:grid-cols-[13rem_1fr] sm:gap-6">
                  <dt className="font-heading font-bold text-foreground">{terme}</dt>
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

          <aside
            className="self-start rounded-3xl border border-border/80 bg-white/90 p-7 shadow-[0_30px_70px_-45px_hsl(211_100%_20%/0.45)] lg:col-span-4 lg:col-start-9"
            aria-labelledby="titre-textes"
          >
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
            <h2 className={TITRE_H2}>
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
            <div className="overflow-hidden rounded-3xl border border-border/80 bg-white shadow-[0_30px_70px_-40px_hsl(211_100%_20%/0.45)]">
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
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Surtitre>Comment ça marche</Surtitre>
          <h2 className={`${TITRE_H2} max-w-3xl`}>
            Trois étapes, sans rendez-vous ni consultant
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {ETAPES.map((e, i) => (
              <li key={e.titre} className="relative overflow-hidden rounded-3xl border border-border/80 bg-white/85 p-7 sm:p-8">
                <span aria-hidden="true" className="pointer-events-none absolute -right-3 -top-6 font-heading text-[8rem] font-extrabold leading-none text-primary/[0.06]">
                  {i + 1}
                </span>
                <span aria-hidden="true" className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-primary font-heading text-lg font-extrabold text-white">
                  {i + 1}
                </span>
                <h3 className="relative mt-6 font-heading text-xl font-bold text-foreground">
                  <span className="sr-only">Étape {i + 1} : </span>
                  {e.titre}
                </h3>
                <p className="relative mt-3 leading-relaxed text-muted-foreground">{e.texte}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <BoutonGenerateur />
          </div>
        </div>
      </section>

      {/* Métiers couverts */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-4">
            <h2 className={TITRE_H2}>
              Neuf métiers, neuf dossiers différents
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Un poissonnier n'a pas les mêmes points critiques qu'une crèche ou un glacier. Le questionnaire
              et le dossier changent avec le métier choisi.
            </p>
          </div>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {METIERS.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border/80 bg-white/85 p-5 transition-colors hover:border-primary/25">
                <dt className="font-heading font-bold text-foreground">{m.libelle}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Comparatif */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`${TITRE_H2} max-w-3xl`}>
            Modèle gratuit, PMS payant ou LockHACCP ?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Les trois façons les plus courantes d'obtenir un PMS, comparées sur ce qui compte le jour du contrôle.
          </p>
          <div className="mt-10 overflow-x-auto rounded-3xl border border-border/80 bg-white/90 shadow-[0_30px_70px_-45px_hsl(211_100%_20%/0.45)]">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <caption className="sr-only">Comparatif des façons d'obtenir un Plan de Maîtrise Sanitaire</caption>
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-[28%] px-5 py-4 font-semibold text-muted-foreground">
                    <span className="sr-only">Critère</span>
                  </th>
                  <th scope="col" className="px-5 py-4 font-heading font-semibold text-foreground">
                    Modèle générique gratuit
                  </th>
                  <th scope="col" className="px-5 py-4 font-heading font-semibold text-foreground">
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
                    <th scope="row" className="px-5 py-4 font-medium text-foreground">
                      {ligne.critere}
                    </th>
                    <td className="px-5 py-4 text-muted-foreground">{texteCellule(ligne.generique)}</td>
                    <td className="px-5 py-4 text-muted-foreground">{texteCellule(ligne.payant)}</td>
                    <td
                      className={[
                        "bg-primary/[0.06] px-5 py-4 text-foreground",
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
      <section className="py-20 lg:py-28">
        <div className="container mx-auto grid items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <h2 className={TITRE_H2}>
              Le classeur papier, ou l'application
            </h2>
            <p className="mt-6 leading-relaxed text-muted-foreground">
              Le jour du contrôle, l'inspecteur demande les relevés des dernières semaines. Avec LockHACCP, ils
              sont sur votre téléphone : températures, nettoyage validé zone par zone, photos des étiquettes,
              rappels quand une tâche est oubliée.
            </p>
            <p className="mt-6 font-semibold text-foreground">
              Avec votre PMS, l'application est paramétrée pour vous, et vous l'essayez gratuitement pendant 14 jours.
            </p>
            <Link
              to="/fonctionnalites/temperatures"
              className="mt-6 inline-block font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
            >
              Voir les relevés de températures dans l'application
            </Link>
            <p className="mt-4 text-muted-foreground">
              Vous hésitez entre plusieurs outils ?{" "}
              <Link to="/blog/logiciel-pms-gratuit-comparatif" className="text-primary underline underline-offset-4">
                Comparez les logiciels de Plan de Maîtrise Sanitaire gratuits
              </Link>
              . Pour la différence entre les deux notions, lisez{" "}
              <Link to="/blog/difference-pms-haccp" className="text-primary underline underline-offset-4">
                PMS et HACCP : quelle différence ?
              </Link>
              , ou découvrez un{" "}
              <Link to="/blog/plan-nettoyage-gratuit-modele" className="text-primary underline underline-offset-4">
                plan de nettoyage gratuit : modèle de cuisine
              </Link>
              .
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            {/* Visite de l'application : relevé du frigo puis nettoyage du jour */}
            <div className="mx-auto w-[14rem] sm:w-[15.5rem] lg:w-[17rem]">
              <Telephone3D inclinaison="gauche" suivreSouris>
                <EcranVideo video={VIDEOS_APP.tour} />
              </Telephone3D>
            </div>
          </div>
        </div>
      </section>

      {/* Erreurs fréquentes, vues en formation et en contrôle : bande bleu nuit, le « moment contrôle » */}
      <section className="relative overflow-hidden bg-[hsl(211_100%_13%)] py-20 text-white lg:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/40 blur-3xl" />
          <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary">Le contrôle sanitaire</p>
          <h2 className="max-w-3xl font-heading text-[clamp(2rem,4.2vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.03em]">
            Les erreurs qui font baisser la note d'un contrôle
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
            La différence entre « satisfaisant » et « à améliorer » sur Alim'confiance tient souvent autant aux
            documents qu'à la cuisine. Voici ce qui revient le plus souvent.
          </p>
          <dl className="mt-12 grid gap-x-12 md:grid-cols-2">
            {ERREURS_PMS.map((e, i) => (
              <div key={e.titre} className="flex gap-5 border-t border-white/10 py-7">
                <span aria-hidden="true" className="font-heading text-sm font-extrabold tabular-nums text-secondary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <dt className="font-heading text-xl font-bold">{e.titre}</dt>
                  <dd className="mt-2 leading-relaxed text-white/75">{e.texte}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <FaqSection items={FAQ_PMS} title="Questions fréquentes sur le PMS" />

      {/* Dernier appel */}
      <section className="px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-32">
        <div className="container relative mx-auto overflow-hidden rounded-[2.5rem] bg-primary px-5 py-14 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-secondary/30 blur-3xl" />
            <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-[hsl(211_100%_45%)]/40 blur-3xl" />
          </div>
          <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="text-center lg:col-span-7 lg:text-left">
              <h2 className="font-heading text-[clamp(2.2rem,4.8vw,3.9rem)] font-extrabold leading-[1.02] tracking-[-0.03em] [text-wrap:balance]">
                Votre PMS prêt avant le prochain contrôle
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80 lg:mx-0">
                Dix minutes de questions, un dossier complet dans votre boîte e-mail.
              </p>
              <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/85 lg:justify-start">
                {["Environ 10 minutes", "Dossier PDF par e-mail", "Sans carte bancaire"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-secondary" strokeWidth={3} />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex justify-center lg:justify-start">
                <Button variant="accent" size="xl" asChild className="group">
                  <a href={`#${ANCRE_QUESTIONNAIRE}`} onClick={allerAuQuestionnaire}>
                    {ACTION}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            {/* Les vrais documents du dossier, en éventail */}
            <div aria-hidden="true" className="relative mx-auto hidden h-72 w-80 lg:col-span-5 lg:block">
              <img src={tableauCcp} alt="" loading="lazy" decoding="async" width={600} height={424}
                className="absolute bottom-16 right-24 w-60 -rotate-6 rounded-md shadow-2xl" />
              <img src={releveTemperature} alt="" loading="lazy" decoding="async" width={400} height={566}
                className="absolute bottom-0 right-8 w-36 rotate-3 rounded-md shadow-2xl" />
              <img src={planNettoyage} alt="" loading="lazy" decoding="async" width={400} height={566}
                className="absolute -bottom-6 -right-6 w-32 rotate-12 rounded-md shadow-2xl" />
            </div>
          </div>
        </div>
      </section>
      </>
      )}
    </main>

    <Footer />
  </div>
  );
};

export default PlanMaitriseSanitaire;
