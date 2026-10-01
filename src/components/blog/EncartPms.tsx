import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import tableauCcp from "@/assets/pms/tableau-ccp.webp";

// Encart vers le PMS gratuit, glissé au milieu ou à la fin d'un article.
const EncartPms = () => (
  <aside
    aria-label="Plan de Maîtrise Sanitaire gratuit"
    className="not-article my-10 grid gap-6 overflow-hidden rounded-2xl border border-border bg-[#F4F7FA] p-6 sm:grid-cols-[9rem_1fr] sm:items-center sm:p-7"
  >
    <img
      src={tableauCcp}
      alt=""
      width={1100}
      height={778}
      loading="lazy"
      decoding="async"
      className="hidden w-36 rotate-[-3deg] bg-white shadow-[0_10px_24px_-12px_rgba(0,38,77,.45)] sm:block"
    />
    <div>
      <p className="font-heading text-lg font-semibold leading-snug text-foreground">
        Votre PMS prêt à imprimer, adapté à votre établissement
      </p>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
        Tableau des CCP, plan de nettoyage, fiches de traçabilité et affichages. Gratuit, en 10 minutes.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button asChild variant="hero" size="lg">
          <Link to="/pms">Créer mon PMS gratuitement</Link>
        </Button>
        <Link
          to="/plan-de-maitrise-sanitaire"
          className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Voir ce que contient le dossier
        </Link>
      </div>
    </div>
  </aside>
);

export default EncartPms;
