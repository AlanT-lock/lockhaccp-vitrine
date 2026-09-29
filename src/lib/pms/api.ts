// Appels à la fonction Edge `generer-pms` (projet Supabase de l'app LockHACCP).
import { VERSION_REFERENTIEL } from "./genere/version";
import type { Reponses } from "./genere/types";

const URL_FONCTION = "https://ndoxvlikhmmixvhuqczs.supabase.co/functions/v1/generer-pms";
const CLE_ANON = import.meta.env.VITE_LOCKHACCP_APP_ANON_KEY as string | undefined;

export interface Resume {
  affiches: number;
  ccp: number;
  registres: number;
}

export class ErreurPms extends Error {
  constructor(public statut: number, message: string) {
    super(message);
  }
}

async function appeler(reponses: Reponses, apercu: boolean, siteWeb = ""): Promise<{ lien: string; resume: Resume }> {
  let reponse: Response;
  try {
    reponse = await fetch(`${URL_FONCTION}${apercu ? "?apercu=1" : ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(CLE_ANON ? { apikey: CLE_ANON, Authorization: `Bearer ${CLE_ANON}` } : {}),
      },
      body: JSON.stringify({ version: VERSION_REFERENTIEL, reponses, site_web: siteWeb }),
    });
  } catch {
    throw new ErreurPms(0, "Connexion impossible. Vérifiez votre accès à Internet et réessayez.");
  }
  const corps = await reponse.json().catch(() => ({}));
  if (!reponse.ok) {
    const message = reponse.status === 409
      ? "Le questionnaire a été mis à jour : rechargez la page (vos réponses sont conservées)."
      : (corps.message as string) || "Une erreur est survenue. Réessayez dans quelques minutes.";
    throw new ErreurPms(reponse.status, message);
  }
  return { lien: corps.lien as string, resume: corps.resume as Resume };
}

export const obtenirApercu = (reponses: Reponses) => appeler(reponses, true).then((r) => r.resume);
/** `siteWeb` : champ piège invisible, rempli seulement par les robots. */
export const genererPms = (reponses: Reponses, siteWeb: string) => appeler(reponses, false, siteWeb);
