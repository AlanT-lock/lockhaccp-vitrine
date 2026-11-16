import { useEffect, useRef, useState, type ReactNode } from "react";

// iPhone dessiné en CSS (cadre, îlot, boutons, reflet), en perspective.
// L'écran affiche une vidéo de l'application (chargée seulement quand le téléphone est visible)
// ou, à défaut, un écran reproduit en code (children). Aucune image du cadre à télécharger.

export interface VideoApp {
  mp4: string;
  webm?: string;
  poster?: string;
  /** Description de ce que montre la vidéo (lue par les lecteurs d'écran). */
  description: string;
}

interface Props {
  /** Écran affiché tant que la vidéo n'est pas chargée (ou s'il n'y a pas de vidéo). */
  children?: ReactNode;
  video?: VideoApp;
  /** Inclinaison de repos. */
  inclinaison?: "gauche" | "droite" | "face";
  /** Le téléphone suit légèrement la souris (grands écrans, souris uniquement). */
  suivreSouris?: boolean;
  className?: string;
}

const INCLINAISONS = {
  gauche: { rx: 6, ry: 16 },
  droite: { rx: 6, ry: -16 },
  face: { rx: 0, ry: 0 },
};

export function Telephone3D({ children, video, inclinaison = "droite", suivreSouris = false, className = "" }: Props) {
  const scene = useRef<HTMLDivElement>(null);
  const corps = useRef<HTMLDivElement>(null);
  const [videoChargee, setVideoChargee] = useState(false);
  const [videoPrete, setVideoPrete] = useState(false);
  const base = INCLINAISONS[inclinaison];

  // Vidéo : montée seulement quand le téléphone approche de l'écran, mise en pause hors écran.
  useEffect(() => {
    const el = scene.current;
    if (!video || !el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVideoChargee(true);
        const v = el.querySelector("video");
        if (!v) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [video]);

  // Inclinaison qui suit la souris : variables CSS mises à jour hors de React (pas de re-rendu).
  useEffect(() => {
    const el = corps.current;
    if (!suivreSouris || !el) return;
    const souris = window.matchMedia("(pointer: fine) and (min-width: 1024px)");
    const calme = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!souris.matches || calme.matches) return;
    let image = 0;
    const bouger = (e: PointerEvent) => {
      cancelAnimationFrame(image);
      image = requestAnimationFrame(() => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        el.style.setProperty("--rx", `${base.rx - y * 8}deg`);
        el.style.setProperty("--ry", `${base.ry + x * 14}deg`);
      });
    };
    window.addEventListener("pointermove", bouger, { passive: true });
    return () => {
      window.removeEventListener("pointermove", bouger);
      cancelAnimationFrame(image);
    };
  }, [suivreSouris, base.rx, base.ry]);

  return (
    <div ref={scene} className={`telephone-scene ${className}`}>
      <div
        ref={corps}
        className="telephone-corps"
        style={{ "--rx": `${base.rx}deg`, "--ry": `${base.ry}deg` } as React.CSSProperties}
      >
        {/* Boutons latéraux */}
        <span aria-hidden="true" className="telephone-bouton left-[-3px] top-[22%] h-[6%]" />
        <span aria-hidden="true" className="telephone-bouton left-[-3px] top-[31%] h-[10%]" />
        <span aria-hidden="true" className="telephone-bouton left-[-3px] top-[43%] h-[10%]" />
        <span aria-hidden="true" className="telephone-bouton right-[-3px] top-[30%] h-[14%]" />

        <div className="telephone-ecran">
          {children}
          {video && videoChargee && (
            <video
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${videoPrete ? "opacity-100" : "opacity-0"}`}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={video.poster}
              aria-label={video.description}
              onCanPlay={() => setVideoPrete(true)}
            >
              {video.webm && <source src={video.webm} type="video/webm" />}
              <source src={video.mp4} type="video/mp4" />
            </video>
          )}
          {/* Îlot dynamique et reflet */}
          <span aria-hidden="true" className="telephone-ilot" />
          <span aria-hidden="true" className="telephone-reflet" />
        </div>
      </div>
      <div aria-hidden="true" className="telephone-ombre" />
    </div>
  );
}
