// Fonction Edge `generer-pms` : reçoit les réponses du questionnaire de
// lockhaccp.fr/pms, produit le dossier PMS (zip de PDF), l'enregistre, l'envoie par e-mail
// et crée ou met à jour le prospect dans Closera. `?apercu=1` : résumé seul.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { enTetesCors } from "../_shared/pms/cors_pms.ts";
import { envoyerProspect } from "../_shared/pms/closera.ts";
import { envoyerCourriel } from "../_shared/pms/courriel.ts";
import { rendrePdf } from "../_shared/pms/pdf/rendu.ts";
import { lienAvecNom } from "../_shared/pms/dossier.ts";
import { ipClient, lireCorps } from "../_shared/pms/requete.ts";
import { type Dependances, type Quota, traiterDemande } from "../_shared/pms/traitement.ts";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const RESEND_FROM_EMAIL = Deno.env.get("RESEND_FROM_EMAIL") ?? "LockHACCP <contact@lockhaccp.fr>";
const CLOSERA_API_URL = Deno.env.get("CLOSERA_API_URL") ?? "https://closera.fr/api/extension/leads";
const CLOSERA_API_TOKEN = Deno.env.get("CLOSERA_API_TOKEN") ?? "";
const TRENTE_JOURS = 60 * 60 * 24 * 30;

const deps: Dependances = {
  async reserverQuota(ip, email) {
    const { data, error } = await supabase.rpc("pms_reserver_quota", { p_ip: ip, p_email: email });
    if (error) throw error;
    return data as Quota;
  },
  async enregistrer(ligne) {
    const { data, error } = await supabase.from("pms_demandes").insert(ligne).select("id").single();
    if (error) throw error;
    return data.id as string;
  },
  async televerser(chemin, fichier) {
    const { error } = await supabase.storage.from("pms").upload(chemin, fichier, { contentType: "application/zip", upsert: true });
    if (error) throw error;
  },
  async lienSigne(chemin, nomTelechargement) {
    const { data, error } = await supabase.storage.from("pms").createSignedUrl(chemin, TRENTE_JOURS);
    if (error) throw error;
    return lienAvecNom(data.signedUrl, nomTelechargement);
  },
  async mettreAJour(id, champs) {
    const { error } = await supabase.from("pms_demandes").update(champs).eq("id", id);
    if (error) throw error;
  },
  envoyerCourriel: (a, contenu, piece, nomFichier) =>
    envoyerCourriel(RESEND_API_KEY, RESEND_FROM_EMAIL, a, contenu, piece, nomFichier),
  envoyerProspect: (prospect) => {
    if (!CLOSERA_API_TOKEN) return Promise.reject(new Error("Closera : secret CLOSERA_API_TOKEN absent"));
    return envoyerProspect(CLOSERA_API_URL, CLOSERA_API_TOKEN, prospect);
  },
  rendrePdf,
  maintenant: () => new Date(),
};

Deno.serve(async (req) => {
  const cors = enTetesCors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return new Response("Méthode non autorisée", { status: 405, headers: cors });

  const json = (corps: unknown, statut: number) =>
    new Response(JSON.stringify(corps), { status: statut, headers: { ...cors, "Content-Type": "application/json" } });

  const corps = await lireCorps(req);
  if (!corps.ok) return json({ message: corps.message }, corps.statut);
  const entree = corps.valeur;
  const ip = ipClient(req.headers);
  const apercu = new URL(req.url).searchParams.get("apercu") === "1";

  try {
    const r = await traiterDemande(entree, ip, deps, { apercu });
    return json(r, r.statut);
  } catch (e) {
    console.error("[generer-pms]", e);
    return json({ message: "Une erreur est survenue pendant la génération de votre PMS. Réessayez dans quelques minutes." }, 500);
  }
});
