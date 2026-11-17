// Éléments communs aux documents du dossier PMS : définition pdfmake, couleurs,
// en-tête LockHACCP, cases à cocher dessinées (Roboto n'a pas le glyphe ☐) et
// pied de page LockHACCP (phrase, QR code, badges des stores cliquables).
// Tout texte saisi par le visiteur est placé dans des nœuds `text` : pdfmake ne
// l'interprète jamais.
import { BADGE_APP_STORE_JPG_BASE64, BADGE_GOOGLE_PLAY_JPG_BASE64, LOGO_LOCKHACCP_JPG_BASE64 } from "./ressources.ts";

// deno-lint-ignore no-explicit-any
export type Noeud = any;

export interface DefinitionPdf {
  pageSize: "A4";
  pageOrientation: "portrait" | "landscape";
  pageMargins: [number, number, number, number];
  info: { title: string; author: string; subject: string };
  /** Images déclarées une seule fois (sinon pdfmake les réintègre à chaque page). */
  images: Record<string, string>;
  defaultStyle: Noeud;
  styles?: Record<string, Noeud>;
  header?: (page: number, total: number, taille: { width: number }) => Noeud;
  background?: (page: number, taille: { width: number; height: number }) => Noeud;
  footer: (page: number, total: number) => Noeud;
  content: Noeud[];
}

export const MARINE = "#27306B";
export const BLEU = "#1F3A68";
export const BLEU_CLAIR = "#4A7CC0";
export const GRIS = "#6b7686";
export const FOND_LIGNE = "#F4F6FB";
export const FOND_INFO = "#EEF2FA";
export const BORDURE = "#9AA7B8";

export const URL_ESSAI = "https://www.lockhaccp.fr/tarifs?utm_source=pms";
export const URL_APP_STORE = "https://apps.apple.com/fr/app/lockhaccp/id6747192726";
export const URL_GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=fr.lockhaccp.app";

export const CAUTION =
  "Document réalisé avec l'expertise de SF FORMATION, organisme de formation à l'hygiène alimentaire " +
  "autorisé par la préfecture et certifié Qualiopi.";

const jpg = (base64: string) => `data:image/jpeg;base64,${base64}`;

/**
 * Images communes : logo LockHACCP et badges des stores, en JPEG sans
 * transparence (une image PNG transparente coûtait ~25 ms et ~100 Ko par PDF).
 */
export function imagesCommunes(): Record<string, string> {
  return {
    logo: jpg(LOGO_LOCKHACCP_JPG_BASE64),
    appStore: jpg(BADGE_APP_STORE_JPG_BASE64),
    googlePlay: jpg(BADGE_GOOGLE_PLAY_JPG_BASE64),
  };
}

/**
 * Cases à cocher : symbole « ☐ » de la police « Cases » (DejaVu Sans réduite),
 * un simple texte, bien plus rapide à mettre en page qu'un dessin par case.
 */
const CASE = (taille: number) => ({ text: "☐", font: "Cases", fontSize: taille + 3.5 });

/** Plusieurs cases côte à côte, centrées dans la cellule. */
export function cases(libelles: string[], taille = 7.5, alignment: "center" | "left" = "center"): Noeud {
  return {
    text: libelles.flatMap((l, i) => [...(i > 0 ? ["      "] : []), CASE(taille), ` ${l}`]),
    fontSize: taille,
    alignment,
  };
}

/** Case seule, centrée. */
export function caseSeule(): Noeud {
  return { text: [CASE(8)], alignment: "center" };
}

/** En-tête des fiches : logo à gauche, « LockHACCP » et le type de fiche à droite. */
export function enTeteFiche(sousTitre: string): Noeud {
  return {
    columns: [
      { image: "logo", width: 38 },
      {
        stack: [
          { text: "LockHACCP", bold: true, fontSize: 12, color: MARINE, alignment: "right" },
          { text: sousTitre, fontSize: 8.5, color: BLEU_CLAIR, alignment: "right", margin: [0, 6, 0, 0] },
        ],
        margin: [0, 4, 0, 0],
      },
    ],
    margin: [0, 0, 0, 6],
  };
}

export function titreFiche(texte: string): Noeud {
  return { text: texte, bold: true, fontSize: 14, color: MARINE, alignment: "center", margin: [0, 0, 0, 6] };
}

