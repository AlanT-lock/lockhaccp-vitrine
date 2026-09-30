// Page de fin du générateur : remerciement, téléchargement du dossier PMS et
// offre de 2 mois d'essai à l'application (QR code, badges des stores).
import { CheckCircle, Download, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BlocApplication } from "@/components/BlocApplication";
import { dateFr, finEssaiOfferte } from "@/lib/pms/essai";

export function PageFin(props: { lien: string; email: string }) {
  const finEssai = dateFr(finEssaiOfferte(new Date()));
  return (
    <div className="text-center space-y-6">
      <CheckCircle className="h-14 w-14 text-green-600 mx-auto" />
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Merci ! Votre PMS est prêt</h2>
        <p className="text-muted-foreground">Nous vous l'avons aussi envoyé par e-mail à <strong>{props.email}</strong>.</p>
      </div>
      {props.lien && (
        <div className="pt-2">
          <a href={props.lien} download>
            <Button variant="hero" size="xl" className="gap-2"><Download className="h-5 w-5" /> Télécharger mon dossier PMS</Button>
          </a>
        </div>
      )}
      <p className="text-sm text-muted-foreground max-w-xl mx-auto">
        Vous recevez un fichier .zip : double-cliquez dessus pour l'ouvrir. Il contient votre tableau HACCP, votre plan de
        nettoyage, le dossier « Traçabilité » (fiches à imprimer chaque mois) et le dossier « Affichage obligatoire »
        (affiches à imprimer et afficher).
      </p>

      <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-6 sm:p-8 max-w-2xl mx-auto space-y-5">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
            <Gift className="h-4 w-4" /> Notre cadeau
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">2 mois d'essai offerts à l'application LockHACCP</h3>
          <p className="text-muted-foreground">
            Fini les fiches papier : relevés de température, nettoyage zone par zone, traçabilité en photo, sur tablette ou
            téléphone. Votre essai offert court <strong className="text-foreground">jusqu'au {finEssai}</strong> : plus
            vous installez l'application tôt, plus vous en profitez.
          </p>
          <p className="text-sm text-foreground">
            Créez votre compte avec la même adresse e-mail : <strong>{props.email}</strong>
          </p>
        </div>
        <BlocApplication />
      </div>
    </div>
  );
}
