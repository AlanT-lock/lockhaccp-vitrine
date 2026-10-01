import { Link } from "react-router-dom";
import { AUTEUR } from "@/lib/auteur";
import Monogramme from "./Monogramme";

const EncartAuteur = () => (
  <aside aria-label="À propos de l'auteur" className="flex gap-4 border-t border-border pt-8">
    <Monogramme />
    <div>
      <p className="font-heading font-semibold text-foreground">
        <Link to={AUTEUR.url} className="hover:underline hover:underline-offset-4">
          {AUTEUR.nom}
        </Link>
      </p>
      <p className="text-sm text-muted-foreground">{AUTEUR.role}, {AUTEUR.organisme}</p>
      <p className="mt-3 max-w-[60ch] text-[0.95rem] leading-relaxed text-foreground/80">{AUTEUR.bio[1]}</p>
    </div>
  </aside>
);

export default EncartAuteur;
