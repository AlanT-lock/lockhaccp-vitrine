import { describe, expect, it } from "vitest";
import {
  accelererAffichage, canonicalAttendu, extraireDescription, fichierPour, genererLlms, genererSitemap,
  injecter, retirerBalisesSeo, verifierPage,
} from "./lib-prerender.mjs";

const GABARIT = `<!doctype html><html lang="fr"><head>
<meta charset="UTF-8" />
<title>Défaut</title>
<meta name="description" content="Défaut" />
<link rel="canonical" href="https://lockhaccp.fr/" />
<meta property="og:title" content="Défaut" />
<meta name="twitter:site" content="@LockHACCP" />
<meta name="twitter:title" content="Défaut" />
<link rel="icon" href="/favicon-32x32.png" />
</head><body><div id="root"></div><script type="module" src="/assets/index.js"></script></body></html>`;

describe("fichierPour / canonicalAttendu", () => {
  it("place l'accueil dans index.html", () => expect(fichierPour("/")).toBe("index.html"));
  it("place une page imbriquée dans un .html", () =>
    expect(fichierPour("/fonctionnalites/huiles")).toBe("fonctionnalites/huiles.html"));
  it("canonical de l'accueil avec slash", () => expect(canonicalAttendu("/")).toBe("https://lockhaccp.fr/"));
  it("canonical d'une page", () => expect(canonicalAttendu("/pms")).toBe("https://lockhaccp.fr/pms"));
});

describe("retirerBalisesSeo + injecter", () => {
  it("retire les balises par défaut mais garde favicon et twitter:site", () => {
    const g = retirerBalisesSeo(GABARIT);
    expect(g).not.toContain("<title>");
    expect(g).not.toContain('name="description"');
    expect(g).not.toContain('rel="canonical"');
    expect(g).not.toContain("og:title");
    expect(g).not.toContain("twitter:title");
    expect(g).toContain("twitter:site");
    expect(g).toContain("favicon-32x32.png");
  });
  it("injecte le head avant </head> et le HTML dans #root", () => {
    const out = injecter(retirerBalisesSeo(GABARIT), "<title>Page</title>", "<main><h1>Bonjour</h1></main>");
    expect(out).toContain("<title>Page</title>\n</head>");
    expect(out).toContain('<div id="root"><main><h1>Bonjour</h1></main></div>');
  });
  it("refuse un gabarit sans #root vide", () => {
    expect(() => injecter("<html><head></head><body></body></html>", "", "x")).toThrow();
  });
});

describe("genererSitemap", () => {
  it("liste seulement les pages avec réglages sitemap", () => {
    const xml = genererSitemap(
      [
        { path: "/", fil: "Accueil", sitemap: { changefreq: "weekly", priority: 1 }, llms: true },
        { path: "/app", fil: "App", sitemap: null, llms: false },
      ],
      "2026-10-01",
    );
    expect(xml).toContain("<loc>https://lockhaccp.fr/</loc>");
    expect(xml).not.toContain("/app");
    expect(xml).toContain("<lastmod>2026-10-01</lastmod>");
    expect(xml).toContain("<priority>1.0</priority>");
  });
});

describe("genererLlms", () => {
  const pages = [
    { path: "/", fil: "Accueil", sitemap: null, llms: true },
    { path: "/fonctionnalites/huiles", fil: "Contrôle des huiles", sitemap: null, llms: true },
    { path: "/blog/x", fil: "Article X", sitemap: null, llms: true },
    { path: "/cgu", fil: "CGU", sitemap: null, llms: false },
  ];
  const txt = genererLlms({
    pages,
    descriptions: { "/": "Accueil desc", "/fonctionnalites/huiles": "Huiles desc", "/blog/x": "X desc" },
    prix: { mainMonthly: 24.9, extraMonthly: 9.9 },
  });
  it("commence par le titre H1 et un résumé", () => {
    expect(txt.startsWith("# LockHACCP\n\n> ")).toBe(true);
  });
  it("annonce le prix en vigueur au format français", () => {
    expect(txt).toContain("24,90 €");
    expect(txt).toContain("9,90 €");
  });
  it("range les pages par section avec URL absolue et description", () => {
    expect(txt).toContain("## Fonctionnalités\n\n- [Contrôle des huiles](https://lockhaccp.fr/fonctionnalites/huiles): Huiles desc");
    expect(txt).toContain("## Ressources\n\n- [Article X](https://lockhaccp.fr/blog/x): X desc");
  });
  it("exclut les pages llms:false", () => expect(txt).not.toContain("CGU"));
});

