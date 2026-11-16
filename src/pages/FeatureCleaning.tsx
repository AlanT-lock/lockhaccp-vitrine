import { BarChart3, Bell, Calendar, CheckSquare, ListChecks, Sparkles, SprayCan, Users } from "lucide-react";
import { PlanningNettoyageExemple } from "@/components/PlanningNettoyageExemple";
import {
  Accent,
  CarteIllustration,
  PageFonctionnalite,
  SectionDuo,
  TelephoneHero,
  type Atout,
} from "@/components/fonctionnalite/PageFonctionnalite";
import { VIDEOS_APP } from "@/lib/videos-app";

const ATOUTS: Atout[] = [
  { icone: Calendar, titre: "Planning personnalisé", texte: "Créez votre plan de nettoyage adapté à votre établissement avec fréquences et zones définies." },
  { icone: Bell, titre: "Rappels automatiques", texte: "Recevez des notifications pour ne jamais oublier une tâche de nettoyage planifiée." },
  { icone: Users, titre: "Attribution des tâches", texte: "Assignez les tâches à vos équipes et suivez qui a effectué chaque nettoyage." },
  { icone: CheckSquare, titre: "Validation simple", texte: "Validez les nettoyages effectués en un clic : la tâche est datée et signée par la personne connectée." },
  { icone: BarChart3, titre: "Suivi de conformité", texte: "Suivez ce qui a été fait et ce qui manque, dans l'application et dans le récapitulatif hebdomadaire." },
  { icone: Sparkles, titre: "Fiches techniques", texte: "Accédez aux protocoles de nettoyage et fiches produits directement depuis l'application." },
];

const ZONES = [
  { nom: "Cuisine", progression: 100, statut: "Terminé" },
  { nom: "Plonge", progression: 100, statut: "Terminé" },
  { nom: "Salle", progression: 75, statut: "En cours" },
  { nom: "Sanitaires", progression: 0, statut: "À faire" },
];

const COULEURS = { Terminé: "bg-emerald-500", "En cours": "bg-secondary", "À faire": "bg-border" } as const;
const PASTILLES = {
  Terminé: "bg-emerald-50 text-emerald-700",
  "En cours": "bg-secondary-light text-secondary-texte",
  "À faire": "bg-muted text-muted-foreground",
} as const;

// Avancement du plan de nettoyage par zone (exemple).
function CarteAvancement() {
  const total = Math.round(ZONES.reduce((s, z) => s + z.progression, 0) / ZONES.length);
  return (
    <CarteIllustration className="mx-auto max-w-md">
      <div className="flex items-center justify-between">
        <p className="font-heading text-lg font-bold text-foreground">Plan de nettoyage</p>
        <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">Aujourd'hui</span>
      </div>
      <ul className="mt-6 space-y-5">
        {ZONES.map((z) => (
          <li key={z.nom}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">{z.nom}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${PASTILLES[z.statut as keyof typeof PASTILLES]}`}>{z.statut}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`barre-remplit h-full rounded-full ${COULEURS[z.statut as keyof typeof COULEURS]}`}
                style={{ width: `${z.progression}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex items-center justify-between rounded-2xl bg-primary p-4 text-white">
        <span className="text-sm text-white/80">Progression globale</span>
        <span className="font-heading text-2xl font-extrabold">{total} %</span>
      </div>
    </CarteIllustration>
  );
}

const FeatureCleaning = () => (
  <PageFonctionnalite
    id="nettoyage"
    seo={{
      title: "Planning de nettoyage cuisine HACCP",
      description:
        "Planning de nettoyage cuisine sur téléphone : zones, fréquences, rappels chaque matin, tâches validées et signées. Un plan de nettoyage HACCP toujours à jour.",
    }}
    icone={Sparkles}
    etiquette="Plan de nettoyage"
    titre={
      <>
        L'application de <Accent>plan de nettoyage HACCP</Accent>, toujours à jour
      </>
    }
    intro="Planifiez, suivez et validez toutes vos opérations de nettoyage. Gardez une trace irréprochable pour les contrôles sanitaires."
    visuel={
      <TelephoneHero
        video={VIDEOS_APP.historique}
        puces={[
          { icone: SprayCan, titre: "Nettoyage du jour", detail: "15 surfaces sur 15" },
          { icone: ListChecks, titre: "Suivi de la journée", detail: "Ce qui est fait, ce qui reste" },
        ]}
      />
    }
    atouts={{
      titre: "Gérez votre plan de nettoyage efficacement",
      intro: "Des outils pensés pour simplifier le quotidien de vos équipes.",
      items: ATOUTS,
    }}
    contenuSupplementaire={<PlanningNettoyageExemple />}
    cta={{
      titre: "Digitalisez votre plan de nettoyage",
      texte: "Fini les fiches papier perdues. Passez au digital avec LockHACCP.",
      capture: {
        src: VIDEOS_APP.historique.cle,
        alt: "Nettoyage du jour : 15 surfaces sur 15 nettoyées, zones Cuisine, Plonge et Sanitaires terminées",
      },
    }}
  >
    <SectionDuo
      surtitre="D'un coup d'œil"
      titre={
        <>
          Voyez d'un coup d'œil <span className="text-secondary-texte">ce qui reste à faire</span>
        </>
      }
      texte="Suivez la progression du plan de nettoyage par zone et par équipe. Identifiez rapidement les tâches en retard et réagissez en conséquence."
      points={[
        "Vision claire de l'avancement quotidien",
        "Rappel chaque matin des tâches du jour",
        "Historique consultable à tout moment",
        "Rapports pour les contrôles sanitaires",
      ]}
      visuel={<CarteAvancement />}
    />
  </PageFonctionnalite>
);

export default FeatureCleaning;
