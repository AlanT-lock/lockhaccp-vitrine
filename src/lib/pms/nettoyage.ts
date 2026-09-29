// Logique du questionnaire du nettoyage (sans interface) : zones proposées selon
// le métier (précochées ou facultatives), surfaces proposées selon la zone
// (courantes précochées), zones et surfaces personnalisées. La réponse garde le
// format du référentiel : [{ nom, surfaces: [{ nom, frequence }] }].
import { ZONES_PROPOSEES, type Frequence, type ZoneProposee } from "./genere/suggestions";
import type { ElementListe, MetierId } from "./genere/types";

export const FREQUENCES: Frequence[] = ["Quotidien", "Hebdo", "Mensuel"];

const memeNom = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const surfacesDe = (z: ElementListe) => (Array.isArray(z.surfaces) ? (z.surfaces as ElementListe[]) : []);

export function zonesProposees(metier: MetierId): ZoneProposee[] {
  return ZONES_PROPOSEES[metier] ?? [];
}

/** Surfaces du catalogue pour une zone (vide pour une zone personnalisée). */
export function surfacesProposees(metier: MetierId, nomZone: string) {
  return zonesProposees(metier).find((z) => memeNom(z.nom, nomZone))?.surfaces ?? [];
}

const versReponse = (z: ZoneProposee): ElementListe => ({
  nom: z.nom,
  surfaces: z.surfaces.filter((s) => s.courante).map((s) => ({ nom: s.nom, frequence: s.frequence })),
});

export function zonesInitiales(metier: MetierId): ElementListe[] {
  return zonesProposees(metier).filter((z) => z.precochee).map(versReponse);
}

/** Coche (avec ses surfaces courantes) ou décoche une zone du catalogue, dans l'ordre du catalogue. */
export function basculerZone(zones: ElementListe[], metier: MetierId, nom: string, cochee: boolean): ElementListe[] {
  const sans = zones.filter((z) => !memeNom(z.nom, nom));
  if (!cochee) return sans;
  const proposee = zonesProposees(metier).find((z) => memeNom(z.nom, nom));
  if (!proposee) return zones;
  const ordre = (z: ElementListe) => {
    const i = zonesProposees(metier).findIndex((p) => memeNom(p.nom, z.nom));
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return [...sans, versReponse(proposee)].sort((a, b) => ordre(a) - ordre(b));
}

export function ajouterZonePerso(zones: ElementListe[], nom: string): ElementListe[] {
  const propre = nom.trim();
  if (!propre || zones.some((z) => memeNom(z.nom, propre))) return zones;
  return [...zones, { nom: propre, surfaces: [] }];
}

export function renommerZone(zones: ElementListe[], ancien: string, nouveau: string): ElementListe[] {
  return zones.map((z) => (z.nom === ancien ? { ...z, nom: nouveau } : z));
}

/** Coche ou décoche une surface du catalogue dans une zone. */
export function basculerSurface(zone: ElementListe, metier: MetierId, nom: string, cochee: boolean): ElementListe {
  const sans = surfacesDe(zone).filter((s) => !memeNom(s.nom, nom));
  if (!cochee) return { ...zone, surfaces: sans };
  const proposee = surfacesProposees(metier, zone.nom).find((s) => memeNom(s.nom, nom));
  const ajout = { nom: proposee?.nom ?? nom, frequence: proposee?.frequence ?? "Quotidien" };
  const ordre = (s: ElementListe) => {
    const i = surfacesProposees(metier, zone.nom).findIndex((p) => memeNom(p.nom, s.nom));
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };
  return { ...zone, surfaces: [...sans, ajout].sort((a, b) => ordre(a) - ordre(b)) };
}

export function ajouterSurfacePerso(zone: ElementListe, nom: string): ElementListe {
  const propre = nom.trim();
  if (!propre || surfacesDe(zone).some((s) => memeNom(s.nom, propre))) return zone;
  return { ...zone, surfaces: [...surfacesDe(zone), { nom: propre, frequence: "Quotidien" }] };
}

export function changerFrequence(zone: ElementListe, nom: string, frequence: Frequence): ElementListe {
  return { ...zone, surfaces: surfacesDe(zone).map((s) => (s.nom === nom ? { ...s, frequence } : s)) };
}
