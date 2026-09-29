import { Plus, Trash2 } from "lucide-react";
import type { ElementListe } from "@/lib/pms/genere/types";
import { champTexte } from "./Choix";

export function ListeProduits(props: { valeur: ElementListe[]; onChange: (v: ElementListe[]) => void }) {
  const liste = props.valeur ?? [];
  const maj = (i: number, champs: Partial<ElementListe>) =>
    props.onChange(liste.map((e, j) => (j === i ? ({ ...e, ...champs } as ElementListe) : e)));
  return (
    <div className="space-y-3">
      {liste.map((p, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.3fr_1.1fr_1fr_0.6fr_auto_auto] gap-2 items-end rounded-lg border border-border p-3">
          <label className="text-xs text-muted-foreground">Nom du produit
            <input className={champTexte} value={p.nom} maxLength={80} onChange={(ev) => maj(i, { nom: ev.target.value })} />
          </label>
          <label className="text-xs text-muted-foreground">Usage
            <input className={champTexte} value={String(p.usage ?? "")} placeholder="Dégraissant…" onChange={(ev) => maj(i, { usage: ev.target.value })} />
          </label>
          <label className="text-xs text-muted-foreground">Dilution
            <input className={champTexte} value={String(p.dilution ?? "")} placeholder="Prêt à l'emploi" onChange={(ev) => maj(i, { dilution: ev.target.value })} />
          </label>
          <label className="text-xs text-muted-foreground">Action (min)
            <input className={champTexte} type="number" min={0} value={p.temps_action_min === undefined ? "" : String(p.temps_action_min)}
              onChange={(ev) => maj(i, { temps_action_min: ev.target.value === "" ? undefined : Number(ev.target.value) })} />
          </label>
          <label className="flex items-center gap-2 text-xs text-muted-foreground min-h-[44px]">
            <input type="checkbox" checked={p.rincage === true} onChange={(ev) => maj(i, { rincage: ev.target.checked })} /> Rinçage
          </label>
          <button type="button" aria-label="Supprimer" className="p-2 text-muted-foreground hover:text-destructive min-h-[44px]" onClick={() => props.onChange(liste.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-primary min-h-[44px]"
        onClick={() => props.onChange([...liste, { nom: "", usage: "", dilution: "", rincage: false }])}>
        <Plus className="h-4 w-4" /> Ajouter un produit
      </button>
    </div>
  );
}
