import { Plus, Trash2 } from "lucide-react";
import { TYPES_EQUIPEMENTS_FROIDS } from "@/lib/pms/genere/equipements";
import type { ElementListe } from "@/lib/pms/genere/types";
import { champTexte } from "./Choix";

const nombreOuVide = (v: string) => (v.trim() === "" ? undefined : Number(v));

export function ListeEquipements(props: { valeur: ElementListe[]; onChange: (v: ElementListe[]) => void }) {
  const liste = props.valeur ?? [];
  const maj = (i: number, champs: Partial<ElementListe>) =>
    props.onChange(liste.map((e, j) => (j === i ? ({ ...e, ...champs } as ElementListe) : e)));
  const changerType = (i: number, type: string) => {
    const t = TYPES_EQUIPEMENTS_FROIDS.find((x) => x.type === type);
    maj(i, { type, consigne_min: t?.consigneMin, consigne_max: t?.consigneMax ?? 4 });
  };
  return (
    <div className="space-y-3">
      {liste.map((e, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-[1.4fr_1.2fr_0.6fr_0.6fr_auto] gap-2 items-end rounded-lg border border-border p-3">
          <label className="text-xs text-muted-foreground">Nom
            <input className={champTexte} value={e.nom} maxLength={80} placeholder="Frigo viandes" onChange={(ev) => maj(i, { nom: ev.target.value })} />
          </label>
          <label className="text-xs text-muted-foreground">Type
            <select className={champTexte} value={String(e.type)} onChange={(ev) => changerType(i, ev.target.value)}>
              {TYPES_EQUIPEMENTS_FROIDS.map((t) => <option key={t.type} value={t.type}>{t.libelle}</option>)}
            </select>
          </label>
          <label className="text-xs text-muted-foreground">Min (°C)
            <input className={champTexte} type="number" value={e.consigne_min === undefined ? "" : String(e.consigne_min)} onChange={(ev) => maj(i, { consigne_min: nombreOuVide(ev.target.value) })} />
          </label>
          <label className="text-xs text-muted-foreground">Max (°C)
            <input className={champTexte} type="number" value={String(e.consigne_max ?? "")} onChange={(ev) => maj(i, { consigne_max: nombreOuVide(ev.target.value) })} />
          </label>
          <button type="button" aria-label="Supprimer" className="p-2 text-muted-foreground hover:text-destructive min-h-[44px]" onClick={() => props.onChange(liste.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-primary min-h-[44px]"
        onClick={() => props.onChange([...liste, { nom: "", type: "refrigerateur", consigne_min: 0, consigne_max: 4 }])}>
        <Plus className="h-4 w-4" /> Ajouter un équipement
      </button>
    </div>
  );
}

export function ListeNoms(props: { valeur: ElementListe[]; onChange: (v: ElementListe[]) => void; exemple: string; libelleAjout: string }) {
  const liste = props.valeur ?? [];
  return (
    <div className="space-y-2">
      {liste.map((e, i) => (
        <div key={i} className="flex gap-2">
          <input className={champTexte} value={e.nom} maxLength={80} placeholder={props.exemple}
            onChange={(ev) => props.onChange(liste.map((x, j) => (j === i ? { ...x, nom: ev.target.value } : x)))} />
          <button type="button" aria-label="Supprimer" className="p-2 text-muted-foreground hover:text-destructive" onClick={() => props.onChange(liste.filter((_, j) => j !== i))}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" className="inline-flex items-center gap-2 text-sm font-medium text-primary min-h-[44px]" onClick={() => props.onChange([...liste, { nom: "" }])}>
        <Plus className="h-4 w-4" /> {props.libelleAjout}
      </button>
    </div>
  );
}
