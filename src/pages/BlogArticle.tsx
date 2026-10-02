import { useEffect, useState, type MouseEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import EncartPms from "@/components/blog/EncartPms";
import EncartAuteur from "@/components/blog/EncartAuteur";
import Monogramme from "@/components/blog/Monogramme";
import NotFound from "@/pages/NotFound";
import { AUTEUR } from "@/lib/auteur";
import { articlesEnLigne, dateLongue, extraireFaq } from "@/lib/blog";
import { blogPostingJsonLd, faqJsonLd } from "@/lib/seo-jsonld";
import tableauCcp from "@/assets/pms/tableau-ccp.webp";
import planNettoyage from "@/assets/pms/plan-nettoyage.webp";
import releveTemperature from "@/assets/pms/releve-temperature.webp";
import huileFriture from "@/assets/pms/huile-friture.webp";
import reception from "@/assets/pms/reception.webp";
import allergenes from "@/assets/pms/allergenes.webp";
import lavageMains from "@/assets/pms/lavage-mains.webp";
import appTemperatures from "@/assets/pms/app-temperatures.webp";

// Illustrations possibles (clé `illustration` de l'en-tête d'un article).
const ILLUSTRATIONS: Record<string, { src: string; largeur: number; hauteur: number; legende: string }> = {
  "tableau-ccp": { src: tableauCcp, largeur: 1100, hauteur: 778, legende: "Tableau des CCP d'un dossier PMS généré par LockHACCP" },
  "plan-nettoyage": { src: planNettoyage, largeur: 760, hauteur: 1075, legende: "Plan de nettoyage et de désinfection d'un dossier PMS LockHACCP" },
  "releve-temperature": { src: releveTemperature, largeur: 760, hauteur: 1075, legende: "Fiche de relevé de température d'un dossier PMS LockHACCP" },
  "huile-friture": { src: huileFriture, largeur: 760, hauteur: 1075, legende: "Fiche de suivi des huiles de friture d'un dossier PMS LockHACCP" },
  reception: { src: reception, largeur: 760, hauteur: 1075, legende: "Registre de réception des marchandises d'un dossier PMS LockHACCP" },
  allergenes: { src: allergenes, largeur: 1100, hauteur: 778, legende: "Tableau des allergènes d'un dossier PMS LockHACCP" },
  "lavage-mains": { src: lavageMains, largeur: 760, hauteur: 1075, legende: "Affiche du lavage des mains d'un dossier PMS LockHACCP" },
  "app-temperatures": { src: appTemperatures, largeur: 560, hauteur: 782, legende: "Relevé des températures dans l'application LockHACCP" },
};

const MARQUEUR_ENCART = "<!-- encart-pms -->";

/** Section du sommaire visible à l'écran (après hydratation uniquement). */
function useSectionActive(ids: string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!ids.length || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entrees) => {
        const visible = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const BlogArticle = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const publies = articlesEnLigne();
  const article = publies.find((a) => a.slug === slug);
  const active = useSectionActive(article ? article.sommaire.map((s) => s.id) : []);

  if (!article) return <NotFound />;

  const { meta, html, sommaire, lecture } = article;
  const path = `/blog/${article.slug}`;
  const illustration = meta.illustration ? ILLUSTRATIONS[meta.illustration] : undefined;
  const [avant, apres] = html.includes(MARQUEUR_ENCART) ? html.split(MARQUEUR_ENCART) : [html, ""];
  const faq = extraireFaq(html);
  const recents = publies.filter((a) => a.slug !== article.slug).slice(0, 3);

  // Liens internes du texte : navigation sans rechargement.
  const surClic = (e: MouseEvent<HTMLDivElement>) => {
    const lien = (e.target as HTMLElement).closest("a");
    const href = lien?.getAttribute("href");
    if (!lien || !href || !href.startsWith("/") || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    navigate(href);
  };

  const jsonLd = [
    blogPostingJsonLd({ titre: meta.titre, description: meta.description, path, datePublished: meta.date, dateModified: meta.maj }),
    ...(faq.length ? [faqJsonLd(faq)] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Seo title={meta.titre} description={meta.description} path={path} jsonLd={jsonLd} />
      <Navbar />

      <main id="main-content" className="pb-20 pt-32 sm:pt-36 lg:pt-40">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="max-w-[46rem]">
            <Link to="/blog" className="text-sm font-semibold text-primary hover:underline hover:underline-offset-4">
              Ressources
            </Link>
            <h1 className="mt-4 font-heading text-[2.1rem] font-extrabold leading-[1.1] tracking-[-0.015em] text-foreground sm:text-[2.6rem] lg:text-[2.9rem]">
              {meta.titre}
            </h1>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-3">
                <Monogramme />
                <span>
                  <Link to={AUTEUR.url} className="font-semibold text-foreground hover:underline hover:underline-offset-4">
                    {AUTEUR.nom}
                  </Link>
                  <span className="block">{AUTEUR.role}</span>
                </span>
              </span>
              <span>
                Publié le <time dateTime={meta.date}>{dateLongue(meta.date)}</time>
                {meta.maj && meta.maj !== meta.date && (
                  <span className="block">
                    Mis à jour le <time dateTime={meta.maj}>{dateLongue(meta.maj)}</time>
                  </span>
                )}
              </span>
              <span>{lecture} min de lecture</span>
            </div>
          </header>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,46rem)_15rem] lg:justify-between">
            <div className="min-w-0">
              <section aria-labelledby="reponse-courte" className="rounded-r-2xl border-l-4 border-secondary bg-secondary-light px-6 py-5">
                <h2 id="reponse-courte" className="font-heading text-base font-semibold text-foreground">
                  La réponse courte
                </h2>
                <p className="mt-2 text-[1.075rem] leading-relaxed text-foreground/90">{meta.resume}</p>
              </section>

              {sommaire.length > 2 && (
                <details className="mt-8 rounded-xl border border-border px-5 py-3 lg:hidden">
                  <summary className="cursor-pointer font-heading font-semibold text-foreground">Au sommaire</summary>
                  <ol className="mt-3 space-y-2 pb-2 text-[0.95rem]">
                    {sommaire.map((s) => (
                      <li key={s.id}>
                        <a href={`#${s.id}`} className="text-muted-foreground hover:text-primary">{s.titre}</a>
                      </li>
                    ))}
                  </ol>
                </details>
              )}

              {illustration && (
                <figure className="mt-10">
                  <img
                    src={illustration.src}
                    alt={illustration.legende}
                    width={illustration.largeur}
                    height={illustration.hauteur}
                    loading="lazy"
                    decoding="async"
                    className={[
                      "mx-auto rounded-sm bg-white shadow-[0_1px_2px_rgba(0,38,77,.1),0_20px_44px_-20px_rgba(0,38,77,.4)]",
                      illustration.largeur > illustration.hauteur ? "w-full" : "w-[min(100%,24rem)]",
                    ].join(" ")}
                  />
                  <figcaption className="mt-3 text-center text-sm text-muted-foreground">{illustration.legende}</figcaption>
                </figure>
              )}

              <div className="article-corps mt-10" onClick={surClic} dangerouslySetInnerHTML={{ __html: avant }} />
              {apres && (
                <>
                  <EncartPms />
                  <div className="article-corps" onClick={surClic} dangerouslySetInnerHTML={{ __html: apres }} />
                </>
              )}
              {!apres && <EncartPms />}

              <div className="mt-14">
                <EncartAuteur />
              </div>
            </div>

            {sommaire.length > 2 && (
              <nav aria-label="Sommaire" className="hidden lg:block">
                <div className="sticky top-36">
                  <p className="font-heading text-sm font-semibold text-foreground">Au sommaire</p>
                  <ol className="mt-4 space-y-1 border-l border-border text-sm">
                    {sommaire.map((s) => (
                      <li key={s.id}>
                        <a
                          href={`#${s.id}`}
                          className={[
                            "-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors",
                            active === s.id
                              ? "border-primary font-medium text-primary"
                              : "border-transparent text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          {s.titre}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              </nav>
            )}
          </div>
        </article>

        {recents.length > 0 && (
          <section aria-labelledby="a-lire-aussi" className="container mx-auto mt-20 px-4 sm:px-6 lg:px-8">
            <h2 id="a-lire-aussi" className="font-heading text-2xl font-bold text-foreground">À lire aussi</h2>
            <ul className="mt-6 grid gap-x-10 border-t border-border sm:grid-cols-3">
              {recents.map((a) => (
                <li key={a.slug} className="border-b border-border py-5 sm:border-b-0">
                  <Link to={`/blog/${a.slug}`} className="group block">
                    <span className="font-heading font-semibold leading-snug text-foreground group-hover:text-primary">
                      {a.meta.titre}
                    </span>
                    <span className="mt-2 block text-sm text-muted-foreground">{dateLongue(a.meta.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BlogArticle;
