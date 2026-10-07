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
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">{titre}</h2>
          <p className="text-lg text-muted-foreground mb-10">{intro}</p>
          <div className="grid sm:grid-cols-2 gap-6">
            {points.map((p) => (
              <div key={p.titre} className="bg-card rounded-2xl p-6 border border-border shadow-card">
                <h3 className="font-heading text-lg font-bold text-foreground mb-2">{p.titre}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.texte}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-sm font-semibold text-foreground mb-2">Textes de référence</p>
            <ul className="space-y-1">
              {sources.map((s) => (
                <li key={s.url + s.libelle}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground underline underline-offset-2 hover:text-primary"
                  >
                    {s.libelle}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
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
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">{titre}</h2>
          {intro && <p className="text-lg text-muted-foreground mb-8">{intro}</p>}
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th scope="col" className="p-4 font-semibold text-foreground">Critère</th>
                  <th scope="col" className="p-4 font-semibold text-foreground">Fiches papier ou tableur</th>
                  <th scope="col" className="p-4 font-semibold text-primary">Application LockHACCP</th>
                </tr>
              </thead>
              <tbody>
                {lignes.map((l) => (
                  <tr key={l.critere} className="border-b border-border last:border-0 align-top">
                    <th scope="row" className="p-4 font-medium text-foreground">{l.critere}</th>
                    <td className="p-4 text-muted-foreground">{l.papier}</td>
                    <td className="p-4 text-foreground">{l.application}</td>
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
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">{titre}</h2>
          {intro && <p className="text-lg text-muted-foreground mb-8">{intro}</p>}
          <ol className="space-y-4">
            {etapes.map((e, i) => (
              <li key={e.titre} className="flex gap-4 bg-card rounded-2xl p-6 border border-border shadow-card">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground mb-1">{e.titre}</h3>
                  <p className="text-muted-foreground leading-relaxed">{e.texte}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
