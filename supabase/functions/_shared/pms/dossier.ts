// Assemblage du dossier PMS en un fichier zip : un dossier racine
// « PMS - {Nom} » qui contient les PDF (chemins UTF-8, sous-dossiers).
import { zipSync } from "npm:fflate@0.8.2";
import { nomDeFichier } from "./pdf/dossier_pdf.ts";

export interface FichierRendu {
  chemin: string;
  octets: Uint8Array;
}

/** « PMS - Le Bistrot » : nom du dossier racine dans le zip. */
export const nomDossierPms = (etablissement: string) => `PMS - ${nomDeFichier(etablissement)}`;

/** Nom du fichier envoyé et téléchargé : « PMS - Le Bistrot.zip » (« .pdf » pour les demandes du lot 2). */
export const nomFichierPms = (etablissement: string, extension: "zip" | "pdf" = "zip") =>
  `${nomDossierPms(etablissement)}.${extension}`;

export function zipper(racine: string, fichiers: FichierRendu[]): Uint8Array {
  const arbre: Record<string, Uint8Array> = {};
  const vus = new Set<string>();
  for (const f of fichiers) {
    const chemin = `${racine}/${f.chemin}`;
    if (vus.has(chemin.toLowerCase())) throw new Error(`Fichier en double dans le dossier PMS : ${f.chemin}`);
    vus.add(chemin.toLowerCase());
    arbre[chemin] = f.octets;
  }
  // Les PDF sont déjà compressés : une compression légère suffit.
  return zipSync(arbre, { level: 1 });
}

/**
 * Lien signé qui enregistre le fichier sous `nom`. On n'utilise pas l'option
 * `download` de storage-js : elle passe par encodeURI, qui laisse & # + tels
 * quels et coupe « Pain & Co.zip » en « Pain ».
 */
export function lienAvecNom(urlSignee: string, nom: string): string {
  return `${urlSignee}${urlSignee.includes("?") ? "&" : "?"}download=${encodeURIComponent(nom)}`;
}
