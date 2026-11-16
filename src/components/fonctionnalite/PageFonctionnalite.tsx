// Socle commun des pages /fonctionnalites/* : même ossature et même style que l'accueil.
// Ordre : hero (téléphone ou illustration), atouts, sections propres à la page, réglementation,
// comparatif papier / application, FAQ, appel final, liens associés.
// Les textes (titre, H1, contenus réglementaires, FAQ) restent ceux de chaque page : seul l'habillage change.
import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Seo } from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { ContenuFonctionnalite } from "@/components/ContenuFonctionnalite";
import { RelatedLinks, FEATURE_RELATED } from "@/components/RelatedLinks";
import { EcranVideo, Telephone3D } from "@/components/accueil/Telephone3D";
import { CONTENUS, type IdFonctionnalite } from "@/lib/contenus-fonctionnalites";
import { faqJsonLd } from "@/lib/seo-jsonld";
import { APP_URL } from "@/lib/links";
import type { VideoApp } from "@/lib/videos-app";

/* ------------------------------------------------------------------ */
/* Éléments de mise en forme                                           */
/* ------------------------------------------------------------------ */

/** Partie du H1 mise en avant : bleue, soulignée d'un trait orange (qui suit les retours à la ligne). */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="accent-souligne text-primary">{children}</span>;
}

/** Surtitre orange en capitales, comme sur l'accueil. */
export function Surtitre({ children, clair = false }: { children: ReactNode; clair?: boolean }) {
  return (
    <p className={`mb-4 text-sm font-bold uppercase tracking-[0.2em] ${clair ? "text-secondary" : "text-secondary-texte"}`}>
      {children}
    </p>
  );
}

export const TITRE_H2 = "font-heading text-[clamp(2rem,4.2vw,3.2rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-foreground";

/** Carte blanche légèrement détachée du fond (illustrations, aperçus). Pas de flou : le fond bouge derrière. */
export function CarteIllustration({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_30px_70px_-34px_hsl(211_100%_20%/0.45)] sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

/** Liste de points cochés. */
export function ListeCoches({ items, colonnes = false }: { items: string[]; colonnes?: boolean }) {
  return (
    <ul className={`grid gap-3 ${colonnes ? "sm:grid-cols-2" : ""}`}>
      {items.map((t) => (
        <li key={t} className="flex items-start gap-3 text-foreground">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light">
            <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
          </span>
          {t}
        </li>
      ))}
    </ul>
  );
}

/** Section en deux colonnes : texte d'un côté, illustration de l'autre. */
export function SectionDuo({
  surtitre,
  titre,
  texte,
  points,
  visuel,
  inverse = false,
}: {
  surtitre?: string;
  titre: ReactNode;
  texte: ReactNode;
  points?: string[];
  visuel: ReactNode;
  inverse?: boolean;
}) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className={inverse ? "lg:order-2" : ""}>
            {surtitre && <Surtitre>{surtitre}</Surtitre>}
            <h2 className={TITRE_H2}>{titre}</h2>
            <div className="mt-6 text-lg leading-relaxed text-muted-foreground">{texte}</div>
            {points && (
              <div className="mt-8">
                <ListeCoches items={points} colonnes={points.length > 4} />
              </div>
            )}
          </div>
          <div className={inverse ? "lg:order-1" : ""}>{visuel}</div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Visuel du hero : téléphone 3D avec une vidéo de l'application        */
/* ------------------------------------------------------------------ */

export interface Puce {
  icone: LucideIcon;
  titre: string;
  detail: string;
}

const PLACES_PUCES = [
  "left-[-2rem] top-[16%] lg:left-[-8.5rem] lg:top-[12%]",
  "right-[-1.5rem] bottom-[20%] lg:right-[-8rem] lg:bottom-[24%]",
];

/** Téléphone du hero. Les puces décrivent ce que montre réellement la vidéo. */
export function TelephoneHero({ video, puces = [] }: { video: VideoApp; puces?: Puce[] }) {
  return (
    <div className="relative mx-auto w-[14.5rem] sm:w-[16rem] lg:w-[17.5rem]">
      <Telephone3D inclinaison="droite" suivreSouris>
        <EcranVideo video={video} priorite />
      </Telephone3D>
      {puces.slice(0, 2).map(({ icone: Icone, titre, detail }, i) => (
        <div
          key={titre}
          aria-hidden="true"
          className={`puce-preuve absolute z-10 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/90 py-1.5 pl-1.5 pr-3 shadow-[0_12px_30px_-12px_hsl(211_100%_20%/0.35)] sm:gap-2.5 sm:py-2 sm:pl-2 sm:pr-4 ${PLACES_PUCES[i]}`}
          style={{ "--d": `${0.9 + i * 0.4}s` } as CSSProperties}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary-light sm:h-9 sm:w-9">
            <Icone className="h-[1.125rem] w-[1.125rem] text-primary" />
          </span>
          <span className="text-left">
            <span className="block whitespace-nowrap text-[0.7rem] font-bold text-foreground sm:text-[0.8rem]">{titre}</span>
            <span className="flex items-center gap-1 whitespace-nowrap text-[0.62rem] text-muted-foreground sm:text-[0.7rem]">
              <Check className="h-3 w-3 text-emerald-500" strokeWidth={3} />
              {detail}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
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
                    <a href={APP_URL}>
                      Essayer gratuitement
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button variant="heroOutline" size="xl" asChild>
                    <Link to="/demander-demo">Demander une démo</Link>
                  </Button>
                </div>
                <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
                  {["1 mois d'essai, sans carte bancaire", "Sans engagement"].map((t) => (
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
