// Socle commun des pages /fonctionnalites/* : même ossature et même style que l'accueil.
// Ordre : hero (téléphone ou illustration), atouts, sections propres à la page, réglementation,
// comparatif papier / application, FAQ, appel final, liens associés.
// Les textes (titre, H1, contenus réglementaires, FAQ) restent ceux de chaque page : seul l'habillage change.
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ContenuFonctionnalite } from "@/components/ContenuFonctionnalite";
import { RelatedLinks, FEATURE_RELATED } from "@/components/RelatedLinks";
import { CONTENUS, type IdFonctionnalite } from "@/lib/contenus-fonctionnalites";
import { faqJsonLd } from "@/lib/seo-jsonld";
import { SIGNUP_URL } from "@/lib/links";
import { Accent, CarteIllustration, ListeCoches, SectionDuo, Surtitre, TITRE_H2, TelephoneHero, type Puce } from "@/components/design/elements";

// Les pages fonctionnalités importent tout depuis ce module.
export { Accent, CarteIllustration, ListeCoches, SectionDuo, Surtitre, TITRE_H2, TelephoneHero, type Puce };

/* ------------------------------------------------------------------ */
/* Atouts                                                              */
/* ------------------------------------------------------------------ */

export interface Atout {
  icone: LucideIcon;
  titre: string;
  texte: string;
}

function GrilleAtouts({ titre, intro, items }: { titre: ReactNode; intro: string; items: Atout[] }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
          <h2 className={`${TITRE_H2} lg:col-span-7`}>{titre}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-5">{intro}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icone: Icone, titre: t, texte }, i) => (
            <div
              key={t}
              className="group relative rounded-3xl border border-border/80 bg-white/80 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_24px_50px_-24px_hsl(211_100%_20%/0.35)]"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icone className="h-6 w-6" />
                </span>
                <span aria-hidden="true" className="font-heading text-sm font-extrabold tabular-nums text-primary/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{t}</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">{texte}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface PropsPage {
  id: IdFonctionnalite;
  seo: { title: string; description: string };
  icone: LucideIcon;
  etiquette: string;
  /** Contenu du H1 (utiliser <Accent> pour la partie mise en avant). */
  titre: ReactNode;
  intro: ReactNode;
  /** Téléphone (TelephoneHero) ou illustration. */
  visuel: ReactNode;
  atouts: { titre: ReactNode; intro: string; items: Atout[] };
  /** Sections propres à la page, placées après les atouts. */
  children?: ReactNode;
  /** Glissé dans le bloc de contenu commun, entre la réglementation et le comparatif. */
  contenuSupplementaire?: ReactNode;
  cta: { titre: string; texte: string; capture: { src: string; alt: string } };
}

export function PageFonctionnalite({
  id,
  seo,
  icone: Icone,
  etiquette,
  titre,
  intro,
  visuel,
  atouts,
  children,
  contenuSupplementaire,
  cta,
}: PropsPage) {
  return (
    <div className="min-h-screen">
      <Seo title={seo.title} description={seo.description} path={`/fonctionnalites/${id}`} jsonLd={faqJsonLd(CONTENUS[id].faq.items)} />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-36">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
              <div className="text-center lg:col-span-7 lg:text-left">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
                  <Icone className="h-4 w-4" />
                  {etiquette}
                </p>
                <h1 className="font-heading text-[clamp(2.3rem,5.4vw,4.3rem)] font-extrabold leading-[1.04] tracking-[-0.035em] text-foreground">
                  {titre}
                </h1>
                <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">{intro}</p>
                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
                  <Button variant="hero" size="xl" asChild className="group">
                    <a href={SIGNUP_URL}>
                      Essayer gratuitement
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button variant="heroOutline" size="xl" asChild>
                    <Link to="/demander-demo">Demander une démo</Link>
                  </Button>
                </div>
                <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
                  {["14 jours d'essai, sans carte bancaire", "Sans engagement"].map((t) => (
                    <li key={t} className="flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-secondary" strokeWidth={3} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-5">{visuel}</div>
            </div>
          </div>
        </section>

        <GrilleAtouts {...atouts} />

        {children}

        <ContenuFonctionnalite id={id}>{contenuSupplementaire}</ContenuFonctionnalite>

        <CTASection titre={cta.titre} texte={cta.texte} capture={cta.capture} />
        <RelatedLinks items={[...FEATURE_RELATED[id]]} />
      </main>
      <Footer />
    </div>
  );
}
