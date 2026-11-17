// Mise en page des affiches du dossier PMS (Alan, 30/09/2026) : une affiche
// par page, illustrée de pictogrammes, sans aucune marque (ni LockHACCP ni
// SF FORMATION) — ce sont des affiches destinées aux clients et au personnel.
// Exception : le tableau des allergènes porte le logo LockHACCP (Alan, 01/10/2026).
// Clients : tons chauds ; personnel : tons bleus. Modèles officiels (alcool)
// et fiche de lavage des mains d'Alan reproduits tels quels, en pleine page.
import type { MetierId, PmsCompose, Reponses } from "../types.ts";
import type { DefinitionPdf, Noeud } from "./commun.ts";
import { ICONES } from "./icones.ts";
import { AFFICHE_LAVAGE_MAINS_JPG_BASE64, LOGO_LOCKHACCP_JPG_BASE64, MODELES_OFFICIELS } from "./ressources.ts";

type AfficheComposee = PmsCompose["affiches"][number];

interface Theme {
  principal: string;
  fond: string;
  texte: string;
}

const CLIENTS: Theme = { principal: "#B8482B", fond: "#FBF1E7", texte: "#2B2118" };
const PERSONNEL: Theme = { principal: "#1F3A68", fond: "#EAF0F8", texte: "#1b2330" };
const GRIS = "#6b7686";

/** Métiers qui vendent l'alcool à emporter (modèle officiel « vente à emporter »). */
const VENTE_A_EMPORTER: MetierId[] = ["epicerie_primeur", "cremerie_fromagerie"];

const texte = (r: Reponses, cle: string) => (typeof r[cle] === "string" ? (r[cle] as string) : "");
const png = (base64: string) => `data:image/png;base64,${base64}`;

// ─── Briques communes ───────────────────────────────────────────────────────

/** Pictogramme dans une pastille ronde (un seul SVG, rapide à mettre en page). */
export function pastille(nom: keyof typeof ICONES | string, taille: number, fond: string, couleur: string): Noeud {
  const icone = ICONES[nom];
  const [, , l, h] = icone.viewBox.split(/[\s,]+/).map(Number);
  const echelle = 56 / Math.max(l, h);
  const chemins = icone.d.map((d) => `<path fill="${couleur}" d="${d}"/>`).join("");
  return {
    svg:
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${fond}"/>` +
      `<g transform="translate(${50 - (l * echelle) / 2},${50 - (h * echelle) / 2}) scale(${echelle})">${chemins}</g></svg>`,
    width: taille,
    height: taille,
  };
}

/** Ligne à compléter à la main : libellé puis trait. */
function champ(libelle: string, theme: Theme, taille = 13): Noeud {
  return {
    table: {
      widths: ["auto", "*"],
      body: [[
        { text: libelle, bold: true, fontSize: taille, color: theme.texte, margin: [0, 6, 6, 0] },
        { text: " ", fontSize: taille, border: [false, false, false, true] },
      ]],
    },
    layout: {
      defaultBorder: false,
      hLineColor: () => theme.principal,
      hLineWidth: () => 0.8,
      paddingLeft: () => 0,
      paddingRight: () => 0,
    },
    margin: [0, taille >= 15 ? 12 : 4, 0, taille >= 15 ? 12 : 4],
  };
}

function entete(icone: string, titre: string, sousTitre: string | null, theme: Theme, grand = false): Noeud[] {
  return [
    { ...pastille(icone, grand ? 120 : 74, theme.principal, "#ffffff"), alignment: "center", margin: [0, grand ? 70 : 4, 0, grand ? 22 : 10] },
    { text: titre, fontSize: grand ? 32 : 27, bold: true, color: theme.principal, alignment: "center", characterSpacing: 0.5 },
    ...(sousTitre ? [{ text: sousTitre, fontSize: 13, color: theme.texte, alignment: "center", margin: [0, 6, 0, 0] }] : []),
    {
      canvas: [{ type: "line", x1: 200, y1: 0, x2: 315, y2: 0, lineWidth: 2.5, lineColor: theme.principal }],
      margin: [0, grand ? 18 : 10, 0, grand ? 30 : 14],
    },
  ];
}

