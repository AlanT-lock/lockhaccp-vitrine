// Titre de page affiché dans Google et l'onglet du navigateur.
const SUFFIXE = " | LockHACCP";
/** Au-delà, Google tronque le titre (contrôlé au build par verifier-prerender.mjs). */
export const TITRE_MAX = 60;

/** Suffixe de marque ajouté seulement s'il tient dans la limite. */
export function titreComplet(title: string): string {
  if (title.includes("LockHACCP")) return title;
  return (title + SUFFIXE).length <= TITRE_MAX ? title + SUFFIXE : title;
}
