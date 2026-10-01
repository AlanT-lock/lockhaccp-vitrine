// Instant de référence pour tout affichage qui dépend de la date (prix de lancement,
// compte à rebours, année). Le HTML étant pré-généré, le premier rendu navigateur
// (hydratation) doit utiliser le MÊME instant que la construction, sinon React
// constate une différence et refait la page. L'instant réel prend le relais après
// le montage (voir useMaintenant).

/** Nom de la meta où la pré-génération écrit son instant (ISO 8601). */
export const META_INSTANT = "lhc-instant";

type DocLike = { querySelector: (sel: string) => { getAttribute: (n: string) => string | null } | null };

export function instantDeRendu(
  doc: DocLike | undefined = typeof document !== "undefined" ? document : undefined,
): Date {
  // Pré-génération : instant fixé une fois pour tout le build (scripts/prerender.mjs).
  const fixe = (globalThis as { __LHC_INSTANT__?: Date }).__LHC_INSTANT__;
  if (fixe) return fixe;
  const contenu = doc?.querySelector(`meta[name="${META_INSTANT}"]`)?.getAttribute("content");
  const date = contenu ? new Date(contenu) : null;
  return date && !Number.isNaN(date.getTime()) ? date : new Date();
}