/** Encadré coloré (fond clair, coins arrondis via un tableau sans bordure). */
function encadre(contenu: Noeud[], theme: Theme, marge: number[] = [0, 0, 0, 0]): Noeud {
  return {
    table: { widths: ["*"], body: [[{ stack: contenu, fillColor: theme.fond, margin: [14, 9, 14, 9] }]] },
    layout: "noBorders",
    margin: marge,
  };
}

/** Cadre fin tout autour de la page, dans la couleur du thème. */
const cadre = (theme: Theme) => (_page: number, taille: { width: number; height: number }) => ({
  canvas: [
    { type: "rect", x: 18, y: 18, w: taille.width - 36, h: taille.height - 36, r: 14, lineWidth: 2, lineColor: theme.principal },
    { type: "rect", x: 18, y: 18, w: taille.width - 36, h: 8, r: 4, color: theme.principal },
  ],
});

function page(
  titre: string,
  theme: Theme,
  contenu: Noeud[],
  pied: string,
  options: { images?: Record<string, string>; fond?: DefinitionPdf["background"] } = {},
): DefinitionPdf {
  return {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [48, 44, 48, 58],
    info: { title: titre, author: "", subject: "Affichage obligatoire" },
    images: options.images ?? {},
    defaultStyle: { font: "Roboto", fontSize: 12, lineHeight: 1.2, color: theme.texte },
    background: options.fond ?? cadre(theme),
    footer: () => ({ text: pied, fontSize: 8, color: GRIS, alignment: "center", margin: [48, 22, 48, 0] }),
    content: contenu,
  };
}

const nom = (r: Reponses) => texte(r, "coordonnees.nom");
/** Pied des affiches du personnel : établissement et texte de référence. */
const piedPersonnel = (a: AfficheComposee, r: Reponses) => `${nom(r)} — ${a.reference}`;

// ─── Affiches clients ───────────────────────────────────────────────────────

// Ordre et présentation du modèle d'Alan (« Tableau des allergènes », 01/10/2026).
const ALLERGENES: [string, string][] = [
  ["gluten", "Gluten"], ["oeufs", "Œufs"], ["poissons", "Poissons"], ["crustaces", "Crustacés"],
  ["arachides", "Arachides"], ["soja", "Soja"], ["celeri", "Céleri"], ["lait", "Lait"],
  ["fruits_coque", "Fruits à coque"], ["moutarde", "Moutarde"], ["sesame", "Sésame"], ["sulfites", "Sulfites"],
  ["lupin", "Lupin"], ["mollusques", "Mollusques"],
];

const BLEU_LOCKHACCP = "#003D85";
const BLEU_CLAIR = "#DCE6F5";
/** Lignes à remplir : le tableau occupe toute la page A4 paysage. */
const LIGNES_ALLERGENES = 14;

