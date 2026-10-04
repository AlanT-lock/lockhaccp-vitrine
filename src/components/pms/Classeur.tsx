import { useRef, useState, type KeyboardEvent } from "react";
import { INTERCALAIRES } from "@/lib/pms/presentation";

// Classeur à intercalaires : les vraies pages d'un dossier généré, rangées par
// section. Un onglet sélectionné fait passer sa section devant.
const Classeur = ({ titreId }: { titreId?: string }) => {
  const [actif, setActif] = useState(0);
  const onglets = useRef<(HTMLButtonElement | null)[]>([]);
  const section = INTERCALAIRES[actif];

  const choisir = (i: number) => {
    const n = (i + INTERCALAIRES.length) % INTERCALAIRES.length;
    setActif(n);
    onglets.current[n]?.focus();
  };

  const auClavier = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); choisir(i + 1); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); choisir(i - 1); }
    if (e.key === "Home") { e.preventDefault(); choisir(0); }
    if (e.key === "End") { e.preventDefault(); choisir(INTERCALAIRES.length - 1); }
  };

  return (
    <figure className="classeur min-w-0" aria-labelledby={titreId}>
      <div className="flex flex-col lg:flex-row-reverse lg:items-stretch">
        {/* Intercalaires : en haut sur mobile, sur la tranche droite sur grand écran. */}
        <div
          role="tablist"
          aria-label="Sections du dossier"
          className="relative z-10 flex gap-1 overflow-x-auto px-3 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:py-8 [scrollbar-width:none]"
        >
          {INTERCALAIRES.map((inter, i) => {
            const selectionne = i === actif;
            return (
              <button
                key={inter.id}
                ref={(el) => (onglets.current[i] = el)}
                type="button"
                role="tab"
                id={`onglet-${inter.id}`}
                aria-selected={selectionne}
                aria-controls={`feuillet-${inter.id}`}
                tabIndex={selectionne ? 0 : -1}
                onClick={() => setActif(i)}
                onKeyDown={(e) => auClavier(e, i)}
                className={[
                  "shrink-0 text-left transition-[background-color,color,transform] duration-200",
                  "rounded-t-lg px-3.5 pb-2 pt-2.5 lg:rounded-l-none lg:rounded-r-xl lg:px-4 lg:py-3 lg:w-44",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  selectionne
                    ? "bg-white text-primary shadow-[0_-1px_0_hsl(var(--border))] lg:shadow-[1px_0_0_hsl(var(--border)),0_8px_20px_-12px_rgba(0,38,77,.35)]"
                    : "bg-[#DCE4EE] text-foreground/70 hover:bg-[#E6ECF3] hover:text-foreground lg:-translate-x-1.5",
                ].join(" ")}
              >
                <span className="block text-sm font-semibold leading-tight">{inter.onglet}</span>
                <span className="mt-0.5 block text-xs text-foreground/70">
                  {inter.documents} {inter.documents > 1 ? "documents" : "document"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feuillets */}
        <div
          role="tabpanel"
          id={`feuillet-${section.id}`}
          aria-labelledby={`onglet-${section.id}`}
          className="relative flex-1 overflow-hidden rounded-2xl bg-white ring-1 ring-border lg:rounded-r-none"
        >
          <div className="relative aspect-[5/4] bg-[linear-gradient(180deg,#F4F7FA_0%,#E9EEF4_100%)]">
            {/* Tranche du classeur et ses anneaux */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 z-20 flex w-7 flex-col items-center justify-evenly bg-[linear-gradient(90deg,#00326A_0%,hsl(var(--primary))_70%,#0A4D96_100%)] sm:w-9"
            >
              {[0, 1, 2].map((n) => (
                <span
                  key={n}
                  className="h-4 w-4 rounded-full bg-[radial-gradient(circle_at_35%_35%,#FFFFFF_0%,#C9D3DF_45%,#8A9AAE_100%)] shadow-[0_1px_2px_rgba(0,0,0,.35)] sm:h-5 sm:w-5"
                />
              ))}
            </div>
            <div key={section.id} className="classeur-feuillets absolute inset-0">
              {[...section.pages].reverse().map((page, iInverse) => {
                const rang = section.pages.length - 1 - iInverse; // 0 = page du dessus
                const paysage = page.largeur > page.hauteur;
                return (
                  <img
                    key={page.src}
                    src={page.src}
                    srcSet={`${page.srcPetit} ${page.largeurPetit}w, ${page.src} ${page.largeur}w`}
                    sizes={paysage ? "(min-width: 1024px) 520px, 80vw" : "(min-width: 1024px) 320px, 45vw"}
                    alt={rang === 0 ? page.alt : ""}
                    aria-hidden={rang === 0 ? undefined : true}
                    width={page.largeur}
                    height={page.hauteur}
                    loading="eager"
                    decoding="async"
                    className={[
                      "absolute left-[calc(50%+14px)] top-1/2 max-w-none bg-white",
                      "shadow-[0_1px_2px_rgba(0,38,77,.10),0_18px_40px_-14px_rgba(0,38,77,.35)]",
                      paysage ? "w-[82%] h-auto" : "h-[86%] w-auto",
                    ].join(" ")}
                    style={{
                      transform: `translate(-50%, -50%) translate(${rang * 22}px, ${rang * -12}px) rotate(${rang * 2.2}deg)`,
                      zIndex: 10 - rang,
                    }}
                  />
                );
              })}
            </div>
          </div>
          <div className="border-t border-border px-5 py-4 sm:px-6">
            <p className="font-heading text-base font-semibold text-foreground">{section.titre}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{section.texte}</p>
          </div>
        </div>
      </div>
    </figure>
  );
};

export default Classeur;
