// Sections de contenu réutilisées par les pages produit : ce que dit la
// réglementation (avec ses textes), comparatif papier / application, étapes.
import { ExternalLink } from "lucide-react";

export interface Source {
  libelle: string;
  url: string;
}

export interface Point {
  titre: string;
  texte: string;
}

export function SectionReglementation({
  titre,
  intro,
  points,
  sources,
}: {
  titre: string;
  intro: string;
  points: Point[];
  sources: Source[];
}) {
  // Bande bleu nuit, comme le « moment contrôle » de l'accueil.
  return (
    <section className="relative overflow-hidden bg-[hsl(211_100%_13%)] py-20 text-white lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary">La réglementation</p>
              <h2 className="font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em]">{titre}</h2>
              <p className="mt-6 text-lg leading-relaxed text-white/75">{intro}</p>
              <div className="mt-8">
                <p className="mb-2 text-sm font-semibold text-white/90">Textes de référence</p>
                <ul className="space-y-1">
                  {sources.map((s) => (
                    <li key={s.url + s.libelle}>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-white/65 underline underline-offset-2 hover:text-white"
                      >
                        {s.libelle}
                        <ExternalLink className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <ol className="lg:col-span-7">
            {points.map((p, i) => (
              <li key={p.titre} className="flex gap-5 border-b border-white/10 py-7 first:border-t sm:gap-6">
                <span className="font-heading text-sm font-extrabold tabular-nums text-secondary">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-heading text-xl font-bold">{p.titre}</h3>
                  <p className="mt-2 leading-relaxed text-white/75">{p.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export interface LigneComparatif {
  critere: string;
  papier: string;
  application: string;
}

export function SectionComparatif({
  titre,
  intro,
  lignes,
}: {
  titre: string;
  intro?: string;
  lignes: LigneComparatif[];
}) {
  // Tableau sur grand écran ; sur mobile, chaque ligne devient une carte (pas de défilement horizontal).
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground">{titre}</h2>
            {intro && <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{intro}</p>}
          </div>
          <div className="rounded-3xl border border-border/80 bg-white/85 p-2 shadow-[0_30px_70px_-40px_hsl(211_100%_20%/0.4)] sm:p-3">
            <table className="block w-full text-left sm:table">
              <thead className="hidden sm:table-header-group">
                <tr>
                  <th scope="col" className="w-[22%] px-5 py-4 text-sm font-semibold text-muted-foreground">Critère</th>
                  <th scope="col" className="w-[39%] px-5 py-4 text-sm font-semibold text-muted-foreground">Fiches papier ou tableur</th>
                  <th scope="col" className="w-[39%] rounded-t-2xl bg-primary px-5 py-4 text-sm font-semibold text-white">Application LockHACCP</th>
                </tr>
              </thead>
              <tbody className="block sm:table-row-group">
                {lignes.map((l, i) => (
                  <tr key={l.critere} className="block border-b border-border/70 p-4 last:border-0 sm:table-row sm:p-0">
                    <th scope="row" className="block pb-3 font-heading font-bold text-foreground sm:table-cell sm:px-5 sm:py-5 sm:align-top">
                      {l.critere}
                    </th>
                    <td className="flex gap-2 pb-2 text-muted-foreground sm:table-cell sm:px-5 sm:py-5 sm:align-top">
                      <span className="shrink-0 font-semibold text-muted-foreground/80 sm:hidden">Papier :</span>
                      {l.papier}
                    </td>
                    <td
                      className={`flex gap-2 rounded-xl bg-primary-light/60 p-3 text-foreground sm:table-cell sm:rounded-none sm:bg-primary/[0.06] sm:px-5 sm:py-5 sm:align-top ${
                        i === lignes.length - 1 ? "sm:rounded-b-2xl" : ""
                      }`}
                    >
                      <span className="shrink-0 font-semibold text-primary sm:hidden">LockHACCP :</span>
                      {l.application}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SectionEtapes({
  titre,
  intro,
  etapes,
}: {
  titre: string;
  intro?: string;
  etapes: Point[];
}) {
  // Frise verticale : un fil relie les étapes numérotées.
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary-texte">Étape par étape</p>
              <h2 className="font-heading text-[clamp(1.9rem,3.6vw,2.8rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground">{titre}</h2>
              {intro && <p className="mt-5 text-lg text-muted-foreground">{intro}</p>}
            </div>
          </div>
          <ol className="relative lg:col-span-7">
            <span aria-hidden="true" className="absolute bottom-8 left-6 top-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-primary/5" />
            {etapes.map((e, i) => (
              <li key={e.titre} className="relative flex gap-5 pb-5 last:pb-0">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary font-heading font-extrabold text-white shadow-[0_12px_26px_-12px_hsl(211_100%_26%/0.7)]">
                  {i + 1}
                </span>
                <div className="flex-1 rounded-2xl border border-border/80 bg-white/85 p-5">
                  <h3 className="font-heading text-lg font-bold text-foreground">{e.titre}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{e.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