/** Tableau à remplir à la main, en paysage, avec le logo LockHACCP (seule affiche avec une marque). */
function tableauAllergenes(r: Reponses): DefinitionPdf {
  const enTete = [
    {
      text: "Produit ou plat",
      bold: true,
      fontSize: 12,
      color: "#ffffff",
      fillColor: BLEU_LOCKHACCP,
      alignment: "center",
      margin: [0, 24, 0, 0],
    },
    ...ALLERGENES.map(([icone, libelle]) => ({
      stack: [
        { ...pastille(icone, 30, "#ffffff", BLEU_LOCKHACCP), alignment: "center" },
        { text: libelle, fontSize: 7.5, bold: true, color: BLEU_LOCKHACCP, alignment: "center", margin: [0, 3, 0, 0] },
      ],
      fillColor: BLEU_CLAIR,
      margin: [0, 4, 0, 0],
    })),
  ];
  const vide = Array.from({ length: LIGNES_ALLERGENES }, () => Array.from({ length: 15 }, () => ({ text: "" })));
  return {
    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [24, 18, 24, 26],
    info: { title: "Tableau des allergènes", author: "", subject: "Affichage obligatoire" },
    images: { logo: `data:image/jpeg;base64,${LOGO_LOCKHACCP_JPG_BASE64}` },
    defaultStyle: { font: "Roboto", fontSize: 10, lineHeight: 1.1, color: "#1b2330" },
    footer: () => ({
      columns: [
        { text: "Cochez les allergènes présents dans chaque produit. Tableau à tenir à jour et à laisser à la disposition des clients.", width: "*" },
        { text: "Règlement (UE) n° 1169/2011, annexe II", width: "auto" },
      ],
      fontSize: 7,
      color: GRIS,
      margin: [24, 8, 24, 0],
    }),
    content: [
      {
        columns: [
          {
            width: 200,
            columns: [
              { image: "logo", fit: [30, 34], width: 30 },
              { text: "LockHACCP", fontSize: 15, bold: true, color: BLEU_LOCKHACCP, margin: [6, 9, 0, 0], width: "auto" },
            ],
          },
          { text: "Tableau des allergènes", fontSize: 24, bold: true, color: BLEU_LOCKHACCP, alignment: "center", margin: [0, 4, 0, 0], width: "*" },
          { text: nom(r), fontSize: 11, bold: true, alignment: "right", margin: [0, 12, 0, 0], width: 200 },
        ],
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          headerRows: 1,
          // Largeurs fixes : 148 + 14 × 41 + marges des cellules = 793 pt sur 794 disponibles.
          widths: [148, ...ALLERGENES.map(() => 41)],
          heights: (i: number) => (i === 0 ? 62 : 25),
          body: [enTete, ...vide],
        },
        layout: {
          hLineColor: () => "#8a9bb5",
          vLineColor: () => "#8a9bb5",
          hLineWidth: () => 0.7,
          vLineWidth: () => 0.7,
          paddingLeft: () => 2,
          paddingRight: () => 2,
        },
      },
    ],
  };
}

function origineViandes(r: Reponses): DefinitionPdf {
  const t = CLIENTS;
  const autres = Array.isArray(r["prep.autres_viandes_types"]) ? (r["prep.autres_viandes_types"] as string[]) : [];
  const viandes: { icone: string; nom: string; etapes: string[] }[] = [];
  if (r["prep.viande_bovine"] === true) viandes.push({ icone: "boeuf", nom: "Bœuf", etapes: ["Né en", "Élevé en", "Abattu en"] });
  if (r["prep.autres_viandes_crues"] === true) {
    if (autres.includes("porc")) viandes.push({ icone: "porc", nom: "Porc", etapes: ["Élevé en", "Abattu en"] });
    if (autres.includes("volaille")) viandes.push({ icone: "volaille", nom: "Volaille", etapes: ["Élevée en", "Abattue en"] });
    if (autres.includes("agneau")) viandes.push({ icone: "agneau", nom: "Agneau", etapes: ["Élevé en", "Abattu en"] });
  }
  const carte = (v: (typeof viandes)[number]) =>
    encadre([{
      columns: [
        { ...pastille(v.icone, 50, "#ffffff", t.principal), width: 50 },
        {
          stack: [
            { text: v.nom, fontSize: 18, bold: true, color: t.principal },
            { columns: v.etapes.map((e) => ({ ...champ(e, t, 12), width: "*" })), columnGap: 14 },
          ],
          margin: [14, 2, 0, 0],
          width: "*",
        },
      ],
    }], t, [0, 0, 0, 8]);
  const preparations = r["prep.produits_viande_achetes"] === true
    ? [
      { text: "Viandes de nos préparations", fontSize: 15, bold: true, color: t.principal, margin: [0, 6, 0, 6] },
      {
        table: {
          widths: ["*", 90, 100, 100],
          body: [
            ["Plat ou produit", "Viande", "Élevée en", "Abattue en"].map((x) => ({
              text: x, bold: true, color: "#ffffff", fillColor: t.principal, fontSize: 11,
            })),
            ...Array.from({ length: 3 }, () => [" ", " ", " ", " "].map((x) => ({ text: x, fontSize: 15 }))),
          ],
        },
        layout: {
          hLineColor: () => t.principal,
          vLineColor: () => t.principal,
          hLineWidth: () => 0.6,
          vLineWidth: () => 0.6,
        },
      },
    ]
    : [];
  return page("Origine de nos viandes", t, [
    ...entete("couverts", "L'ORIGINE DE NOS VIANDES", "Pays de naissance, d'élevage et d'abattage", t),
    ...viandes.map(carte),
    ...preparations,
  ], nom(r));
}

