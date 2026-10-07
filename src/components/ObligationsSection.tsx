// Accueil : obligations d'hygiène d'un restaurant et la fonction de
// l'application qui y répond (maillage vers chaque page fonctionnalité).
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { SOURCES } from "@/lib/sources-reglementaires";

const OBLIGATIONS = [
  { obligation: "Relever la température des frigos et congélateurs, et noter les actions en cas d'écart", to: "/fonctionnalites/temperatures", outil: "Relevés de température" },
  { obligation: "Contrôler chaque livraison : température, dates, emballages", to: "/fonctionnalites/receptions", outil: "Contrôle à réception" },
  { obligation: "Savoir de quel fournisseur vient chaque produit", to: "/fonctionnalites/tracabilite", outil: "Traçabilité" },
  { obligation: "Suivre un plan de nettoyage et garder la trace de ce qui est fait", to: "/fonctionnalites/nettoyage", outil: "Plan de nettoyage" },
  { obligation: "Changer l'huile de friture avant 25 % de composés polaires", to: "/fonctionnalites/huiles", outil: "Contrôle des huiles" },
  { obligation: "Dater les préparations et indiquer les allergènes", to: "/fonctionnalites/etiquettes", outil: "Étiquettes de production" },
  { obligation: "Tenir un Plan de Maîtrise Sanitaire à jour", to: "/plan-de-maitrise-sanitaire", outil: "PMS gratuit" },
];

export function ObligationsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Un logiciel HACCP calé sur ce que demande l'inspecteur
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Le règlement européen 852/2004 impose à tout restaurant d'appliquer les bonnes pratiques d'hygiène et les
            principes HACCP, et de garder la trace de ses contrôles. Voici ce que vérifie un contrôle sanitaire de la
            DDPP, et où vous le retrouvez dans LockHACCP.
          </p>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card shadow-card">
            {OBLIGATIONS.map((o) => (
              <li key={o.to} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <span className="text-foreground">{o.obligation}</span>
                <Link to={o.to} className="inline-flex shrink-0 items-center gap-1 font-semibold text-primary hover:underline">
                  {o.outil}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Textes de référence :{" "}
            <a href={SOURCES.hygiene852.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">règlement (CE) n° 852/2004</a>
            {", "}
            <a href={SOURCES.arrete2009.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">arrêté du 21 décembre 2009</a>
            {", "}
            <a href={SOURCES.huiles2008.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary">décret n° 2008-184 (huiles de friture)</a>.
            Pour comprendre la méthode, lisez{" "}
            <Link to="/blog/methode-haccp-guide-complet" className="underline underline-offset-2 hover:text-primary">les 7 principes HACCP expliqués en cuisine</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
