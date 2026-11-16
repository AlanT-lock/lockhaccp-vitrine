import {
  Thermometer,
  Truck,
  ScanLine,
  SprayCan,
  Droplet,
  ChefHat,
  Printer,
  ClipboardCheck,
  History,
  Settings,
  UserRound,
  Check,
  ChevronLeft,
  Camera,
} from "lucide-react";
import type { ReactNode } from "react";

// Écrans de l'application LockHACCP reproduits en code, d'après les captures de l'application
// (établissement de démonstration « Le Bistrot Français »). Provisoires : remplacés par les
// vidéos enregistrées dans le simulateur (docs/design/prompt-captures-simulateur-ios.md).
// Contenu fixe (aucune date calculée) : identique au HTML pré-généré, sans écart d'hydratation.

function Barre({ titre, retour = false }: { titre: string; retour?: boolean }) {
  return (
    <div className="bg-primary px-4 pb-3 pt-10 text-primary-foreground">
      <div className="flex items-center justify-between">
        {retour ? <ChevronLeft className="h-5 w-5" /> : <UserRound className="h-5 w-5 text-red-400" />}
        <span className="font-heading text-[0.95rem] font-bold">{titre}</span>
        <Settings className="h-5 w-5" />
      </div>
    </div>
  );
}

function Ecran({ children }: { children: ReactNode }) {
  return <div className="flex h-full flex-col bg-[#eef2f8] text-[#0b2545]">{children}</div>;
}

const TUILES = [
  { icone: Thermometer, nom: "Températures" },
  { icone: Truck, nom: "Contrôle à réception" },
  { icone: ScanLine, nom: "Traçabilité" },
  { icone: SprayCan, nom: "Plan de nettoyage" },
  { icone: Thermometer, nom: "T° Produit" },
  { icone: Droplet, nom: "Huile de friture" },
  { icone: ChefHat, nom: "Production" },
  { icone: Printer, nom: "Étiqueteuse" },
];

export function EcranAccueilApp() {
  return (
    <Ecran>
      <Barre titre="Le Bistrot Français" />
      <div className="grid flex-1 grid-cols-2 gap-2.5 p-3">
        {TUILES.map(({ icone: Icone, nom }, i) => (
          <div
            key={nom}
            className="ecran-apparition flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white p-2 text-center shadow-sm"
            style={{ "--d": `${120 + i * 70}ms` } as React.CSSProperties}
          >
            <Icone className="h-6 w-6 text-primary" strokeWidth={2.2} />
            <span className="text-[0.68rem] font-bold leading-tight">{nom}</span>
          </div>
        ))}
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-secondary p-2 text-white shadow-sm">
          <ClipboardCheck className="h-6 w-6" strokeWidth={2.2} />
          <span className="text-[0.68rem] font-bold">Checklist</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl bg-primary p-2 text-white shadow-sm">
          <History className="h-6 w-6" strokeWidth={2.2} />
          <span className="text-[0.68rem] font-bold">Historique</span>
        </div>
      </div>
    </Ecran>
  );
}

const EQUIPEMENTS = [
  { nom: "Chambre froide négative", valeur: "−18,0 °C" },
  { nom: "Chambre froide positive", valeur: "3,0 °C" },
  { nom: "Frigo cuisine", valeur: "3,2 °C", anime: true },
  { nom: "Frigo bar", valeur: "4,0 °C" },
];

export function EcranTemperatures() {
  return (
    <Ecran>
      <Barre titre="Températures" retour />
      <div className="flex-1 space-y-2.5 p-3">
        {EQUIPEMENTS.map(({ nom, valeur, anime }) => (
          <div key={nom} className="rounded-xl border-2 border-primary/70 bg-white p-2.5 shadow-sm">
            <p className="mb-2 text-center text-[0.72rem] font-bold">{nom}</p>
            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="flex h-6 w-10 items-center justify-center rounded-md bg-red-400 text-sm font-bold text-white">−</span>
              <span className="flex h-6 w-16 items-center justify-center rounded-md bg-slate-200 text-[0.72rem] font-bold">{valeur}</span>
              <span className="flex h-6 w-10 items-center justify-center rounded-md bg-emerald-500 text-sm font-bold text-white">+</span>
            </div>
            {anime ? (
              <div className="relative h-7 overflow-hidden rounded-md text-[0.68rem] font-bold text-white">
                <span className="absolute inset-0 flex items-center justify-center gap-1 bg-primary">
                  <Check className="h-3.5 w-3.5" /> Enregistrer
                </span>
                <span className="ecran-valide absolute inset-0 flex items-center justify-center gap-1 bg-emerald-500">
                  <Check className="h-3.5 w-3.5" /> Enregistré à 9:41
                </span>
              </div>
            ) : (
              <div className="flex h-7 items-center justify-center gap-1 rounded-md bg-primary text-[0.68rem] font-bold text-white">
                <Check className="h-3.5 w-3.5" /> Enregistrer
              </div>
            )}
          </div>
        ))}
      </div>
    </Ecran>
  );
}

