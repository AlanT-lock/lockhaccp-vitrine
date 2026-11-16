// Éléments de mise en forme partagés par les pages refaites (accueil, fonctionnalités, tarifs…) :
// même typographie, mêmes cartes, même téléphone 3D que l'accueil.
import type { CSSProperties, ReactNode } from "react";
import { Check, type LucideIcon } from "lucide-react";
import { EcranVideo, Telephone3D } from "@/components/accueil/Telephone3D";
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
