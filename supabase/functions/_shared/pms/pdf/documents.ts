// Documents du dossier PMS autres que les fiches : tableau CCP (paysage), plan
// de nettoyage et de désinfection (un tableau par zone) et affiches (une par
// fichier, voir affiches_design.ts). Fonctions pures, sans rendu.
import { produitPourSurface, USAGE_PRODUIT } from "../produits_nettoyage.ts";
import type { ElementListe, MetierId, PmsCompose, Reponses } from "../types.ts";
import { MODELES_OFFICIELS } from "./ressources.ts";
import {
  BLEU,
  BORDURE,
  CAUTION,
  type DefinitionPdf,
  enTeteFiche,
  FOND_INFO,
  GRIS,
  imagesCommunes,
  MARINE,
  type Noeud,
  piedLockhaccp,
  titreFiche,
} from "./commun.ts";

type AfficheComposee = PmsCompose["affiches"][number];


const texte = (r: Reponses, cle: string) => (typeof r[cle] === "string" ? (r[cle] as string) : "");

/** Nom d'établissement raccourci pour les en-têtes. */
export const nomCourt = (nom: string) => (nom.length > 60 ? `${nom.slice(0, 60)}…` : nom);

/** Affiche à modèle officiel dont l'image n'est pas (encore) fournie : on renvoie vers le modèle. */
const modeleManquant = (a: AfficheComposee) => Boolean(a.modeleOfficielUrl) && !MODELES_OFFICIELS[a.id];

/** Titre imprimé et nom de fichier : sans « (modèle officiel) » quand le modèle manque. */
export const titreAffiche = (a: AfficheComposee) =>
  modeleManquant(a) ? a.titre.replace(/\s*\(modèle officiel\)/, "") : a.titre;


function base(orientation: "portrait" | "landscape", titre: string): Omit<DefinitionPdf, "content" | "footer"> {
  return {
    pageSize: "A4",
    pageOrientation: orientation,
    pageMargins: [28, 28, 28, 40],
    info: { title: titre, author: "LockHACCP", subject: "Plan de Maîtrise Sanitaire" },
    images: imagesCommunes(),
    defaultStyle: { font: "Roboto", fontSize: 9, lineHeight: 1.15, color: "#1b2330" },
  };
}

// ─── Tableau CCP ────────────────────────────────────────────────────────────

export function definirTableauCcp(pms: PmsCompose, r: Reponses): DefinitionPdf {
  const nom = texte(r, "coordonnees.nom");
  const entete = ["CCP", "Seuil critique", "Surveillance", "Mesures correctives"];
  return {
    ...base("landscape", `Tableau CCP — ${nom}`),
    pageMargins: [28, 58, 28, 40],
    header: (_page, _total, taille) => ({
      margin: [28, 14, 28, 0],
      stack: [
        {
          columns: [
            { image: "logo", width: 28 },
            {
              text: `Analyse des dangers (CCP) — ${nomCourt(nom)}`,
              margin: [10, 8, 0, 0],
              color: BLEU,
              bold: true,
              width: "*",
            },
          ],
        },
        { canvas: [{ type: "line", x1: 0, y1: 4, x2: taille.width - 56, y2: 4, lineWidth: 0.8, lineColor: BLEU }] },
      ],
    }),
    footer: (page, total) => ({
      margin: [28, 12, 28, 0],
      columns: [
        { text: CAUTION, fontSize: 7, color: GRIS, width: "*" },
        { text: `${page} / ${total}`, fontSize: 8, alignment: "right", width: 50 },
      ],
    }),
    content: [
      titreFiche("TABLEAU D'ANALYSE DES DANGERS (CCP)"),
      {
        table: {
          headerRows: 1,
          dontBreakRows: true,
          widths: [150, 170, "*", "*"],
          body: [
            entete.map((c) => ({ text: c, bold: true, color: "white", fillColor: MARINE, fontSize: 9 })),
            ...pms.ccp.map((l) =>
              [l.rendu.libelle, l.rendu.seuil, l.rendu.surveillance, l.rendu.correctives].map((c) => ({
                text: c,
                fontSize: 8.5,
              }))
            ),
          ],
        },
        layout: {
          hLineColor: () => BORDURE,
          vLineColor: () => BORDURE,
          fillColor: (i: number) => (i > 0 && i % 2 === 0 ? "#F4F6FB" : null),
          paddingTop: () => 4,
          paddingBottom: () => 4,
        },
      },
    ],
  };
}