function egalim(r: Reponses): DefinitionPdf {
  const t = CLIENTS;
  const stat = (libelle: string) =>
    encadre([
      { text: "______ %", fontSize: 30, bold: true, color: t.principal, alignment: "center" },
      { text: libelle, fontSize: 12, alignment: "center", margin: [0, 6, 0, 0] },
    ], t);
  return page("Qualité de nos repas", t, [
    ...entete("pousse", "CE QUE CONTIENNENT NOS REPAS", "Année ________", t),
    {
      columns: [
        stat("de produits durables et de qualité"),
        stat("de produits issus de l'agriculture biologique"),
      ],
      columnGap: 16,
      margin: [0, 0, 0, 18],
    },
    { text: "Nos actions pour le commerce équitable", fontSize: 15, bold: true, color: t.principal, margin: [0, 0, 0, 4] },
    ...Array.from({ length: 4 }, () => champ("•", t, 12)),
  ], nom(r));
}

/** Planche d'étiquettes à découper (prix, poisson, fruits et légumes, viande bovine). */
function etiquettes(
  titre: string,
  icone: string,
  colonnes: 2,
  lignes: number,
  champs: string[],
  r: Reponses,
): DefinitionPdf {
  const t = CLIENTS;
  const etiquette = () => ({
    table: {
      widths: ["*"],
      body: [[{
        stack: [
          { columns: [{ ...pastille(icone, 22, t.principal, "#ffffff"), width: 22 }, { text: "", width: "*" }] },
          ...champs.map((c) => champ(c, t, 10)),
        ],
        margin: [8, 8, 8, 8],
      }]],
    },
    layout: {
      hLineColor: () => GRIS,
      vLineColor: () => GRIS,
      hLineStyle: () => ({ dash: { length: 3 } }),
      vLineStyle: () => ({ dash: { length: 3 } }),
    },
  });
  return page(titre, t, [
    { text: titre.toUpperCase(), fontSize: 18, bold: true, color: t.principal, alignment: "center", margin: [0, 6, 0, 2] },
    { text: "Étiquettes à découper et à placer près de chaque produit", fontSize: 11, alignment: "center", margin: [0, 0, 0, 12] },
    {
      table: {
        widths: Array.from({ length: colonnes }, () => "*"),
        body: Array.from({ length: lignes }, () => Array.from({ length: colonnes }, etiquette)),
      },
      layout: { defaultBorder: false, paddingLeft: () => 5, paddingRight: () => 5, paddingTop: () => 5, paddingBottom: () => 5 },
    },
  ], nom(r));
}

// ─── Affiches du personnel ──────────────────────────────────────────────────

function fiche(a: AfficheComposee, r: Reponses, icone: string, titre: string, contenu: Noeud[], grand = true): DefinitionPdf {
  return page(a.titre, PERSONNEL, [...entete(icone, titre, null, PERSONNEL, grand), ...contenu], piedPersonnel(a, r));
}

/** Champ des affiches du personnel : grand, facile à remplir. */
const champP = (libelle: string) => champ(libelle, PERSONNEL, 16);

