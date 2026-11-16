import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { VIDEOS_APP, type VideoApp } from "@/lib/videos-app";
import { EcranVideo, Telephone3D } from "./Telephone3D";

// « Une journée en cuisine » : sur grand écran, le téléphone reste fixe et sa vidéo change avec
// le moment de la journée ; sur mobile, chaque moment a son propre téléphone.
// Les textes décrivent ce que montrent réellement les vidéos (docs/design/videos-app-manifest.json).
interface Etape {
  heure: string;
  titre: string;
  texte: string;
  lien: { to: string; libelle: string };
  video: VideoApp;
}

const ETAPES: Etape[] = [
  {
    heure: "9 h 00",
    titre: "Les relevés de température",
    texte:
      "Chaque frigo affiche son dernier relevé. On ajuste la valeur, on enregistre. Si elle dépasse la limite, l'application demande la mesure corrective : quelques touches, et l'écart est tracé.",
    lien: { to: "/fonctionnalites/temperatures", libelle: "Les relevés de température" },
    video: VIDEOS_APP.temperatures,
  },
  {
    heure: "11 h 00",
    titre: "La réception des marchandises",
    texte:
      "Une photo du bon de livraison : la lecture automatique reconnaît le fournisseur et les produits. Il reste à saisir la température des produits frais, et la réception est enregistrée.",
    lien: { to: "/fonctionnalites/receptions", libelle: "Le contrôle à réception" },
    video: VIDEOS_APP.reception,
  },
  {
    heure: "15 h 00",
    titre: "La production et ses étiquettes",
    texte:
      "On choisit la préparation et la quantité : la DLC secondaire est calculée, le numéro de lot proposé, et les étiquettes partent vers l'étiqueteuse.",
    lien: { to: "/fonctionnalites/etiquettes", libelle: "Les étiquettes DLC" },
    video: VIDEOS_APP.etiquettes,
  },
  {
    heure: "22 h 30",
    titre: "La fin de service",
    texte:
      "Le nettoyage du jour se coche zone par zone, et le suivi de la journée montre ce qui est fait et ce qui reste. Le gérant le voit sans relire un seul classeur.",
    lien: { to: "/fonctionnalites/nettoyage", libelle: "Le plan de nettoyage" },
    video: VIDEOS_APP.historique,
  },
];

export function HistoireDefilement() {
  const [active, setActive] = useState(0);
  const blocs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.etape));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    blocs.current.forEach((b) => b && obs.observe(b));
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative pb-20 pt-24 lg:pb-4 lg:pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-8">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary-texte">Une journée avec LockHACCP</p>
          <h2 className="font-heading text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
            Une journée en cuisine, <span className="text-primary">sans une feuille de papier</span>
          </h2>
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <ol className="space-y-20 lg:space-y-0">
            {ETAPES.map((etape, i) => (
              <li
                key={etape.titre}
                ref={(el) => (blocs.current[i] = el)}
                data-etape={i}
                className="lg:flex lg:min-h-[78vh] lg:items-center"
              >
                <div className={`transition-opacity duration-500 ${active === i ? "lg:opacity-100" : "lg:opacity-35"}`}>
                  <p className="mb-3 font-heading text-5xl font-extrabold tracking-tight text-primary/15 sm:text-6xl">{etape.heure}</p>
                  <h3 className="mb-4 font-heading text-2xl font-bold text-foreground sm:text-3xl">{etape.titre}</h3>
                  <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">{etape.texte}</p>
                  <Link
                    to={etape.lien.to}
                    className="group mt-6 inline-flex items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {etape.lien.libelle}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  {/* Mobile et tablette : un téléphone par moment de la journée */}
                  <div className="mx-auto mt-10 w-[14.5rem] lg:hidden">
                    <Telephone3D inclinaison="face">
                      <EcranVideo video={etape.video} />
                    </Telephone3D>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Grand écran : téléphone fixe, la vidéo change avec le moment de la journée */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-10">
              <div className="w-[17.5rem] xl:w-[19rem]">
                <Telephone3D inclinaison="gauche" suivreSouris>
                  {/* La clé remonte l'écran à chaque moment : la vidéo repart du début. */}
                  <div key={active} className="histoire-ecran absolute inset-0">
                    <EcranVideo video={ETAPES[active].video} />
                  </div>
                </Telephone3D>
              </div>
              {/* Fil de la journée : l'heure du moment affiché est mise en avant */}
              <div aria-hidden="true" className="flex items-center gap-2">
                {ETAPES.map((etape, i) => (
                  <span key={etape.heure} className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold transition-colors duration-300 ${
                        active === i ? "bg-primary text-white" : "bg-primary/5 text-primary/50"
                      }`}
                    >
                      {etape.heure}
                    </span>
                    {i < ETAPES.length - 1 && <span className="h-px w-5 bg-primary/20" />}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