/** Ligne d'informations (« MOIS ____ | ANNÉE ____ … ») : paires libellé / valeur. */
export function bandeauInfos(paires: [string, string][], largeurs?: (string | number)[]): Noeud {
  const cellules = paires.flatMap(([libelle, valeur]) => [
    { text: libelle, bold: true, fontSize: 7.5, color: MARINE, fillColor: FOND_INFO },
    { text: valeur || " ", fontSize: 8.5, bold: Boolean(valeur) },
  ]);
  return {
    table: { widths: largeurs ?? cellules.map((_, i) => (i % 2 === 0 ? "auto" : "*")), body: [cellules] },
    layout: {
      hLineColor: () => "#1b2330",
      vLineColor: () => "#1b2330",
      hLineWidth: () => 0.6,
      vLineWidth: () => 0.6,
      paddingTop: () => 4,
      paddingBottom: () => 4,
    },
    margin: [0, 0, 0, 6],
  };
}

/** Encadré « IMPORTANT : … » des fiches de refroidissement, plats témoins et assainissement. */
export function encadreImportant(texte: string): Noeud {
  return {
    table: {
      widths: ["*"],
      body: [[{
        text: [{ text: "IMPORTANT : ", bold: true }, texte],
        fontSize: 8,
        alignment: "center",
        fillColor: FOND_INFO,
        color: MARINE,
      }]],
    },
    layout: {
      hLineColor: () => MARINE,
      vLineColor: () => MARINE,
      hLineWidth: () => 0.6,
      vLineWidth: () => 0.6,
      paddingTop: () => 4,
      paddingBottom: () => 4,
    },
    margin: [0, 0, 0, 6],
  };
}

/**
 * Grand tableau d'une fiche : en-tête marine, lignes zébrées de hauteur fixe.
 * `lignes` contient déjà les cellules (texte, cases…).
 */
export function tableauFiche(
  colonnes: string[],
  largeurs: (string | number)[],
  lignes: Noeud[][],
  hauteurLigne: number,
): Noeud {
  return {
    table: {
      headerRows: 1,
      dontBreakRows: true,
      widths: largeurs,
      heights: (i: number) => (i === 0 ? 22 : hauteurLigne),
      body: [
        colonnes.map((c) => ({ text: c, bold: true, color: "white", fontSize: 7.5, alignment: "center", fillColor: MARINE })),
        ...lignes,
      ],
    },
    layout: {
      hLineColor: () => "#1b2330",
      vLineColor: () => "#1b2330",
      hLineWidth: () => 0.5,
      vLineWidth: () => 0.5,
      fillColor: (i: number) => (i > 0 && i % 2 === 0 ? FOND_LIGNE : null),
      paddingTop: () => 2,
      paddingBottom: () => 1,
    },
  };
}

/** Pied des fiches : encadré LockHACCP avec la phrase de la fiche, QR code et badges. */
export function piedLockhaccp(phrase: string): Noeud {
  return {
    margin: [28, 0, 28, 0],
    table: {
      widths: ["*"],
      body: [[{
        fillColor: FOND_INFO,
        columns: [
          { qr: URL_ESSAI, fit: 66, foreground: MARINE, width: 66 },
          {
            stack: [
              { text: phrase, bold: true, fontSize: 8.5, color: MARINE },
              {
                text: "Essai gratuit sur lockhaccp.fr — scannez le QR code ou téléchargez l'application.",
                fontSize: 7,
                color: GRIS,
                margin: [0, 3, 0, 0],
              },
            ],
            width: "*",
            margin: [4, 6, 6, 0],
          },
          {
            stack: [
              { image: "appStore", width: 88, link: URL_APP_STORE },
              { image: "googlePlay", width: 88, link: URL_GOOGLE_PLAY, margin: [0, 4, 0, 0] },
            ],
            width: 88,
            margin: [0, 2, 0, 0],
          },
        ],
        columnGap: 6,
      }]],
    },
    layout: {
      hLineColor: () => "#C9D4E8",
      vLineColor: () => "#C9D4E8",
      paddingTop: () => 4,
      paddingBottom: () => 4,
      paddingLeft: () => 6,
      paddingRight: () => 6,
    },
  };
}
