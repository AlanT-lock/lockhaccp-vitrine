// Affiche une question du référentiel selon son type, avec son aide et son erreur.
import type { ElementListe, Question, ValeurReponse } from "@/lib/pms/genere/types";
import { BoutonChoix, champTexte } from "./Choix";
import { ListeEquipements, ListeNoms } from "./ListeEquipements";

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

export function ChampQuestion(props: {
  question: Question;
  valeur: ValeurReponse | undefined;
  erreur?: string;
  onChange: (v: ValeurReponse | undefined) => void;
}) {
  const { question: q, valeur: v, onChange } = props;
  const tableau = (Array.isArray(v) ? v : []) as string[];
  const basculer = (x: string) => onChange(tableau.includes(x) ? tableau.filter((y) => y !== x) : [...tableau, x]);

  let champ: React.ReactNode;
  switch (q.type) {
    case "oui_non":
      champ = (
        <div className="flex gap-2">
          <BoutonChoix actif={v === true} onClick={() => onChange(true)}>Oui</BoutonChoix>
          <BoutonChoix actif={v === false} onClick={() => onChange(false)}>Non</BoutonChoix>
        </div>
      );
      break;
    case "nombre":
      champ = (
        <input className={`${champTexte} max-w-[10rem]`} type="number" min={0} inputMode="numeric"
          value={typeof v === "number" ? String(v) : ""}
          onChange={(e) => onChange(e.target.value === "" ? undefined : Math.max(0, Math.floor(Number(e.target.value))))} />
      );
      break;
    case "texte":
      champ = (
        <input className={champTexte} maxLength={200} value={typeof v === "string" ? v : ""}
          type={q.id === "coordonnees.email" ? "email" : q.id === "coordonnees.telephone" ? "tel" : "text"}
          autoComplete={q.id === "coordonnees.email" ? "email" : q.id === "coordonnees.telephone" ? "tel" : q.id === "coordonnees.code_postal" ? "postal-code" : q.id === "coordonnees.nom" ? "organization" : undefined}
          onChange={(e) => onChange(e.target.value)} />
      );
      break;
    case "jours":
      champ = <div className="flex flex-wrap gap-2">{JOURS.map((j) => <BoutonChoix key={j} actif={tableau.includes(j)} onClick={() => basculer(j)}>{j.slice(0, 3)}</BoutonChoix>)}</div>;
      break;
    case "choix_multiple":
      champ = <div className="flex flex-wrap gap-2">{(q.options ?? []).map((o) => <BoutonChoix key={o.valeur} actif={tableau.includes(o.valeur)} onClick={() => basculer(o.valeur)}>{o.libelle}</BoutonChoix>)}</div>;
      break;
    case "choix_unique":
      champ = <div className="flex flex-wrap gap-2">{(q.options ?? []).map((o) => <BoutonChoix key={o.valeur} actif={v === o.valeur} onClick={() => onChange(o.valeur)}>{o.libelle}</BoutonChoix>)}</div>;
      break;
    case "liste_equipements_froids":
      champ = <ListeEquipements valeur={v as ElementListe[]} onChange={onChange} />;
      break;
    case "liste_friteuses":
      champ = <ListeNoms valeur={v as ElementListe[]} onChange={onChange} exemple="Friteuse frites" libelleAjout="Ajouter une friteuse" />;
      break;
    // Les zones du nettoyage ont leurs propres écrans (ChoixZones, SurfacesZone).
  }

  if (q.id === "coordonnees.consentement") {
    return (
      <div className="rounded-xl border border-border bg-card p-4">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-1 h-5 w-5" checked={v === true} onChange={(e) => onChange(e.target.checked)} />
          <span>
            {q.texte}{" "}
            <a href="/politique-confidentialite" target="_blank" rel="noreferrer" className="text-primary underline">Politique de confidentialité</a>.
            Vous pourrez vous désinscrire à tout moment.
          </span>
        </label>
        {props.erreur && <p className="mt-2 text-sm text-destructive">{props.erreur}</p>}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-medium text-foreground mb-1">{q.texte}{!q.obligatoire && <span className="text-muted-foreground font-normal"> (facultatif)</span>}</p>
      {q.aide && <p className="text-sm text-muted-foreground mb-3">{q.aide}</p>}
      <div className={q.aide ? "" : "mt-3"}>{champ}</div>
      {props.erreur && <p className="mt-2 text-sm text-destructive">{props.erreur}</p>}
    </div>
  );
}
