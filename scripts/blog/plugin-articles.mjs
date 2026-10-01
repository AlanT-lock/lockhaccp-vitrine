// Plugin Vite : content/blog/*.md → module JS { slug, meta, html, sommaire, mots, lecture }.
// Le contrôle (en-tête + charte d'écriture + lien PMS) fait échouer le build.
import { basename } from "node:path";
import { Marked } from "marked";
import {
  compterMots, lireEntete, slugTitre, tempsDeLecture, validerMeta, verifierCharte, verifierLienPms,
} from "./lib.mjs";

export function convertirArticle(source, fichier) {
  const { meta, corps } = lireEntete(source);
  const erreurs = [
    ...validerMeta(meta, fichier),
    ...verifierCharte(corps).map((e) => `${fichier} : ${e}`),
    ...verifierLienPms(corps).map((e) => `${fichier} : ${e}`),
  ];
  if (erreurs.length) throw new Error(`Article refusé :\n  - ${erreurs.join("\n  - ")}`);

  const sommaire = [];
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading({ tokens, depth, text }) {
        const contenu = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${contenu}</h${depth}>\n`;
        const id = slugTitre(text);
        if (depth === 2 && text !== "Sources") sommaire.push({ id, titre: text });
        return `<h${depth} id="${id}">${contenu}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const contenu = this.parser.parseInline(tokens);
        const t = title ? ` title="${title}"` : "";
        return /^https?:\/\//.test(href)
          ? `<a href="${href}"${t} rel="noopener" target="_blank">${contenu}</a>`
          : `<a href="${href}"${t}>${contenu}</a>`;
      },
    },
  });
  // Tableaux : rendu par défaut de marked, enveloppé pour le défilement horizontal sur mobile.
  const html = marked
    .parse(corps)
    .replace(/<table>/g, '<div class="article-tableau"><table>')
    .replace(/<\/table>/g, "</table></div>");
  const mots = compterMots(corps);
  return { meta, html, sommaire, mots, lecture: tempsDeLecture(mots) };
}

export function articles() {
  return {
    name: "lockhaccp-articles",
    enforce: "pre",
    transform(source, id) {
      if (!/\/content\/blog\/[^/]+\.md$/.test(id)) return null;
      const slug = basename(id, ".md");
      const article = convertirArticle(source, `content/blog/${slug}.md`);
      return { code: `export default ${JSON.stringify({ slug, ...article })};`, map: null };
    },
  };
}
