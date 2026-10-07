// Lecture et contrôle des articles du blog (utilisé par le plugin Vite et les tests).

export const CHAMPS_OBLIGATOIRES = ["titre", "description", "date", "motCle", "resume"];

export function lireEntete(source) {
  const m = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new Error("en-tête absent (bloc --- … --- en début de fichier)");
  const meta = {};
  for (const ligne of m[1].split(/\r?\n/)) {
    const i = ligne.indexOf(":");
    if (i < 1) continue;
    const cle = ligne.slice(0, i).trim();
    let valeur = ligne.slice(i + 1).trim();
    if (/^".*"$/.test(valeur)) valeur = valeur.slice(1, -1);
    meta[cle] = valeur;
  }
  return { meta, corps: m[2] };
}

const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validerMeta(meta, fichier) {
  const e = [];
  for (const c of CHAMPS_OBLIGATOIRES) if (!meta[c]) e.push(`${fichier} : champ « ${c} » manquant`);
  if (meta.description && meta.description.length > 160) e.push(`${fichier} : description de ${meta.description.length} caractères (160 max)`);
  // Title affiché par Google : titreSeo s'il existe (le h1 garde le titre complet), sinon titre.
  const titreGoogle = meta.titreSeo || meta.titre;
  if (titreGoogle && titreGoogle.length > 60) {
    e.push(`${fichier} : titre de ${titreGoogle.length} caractères dans Google (60 max) : ajoutez un champ « titreSeo » plus court`);
  }
  if (meta.date && !DATE.test(meta.date)) e.push(`${fichier} : date « ${meta.date} » au format AAAA-MM-JJ attendu`);
  if (meta.maj && !DATE.test(meta.maj)) e.push(`${fichier} : maj « ${meta.maj} » au format AAAA-MM-JJ attendu`);
  return e;
}

const FORMULES_INTERDITES = [
  /dans cet article/i, /dans ce guide/i, /plongeons/i, /il est important de noter/i, /il convient de/i,
  /en conclusion/i, /en résumé/i, /en somme/i, /n'hésitez pas/i, /n’hésitez pas/i, /que vous soyez\b/i,
  /véritable/i, /incontournable/i, /crucial/i, /^essentiel/im, /force est de constater/i, /à l'ère de/i,
  /à l’ère de/i, /le saviez-vous/i,
];
const EMOJI = /\p{Extended_Pictographic}/u;

export function verifierCharte(corps) {
  const e = [];
  for (const f of FORMULES_INTERDITES) if (f.test(corps)) e.push(`formule interdite : ${f.source}`);
  const ouvertures = corps.split(/\n\s*\n/).filter((p) => /^(En effet|Ainsi),/.test(p.trim())).length;
  if (ouvertures > 1) e.push(`« En effet, » / « Ainsi, » en ouverture de ${ouvertures} paragraphes`);
  const tirets = (corps.match(/—/g) || []).length;
  if (tirets > 2) e.push(`${tirets} tirets cadratins (2 max)`);
  if (EMOJI.test(corps)) e.push("emoji interdit");
  const gras = (corps.match(/\*\*[^*]+\*\*/g) || []).length;
  if (gras > 4) e.push(`${gras} passages en gras (4 max)`);
  const listes = corps.split(/\n\s*\n/).filter((bloc) => /^\s*([-*]|\d+\.)\s/.test(bloc)).length;
  const sources = corps.split(/^## Sources\s*$/m);
  const listesHorsSources = listes - (sources.length > 1 ? 1 : 0);
  if (listesHorsSources > 3) e.push(`${listesHorsSources} listes (3 max hors Sources)`);
  if (sources.length < 2 || !/\]\(https?:\/\//.test(sources[1])) e.push("section « ## Sources » avec au moins un lien manquante");
  return e;
}

export function verifierLienPms(corps) {
  const parle = /\bPMS\b|plan de maîtrise sanitaire/i.test(corps);
  return parle && !corps.includes("](/plan-de-maitrise-sanitaire)")
    ? ["l'article parle du PMS sans lien vers /plan-de-maitrise-sanitaire"]
    : [];
}

export function slugTitre(texte) {
  return texte.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export const compterMots = (corps) => (corps.match(/[\p{L}\p{N}’']+/gu) || []).length;
export const tempsDeLecture = (mots) => Math.max(1, Math.round(mots / 220));
