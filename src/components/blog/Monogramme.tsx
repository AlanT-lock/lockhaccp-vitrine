import { AUTEUR } from "@/lib/auteur";

const TAILLES = { sm: "h-9 w-9 text-xs", lg: "h-20 w-20 text-2xl" } as const;

/** Initiales de l'auteur (pas de photo). */
const Monogramme = ({ taille = "sm" }: { taille?: keyof typeof TAILLES }) => (
  <span
    aria-hidden="true"
    className={`inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-heading font-bold tracking-wide text-primary-foreground ${TAILLES[taille]}`}
  >
    {AUTEUR.initiales}
  </span>
);

export default Monogramme;
