// Accueil : obligations d'hygiène d'un restaurant et la fonction de l'application qui y répond
// (maillage vers chaque page fonctionnalité). Bande bleu nuit : le « moment contrôle » de la page.
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SOURCES } from "@/lib/sources-reglementaires";

const OBLIGATIONS = [
  { obligation: "Relever la température des frigos et congélateurs, et noter les actions en cas d'écart", to: "/fonctionnalites/temperatures", outil: "Relevés de température" },
  { obligation: "Contrôler chaque livraison : température, dates, emballages", to: "/fonctionnalites/receptions", outil: "Contrôle à réception" },
  { obligation: "Savoir de quel fournisseur vient chaque produit", to: "/fonctionnalites/tracabilite", outil: "Traçabilité" },
  { obligation: "Suivre un plan de nettoyage et garder la trace de ce qui est fait", to: "/fonctionnalites/nettoyage", outil: "Plan de nettoyage" },
  { obligation: "Changer l'huile de friture avant 25 % de composés polaires", to: "/fonctionnalites/huiles", outil: "Contrôle des huiles" },
  { obligation: "Dater les préparations et indiquer les allergènes", to: "/fonctionnalites/etiquettes", outil: "Étiquettes DLC" },
  { obligation: "Tenir un Plan de Maîtrise Sanitaire à jour", to: "/plan-de-maitrise-sanitaire", outil: "PMS gratuit" },
];

const LIEN_SOURCE = "underline underline-offset-2 hover:text-white";

export function ObligationsSection() {
  return (
    <section className="relative overflow-hidden bg-[hsl(211_100%_13%)] py-24 text-white lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-0 h-[30rem] w-[30rem] rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary">Le contrôle sanitaire</p>
              <h2 className="font-heading text-[clamp(2.1rem,4.2vw,3.4rem)] font-extrabold leading-[1.05] tracking-[-0.03em]">
                Un logiciel HACCP calé sur ce que demande l'inspecteur
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-white/75">
                Le règlement européen 852/2004 impose à tout restaurant d'appliquer les bonnes pratiques d'hygiène et les
                principes HACCP, et de garder la trace de ses contrôles. Voici ce que vérifie un contrôle sanitaire de la
                DDPP, et où vous le retrouvez dans LockHACCP.
              </p>
              <p className="mt-8 text-sm leading-relaxed text-white/60">
                Textes de référence :{" "}
                <a href={SOURCES.hygiene852.url} target="_blank" rel="noopener noreferrer" className={LIEN_SOURCE}>règlement (CE) n° 852/2004</a>
                {", "}
                <a href={SOURCES.arrete2009.url} target="_blank" rel="noopener noreferrer" className={LIEN_SOURCE}>arrêté du 21 décembre 2009</a>
                {", "}
                <a href={SOURCES.huiles2008.url} target="_blank" rel="noopener noreferrer" className={LIEN_SOURCE}>décret n° 2008-184 (huiles de friture)</a>.
                Pour comprendre la méthode, lisez{" "}
                <Link to="/blog/methode-haccp-guide-complet" className={LIEN_SOURCE}>les 7 principes HACCP expliqués en cuisine</Link>.
              </p>
            </div>
          </div>

          <ol className="lg:col-span-7">
            {OBLIGATIONS.map((o, i) => (
              <li key={o.to} className="group border-b border-white/10 first:border-t">
                <div className="flex flex-col gap-4 py-6 transition-colors sm:flex-row sm:items-center sm:gap-6 sm:px-4 sm:group-hover:bg-white/[0.04]">
                  <span className="font-heading text-sm font-extrabold tabular-nums text-secondary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex-1 text-lg leading-snug text-white/90">{o.obligation}</span>
                  <Link
                    to={o.to}
                    className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition-colors hover:border-secondary hover:bg-secondary sm:self-auto"
                  >
                    {o.outil}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
