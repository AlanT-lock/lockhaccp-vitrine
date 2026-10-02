import { Link } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

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
  return (
    <section className="py-16 border-t border-border bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-8 text-center">
          {title}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-3 rounded-xl bg-card border border-border p-4 hover:border-primary/30 hover:shadow-card transition-all"
              >
                {Icon && (
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.label}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-2" />
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
  ],
  receptions: [
    { to: "/fonctionnalites/tracabilite", label: "Traçabilité alimentaire", description: "Suivi des lots et fournisseurs." },
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/blog/methode-haccp-guide-complet", label: "Guide méthode HACCP", description: "Les 7 principes expliqués." },
  ],
  tracabilite: [
    { to: "/fonctionnalites/receptions", label: "Contrôle à réception", description: "Capturez les infos à la source." },
    { to: "/fonctionnalites/etiquettes", label: "Étiquettes de production", description: "DLC et n° de lot conformes." },
    { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
  ],
  nettoyage: [
    { to: "/fonctionnalites/checklist", label: "Check-lists personnalisées", description: "Ouverture, fermeture, service." },
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/plan-de-maitrise-sanitaire", label: "Plan de Maîtrise Sanitaire gratuit", description: "Votre dossier PMS en 10 minutes." },
  ],
  huiles: [
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/fonctionnalites/nettoyage", label: "Plan de nettoyage", description: "Planifiez et suivez vos tâches." },
    { to: "/blog/methode-haccp-guide-complet", label: "Guide méthode HACCP", description: "Les 7 principes expliqués." },
  ],
  etiquettes: [
    { to: "/fonctionnalites/tracabilite", label: "Traçabilité alimentaire", description: "Suivi des lots et fournisseurs." },
    { to: "/fonctionnalites/receptions", label: "Contrôle à réception", description: "Vérifiez vos livraisons." },
    { to: "/blog/affichages-obligatoires-restaurant-2026", label: "Affichages obligatoires", description: "Le guide complet 2026." },
  ],
  checklist: [
    { to: "/fonctionnalites/nettoyage", label: "Plan de nettoyage", description: "Planifiez et suivez vos tâches." },
    { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Un relevé en quelques secondes." },
    { to: "/blog/methode-haccp-guide-complet", label: "Guide méthode HACCP", description: "Les 7 principes expliqués." },
  ],
} as const;
