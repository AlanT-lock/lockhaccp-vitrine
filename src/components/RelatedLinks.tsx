import { Link } from "react-router-dom";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { articlesEnLigne } from "@/lib/blog";

export interface RelatedItem {
  to: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
}

export function RelatedLinks({
  title = "À découvrir aussi",
  items,
}: {
  title?: string;
  items: RelatedItem[];
}) {
  // Un article programmé n'apparaît qu'une fois publié (jamais de lien vers une page absente).
  const enLigne = new Set(articlesEnLigne().map((a) => `/blog/${a.slug}`));
  const visibles = items.filter((i) => !i.to.startsWith("/blog/") || enLigne.has(i.to));
  if (visibles.length === 0) return null;
  return (
    <section className="pb-24 pt-4 lg:pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-8 font-heading text-2xl font-extrabold tracking-[-0.02em] text-foreground sm:text-3xl">{title}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-3 rounded-2xl border border-border/80 bg-white/80 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white hover:shadow-[0_20px_40px_-24px_hsl(211_100%_20%/0.35)]"
              >
                {Icon && (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-light">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-heading font-bold text-foreground transition-colors group-hover:text-primary">{item.label}</div>
                  {item.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>}
                </div>
                <ArrowUpRight className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary/40 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Pre-built clusters — keeps Feature pages tidy.
export const FEATURE_RELATED = {
  temperatures: [
    { to: "/fonctionnalites/receptions", label: "Contrôle à réception", description: "Vérifiez vos livraisons en 1 minute." },
    { to: "/fonctionnalites/nettoyage", label: "Plan de nettoyage", description: "Planifiez et suivez vos tâches." },
    { to: "/blog/methode-haccp-guide-complet", label: "Guide méthode HACCP", description: "Les 7 principes expliqués." },
    { to: "/blog/releve-temperature-restaurant-regles-fiche", label: "Relevé de température : le guide", description: "Seuils, fréquence et fiche." },
  ],
  receptions: [
    { to: "/fonctionnalites/tracabilite", label: "Traçabilité alimentaire", description: "Suivi des lots et fournisseurs." },
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/blog/methode-haccp-guide-complet", label: "Guide méthode HACCP", description: "Les 7 principes expliqués." },
  ],
  tracabilite: [
    { to: "/fonctionnalites/receptions", label: "Contrôle à réception", description: "Capturez les infos à la source." },
    { to: "/fonctionnalites/etiquettes", label: "Étiquettes DLC", description: "DLC, n° de lot et allergènes, imprimés." },
    { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
    { to: "/blog/controle-sanitaire-restaurant-inspecteur-ddpp", label: "Le contrôle sanitaire", description: "Les documents demandés." },
  ],
  nettoyage: [
    { to: "/fonctionnalites/checklist", label: "Check-lists personnalisées", description: "Ouverture, fermeture, service." },
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
    { to: "/blog/plan-nettoyage-gratuit-modele", label: "Plan de nettoyage cuisine : modèle gratuit", description: "Exemple HACCP, nettoyage puis désinfection." },
    { to: "/blog/planning-nettoyage-cuisine-restaurant", label: "Planning de nettoyage : le guide", description: "Fréquences, exemple et fiche de suivi." },
  ],
  huiles: [
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/fonctionnalites/nettoyage", label: "Plan de nettoyage", description: "Planifiez et suivez vos tâches." },
    { to: "/blog/methode-haccp-guide-complet", label: "Guide méthode HACCP", description: "Les 7 principes expliqués." },
    { to: "/blog/controle-sanitaire-restaurant-inspecteur-ddpp", label: "Le contrôle sanitaire", description: "Ce que vérifie l'inspecteur." },
  ],
  etiquettes: [
    { to: "/fonctionnalites/tracabilite", label: "Traçabilité alimentaire", description: "Suivi des lots et fournisseurs." },
    { to: "/fonctionnalites/receptions", label: "Contrôle à réception", description: "Vérifiez vos livraisons." },
    { to: "/blog/affichages-obligatoires-restaurant-2026", label: "Affichages obligatoires", description: "Le guide complet 2026." },
    { to: "/blog/tableau-allergenes-restaurant", label: "Tableau des allergènes", description: "Obligations et modèle." },
  ],
  checklist: [
    { to: "/fonctionnalites/nettoyage", label: "Plan de nettoyage", description: "Planifiez et suivez vos tâches." },
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/blog/methode-haccp-guide-complet", label: "Guide méthode HACCP", description: "Les 7 principes expliqués." },
  ],
} as const;

