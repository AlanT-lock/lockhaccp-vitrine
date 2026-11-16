import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { SOURCES } from "@/lib/sources-reglementaires";
import Monogramme from "@/components/blog/Monogramme";
import { AUTEUR } from "@/lib/auteur";
import { articlesEnLigne, dateLongue } from "@/lib/blog";
import { ArrowRight, ArrowUpRight, BookOpen, ExternalLink } from "lucide-react";
import { Accent } from "@/components/design/elements";

const BlogIndex = () => {
  const articles = articlesEnLigne();
  const [une, ...suite] = articles;

  return (
    <div className="min-h-screen">
      <Seo
        title="Ressources HACCP pour restaurateurs"
        description="Contrôle sanitaire, températures, nettoyage, allergènes, formation : des réponses claires et sourcées, écrites par un formateur en hygiène alimentaire."
        path="/blog"
      />
      <Navbar />

      <main id="main-content" className="pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="grid grid-cols-1 gap-8 pb-12 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-8">
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                <BookOpen className="h-4 w-4" />
                Articles écrits par un formateur en hygiène
              </p>
              <h1 className="font-heading text-[clamp(2.3rem,5vw,4rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground">
                <Accent>Ressources HACCP</Accent> : les questions qu'on me pose en formation
              </h1>
            </div>
            <div className="flex items-start gap-4 rounded-3xl border border-border/80 bg-white/85 p-5 lg:col-span-4">
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
            <section aria-label="Dernier article">
              <Link
                to={`/blog/${une.slug}`}
                className="group relative block overflow-hidden rounded-[2rem] bg-[hsl(211_100%_13%)] p-8 text-white sm:p-12 lg:p-14"
              >
                <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/50 blur-3xl" />
                  <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" />
                </div>
                <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-12">
                  <p className="text-sm text-white/65 lg:col-span-3">
                    <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                      Dernier article
                    </span>
                    <time dateTime={une.meta.date} className="block">{dateLongue(une.meta.date)}</time>
                    <span className="block">{une.lecture} min de lecture</span>
                  </p>
                  <div className="lg:col-span-9">
                    <h2 className="font-heading text-[clamp(1.8rem,3.4vw,2.7rem)] font-extrabold leading-[1.1] tracking-[-0.02em] transition-colors group-hover:text-secondary">
                      {une.meta.titre}
                    </h2>
                    <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-white/75">{une.meta.resume}</p>
                    <span className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-primary transition-transform group-hover:translate-x-1">
                      Lire l'article
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          <ul aria-label="Tous les articles" className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suite.map((a) => (
              <li key={a.slug}>
                <Link
                  to={`/blog/${a.slug}`}
                  className="group relative flex h-full flex-col rounded-3xl border border-border/80 bg-white/85 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]"
                >
                  <ArrowUpRight className="absolute right-6 top-6 h-5 w-5 text-primary/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                  <p className="text-sm text-muted-foreground">
                    <time dateTime={a.meta.date}>{dateLongue(a.meta.date)}</time>
                  </p>
                  <h2 className="mt-4 pr-6 font-heading text-xl font-bold leading-snug text-foreground group-hover:text-primary">
                    {a.meta.titre}
                  </h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{a.meta.description}</p>
                </Link>
              </li>
            ))}
          </ul>

          <section aria-labelledby="reperes" className="mt-24 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary-texte">Aide-mémoire</p>
              <h2 id="reperes" className="font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground">
                Les repères à connaître en cuisine
              </h2>
              <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {REPERES.map((r) => (
                  <div key={r.valeur + r.texte} className="rounded-3xl border border-border/80 bg-white/85 p-6">
                    <dt className="font-heading text-3xl font-extrabold tracking-tight text-primary">{r.valeur}</dt>
                    <dd className="mt-2 leading-relaxed text-muted-foreground">{r.texte}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="lg:col-span-4">
              <div className="rounded-3xl bg-[hsl(211_100%_13%)] p-7 text-white lg:sticky lg:top-32 lg:mt-[5.5rem]">
                <h2 className="font-heading text-xl font-bold">Les textes officiels</h2>
                <ul className="mt-5 space-y-3 text-sm">
                  {TEXTES.map((t) => (
                    <li key={t.url}>
                      <a href={t.url} target="_blank" rel="noopener noreferrer" className="inline-flex gap-1.5 text-white/75 underline underline-offset-2 hover:text-white">
                        {t.libelle}
                        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="outils" className="mt-24">
            <h2 id="outils" className="font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground">
              Passer à la pratique
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {OUTILS.map((o) => (
                <li key={o.to}>
                  <Link
                    to={o.to}
                    className="group relative block h-full rounded-3xl border border-border/80 bg-white/85 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white"
                  >
                    <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-primary/40 transition-colors group-hover:text-primary" />
                    <span className="block pr-8 font-heading text-lg font-bold text-foreground group-hover:text-primary">{o.titre}</span>
                    <span className="mt-1 block text-muted-foreground">{o.texte}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-primary p-8 text-white sm:p-10">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary/30 blur-3xl" />
            <p className="relative max-w-3xl text-lg leading-relaxed text-white/85">
              Vous préparez un contrôle ?{" "}
              <Link to="/plan-de-maitrise-sanitaire" className="font-semibold text-white underline underline-offset-4">
                Créez gratuitement votre Plan de Maîtrise Sanitaire
              </Link>
              , adapté à votre établissement et prêt à imprimer.
            </p>
          </div>
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
