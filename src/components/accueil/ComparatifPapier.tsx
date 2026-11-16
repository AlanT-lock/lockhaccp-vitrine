import { Check, FileText, X } from "lucide-react";
import logoColor from "@/assets/logo-color.webp";

// Accueil : face-à-face « fiches papier / LockHACCP », critère par critère.
// (Les pages fonctionnalités gardent le tableau de SectionComparatif.)
export interface LigneComparatif {
  critere: string;
  papier: string;
  application: string;
}

export function ComparatifPapier({ titre, intro, lignes }: { titre: string; intro: string; lignes: LigneComparatif[] }) {
  return (
    <section className="bg-[hsl(220_33%_97%)] py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <h2 className="font-heading text-[clamp(2.1rem,4.6vw,3.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-foreground">
            {titre}
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">{intro}</p>
        </div>

        <div className="mx-auto max-w-5xl">
          {/* En-têtes des deux colonnes (grand écran) */}
          <div aria-hidden="true" className="mb-4 hidden grid-cols-[1fr_1fr] gap-4 pl-[13rem] md:grid">
            <p className="flex items-center gap-2 px-5 font-heading font-bold text-muted-foreground">
              <FileText className="h-5 w-5" /> Fiches papier ou tableur
            </p>
            <p className="flex items-center gap-2 px-5 font-heading font-bold text-primary">
              <img src={logoColor} alt="" width={35} height={40} className="h-5 w-auto" /> Avec LockHACCP
            </p>
          </div>

          <dl className="space-y-3">
            {lignes.map((l) => (
              <div key={l.critere} className="grid gap-3 md:grid-cols-[12rem_1fr_1fr] md:items-stretch md:gap-4">
                <dt className="flex items-center font-heading font-bold text-foreground md:pr-2">{l.critere}</dt>
                <dd className="flex items-start gap-3 rounded-2xl border border-border bg-white/60 p-5 text-muted-foreground">
                  <X className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
                  <span>
                    <span className="sr-only">Fiches papier : </span>
                    <span aria-hidden="true" className="mb-1 block text-xs font-bold uppercase tracking-wide text-slate-500 md:hidden">Papier</span>
                    {l.papier}
                  </span>
                </dd>
                <dd className="flex items-start gap-3 rounded-2xl bg-white p-5 font-medium text-foreground shadow-[0_14px_30px_-18px_hsl(211_100%_20%/0.35)] ring-1 ring-primary/15">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-white" strokeWidth={4} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="sr-only">Avec LockHACCP : </span>
                    <span aria-hidden="true" className="mb-1 block text-xs font-bold uppercase tracking-wide text-primary md:hidden">LockHACCP</span>
                    {l.application}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
