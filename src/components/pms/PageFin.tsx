import { CheckCircle, Download, Tablet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function PageFin(props: { lien: string; email: string }) {
  return (
    <div className="text-center space-y-6">
      <CheckCircle className="h-14 w-14 text-green-600 mx-auto" />
      <h2 className="text-2xl font-bold text-foreground">Votre PMS est prêt</h2>
      {props.lien && (
        <a href={props.lien} download>
          <Button variant="hero" size="xl" className="gap-2"><Download className="h-5 w-5" /> Télécharger mon dossier PMS</Button>
        </a>
      )}
      <p className="text-sm text-muted-foreground max-w-xl mx-auto">
        Vous recevez un fichier .zip : double-cliquez dessus pour l'ouvrir. Il contient votre tableau HACCP, votre plan de
        nettoyage, le dossier « Traçabilité » (fiches à imprimer chaque mois) et le dossier « Affichage obligatoire »
        (affiches à imprimer et afficher).
      </p>
      <p className="text-muted-foreground">Nous vous l'avons aussi envoyé par e-mail à <strong>{props.email}</strong>.</p>
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 text-left max-w-xl mx-auto">
        <p className="flex items-center gap-2 font-semibold text-foreground mb-2"><Tablet className="h-5 w-5 text-primary" /> Et si vous ne remplissiez plus ces registres à la main ?</p>
        <p className="text-sm text-muted-foreground mb-4">
          LockHACCP tient vos relevés de température, votre plan de nettoyage par zone et votre traçabilité sur tablette,
          déjà configuré avec vos réponses.
        </p>
        <Link to="/tarifs"><Button variant="hero">Essayer gratuitement LockHACCP</Button></Link>
      </div>
    </div>
  );
}
