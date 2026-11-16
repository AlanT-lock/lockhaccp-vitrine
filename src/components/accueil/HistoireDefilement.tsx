import { useEffect, useRef, useState, type ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Telephone3D, type VideoApp } from "./Telephone3D";
import { EcranEtiquette, EcranNettoyage, EcranReception, EcranTemperatures } from "./EcransDemo";

// « Une journée en cuisine » : sur grand écran, le téléphone reste fixe pendant que les moments
// de la journée défilent à côté ; sur mobile, chaque moment a son propre téléphone.
// `video` : à renseigner quand les vidéos du simulateur seront livrées (public/videos/app/).
interface Etape {
  heure: string;
  titre: string;
  texte: string;
  lien: { to: string; libelle: string };
  Ecran: ComponentType;
  video?: VideoApp;
}

const ETAPES: Etape[] = [
  {
    heure: "9 h 00",
    titre: "Les relevés de température",
    texte:
      "Le rappel arrive sur le téléphone, le relevé de chaque frigo prend quelques secondes. La consigne est affichée, et si un relevé dépasse, l'application demande l'action corrective.",
    lien: { to: "/fonctionnalites/temperatures", libelle: "Les relevés de température" },
    Ecran: EcranTemperatures,
  },
  {
    heure: "11 h 00",
    titre: "La réception des marchandises",
    texte:
      "Température, emballages, DLC : la livraison est contrôlée en quelques gestes. Une photo de l'étiquette ou du bon de livraison, et la lecture automatique relève les informations de traçabilité.",
    lien: { to: "/fonctionnalites/receptions", libelle: "Le contrôle à réception" },
    Ecran: EcranReception,
  },
  {
    heure: "15 h 00",
    titre: "Les étiquettes DLC",
    texte:
      "La date limite de chaque préparation est calculée selon vos règles, avec le numéro de lot et les allergènes. L'étiquette part directement vers l'étiqueteuse.",
    lien: { to: "/fonctionnalites/etiquettes", libelle: "Les étiquettes DLC" },
    Ecran: EcranEtiquette,
  },
  {
    heure: "22 h 30",
    titre: "Le nettoyage de fin de service",
    texte:
      "Les tâches de chaque zone sont cochées et signées par la personne connectée. Le gérant voit ce qui est fait sans relire un seul classeur.",
    lien: { to: "/fonctionnalites/nettoyage", libelle: "Le plan de nettoyage" },
    Ecran: EcranNettoyage,
  },
];

export function HistoireDefilement() {
  const [active, setActive] = useState(0);
  const blocs = useRef<(HTMLDivElement | null)[]>([]);

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
    <section className="relative bg-gradient-to-b from-white to-[hsl(220_33%_97%)] pb-20 pt-24 lg:pb-4 lg:pt-32">
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
                ref={(el) => (blocs.current[i] = el as HTMLDivElement | null)}
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
                    <Telephone3D inclinaison="face" video={etape.video}>
                      <etape.Ecran />
                    </Telephone3D>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Grand écran : téléphone fixe, l'écran change avec le moment de la journée */}
          <div className="hidden lg:block">
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-10">
              <div className="w-[17.5rem] xl:w-[19rem]">
                <Telephone3D inclinaison="gauche" suivreSouris>
                  <div className="relative h-full">
                    {ETAPES.map((etape, i) => (
                      <div
                        key={etape.titre}
                        aria-hidden={active !== i}
                        className={`histoire-ecran absolute inset-0 ${active === i ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
                      >
                        {active === i && <etape.Ecran />}
                      </div>
                    ))}
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
