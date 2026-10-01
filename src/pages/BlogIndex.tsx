import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import Monogramme from "@/components/blog/Monogramme";
import { useMaintenant } from "@/hooks/useMaintenant";
import { AUTEUR } from "@/lib/auteur";
import { articlesPublies, dateLongue, TOUS_LES_ARTICLES } from "@/lib/blog";

const BlogIndex = () => {
  const articles = articlesPublies(TOUS_LES_ARTICLES, useMaintenant());
  const [une, ...suite] = articles;

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Ressources hygiène alimentaire et HACCP pour les restaurateurs"
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

export default BlogIndex;
