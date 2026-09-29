// FICHIER GÉNÉRÉ par lockhaccp/scripts/pms/synchroniser_vitrine.ts — ne pas modifier.
// supabase/functions/_shared/pms/moteur.ts
// Moteur du référentiel PMS : conditions, filtrage, gabarits. Fonctions pures.
import type {
  Condition, Element, ElementListe, Mode, PmsCompose, Question, Referentiel, Reponses,
} from "./types";

export function evaluer(c: Condition, r: Reponses): boolean {
  if ("toujours" in c) return true;
  if ("tous" in c) return c.tous.every((x) => evaluer(x, r));
  if ("unDe" in c) return c.unDe.some((x) => evaluer(x, r));
  if ("non" in c) return !evaluer(c.non, r);
  const v = r[c.question];
  if (v === undefined || v === null) return false;
  if ("egal" in c) return v === c.egal;
  if ("contient" in c) return Array.isArray(v) && (v as unknown[]).includes(c.contient);
  if ("nonVide" in c) return Array.isArray(v) && v.length > 0;
  if ("superieurA" in c) return typeof v === "number" && v > c.superieurA;
  return false;
}

function metierOk(metiers: Element["metiers"] | Question["metiers"], r: Reponses): boolean {
  return metiers === "tous" || metiers.includes(r.metier);
}

export function concerne(e: Element, r: Reponses): boolean {
  return metierOk(e.metiers, r) && evaluer(e.condition, r);
}

export function questionsVisibles(qs: Question[], r: Reponses): Question[] {
  return qs.filter((q) => metierOk(q.metiers, r) && evaluer(q.condition, r));
}

export const PLACEHOLDERS_CONNUS = [
  "etablissement.nom", "etablissement.adresse_complete", "etablissement.telephone",
  "metier.libelle", "equipement.nom", "equipement.consigne", "date",
] as const;

export function placeholdersDe(gabarit: string): string[] {
  return [...gabarit.matchAll(/\{([^{}]+)\}/g)].map((m) => m[1]);
}

export function remplir(gabarit: string, contexte: Record<string, string>): string {
  return gabarit.replace(/\{([^{}]+)\}/g, (_, cle: string) => {
    if (!(cle in contexte)) throw new Error(`Placeholder inconnu : ${cle}`);
    return contexte[cle];
  });
}

/** « 0 à +3 °C », « ≤ -18 °C », « ≤ +4 °C ». */
export function formaterConsigne(eq: ElementListe): string {
  const signe = (n: number) => (n > 0 ? `+${n}` : `${n}`);
  const min = eq.consigne_min as number | undefined;
  const max = eq.consigne_max as number | undefined;
  if (min !== undefined && max !== undefined) return `${min} à ${signe(max)} °C`;
  if (max !== undefined) return `≤ ${signe(max)} °C`;
  return "Selon la consigne de l'équipement";
}

function contexteDe(ref: Referentiel, r: Reponses): Record<string, string> {
  const s = (k: string) => (typeof r[k] === "string" ? (r[k] as string) : "");
  const metier = ref.metiers.find((m) => m.id === r.metier);
  return {
    "etablissement.nom": s("coordonnees.nom"),
    "etablissement.adresse_complete":
      [s("coordonnees.adresse"), `${s("coordonnees.code_postal")} ${s("coordonnees.ville")}`.trim()]
        .filter(Boolean).join(", "),
    "etablissement.telephone": s("coordonnees.telephone"),
    "metier.libelle": metier?.libelle ?? "",
    "date": new Date().toLocaleDateString("fr-FR"),
  };
}

export function composerPms(ref: Referentiel, r: Reponses, mode: Mode): PmsCompose {
  const garder = <T extends Element>(e: T) =>
    concerne(e, r) && (mode === "relecture" || e.statut === "valide");
  const ctx = contexteDe(ref, r);
  const froids = (Array.isArray(r["equipements.froids"]) ? r["equipements.froids"] : []) as ElementListe[];

  const affiches = ref.affiches.filter(garder).map((a) => ({ ...a, contenuRendu: remplir(a.contenu, ctx) }));

  const ccp = ref.ccp.filter(garder).flatMap((l) => {
    const rendre = (c: Record<string, string>) => ({
      libelle: remplir(l.libelle, c), seuil: remplir(l.seuil, c),
      surveillance: remplir(l.surveillance, c), correctives: remplir(l.correctives, c),
    });
    if (!l.parEquipementFroid) return [{ ...l, rendu: rendre(ctx) }];
    return froids.map((eq) => ({
      ...l,
      rendu: rendre({ ...ctx, "equipement.nom": eq.nom, "equipement.consigne": formaterConsigne(eq) }),
    }));
  });

  const registres = ref.registres.filter(garder).map((g) => ({
    ...g,
    consigneRendue: remplir(g.consigne, ctx),
    colonnesRendues: Array.isArray(g.colonnes)
      ? g.colonnes
      : [...g.colonnes.avant, ...froids.map((e) => e.nom), ...g.colonnes.apres],
  }));

  return { affiches, ccp, registres };
}

const TEXTE_OPERATEUR = {
  egal: (v: unknown) => (v === true ? "oui" : v === false ? "non" : `« ${v} »`),
};

export function decrireCondition(c: Condition, qs: Question[]): string {
  const texte = (id: string) => qs.find((q) => q.id === id)?.texte ?? id;
  const libelleOption = (id: string, valeur: string) =>
    qs.find((q) => q.id === id)?.options?.find((o) => o.valeur === valeur)?.libelle ?? valeur;
  if ("toujours" in c) return "Toujours";
  if ("tous" in c) return c.tous.map((x) => decrireCondition(x, qs)).join(" et ");
  if ("unDe" in c) return c.unDe.map((x) => decrireCondition(x, qs)).join(" ou ");
  if ("non" in c) return decrireCondition(c.non, qs).replace(/^Si /, "Sauf si ");
  const q = `« ${texte(c.question)} »`;
  if ("egal" in c) return `Si ${q} = ${TEXTE_OPERATEUR.egal(c.egal)}`;
  if ("contient" in c) return `Si ${q} inclut « ${libelleOption(c.question, c.contient)} »`;
  if ("nonVide" in c) return `Si ${q} : au moins un élément`;
  return `Si ${q} > ${c.superieurA}`;
}
