// Étape 5, un écran par zone : les surfaces et équipements à nettoyer dans la
// zone (courants précochés), leur fréquence, et l'ajout d'une surface.
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { ElementListe, MetierId } from "@/lib/pms/genere/types";
import type { Frequence } from "@/lib/pms/genere/suggestions";
import {
  ajouterSurfacePerso, basculerSurface, changerFrequence, FREQUENCES, surfacesProposees,
} from "@/lib/pms/nettoyage";
import { champTexte } from "./Choix";
import { CaseCarte } from "./ChoixZones";

export function SurfacesZone(props: {
  metier: MetierId;
  zone: ElementListe;
  numero: number;
  total: number;
  erreur?: string;
  onChange: (zone: ElementListe) => void;
}) {
  const [nouvelle, setNouvelle] = useState("");
  const { zone } = props;
  const surfaces = (zone.surfaces ?? []) as ElementListe[];
  const catalogue = surfacesProposees(props.metier, zone.nom);
  const choisie = (nom: string) => surfaces.find((s) => s.nom === nom);
  const perso = surfaces.filter((s) => !catalogue.some((c) => c.nom === s.nom));
  const ajouter = () => {
    props.onChange(ajouterSurfacePerso(zone, nouvelle));
    setNouvelle("");
  };
  const selectFrequence = (s: ElementListe) => (
    <select className={`${champTexte.replace("w-full", "")} w-[7.25rem] shrink-0 px-2`} aria-label={`Fréquence : ${s.nom}`} value={String(s.frequence)}
      onChange={(e) => props.onChange(changerFrequence(zone, s.nom, e.target.value as Frequence))}>
      {FREQUENCES.map((f) => <option key={f} value={f}>{f}</option>)}
    </select>
  );

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Zone {props.numero} sur {props.total}</p>
        <p className="text-lg font-semibold text-foreground">{zone.nom}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Cochez ce qui se trouve dans cette zone et doit être nettoyé. Nous avons coché le plus courant et indiqué une
          fréquence habituelle : ajustez-la si besoin.
        </p>
      </div>
      <div className="space-y-2">
        {catalogue.map((c) => {
          const s = choisie(c.nom);
          return (
            <div key={c.nom} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <CaseCarte cochee={Boolean(s)} titre={c.nom}
                  onClick={() => props.onChange(basculerSurface(zone, props.metier, c.nom, !s))} />
              </div>
              {s && selectFrequence(s)}
            </div>
          );
        })}
        {perso.map((s) => (
          <div key={s.nom} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <CaseCarte cochee titre={s.nom} detail="Ajoutée par vous"
                onClick={() => props.onChange({ ...zone, surfaces: surfaces.filter((x) => x !== s) })} />
            </div>
            {selectFrequence(s)}
            <button type="button" aria-label={`Supprimer ${s.nom}`} className="p-2 text-muted-foreground hover:text-destructive"
              onClick={() => props.onChange({ ...zone, surfaces: surfaces.filter((x) => x !== s) })}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className={champTexte} value={nouvelle} maxLength={80}
          placeholder={catalogue.length ? "Autre surface ou équipement" : "Surface ou équipement (ex. Tables, Sols)"}
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
