import { useEffect, useRef, useState, type ReactNode } from "react";
import { VIDEO_HAUTEUR, VIDEO_LARGEUR, type VideoApp } from "@/lib/videos-app";

// iPhone dessiné en CSS (cadre, boutons, reflet), en perspective. Les vidéos du simulateur
// contiennent déjà la barre d'état et l'îlot : le cadre n'en ajoute pas.

interface PropsTelephone {
  children: ReactNode;
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

export function Telephone3D({ children, inclinaison = "droite", suivreSouris = false, className = "" }: PropsTelephone) {
  const corps = useRef<HTMLDivElement>(null);
  const base = INCLINAISONS[inclinaison];

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
    <div className={`telephone-scene ${className}`}>
      <div
        ref={corps}
        className="telephone-corps"
        style={{ "--rx": `${base.rx}deg`, "--ry": `${base.ry}deg` } as React.CSSProperties}
      >
        <span aria-hidden="true" className="telephone-bouton left-[-3px] top-[22%] h-[6%]" />
        <span aria-hidden="true" className="telephone-bouton left-[-3px] top-[31%] h-[10%]" />
        <span aria-hidden="true" className="telephone-bouton left-[-3px] top-[43%] h-[10%]" />
        <span aria-hidden="true" className="telephone-bouton right-[-3px] top-[30%] h-[14%]" />
        <div className="telephone-ecran">
          {children}
          <span aria-hidden="true" className="telephone-reflet" />
        </div>
      </div>
      <div aria-hidden="true" className="telephone-ombre" />
    </div>
  );
}

interface PropsEcran {
  video: VideoApp;
  /** Haut de page : image d'attente chargée en priorité (pas de chargement différé). */
  priorite?: boolean;
}

/**
 * Écran du téléphone : l'image d'attente est dans le HTML dès le premier rendu (rien ne bouge
 * à l'hydratation) ; la vidéo n'est montée que lorsque le téléphone approche de l'écran, et
 * mise en pause quand il le quitte. Sans JavaScript, ou si la vidéo échoue, l'image reste.
 */
export function EcranVideo({ video, priorite = false }: PropsEcran) {
  const cadre = useRef<HTMLDivElement>(null);
  const lecteur = useRef<HTMLVideoElement>(null);
  const [montee, setMontee] = useState(false);
  const [prete, setPrete] = useState(false);
  const visible = useRef(false);

  useEffect(() => {
    const el = cadre.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        visible.current = e.isIntersecting;
        if (e.isIntersecting) setMontee(true);
        const v = lecteur.current;
        if (!v) return;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "250px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Une fois la vidéo montée : React ne pose pas l'attribut « muted » dans le DOM, or les
  // navigateurs mobiles n'autorisent la lecture automatique que des vidéos muettes.
  useEffect(() => {
    const v = lecteur.current;
    if (!montee || !v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    if (visible.current) v.play().catch(() => {});
  }, [montee]);

  return (
    <div ref={cadre} className="absolute inset-0 bg-[#eef2f8]">
      <img
        src={video.poster}
        alt={video.description}
        width={VIDEO_LARGEUR}
        height={VIDEO_HAUTEUR}
        loading={priorite ? "eager" : "lazy"}
        decoding="async"
        {...(priorite ? { fetchpriority: "high" } : {})}
        className="h-full w-full object-cover object-top"
      />
      {montee && (
        <video
          ref={lecteur}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 ${prete ? "opacity-100" : "opacity-0"}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={video.poster}
          aria-hidden="true"
          onPlaying={() => setPrete(true)}
        >
          <source src={video.webm} type="video/webm" />
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
