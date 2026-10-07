import type { RelatedItem } from "@/components/RelatedLinks";

/** Les sept fonctionnalités, pour les pages qui présentent l'application entière. */
export const TOUTES_FONCTIONNALITES: RelatedItem[] = [
  { to: "/fonctionnalites/temperatures", label: "Relevés de température", description: "Consigne par équipement, rappel chaque matin." },
  { to: "/fonctionnalites/receptions", label: "Contrôle à réception", description: "Température, dates, photos, refus." },
  { to: "/fonctionnalites/tracabilite", label: "Traçabilité", description: "Photo des étiquettes, export PDF ou Excel." },
  { to: "/fonctionnalites/nettoyage", label: "Plan de nettoyage", description: "Tâches par zone, validées et signées." },
  { to: "/fonctionnalites/huiles", label: "Contrôle des huiles", description: "Tests de composés polaires, changements tracés." },
  { to: "/fonctionnalites/etiquettes", label: "Étiquettes de production", description: "DLC, n° de lot et allergènes." },
  { to: "/fonctionnalites/checklist", label: "Check-lists", description: "Ouverture, fermeture, audits internes." },
];
