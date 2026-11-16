// Vidéos de l'application LockHACCP enregistrées dans le simulateur iOS (public/videos/app/,
// voir docs/design/videos-app-manifest.json et docs/design/prompt-captures-simulateur-ios.md). 780 × 1696, en boucle, sans son.
// La description sert de texte alternatif : elle dit ce que montre réellement la vidéo.

export interface VideoApp {
  mp4: string;
  webm: string;
  /** Première image : affichée avant la lecture (et à la place de la vidéo si elle ne se charge pas). */
  poster: string;
  /** Image fixe de l'état le plus parlant. */
  cle: string;
  description: string;
}

function video(id: string, description: string): VideoApp {
  const base = `/videos/app/${id}`;
  return { mp4: `${base}.mp4`, webm: `${base}.webm`, poster: `${base}-poster.webp`, cle: `${base}-cle.webp`, description };
}

export const VIDEOS_APP = {
  tour: video(
    "tour",
    "Application LockHACCP : relevé du réfrigérateur de cuisine à 3 °C enregistré, puis surfaces de la plonge cochées dans le nettoyage du jour.",
  ),
  temperatures: video(
    "temperatures",
    "Relevé de la chambre froide à 7,4 °C, au-dessus de la limite de 4 °C : l'application demande une mesure corrective, deux actions sont choisies et le relevé est enregistré.",
  ),
  etiquettes: video(
    "etiquettes",
    "Production de 3 sauces béarnaises : la DLC secondaire est calculée automatiquement, le numéro de lot est proposé, puis la production est enregistrée.",
  ),
  reception: video(
    "reception",
    "Photo d'un bon de livraison : la lecture automatique reconnaît le fournisseur et 5 produits, puis la température des produits frais est saisie et la réception terminée.",
  ),
  historique: video(
    "historique",
    "Suivi de la journée avec les températures et les huiles faites, puis le nettoyage du jour avec ses 15 surfaces terminées.",
  ),
} satisfies Record<string, VideoApp>;

/** Dimensions des vidéos et des images fixes. */
export const VIDEO_LARGEUR = 780;
export const VIDEO_HAUTEUR = 1696;