describe("extraireDescription", () => {
  it("lit la meta description générée par Helmet", () => {
    expect(extraireDescription('<meta data-rh="true" name="description" content="Bonjour &amp; bienvenue"/>'))
      .toBe("Bonjour & bienvenue");
  });
});

describe("verifierPage", () => {
  const texte = "Contenu ".repeat(60);
  const ok = (path, extra = "") => `<html><head><title data-rh="true">T</title>
<meta data-rh="true" name="description" content="D"/>
<link data-rh="true" rel="canonical" href="${canonicalAttendu(path)}"/>${extra}
</head><body><div id="root"><h1>Titre</h1><p>${texte}</p></div></body></html>`;

  it("accepte une page complète", () => expect(verifierPage(ok("/pms"), "/pms")).toEqual([]));
  it("signale un canonical qui pointe ailleurs", () => {
    expect(verifierPage(ok("/"), "/pms").join()).toMatch(/canonical/);
  });
  it("signale l'absence de h1 et un texte trop court", () => {
    const html = '<html><head><title>T</title><meta name="description" content="D"/><link rel="canonical" href="https://lockhaccp.fr/pms"/></head><body><div id="root"><p>court</p></div></body></html>';
    const erreurs = verifierPage(html, "/pms").join();
    expect(erreurs).toMatch(/h1/);
    expect(erreurs).toMatch(/texte/);
  });
  it("exige noindex sur la 404", () => {
    expect(verifierPage(ok("/x"), null).join()).toMatch(/noindex/);
    expect(verifierPage(ok("/x", '<meta name="robots" content="noindex,nofollow"/>'), null)).toEqual([]);
  });
});

describe("metaInstant", () => {
  it("écrit l'instant de construction lisible par instantDeRendu", async () => {
    const { metaInstant } = await import("./lib-prerender.mjs");
    expect(metaInstant(new Date("2026-10-31T23:15:00Z")))
      .toBe('<meta name="lhc-instant" content="2026-10-31T23:15:00.000Z" />');
  });
});

describe("liensInternesCasses", () => {
  it("signale un lien interne vers une page qui n'est pas générée", async () => {
    const { liensInternesCasses } = await import("./lib-prerender.mjs");
    const html = '<div id="root"><a href="/pms">a</a><a href="/blog/futur">b</a><a href="https://x.fr/y">c</a><a href="#ancre">d</a><a href="/tarifs#faq">e</a><a href="/admin">f</a></div>';
    expect(liensInternesCasses(html, new Set(["/pms", "/tarifs"]))).toEqual(["/blog/futur"]);
  });
});

describe("accelererAffichage", () => {
  const g = `<head>\n    <link rel="stylesheet" crossorigin href="/assets/index-abc.css">\n</head><body></body>`;
  it("intègre la feuille de style et précharge les polices", () => {
    const sortie = accelererAffichage(g, {
      lireCss: (href) => (href === "/assets/index-abc.css" ? "body{color:red}" : ""),
      polices: ["/assets/inter-latin-wght-normal-x.woff2"],
    });
    expect(sortie).toContain("<style>body{color:red}</style>");
    expect(sortie).not.toContain('rel="stylesheet"');
    expect(sortie).toContain('<link rel="preload" href="/assets/inter-latin-wght-normal-x.woff2" as="font" type="font/woff2" crossorigin />');
  });
  it("échoue si la feuille de style est introuvable", () =>
    expect(() => accelererAffichage("<head></head>", { lireCss: () => "", polices: [] })).toThrow());
});
