import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { SOURCES } from "@/lib/sources-reglementaires";
import Monogramme from "@/components/blog/Monogramme";
import { AUTEUR } from "@/lib/auteur";
import { articlesEnLigne, dateLongue } from "@/lib/blog";

const BlogIndex = () => {
  const articles = articlesEnLigne();
  const [une, ...suite] = articles;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Ressources HACCP pour restaurateurs"
        description="Contrôle sanitaire, températures, nettoyage, allergènes, formation : des réponses claires et sourcées, écrites par un formateur en hygiène alimentaire."
        path="/blog"
      />
      <Navbar />

      <main id="main-content" className="pb-24 pt-32 sm:pt-36 lg:pt-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="grid gap-8 border-b border-border pb-12 lg:grid-cols-12 lg:items-end">
            <h1 className="font-heading text-[2.3rem] font-extrabold leading-[1.08] tracking-[-0.015em] text-foreground sm:text-5xl lg:col-span-7">
              Les questions qu'on me pose en formation, avec des réponses claires
            </h1>
            <div className="flex items-start gap-4 lg:col-span-4 lg:col-start-9">
              <Monogramme />
              <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
                Contrôles, températures, nettoyage, allergènes : chaque article part d'une vraie question de terrain
                et cite ses textes. Écrit par{" "}
                <Link to={AUTEUR.url} className="font-semibold text-foreground underline underline-offset-4">
                  {AUTEUR.nom}
                </Link>
                , formateur en hygiène alimentaire.
              </p>
            </div>
          </header>

          {une && (
            <section aria-label="Dernier article" className="border-b border-border py-12 lg:py-16">
              <Link to={`/blog/${une.slug}`} className="group grid gap-6 lg:grid-cols-12">
                <p className="text-sm text-muted-foreground lg:col-span-3">
                  <time dateTime={une.meta.date}>{dateLongue(une.meta.date)}</time>
                  <span className="block">{une.lecture} min de lecture</span>
                </p>
                <div className="lg:col-span-8">
                  <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-foreground group-hover:text-primary sm:text-[2.2rem]">
                    {une.meta.titre}
                  </h2>
                  <p className="mt-4 max-w-[60ch] text-lg leading-relaxed text-muted-foreground">{une.meta.resume}</p>
                  <span className="mt-5 inline-block font-semibold text-primary underline underline-offset-4">
                    Lire l'article
                  </span>
                </div>
              </Link>
            </section>
          )}

          <ul aria-label="Tous les articles">
            {suite.map((a) => (
              <li key={a.slug} className="border-b border-border">
                <Link to={`/blog/${a.slug}`} className="group grid gap-2 py-8 lg:grid-cols-12 lg:gap-6">
                  <p className="text-sm text-muted-foreground lg:col-span-3">
                    <time dateTime={a.meta.date}>{dateLongue(a.meta.date)}</time>
                  </p>
                  <div className="lg:col-span-8">
                    <h2 className="font-heading text-xl font-semibold leading-snug text-foreground group-hover:text-primary sm:text-2xl">
                      {a.meta.titre}
                    </h2>
                    <p className="mt-2 max-w-[62ch] leading-relaxed text-muted-foreground">{a.meta.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <section aria-labelledby="reperes" className="mt-16 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 id="reperes" className="font-heading text-2xl font-bold text-foreground">
                Les repères à connaître en cuisine
              </h2>
              <dl className="mt-6 divide-y divide-border border-y border-border">
                {REPERES.map((r) => (
                  <div key={r.valeur + r.texte} className="grid grid-cols-[6.5rem_1fr] gap-4 py-4">
                    <dt className="font-heading text-xl font-bold text-primary">{r.valeur}</dt>
                    <dd className="leading-relaxed text-muted-foreground">{r.texte}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="font-heading text-2xl font-bold text-foreground">Les textes officiels</h2>
              <ul className="mt-6 space-y-3 text-sm">
                {TEXTES.map((t) => (
                  <li key={t.url}>
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline underline-offset-2 hover:text-primary">
                      {t.libelle}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="outils" className="mt-16">
            <h2 id="outils" className="font-heading text-2xl font-bold text-foreground">Passer à la pratique</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {OUTILS.map((o) => (
                <li key={o.to}>
                  <Link to={o.to} className="group block h-full rounded-xl border border-border bg-card p-5 hover:border-primary/30">
                    <span className="font-semibold text-foreground group-hover:text-primary">{o.titre}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{o.texte}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-12 max-w-2xl leading-relaxed text-muted-foreground">
            Vous préparez un contrôle ?{" "}
            <Link to="/plan-de-maitrise-sanitaire" className="font-semibold text-primary underline underline-offset-4">
              Créez gratuitement votre Plan de Maîtrise Sanitaire
            </Link>
            , adapté à votre établissement et prêt à imprimer.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Valeurs reprises des articles (chacun cite le texte officiel correspondant).
const REPERES = [
  { valeur: "+4 °C", texte: "Température maximale de la plupart des denrées très périssables (+2 °C pour la viande hachée et le poisson frais, +3 °C pour les plats préparés à l'avance)." },
  { valeur: "−18 °C", texte: "Température des surgelés." },
  { valeur: "+63 °C", texte: "Minimum pour les plats maintenus au chaud jusqu'au service." },
  { valeur: "25 %", texte: "Taux de composés polaires au-delà duquel l'huile de friture doit être changée." },
  { valeur: "14", texte: "Allergènes à signaler par écrit au client pour les plats servis non emballés." },
  { valeur: "60 jours", texte: "Durée de conservation des étiquettes sanitaires des coquillages vivants." },
];

const TEXTES = [
  SOURCES.hygiene852,
  SOURCES.arrete2009,
  SOURCES.information1169,
  SOURCES.huiles2008,
  SOURCES.alimConfiance,
];

const OUTILS = [
  { to: "/plan-de-maitrise-sanitaire", titre: "Plan de Maîtrise Sanitaire gratuit", texte: "Le dossier de votre établissement en 10 minutes, prêt à imprimer." },
  { to: "/fonctionnalites/temperatures", titre: "Relevés de température sur téléphone", texte: "Consigne par équipement, rappel chaque matin, actions correctives." },
  { to: "/fonctionnalites/nettoyage", titre: "Planning de nettoyage", texte: "Tâches par zone, rappels et validation par l'équipe." },
  { to: "/fonctionnalites/tracabilite", titre: "Traçabilité des produits", texte: "Photo des étiquettes, recherche par date en cas de rappel." },
];

export default BlogIndex;
