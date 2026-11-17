// supabase/functions/_shared/pms/referentiel.ts
import { AFFICHES } from "./affiches.ts";
import { TYPES_EQUIPEMENTS_FROIDS } from "./equipements.ts";
import { LIGNES_CCP } from "./ccp.ts";
import { METIERS } from "./metiers.ts";
import { QUESTIONS } from "./questions.ts";
import { REGISTRES } from "./registres.ts";
import type { Referentiel } from "./types.ts";

export const REFERENTIEL: Referentiel = {
  version: "2026.3",
  metiers: METIERS,
  questions: QUESTIONS,
  affiches: AFFICHES,
  ccp: LIGNES_CCP,
  registres: REGISTRES,
  typesEquipementsFroids: TYPES_EQUIPEMENTS_FROIDS,
};