const TACHES = ["Plans de travail", "Planches à découper", "Trancheuse", "Poignées de frigo", "Évier", "Sol", "Poubelles"];

export function EcranNettoyage() {
  return (
    <Ecran>
      <Barre titre="Plan de nettoyage" retour />
      <div className="flex-1 space-y-2 p-3">
        <p className="text-[0.7rem] font-bold uppercase tracking-wide text-primary/70">Zone préparation · Julien</p>
        {TACHES.map((t, i) => (
          <div key={t} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
            <span className="text-[0.72rem] font-semibold">{t}</span>
            <span className="relative flex h-5 w-5 items-center justify-center rounded-md border-2 border-primary/60 bg-white">
              <span
                className="ecran-coche absolute inset-[-2px] flex items-center justify-center rounded-md bg-primary"
                style={{ "--d": `${i * 0.55}s` } as React.CSSProperties}
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </span>
            </span>
          </div>
        ))}
      </div>
    </Ecran>
  );
}

export function EcranEtiquette() {
  return (
    <Ecran>
      <Barre titre="Étiqueteuse" retour />
      <div className="flex flex-1 flex-col gap-3 p-3">
        <div className="rounded-lg bg-white px-3 py-2 text-[0.72rem] shadow-sm">
          <span className="text-slate-500">Préparation</span>
          <p className="font-bold">Sauce béarnaise</p>
        </div>
        <div className="ecran-etiquette rounded-xl border border-dashed border-slate-300 bg-white p-3 font-mono text-[0.68rem] leading-relaxed shadow-md">
          <p className="mb-1 font-sans text-[0.85rem] font-extrabold">SAUCE BÉARNAISE</p>
          <p>Fabriqué le 16/11 · 10:42</p>
          <p className="font-bold">DLC : 18/11</p>
          <p>Lot : L-1611-03</p>
          <p>Allergènes : œufs, lait</p>
          <p>Conserver entre 0 et 3 °C</p>
        </div>
        <div className="ecran-imprimer mt-auto flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary text-[0.75rem] font-bold text-white">
          <Printer className="h-4 w-4" /> Imprimer
        </div>
      </div>
    </Ecran>
  );
}

const CHAMPS = [
  { nom: "Fournisseur", valeur: "Maraîcher Dubois" },
  { nom: "Produit", valeur: "Tomates grappe" },
  { nom: "Lot", valeur: "24-118" },
  { nom: "DLC", valeur: "22/11" },
  { nom: "Température", valeur: "4,1 °C" },
];

export function EcranReception() {
  return (
    <Ecran>
      <Barre titre="Contrôle à réception" retour />
      <div className="flex flex-1 flex-col gap-2.5 p-3">
        <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-xl bg-slate-800 text-white">
          <Camera className="h-7 w-7 opacity-70" />
          <span className="ecran-balayage absolute inset-x-3 h-0.5 rounded bg-secondary shadow-[0_0_12px_2px] shadow-secondary/70" />
        </div>
        {CHAMPS.map(({ nom, valeur }, i) => (
          <div key={nom} className="flex items-center justify-between rounded-lg bg-white px-3 py-1.5 text-[0.72rem] shadow-sm">
            <span className="text-slate-500">{nom}</span>
            <span className="ecran-remplit font-bold" style={{ "--d": `${0.8 + i * 0.35}s` } as React.CSSProperties}>
              {valeur}
            </span>
          </div>
        ))}
        <div className="mt-auto flex h-8 items-center justify-center gap-1.5 rounded-lg bg-emerald-500 text-[0.72rem] font-bold text-white">
          <Check className="h-4 w-4" /> Réception conforme
        </div>
      </div>
    </Ecran>
  );
}
