// Fiches de traçabilité du dossier PMS : reprise fidèle de la forme des fiches
// d'Alan (~/Downloads/Tracabilité), à la marque LockHACCP, avec un pied qui
// présente l'application. Chaque fiche tient sur une seule page A4 (testé).
import {
  bandeauInfos,
  caseSeule,
  cases,
  type DefinitionPdf,
  encadreImportant,
  enTeteFiche,
  imagesCommunes,
  type Noeud,
  piedLockhaccp,
  tableauFiche,
  titreFiche,
} from "./commun.ts";

export type IdFiche =
  | "temperatures"
  | "nettoyage"
  | "reception"
  | "huile"
  | "refroidissement"
  | "plats_temoins"
  | "assainissement_poisson";

export interface ContexteFiche {
  equipement?: { nom: string; type: string; consigne: string };
  /** Relevés de température par jour : 2 pour les établissements à deux services. */
  releves?: 1 | 2;
  zone?: string;
  friteuse?: string;
}

interface Fiche {
  /** Phrase du pied LockHACCP : n'annonce que ce que l'application sait faire. */
  phrase: string;
  contenu: (ctx: ContexteFiche) => Noeud[];
}

const JOURS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const vide = () => ({ text: "" });
const jour = (j: string) => ({ text: j, bold: true, fontSize: 8, alignment: "center" });
const lignesVides = (n: number, colonnes: number) =>
  Array.from({ length: n }, () => Array.from({ length: colonnes }, vide));
const signataire = (texte: string) => ({ text: texte, bold: true, fontSize: 8, color: "#27306B", margin: [0, 5, 0, 0] });

const PHRASE_GENERALE =
  "Tenez tous vos registres HACCP sur tablette avec l'application LockHACCP : températures, nettoyage, réceptions et traçabilité.";

