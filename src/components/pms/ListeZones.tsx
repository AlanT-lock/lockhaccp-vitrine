import { Plus, Trash2 } from "lucide-react";
import type { ElementListe } from "@/lib/pms/genere/types";
import { champTexte } from "./Choix";

const FREQUENCES = ["Quotidien", "Hebdo", "Mensuel"];

export function ListeZones(props: { valeur: ElementListe[]; onChange: (v: ElementListe[]) => void }) {
  const zones = props.valeur ?? [];
  const surfaces = (z: ElementListe) => (z.surfaces ?? []) as ElementListe[];
  const majZone = (i: number, z: ElementListe) => props.onChange(zones.map((x, j) => (j === i ? z : x)));
  return (
    <div className="space-y-4">
      {zones.map((z, i) => (
        <div key={i} className="rounded-lg border border-border p-3 space-y-2">
          <div className="flex gap-2">
            <input className={`${champTexte} font-semibold`} value={z.nom} maxLength={80} placeholder="Nom de la zone" onChange={(ev) => majZone(i, { ...z, nom: ev.target.value })} />
            <button type="button" aria-label="Supprimer la zone" className="p-2 text-muted-foreground hover:text-destructive" onClick={() => props.onChange(zones.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          {surfaces(z).map((s, k) => (
            <div key={k} className="pl-3 space-y-2 pb-2">
              <div className="flex gap-2">
                <input className={champTexte} value={s.nom} maxLength={80} placeholder="Surface"
                  onChange={(ev) => majZone(i, { ...z, surfaces: surfaces(z).map((x, m) => (m === k ? { ...x, nom: ev.target.value } : x)) })} />
                <button type="button" aria-label="Supprimer la surface" className="p-2 text-muted-foreground hover:text-destructive"
                  onClick={() => majZone(i, { ...z, surfaces: surfaces(z).filter((_, m) => m !== k) })}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <select className={`${champTexte} max-w-[12rem]`} aria-label="Fréquence" value={String(s.frequence)}
                onChange={(ev) => majZone(i, { ...z, surfaces: surfaces(z).map((x, m) => (m === k ? { ...x, frequence: ev.target.value } : x)) })}>
                {FREQUENCES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          ))}
          <button type="button" className="inline-flex items-center gap-2 text-sm text-primary pl-3 min-h-[40px]"
            onClick={() => majZone(i, { ...z, surfaces: [...surfaces(z), { nom: "", frequence: "Quotidien" }] })}>
            <Plus className="h-4 w-4" /> Ajouter une surface
          </button>
        </div>
      ))}
      <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-primary min-h-[44px]"
        onClick={() => props.onChange([...zones, { nom: "", surfaces: [{ nom: "", frequence: "Quotidien" }] }])}>
        <Plus className="h-4 w-4" /> Ajouter une zone
      </button>
    </div>
  );
}
