// Étape 5, premier écran : les zones de l'établissement. Les zones habituelles
// du métier sont précochées ; les autres sont proposées ; on peut en ajouter.
import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import type { ElementListe, MetierId } from "@/lib/pms/genere/types";
import { ajouterZonePerso, basculerZone, zonesProposees } from "@/lib/pms/nettoyage";
import { cn } from "@/lib/utils";
import { champTexte } from "./Choix";

export function CaseCarte(props: { cochee: boolean; onClick: () => void; titre: string; detail?: string }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={props.cochee}
      onClick={props.onClick}
      className={cn(
        "flex items-center gap-3 w-full text-left rounded-lg border px-3 py-2 min-h-[48px] transition-colors",
        props.cochee ? "border-primary bg-primary/5" : "border-border hover:border-primary/60",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded border",
          props.cochee ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/50",
        )}
      >
        {props.cochee && <Check className="h-3.5 w-3.5" />}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-foreground">{props.titre}</span>
        {props.detail && <span className="block text-xs text-muted-foreground">{props.detail}</span>}
      </span>
    </button>
  );
}

export function ChoixZones(props: {
  metier: MetierId;
  zones: ElementListe[];
  erreur?: string;
  onChange: (zones: ElementListe[]) => void;
}) {
  const [nouvelle, setNouvelle] = useState("");
  const proposees = zonesProposees(props.metier);
  const cochee = (nom: string) => props.zones.some((z) => z.nom === nom);
  const perso = props.zones.filter((z) => !proposees.some((p) => p.nom === z.nom));
  const ajouter = () => {
    props.onChange(ajouterZonePerso(props.zones, nouvelle));
    setNouvelle("");
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div>
        <p className="font-medium text-foreground">Quelles sont les zones de votre établissement ?</p>
        <p className="text-sm text-muted-foreground mt-1">
          Nous avons coché les zones habituelles de votre métier : décochez celles que vous n'avez pas, cochez celles qui
          manquent. À l'écran suivant, vous choisirez zone par zone les surfaces à nettoyer. Chaque zone aura son tableau
          dans votre plan de nettoyage et sa fiche de traçabilité.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {proposees.map((z) => (
          <CaseCarte key={z.nom} cochee={cochee(z.nom)} titre={z.nom}
            onClick={() => props.onChange(basculerZone(props.zones, props.metier, z.nom, !cochee(z.nom)))} />
        ))}
        {perso.map((z) => (
          <div key={z.nom} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <CaseCarte cochee titre={z.nom} detail="Zone ajoutée par vous"
                onClick={() => props.onChange(props.zones.filter((x) => x !== z))} />
            </div>
            <button type="button" aria-label={`Supprimer la zone ${z.nom}`} className="p-2 text-muted-foreground hover:text-destructive"
              onClick={() => props.onChange(props.zones.filter((x) => x !== z))}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className={champTexte} value={nouvelle} maxLength={80} placeholder="Autre zone (ex. Terrasse, Labo pâtisserie)"
          onChange={(e) => setNouvelle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ajouter();
            }
          }} />
        <button type="button" onClick={ajouter} disabled={!nouvelle.trim()}
          className="inline-flex items-center gap-1 shrink-0 rounded-lg border border-primary px-3 text-sm font-medium text-primary disabled:opacity-40 min-h-[44px]">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>
      {props.erreur && <p className="text-sm text-destructive">{props.erreur}</p>}
    </div>
  );
}
