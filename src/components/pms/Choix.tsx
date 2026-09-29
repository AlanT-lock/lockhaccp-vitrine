// Petits boutons de choix (oui/non, jours, options) partagés par les champs du questionnaire.
import { cn } from "@/lib/utils";

export function BoutonChoix(props: { actif: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.actif}
      className={cn(
        "px-4 py-2 rounded-lg border text-sm font-medium transition-colors min-h-[44px]",
        props.actif
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-foreground border-border hover:border-primary/60",
      )}
    >
      {props.children}
    </button>
  );
}

export const champTexte =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary/40";
