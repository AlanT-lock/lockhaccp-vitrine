import { Link } from "react-router-dom";
import { ArrowRight, Check, Tag, Thermometer, SprayCan, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_URL } from "@/lib/links";
import { VIDEOS_APP } from "@/lib/videos-app";
import { EcranVideo, Telephone3D } from "./Telephone3D";

// Preuves qui gravitent autour du téléphone : ce que montrent les vidéos de l'application
// (établissement de démonstration « Le Bistrot Français »).
const PREUVES = [
  { icone: Thermometer, titre: "Réfrigérateur cuisine · 3 °C", detail: "Conforme, relevé enregistré", place: "left-[-2.5rem] top-[14%] lg:left-[-9.5rem] lg:top-[9%]", d: "0.9s" },
  { icone: SprayCan, titre: "Nettoyage du jour", detail: "15 surfaces sur 15", place: "right-[-2rem] top-[42%] lg:right-[-8.5rem]", d: "1.3s" },
  { icone: Tag, titre: "Sauce béarnaise × 3", detail: "DLC secondaire calculée", place: "hidden sm:flex left-[-1.5rem] bottom-[16%] lg:left-[-9rem] lg:bottom-[22%]", d: "1.7s" },
];

export function HeroAccueil() {
  return (
    <section className="relative overflow-hidden pb-20 pt-24 sm:pt-32 lg:min-h-[100svh] lg:pb-24 lg:pt-36">
      {/* Fond : trame de points et deux halos de couleur, discrets */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="fond-points absolute inset-0" />
        <div className="absolute -right-40 top-10 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="text-center lg:col-span-7 lg:text-left">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm backdrop-blur">
              <ShieldCheck className="h-4 w-4" />
              <span className="sm:hidden">Conçu par un formateur en hygiène</span>
              <span className="hidden sm:inline">Conçu avec un formateur en hygiène alimentaire</span>
            </p>

            {/* Le titre reste le H1 de la page (référencement) : affiché dès le premier rendu. */}
            <h1 className="font-heading text-[clamp(2.6rem,7.2vw,5.6rem)] font-extrabold leading-[0.98] tracking-[-0.035em] text-foreground">
              Le logiciel{" "}
              <span className="relative inline-block text-primary">
                HACCP
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 24"
                  preserveAspectRatio="none"
                  className="trait-souligne absolute -bottom-2 left-0 h-[0.32em] w-full text-secondary"
                >
                  <path d="M4 16 C 60 6, 140 4, 296 12" fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
                </svg>
              </span>
              <br />
              pour restaurateurs
            </h1>

            <p className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0">
              Températures, réceptions, traçabilité, nettoyage, étiquettes DLC : LockHACCP digitalise tous vos
              contrôles sanitaires sur téléphone. Gagnez du temps en service, restez prêt pour le contrôle.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <Button variant="hero" size="xl" asChild className="group">
                <a href={APP_URL}>
                  Démarrer gratuitement
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/demander-demo">Demander une démo</Link>
              </Button>
            </div>

            <p className="mt-5 text-sm text-muted-foreground">
              Pas encore prêt ?{" "}
              <Link to="/plan-de-maitrise-sanitaire" className="font-semibold text-primary underline underline-offset-4">
                Obtenez gratuitement votre Plan de Maîtrise Sanitaire
              </Link>
            </p>

            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground lg:justify-start">
              {["1 mois d'essai, sans carte bancaire", "Sans engagement", "Données hébergées en Europe"].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-secondary" strokeWidth={3} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-[15.5rem] sm:w-[17rem] lg:col-span-5 lg:w-[19rem]">
            <Telephone3D inclinaison="droite" suivreSouris>
              <EcranVideo video={VIDEOS_APP.tour} priorite />
            </Telephone3D>
            {PREUVES.map(({ icone: Icone, titre, detail, place, d }) => (
              <div
                key={titre}
                aria-hidden="true"
                className={`puce-preuve absolute z-10 flex items-center gap-2 rounded-2xl border border-white/60 bg-white/85 py-1.5 pl-1.5 pr-3 sm:gap-2.5 sm:py-2 sm:pl-2 sm:pr-4 shadow-[0_12px_30px_-12px_hsl(211_100%_20%/0.35)] backdrop-blur-md ${place}`}
                style={{ "--d": d } as React.CSSProperties}
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
        </div>
      </div>
    </section>
  );
}
