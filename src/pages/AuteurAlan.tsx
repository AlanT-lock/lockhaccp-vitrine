import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import Monogramme from "@/components/blog/Monogramme";
import { AUTEUR } from "@/lib/auteur";
import { articlesEnLigne, dateLongue } from "@/lib/blog";
import { personJsonLd } from "@/lib/seo-jsonld";

const AuteurAlan = () => {
  const articles = articlesEnLigne();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Alan Touati, formateur en hygiène alimentaire"
        description="Alan Touati est formateur en hygiène alimentaire chez SF FORMATION et créateur de LockHACCP. Ses articles sur le contrôle sanitaire, le HACCP et le PMS."
        path={AUTEUR.url}
        jsonLd={personJsonLd()}
      />
      <Navbar />

      <main id="main-content" className="pb-24 pt-32 sm:pt-36 lg:pt-40">
        <div className="container mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <header className="lg:col-span-4">
            <Monogramme taille="lg" />
            <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight text-foreground">{AUTEUR.nom}</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              {AUTEUR.role}, {AUTEUR.organisme}
            </p>
          </header>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-5 text-lg leading-relaxed text-foreground/85">
              {AUTEUR.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-16 font-heading text-2xl font-bold text-foreground">Ses articles</h2>
            <ul className="mt-6 border-t border-border">
              {articles.map((a) => (
                <li key={a.slug} className="border-b border-border">
                  <Link to={`/blog/${a.slug}`} className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <span className="font-heading font-semibold text-foreground group-hover:text-primary">{a.meta.titre}</span>
                    <time dateTime={a.meta.date} className="shrink-0 text-sm text-muted-foreground">
                      {dateLongue(a.meta.date)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuteurAlan;
