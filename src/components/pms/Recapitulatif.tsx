import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { ErreurPms, obtenirApercu, type Resume } from "@/lib/pms/api";
import { ETAPES } from "@/lib/pms/questionnaire";
import type { Reponses } from "@/lib/pms/genere/types";

export function Recapitulatif(props: { reponses: Reponses; allerA: (etape: number) => void }) {
  const [resume, setResume] = useState<Resume | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    let actif = true;
    obtenirApercu(props.reponses)
      .then((r) => actif && setResume(r))
      .catch((e) => actif && setErreur(e instanceof ErreurPms ? e.message : "Aperçu indisponible."));
    return () => {
      actif = false;
    };
  }, [props.reponses]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
        {resume ? (
          <p className="text-foreground">
            Votre PMS contiendra <strong>{resume.affiches} affiches</strong>, un <strong>tableau HACCP de {resume.ccp} lignes</strong> et{" "}
            <strong>{resume.registres} registres</strong>, tous adaptés à vos réponses.
          </p>
        ) : erreur ? (
          <p className="text-muted-foreground">{erreur} Vous pouvez tout de même continuer.</p>
        ) : (
          <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Calcul du contenu de votre PMS…</p>
        )}
      </div>
      <ul className="divide-y divide-border rounded-xl border border-border">
        {ETAPES.slice(1, 6).map((e, i) => (
          <li key={e.titre} className="flex items-center justify-between px-4 py-3">
            <span>{e.titre}</span>
            <button type="button" className="text-sm font-medium text-primary" onClick={() => props.allerA(i + 2)}>Modifier</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