// ─── Aiguillage ─────────────────────────────────────────────────────────────

export function definirAffiche(a: AfficheComposee, r: Reponses): DefinitionPdf {
  const P = PERSONNEL;
  switch (a.id) {
    case "affiche.lavage_mains":
      return {
        ...page(a.titre, P, [{ image: "lavageMains", fit: [539, 786], alignment: "center" }], "", {
          images: { lavageMains: `data:image/jpeg;base64,${AFFICHE_LAVAGE_MAINS_JPG_BASE64}` },
          fond: () => ({ text: "" }),
        }),
        pageMargins: [28, 28, 28, 28],
      };
    case "affiche.protection_mineurs_alcool": {
      const modeles = MODELES_OFFICIELS[a.id];
      const voulue = VENTE_A_EMPORTER.includes(r.metier) ? "a_emporter" : "sur_place";
      const variante = modeles[voulue] ? voulue : Object.keys(modeles)[0];
      return {
        ...page(a.titre, CLIENTS, [{ image: "modele", fit: [539, 786], alignment: "center" }], "", {
          images: { modele: png(modeles[variante]) },
          fond: () => ({ text: "" }),
        }),
        pageMargins: [28, 28, 28, 28],
      };
    }
    case "affiche.allergenes":
      return tableauAllergenes(r);
    case "affiche.origine_viandes":
      return origineViandes(r);
    case "affiche.egalim":
      return egalim(r);
    case "affiche.prix_commerce":
      return etiquettes("Étiquettes de prix", "etiquette", 2, 4, ["Produit :", "Prix TTC :", "Prix au kg ou au litre :"], r);
    case "affiche.produits_peche":
      return etiquettes("Étiquettes produits de la mer", "poissons", 2, 2, [
        "Nom :", "Nom scientifique :", "Pêché / élevé :", "Zone ou pays :", "Engin de pêche :", "Décongelé : oui / non",
        "Prix au kg :",
      ], r);
    case "affiche.origine_fruits_legumes":
      return etiquettes("Pancartes fruits et légumes", "pousse", 2, 3, [
        "Produit :", "Variété :", "Origine :", "Catégorie / calibre :", "Prix :",
      ], r);
    case "affiche.origine_viande_boucherie":
      return etiquettes("Étiquettes viande bovine", "boeuf", 2, 2, [
        "Morceau :", "Prix au kg :", "N° de lot :", "Né en :", "Élevé en :", "Abattu en (n° d'agrément) :",
        "Découpé en (n° d'agrément) :", "Catégorie / race :",
      ], r);
    case "affiche.employeur_inspection_travail":
      return fiche(a, r, "marteau", "INSPECTION DU TRAVAIL", [
        encadre([champP("Adresse :"), champP(""), champP("Téléphone :"), champP("Inspecteur ou inspectrice :")], P),
      ]);
    case "affiche.employeur_medecine_travail":
      return fiche(a, r, "stethoscope", "SERVICE DE SANTÉ AU TRAVAIL", [
        encadre([champP("Service ou médecin :"), champP("Adresse :"), champP(""), champP("Téléphone :")], P),
      ]);
    case "affiche.employeur_convention_collective":
      return fiche(a, r, "livre", "CONVENTION COLLECTIVE", [
        encadre([
          champP("Convention applicable :"),
          champP("N° IDCC :"),
          champP("Consultable :"),
          champP("À demander à :"),
          { text: "Vous pouvez la consulter pendant votre temps de travail.", fontSize: 13, italics: true, margin: [0, 8, 0, 0] },
        ], P),
      ]);
    default:
      // Affiche sans mise en page dédiée : son texte, dans le gabarit du public visé.
      return page(a.titre, a.public === "clients" ? CLIENTS : P, [
        ...entete("couverts", a.titre.toUpperCase(), null, a.public === "clients" ? CLIENTS : P),
        { text: a.contenuRendu, fontSize: 14 },
      ], nom(r));
  }
}
