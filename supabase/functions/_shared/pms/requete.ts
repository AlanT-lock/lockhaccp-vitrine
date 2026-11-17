// Lecture prudente de la requête reçue par `generer-pms` : taille du corps
// bornée avant l'analyse JSON, adresse IP du visiteur pour les quotas.

/** 64 Ko : un questionnaire complet pèse moins de 15 Ko. */
export const CORPS_MAX = 64 * 1024;

export type Corps = { ok: true; valeur: unknown } | { ok: false; statut: 400 | 413; message: string };

export async function lireCorps(req: Request): Promise<Corps> {
  const annonce = Number(req.headers.get("content-length") ?? "0");
  if (annonce > CORPS_MAX) return { ok: false, statut: 413, message: "Demande trop volumineuse." };
  const texte = await req.text();
  if (new TextEncoder().encode(texte).length > CORPS_MAX) {
    return { ok: false, statut: 413, message: "Demande trop volumineuse." };
  }
  try {
    return { ok: true, valeur: JSON.parse(texte) };
  } catch {
    return { ok: false, statut: 400, message: "Demande illisible." };
  }
}

/**
 * `cf-connecting-ip` est posé par Cloudflare devant Supabase et ne peut pas
 * être imposé par le visiteur ; `x-forwarded-for` sert de repli.
 */
export function ipClient(entetes: Headers): string {
  const cf = entetes.get("cf-connecting-ip")?.trim();
  if (cf) return cf;
  return (entetes.get("x-forwarded-for") ?? "").split(",")[0].trim() || "inconnue";
}
