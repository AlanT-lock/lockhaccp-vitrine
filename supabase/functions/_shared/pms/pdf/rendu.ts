// Rendu d'une définition pdfmake en octets PDF (pdfmake côté serveur, police
// Roboto embarquée : accents, « ≤ », « ° », « œ »).
import PdfPrinter from "npm:pdfmake@0.2.18";
import fontkit from "npm:@foliojs-fork/fontkit@1.9.2";
import vfsFonts from "npm:pdfmake@0.2.18/build/vfs_fonts.js";
import { Buffer } from "node:buffer";
import type { DefinitionPdf } from "./commun.ts";
import { POLICE_CASES_TTF_BASE64 } from "./ressources.ts";

// Le dossier compte 15 à 50 PDF. pdfkit relit chaque police (fontkit.create) à
// chaque document : ~4,5 ms par police et par PDF. On garde la police lue en
// mémoire, par tampon source : pdfkit crée ensuite son propre sous-ensemble de
// glyphes pour chaque document, la police lue n'est pas modifiée.
type Creer = (src: Uint8Array, famille?: string) => unknown;
const fk = fontkit as unknown as { create: Creer };
const creerOriginal = fk.create.bind(fontkit);
const policesLues = new WeakMap<Uint8Array, Map<string, unknown>>();
let lectures = 0;
fk.create = (src, famille) => {
  const parFamille = policesLues.get(src) ?? new Map<string, unknown>();
  policesLues.set(src, parFamille);
  const cle = famille ?? "";
  if (!parFamille.has(cle)) {
    parFamille.set(cle, creerOriginal(src, famille));
    lectures++;
  }
  return parFamille.get(cle);
};
/** Nombre de polices réellement lues depuis le démarrage (pour les tests). */
export const lecturesDePolices = () => lectures;

const vfs = vfsFonts as unknown as Record<string, string>;
const police = (fichier: string) => Buffer.from(vfs[fichier], "base64");

const cases = Buffer.from(POLICE_CASES_TTF_BASE64, "base64");

const printer = new PdfPrinter({
  Roboto: {
    normal: police("Roboto-Regular.ttf"),
    bold: police("Roboto-Medium.ttf"),
    italics: police("Roboto-Italic.ttf"),
    bolditalics: police("Roboto-MediumItalic.ttf"),
  },
  // Symbole « ☐ » des cases à cocher (absent de Roboto).
  Cases: { normal: cases, bold: cases, italics: cases, bolditalics: cases },
});

export function rendrePdf(definition: DefinitionPdf): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    // deno-lint-ignore no-explicit-any
    const doc = printer.createPdfKitDocument(definition as any);
    const morceaux: Uint8Array[] = [];
    doc.on("data", (m: Uint8Array) => morceaux.push(m));
    doc.on("end", () => {
      const total = morceaux.reduce((n, m) => n + m.length, 0);
      const pdf = new Uint8Array(total);
      let pos = 0;
      for (const m of morceaux) {
        pdf.set(m, pos);
        pos += m.length;
      }
      resolve(pdf);
    });
    doc.on("error", reject);
    doc.end();
  });
}
