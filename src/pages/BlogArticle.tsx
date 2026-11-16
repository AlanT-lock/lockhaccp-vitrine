import { lazy, Suspense, useEffect, useMemo, useState, type ComponentType, type MouseEvent } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import EncartPms from "@/components/blog/EncartPms";
import EncartAuteur from "@/components/blog/EncartAuteur";
import Monogramme from "@/components/blog/Monogramme";
import NotFound from "@/pages/NotFound";
import { AUTEUR } from "@/lib/auteur";
import { articlesEnLigne, chargeurCorps, dateLongue, extraireFaq } from "@/lib/blog";
import { blogPostingJsonLd, faqJsonLd } from "@/lib/seo-jsonld";
import tableauCcp from "@/assets/pms/tableau-ccp.webp";
import planNettoyage from "@/assets/pms/plan-nettoyage.webp";
import releveTemperature from "@/assets/pms/releve-temperature.webp";
import huileFriture from "@/assets/pms/huile-friture.webp";
import reception from "@/assets/pms/reception.webp";
import allergenes from "@/assets/pms/allergenes.webp";
import lavageMains from "@/assets/pms/lavage-mains.webp";
import { VIDEOS_APP, VIDEO_HAUTEUR, VIDEO_LARGEUR } from "@/lib/videos-app";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import tableauCcpPetit from "@/assets/pms/tableau-ccp-petit.webp";
import planNettoyagePetit from "@/assets/pms/plan-nettoyage-petit.webp";
import releveTemperaturePetit from "@/assets/pms/releve-temperature-petit.webp";
import huileFriturePetit from "@/assets/pms/huile-friture-petit.webp";
import receptionPetit from "@/assets/pms/reception-petit.webp";
import allergenesPetit from "@/assets/pms/allergenes-petit.webp";
import lavageMainsPetit from "@/assets/pms/lavage-mains-petit.webp";

// Illustrations possibles (clé `illustration` de l'en-tête d'un article).
// `petit` : version réduite (400 px portrait, 600 px paysage) proposée aux petits écrans.
const ILLUSTRATIONS: Record<string, { src: string; largeur: number; hauteur: number; legende: string; petit?: [string, number] }> = {
  "tableau-ccp": { src: tableauCcp, largeur: 1100, hauteur: 778, legende: "Tableau des CCP d'un dossier PMS généré par LockHACCP", petit: [tableauCcpPetit, 600] },
  "plan-nettoyage": { src: planNettoyage, largeur: 760, hauteur: 1075, legende: "Plan de nettoyage et de désinfection d'un dossier PMS LockHACCP", petit: [planNettoyagePetit, 400] },
  "releve-temperature": { src: releveTemperature, largeur: 760, hauteur: 1075, legende: "Fiche de relevé de température d'un dossier PMS LockHACCP", petit: [releveTemperaturePetit, 400] },
  "huile-friture": { src: huileFriture, largeur: 760, hauteur: 1075, legende: "Fiche de suivi des huiles de friture d'un dossier PMS LockHACCP", petit: [huileFriturePetit, 400] },
  reception: { src: reception, largeur: 760, hauteur: 1075, legende: "Registre de réception des marchandises d'un dossier PMS LockHACCP", petit: [receptionPetit, 400] },
  allergenes: { src: allergenes, largeur: 1100, hauteur: 778, legende: "Tableau des allergènes d'un dossier PMS LockHACCP", petit: [allergenesPetit, 600] },
  "lavage-mains": { src: lavageMains, largeur: 760, hauteur: 1075, legende: "Affiche du lavage des mains d'un dossier PMS LockHACCP", petit: [lavageMainsPetit, 400] },
  "app-temperatures": { src: VIDEOS_APP.tour.cle, largeur: VIDEO_LARGEUR, hauteur: VIDEO_HAUTEUR, legende: "Relevé des températures dans l'application LockHACCP : réfrigérateur de cuisine à 3 °C, conforme" },
};

const MARQUEUR_ENCART = "<!-- encart-pms -->";

type PropsCorps = { surClic: (e: MouseEvent<HTMLDivElement>) => void };

/** Corps HTML d'un article, chargé à la demande (un fichier JS par article). */
function CorpsArticle({ html, surClic }: PropsCorps & { html: string }) {
  const [avant, apres] = html.includes(MARQUEUR_ENCART) ? html.split(MARQUEUR_ENCART) : [html, ""];
  const faq = extraireFaq(html);
  return (
    <>
      {faq.length > 0 && (
        <Helmet>
          <script type="application/ld+json">{JSON.stringify(faqJsonLd(faq))}</script>
        </Helmet>
      )}
      <div className="article-corps mt-10" onClick={surClic} dangerouslySetInnerHTML={{ __html: avant }} />
      <EncartPms />
      {apres && <div className="article-corps" onClick={surClic} dangerouslySetInnerHTML={{ __html: apres }} />}
    </>
  );
}

