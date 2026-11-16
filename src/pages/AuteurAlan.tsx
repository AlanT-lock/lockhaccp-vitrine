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
    <div className="min-h-screen">
      <Seo
        title="Alan Touati, formateur en hygiène alimentaire"
        description="Alan Touati est formateur en hygiène alimentaire chez SF FORMATION et créateur de LockHACCP. Ses articles sur le contrôle sanitaire, le HACCP et le PMS."
        path={AUTEUR.url}
        jsonLd={personJsonLd()}
      />
      <Navbar />

      <main id="main-content" className="pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <div className="container mx-auto grid grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <header className="relative overflow-hidden rounded-[2rem] bg-[hsl(211_100%_13%)] p-8 text-white lg:sticky lg:top-32 lg:col-span-4">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/50 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary/25 blur-3xl" />
            <div className="relative">
              <Monogramme taille="lg" />
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-secondary">L'auteur</p>
              <h1 className="mt-2 font-heading text-[clamp(2.1rem,3.6vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">{AUTEUR.nom}</h1>
              <p className="mt-3 text-lg text-white/75">
                {AUTEUR.role}, {AUTEUR.organisme}
              </p>
            </div>
          </header>

          <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_40px_80px_-50px_hsl(211_100%_20%/0.45)] sm:p-10 lg:col-span-8 lg:p-12">
            <div className="space-y-5 text-lg leading-relaxed text-foreground/85">
              {AUTEUR.bio.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 className="mt-14 font-heading text-[clamp(1.6rem,2.8vw,2.1rem)] font-extrabold tracking-[-0.02em] text-foreground">Ce qu'il a conçu sur LockHACCP</h2>
            <ul className="mt-6 space-y-5 text-lg leading-relaxed text-foreground/85">
              <li>
                <Link to="/plan-de-maitrise-sanitaire" className="font-semibold text-primary hover:underline">Le Plan de Maîtrise Sanitaire gratuit</Link>
                {" "}: le contenu des dossiers générés pour neuf métiers de l'alimentation, du restaurant à la poissonnerie. Tableau des points critiques, plan de nettoyage, fiches de relevé et affichages obligatoires.
              </li>
              <li>
                <Link to="/" className="font-semibold text-primary hover:underline">L'application LockHACCP</Link>
                {" "}: les enregistrements du quotidien sur téléphone, avec les{" "}
                <Link to="/fonctionnalites/temperatures" className="text-primary hover:underline">relevés de température</Link>, le{" "}
                <Link to="/fonctionnalites/receptions" className="text-primary hover:underline">contrôle à réception</Link>, la{" "}
                <Link to="/fonctionnalites/tracabilite" className="text-primary hover:underline">traçabilité</Link> et le{" "}
                <Link to="/fonctionnalites/nettoyage" className="text-primary hover:underline">plan de nettoyage</Link>.
              </li>
            </ul>

            <h2 className="mt-14 font-heading text-[clamp(1.6rem,2.8vw,2.1rem)] font-extrabold tracking-[-0.02em] text-foreground">Les sujets qu'il traite</h2>
            <p className="mt-6 text-lg leading-relaxed text-foreground/85">
              La méthode HACCP et le Plan de Maîtrise Sanitaire, les températures de conservation, le nettoyage et la
              désinfection, la traçabilité, les allergènes, les affichages obligatoires et le déroulé d'un contrôle de la
              DDPP. Ses articles citent les textes officiels sur lesquels ils s'appuient (règlement européen 852/2004,
              arrêté du 21 décembre 2009, code rural), avec un lien vers Légifrance ou EUR-Lex.
            </p>

            <h2 className="mt-14 font-heading text-[clamp(1.6rem,2.8vw,2.1rem)] font-extrabold tracking-[-0.02em] text-foreground">Ses articles</h2>
            <ul className="mt-6 space-y-3">
              {articles.map((a) => (
                <li key={a.slug}>
                  <Link to={`/blog/${a.slug}`} className="group flex flex-col gap-1 rounded-2xl border border-border/80 bg-[hsl(220_33%_98%)] px-5 py-4 transition-colors hover:border-primary/25 hover:bg-white sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
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