// ─── Plan de nettoyage ──────────────────────────────────────────────────────

export function definirPlanNettoyage(r: Reponses): DefinitionPdf {
  const zones = (Array.isArray(r["nettoyage.zones"]) ? r["nettoyage.zones"] : []) as ElementListe[];
  const surfacesDe = (z: ElementListe) => (z.surfaces ?? []) as ElementListe[];
  const produitsUtilises = [...new Set(zones.flatMap((z) => surfacesDe(z).map((s) => produitPourSurface(s.nom))))];
  const cellule = (t: string, extra: Noeud = {}) => ({ text: t, fontSize: 8.5, ...extra });
  // Un seul tableau par zone : titre et en-têtes répétés si la zone continue
  // sur la page suivante. (pdfmake supprime un bloc « unbreakable » plus haut
  // qu'une page : une longue zone disparaissait.)
  const tableauZone = (z: ElementListe): Noeud => ({
    _zone: z.nom,
    margin: [0, 0, 0, 10],
    table: {
      headerRows: 2,
      keepWithHeaderRows: 1,
      dontBreakRows: true,
      widths: ["*", 70, 150, 90],
      body: [
        [
          { text: `ZONE : ${z.nom}`, bold: true, color: "white", fillColor: MARINE, fontSize: 10, colSpan: 4 },
          {},
          {},
          {},
        ],
        ["SURFACE / ÉQUIPEMENT", "FRÉQUENCE", "TYPE DE PRODUIT", "RESPONSABLE"].map((c) =>
          cellule(c, { bold: true, fontSize: 7.5, color: MARINE, fillColor: FOND_INFO })
        ),
        ...surfacesDe(z).map((s) => [
          cellule(s.nom),
          cellule(String(s.frequence ?? "")),
          cellule(produitPourSurface(s.nom)),
          cellule(" "),
        ]),
      ],
    },
    layout: {
      hLineColor: () => BORDURE,
      vLineColor: () => BORDURE,
      paddingTop: () => 3,
      paddingBottom: () => 3,
    },
  });
  return {
    ...base("portrait", "Plan de nettoyage et de désinfection"),
    pageMargins: [28, 22, 28, 96],
    footer: () => ({
      stack: [
        piedLockhaccp(
          "Suivez votre plan de nettoyage zone par zone sur l'application LockHACCP : chaque nettoyage validé est enregistré automatiquement.",
        ),
        { text: CAUTION, fontSize: 6.5, color: GRIS, margin: [28, 3, 28, 0] },
      ],
    }),
    content: [
      enTeteFiche("PLAN DE MAÎTRISE SANITAIRE — NETTOYAGE"),
      titreFiche("PLAN DE NETTOYAGE ET DE DÉSINFECTION"),
      { text: texte(r, "coordonnees.nom"), bold: true, fontSize: 9, color: MARINE, alignment: "center", margin: [0, 0, 0, 6] },
      {
        table: {
          widths: ["*"],
          body: [[{
            fillColor: FOND_INFO,
            stack: [
              { text: "Produits à utiliser (aptes au contact alimentaire)", bold: true, fontSize: 8.5, color: MARINE },
              {
                ul: produitsUtilises.map((p) => ({ text: [{ text: p, bold: true }, ` : ${USAGE_PRODUIT[p]}`], fontSize: 8 })),
                margin: [0, 3, 0, 3],
              },
              {
                text: "Respectez la dilution et le temps d'action indiqués sur l'étiquette ; rincez si l'étiquette l'indique.",
                fontSize: 7.5,
                color: GRIS,
              },
            ],
          }]],
        },
        layout: "noBorders",
        margin: [0, 0, 0, 10],
      },
      ...zones.map(tableauZone),
    ],
  };
}