const corpsParSlug = new Map<string, ComponentType<PropsCorps>>();
function corpsDe(slug: string): ComponentType<PropsCorps> {
  let C = corpsParSlug.get(slug);
  if (!C) {
    const charger = chargeurCorps(slug);
    C = lazy(async () => {
      const article = await charger!();
      return { default: (props: PropsCorps) => <CorpsArticle html={article.html} {...props} /> };
    });
    corpsParSlug.set(slug, C);
  }
  return C;
}

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
  const ids = useMemo(() => (article ? article.sommaire.map((s) => s.id) : []), [article]);
  const active = useSectionActive(ids);

  if (!article) return <NotFound />;

  const { meta, sommaire, lecture } = article;
  const Corps = corpsDe(article.slug);
  const path = `/blog/${article.slug}`;
  const illustration = meta.illustration ? ILLUSTRATIONS[meta.illustration] : undefined;
  const recents = publies.filter((a) => a.slug !== article.slug).slice(0, 3);

  // Liens internes du texte : navigation sans rechargement.
  const surClic = (e: MouseEvent<HTMLDivElement>) => {
    const lien = (e.target as HTMLElement).closest("a");
    const href = lien?.getAttribute("href");
    if (!lien || !href || !href.startsWith("/") || href.startsWith("//") || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(href);
  };

  const jsonLd = blogPostingJsonLd({
    titre: meta.titre, description: meta.description, path, datePublished: meta.date, dateModified: meta.maj,
    image: illustration?.src,
  });

  return (
    <div className="min-h-screen">
      <Seo title={meta.titreSeo ?? meta.titre} description={meta.description} path={path} jsonLd={jsonLd} />
      <Navbar />

      <main id="main-content" className="pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="max-w-[52rem]">
            <Link
              to="/blog"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              Ressources
            </Link>
            <h1 className="mt-6 font-heading text-[clamp(2.1rem,4.4vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-foreground">
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

          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,52rem)_15rem] lg:justify-between">
            {/* Le texte dans une carte blanche : lecture confortable au-dessus du fond animé */}
            <div className="min-w-0 rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_40px_80px_-50px_hsl(211_100%_20%/0.45)] sm:p-10 lg:p-12">
              <section aria-labelledby="reponse-courte" className="rounded-r-2xl border-l-4 border-secondary bg-secondary-light px-6 py-5">
                <h2 id="reponse-courte" className="font-heading text-base font-semibold text-foreground">
                  La réponse courte
                </h2>
                <p className="mt-2 text-[1.075rem] leading-relaxed text-foreground/90">{meta.resume}</p>
              </section>

              {sommaire.length > 2 && (
                <details className="mt-8 rounded-2xl border border-border/80 bg-[hsl(220_33%_98%)] px-5 py-3 lg:hidden">
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
                    srcSet={illustration.petit && `${illustration.petit[0]} ${illustration.petit[1]}w, ${illustration.src} ${illustration.largeur}w`}
                    sizes={illustration.largeur > illustration.hauteur ? "(min-width: 768px) 720px, 100vw" : "(min-width: 640px) 384px, 100vw"}
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

              <Suspense fallback={<div className="mt-10 min-h-[60vh]" />}>
                <Corps surClic={surClic} />
              </Suspense>

              <div className="mt-14">
                <EncartAuteur />
              </div>
            </div>

            {sommaire.length > 2 && (
              <nav aria-label="Sommaire" className="hidden lg:block">
                <div className="sticky top-32 rounded-3xl border border-border/80 bg-white/85 p-5">
                  <p className="font-heading text-sm font-bold text-foreground">Au sommaire</p>
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
            <h2 id="a-lire-aussi" className="font-heading text-[clamp(1.7rem,3vw,2.3rem)] font-extrabold tracking-[-0.02em] text-foreground">
              À lire aussi
            </h2>
            <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {recents.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/blog/${a.slug}`}
                    className="group relative flex h-full flex-col rounded-3xl border border-border/80 bg-white/85 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]"
                  >
                    <ArrowUpRight className="absolute right-5 top-5 h-5 w-5 text-primary/40 transition-colors group-hover:text-primary" />
                    <span className="pr-7 font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary">{a.meta.titre}</span>
                    <span className="mt-3 block text-sm text-muted-foreground">{dateLongue(a.meta.date)}</span>
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