export const FICHES: Record<IdFiche, Fiche> = {
  temperatures: {
    phrase:
      "Relevez directement la température de vos équipements sur l'application LockHACCP : plus de feuille à remplir, chaque relevé est enregistré et prêt pour le contrôle.",
    contenu: (ctx) => {
      const eq = ctx.equipement;
      const deux = ctx.releves === 2;
      const colonnes = deux
        ? ["J", "TEMPÉRATURE\nMATIN (°C)", "C / NC", "TEMPÉRATURE\nSOIR (°C)", "C / NC", "ACTIONS CORRECTIVES"]
        : ["JOUR", "TEMPÉRATURE\nENREGISTRÉE (°C)", "CONFORMITÉ", "ACTIONS CORRECTIVES"];
      const largeurs = deux ? [24, 70, 70, 70, 70, "*"] : [40, 100, 110, "*"];
      const lignes = JOURS.map((j) =>
        deux
          ? [jour(j), vide(), cases(["C", "NC"]), vide(), cases(["C", "NC"]), vide()]
          : [jour(j), vide(), cases(["Conforme", "NC"]), vide()]
      );
      return [
        enTeteFiche("FICHE DE TRAÇABILITÉ — RELEVÉ DE TEMPÉRATURE"),
        titreFiche("RELEVÉ MENSUEL DE TEMPÉRATURE"),
        bandeauInfos([["MOIS", ""], ["ANNÉE", ""]]),
        bandeauInfos(
          [["NOM DE L'ÉQUIPEMENT", eq?.nom ?? ""], ["TYPE ET CONSIGNE", eq ? `${eq.type} — ${eq.consigne}` : ""]],
          ["auto", "*", "auto", "*"],
        ),
        tableauFiche(colonnes, largeurs, lignes, 14.2),
        signataire("Nom / initiales de la personne ayant effectué les relevés : ______________________________"),
      ];
    },
  },

  nettoyage: {
    phrase:
      "Suivez votre plan de nettoyage zone par zone sur l'application LockHACCP : chaque nettoyage validé est enregistré automatiquement.",
    contenu: (ctx) => [
      enTeteFiche("FICHE DE TRAÇABILITÉ — NETTOYAGE"),
      titreFiche("REGISTRE DE TRAÇABILITÉ DU NETTOYAGE"),
      bandeauInfos([["MOIS", ""], ["ANNÉE", ""], ["ZONE", ctx.zone ?? ""]], ["auto", 70, "auto", 60, "auto", "*"]),
      tableauFiche(
        ["JOUR", "FRÉQUENCE DU NETTOYAGE", "SIGNATURE"],
        [50, 250, "*"],
        JOURS.map((j) => [jour(j), cases(["Quotidien", "Hebdo", "Mensuel"]), vide()]),
        15,
      ),
    ],
  },

  reception: {
    phrase:
      "Enregistrez vos réceptions sur l'application LockHACCP : fournisseur, température et photo des étiquettes en quelques secondes.",
    contenu: () => [
      enTeteFiche("FICHE DE TRAÇABILITÉ — RÉCEPTION DE MARCHANDISES"),
      titreFiche("REGISTRE DE RÉCEPTION DE MARCHANDISES"),
      tableauFiche(
        ["DATE", "TEMPÉRATURE\n(°C)", "NOM DU FOURNISSEUR", "CONFORMITÉ", "OBSERVATIONS"],
        [70, 70, 110, 90, "*"],
        Array.from({ length: 16 }, () => [vide(), vide(), vide(), {
          stack: [cases(["Conforme"], 7.5, "left"), { ...cases(["Non conforme"], 7.5, "left"), margin: [0, 2, 0, 0] }],
          margin: [16, 5, 0, 0],
        }, vide()]),
        31,
      ),
      signataire("Personne ayant effectué le contrôle : ______________________________     Date : ____ / ____ / ______"),
    ],
  },

  huile: {
    phrase:
      "Notez vos contrôles et vos changements d'huile sur l'application LockHACCP, friteuse par friteuse.",
    contenu: (ctx) => [
      enTeteFiche("FICHE DE TRAÇABILITÉ — HUILES DE FRITURE"),
      titreFiche("TRAÇABILITÉ DES HUILES DE FRITURE"),
      bandeauInfos(
        [["MOIS", ""], ["ANNÉE", ""], ["NOM DE LA FRITEUSE", ctx.friteuse ?? ""]],
        ["auto", 70, "auto", 60, "auto", "*"],
      ),
      tableauFiche(
        ["JOUR", "CONFORMITÉ DE L'HUILE", "CHANGEMENT DE L'HUILE", "NETTOYAGE DE LA FRITEUSE"],
        [40, 190, "*", "*"],
        JOURS.map((j) => [jour(j), cases(["Conforme", "Non-conforme"]), caseSeule(), caseSeule()]),
        15,
      ),
    ],
  },

  refroidissement: {
    phrase:
      "Lancez vos refroidissements sur l'application LockHACCP : elle vous rappelle de relever la température de fin.",
    contenu: () => [
      enTeteFiche("FICHE DE TRAÇABILITÉ — REFROIDISSEMENT"),
      titreFiche("TRAÇABILITÉ DU REFROIDISSEMENT"),
      bandeauInfos([["MOIS", ""], ["ANNÉE", ""]]),
      encadreImportant(
        "tout produit suivant une procédure de refroidissement doit être refroidi de minimum +63 °C à maximum +10 °C en moins de 2 heures.",
      ),
      tableauFiche(
        [
          "DATE", "NOM DU\nPRODUIT", "TEMPÉRATURE\nAPRÈS CUISSON (°C)", "HORAIRE\nAPRÈS CUISSON",
          "TEMPÉRATURE APRÈS\nREFROIDISSEMENT (°C)", "HORAIRE APRÈS\nREFROIDISSEMENT", "SIGNATURE",
        ],
        [44, "*", 70, 58, 84, 78, 56],
        lignesVides(28, 7),
        16.2,
      ),
    ],
  },

  plats_temoins: {
    phrase: PHRASE_GENERALE,
    contenu: () => [
      enTeteFiche("FICHE DE TRAÇABILITÉ — PLATS TÉMOINS"),
      titreFiche("TRAÇABILITÉ DES PLATS TÉMOINS"),
      bandeauInfos([["MOIS", ""], ["ANNÉE", ""]]),
      encadreImportant(
        "conserver un échantillon de chaque plat servi, clairement identifié, pendant au moins 5 jours entre 0 et +3 °C après le service.",
      ),
      tableauFiche(
        ["DATE", "REPAS / SERVICE", "PLATS PRÉLEVÉS", "DATE DE\nDESTRUCTION", "SIGNATURE"],
        [55, 90, "*", 70, 70],
        lignesVides(28, 5),
        16.2,
      ),
    ],
  },

  assainissement_poisson: {
    phrase: PHRASE_GENERALE,
    contenu: () => [
      enTeteFiche("FICHE DE TRAÇABILITÉ — ASSAINISSEMENT DU POISSON"),
      titreFiche("ASSAINISSEMENT DU POISSON SERVI CRU"),
      bandeauInfos([["MOIS", ""], ["ANNÉE", ""]]),
      encadreImportant(
        "tout poisson servi cru ou peu cuit doit être congelé à -20 °C à cœur pendant au moins 24 heures, ou à -35 °C pendant au moins 15 heures.",
      ),
      tableauFiche(
        [
          "DATE", "POISSON / LOT", "HEURE\nD'ENTRÉE", "TEMPÉRATURE\n(°C)", "DATE ET HEURE\nDE SORTIE", "DURÉE\nRESPECTÉE",
          "SIGNATURE",
        ],
        [48, "*", 55, 62, 78, 55, 60],
        Array.from({ length: 28 }, () => [vide(), vide(), vide(), vide(), vide(), caseSeule(), vide()]),
        16.2,
      ),
    ],
  },
};

export function definirFiche(id: IdFiche, ctx: ContexteFiche): DefinitionPdf {
  const fiche = FICHES[id];
  return {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [28, 22, 28, 88],
    info: { title: `Fiche de traçabilité LockHACCP`, author: "LockHACCP", subject: "Plan de Maîtrise Sanitaire" },
    images: imagesCommunes(),
    defaultStyle: { font: "Roboto", fontSize: 8.5, lineHeight: 1.05, color: "#1b2330" },
    footer: () => piedLockhaccp(fiche.phrase),
    content: fiche.contenu(ctx),
  };
}
