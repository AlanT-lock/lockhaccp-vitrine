// E-mail d'envoi du PMS (Resend) : lien de téléchargement, dossier zip en
// pièce jointe, mode d'emploi du dossier, invitation à l'essai de LockHACCP.

export interface ContenuCourriel {
  sujet: string;
  html: string;
  texte: string;
}

import { URL_APP } from "./essai.ts";

const DESINSCRIPTION = "mailto:contact@lockhaccp.fr?subject=D%C3%A9sinscription";
const BADGE_APP_STORE = "https://www.lockhaccp.fr/badges/app-store.png";
const BADGE_GOOGLE_PLAY = "https://www.lockhaccp.fr/badges/google-play.png";
const CAUTION =
  "Document réalisé avec l'expertise de SF FORMATION, organisme de formation à l'hygiène alimentaire " +
  "autorisé par la préfecture et certifié Qualiopi.";

const echapper = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

/** `email` : adresse avec laquelle créer le compte pour que le PMS paramètre l'app. */
export function construireCourriel(
  p: { etablissement: string; lien: string; metier: string; email: string },
): ContenuCourriel {
  const nom = echapper(p.etablissement);
  const lien = echapper(p.lien);
  const email = echapper(p.email);
  const sujet = `Votre Plan de Maîtrise Sanitaire — ${p.etablissement}`;

  const html = `<!doctype html>
<html lang="fr"><body style="margin:0;background:#f4f6fa;font-family:Arial,Helvetica,sans-serif;color:#1b2330">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fa;padding:24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden">
<tr><td style="background:#003D85;color:#ffffff;padding:20px 28px;font-size:20px;font-weight:bold">LockHACCP</td></tr>
<tr><td style="padding:28px">
<p style="font-size:16px;margin:0 0 14px">Bonjour, et merci de votre confiance !</p>
<p style="font-size:15px;line-height:1.5;margin:0 0 18px">Voici le dossier du Plan de Maîtrise Sanitaire de <strong>${nom}</strong>, préparé à partir de vos réponses. Vous le trouverez en pièce jointe (fichier .zip) et en téléchargement :</p>
<p style="text-align:center;margin:0 0 22px"><a href="${lien}" style="background:#003D85;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:bold;display:inline-block">Télécharger mon dossier PMS</a></p>
<p style="font-size:13px;color:#6b7686;margin:0 0 22px">Le lien est valable 30 jours.</p>
<p style="font-size:15px;font-weight:bold;margin:0 0 8px">Pour bien l'utiliser</p>
<ol style="font-size:14px;line-height:1.6;margin:0 0 22px;padding-left:20px">
<li>Ouvrez le fichier .zip (double-clic) : il contient votre tableau HACCP, votre plan de nettoyage et deux dossiers.</li>
<li>Imprimez les affiches du dossier « Affichage obligatoire » et affichez-les.</li>
<li>Imprimez chaque mois les fiches du dossier « Traçabilité » et remplissez-les au quotidien.</li>
</ol>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef3fa;border-radius:8px"><tr><td style="padding:18px 20px;font-size:14px;line-height:1.5">
<p style="font-size:17px;font-weight:bold;color:#003D85;margin:0 0 8px">1 mois d'essai offert à l'application LockHACCP</p>
<p style="margin:0 0 10px;font-weight:bold;color:#003D85">Votre essai démarre seulement le jour où vous créez votre compte.</p>
<p style="margin:0 0 10px">Relevés de température, plan de nettoyage et traçabilité, sur tablette ou téléphone, sans papier.</p>
<p style="margin:0 0 14px">Créez votre compte avec la même adresse e-mail (<strong>${email}</strong>) : votre PMS servira directement à paramétrer l'application.</p>
<a href="${URL_APP}" style="display:inline-block;margin-right:8px"><img src="${BADGE_APP_STORE}" alt="Télécharger dans l'App Store" height="44" style="height:44px;border:0"></a>
<a href="${URL_APP}" style="display:inline-block"><img src="${BADGE_GOOGLE_PLAY}" alt="Disponible sur Google Play" height="44" style="height:44px;border:0"></a>
<p style="margin:10px 0 0;font-size:12px"><a href="${URL_APP}" style="color:#003D85">${URL_APP}</a></p>
</td></tr></table>
</td></tr>
<tr><td style="padding:18px 28px;border-top:1px solid #e3e8ef;font-size:11px;color:#6b7686;line-height:1.5">
${CAUTION}<br>
Vous recevez cet e-mail parce que vous avez demandé votre PMS sur lockhaccp.fr. <a href="${DESINSCRIPTION}" style="color:#6b7686">Désinscription</a>
</td></tr>
</table>
</td></tr></table>
</body></html>`;

  const texte = [
    "Bonjour, et merci de votre confiance !",
    "",
    `Voici le dossier du Plan de Maîtrise Sanitaire de ${p.etablissement}, préparé à partir de vos réponses.`,
    "Vous le trouverez en pièce jointe (fichier .zip) et en téléchargement (lien valable 30 jours) :",
    p.lien,
    "",
    "Pour bien l'utiliser :",
    "1. Ouvrez le fichier .zip (double-clic) : il contient votre tableau HACCP, votre plan de nettoyage et deux dossiers.",
    "2. Imprimez les affiches du dossier « Affichage obligatoire » et affichez-les.",
    "3. Imprimez chaque mois les fiches du dossier « Traçabilité » et remplissez-les au quotidien.",
    "",
    "1 mois d'essai offert à l'application LockHACCP.",
    "Votre essai démarre seulement le jour où vous créez votre compte.",
    `Créez votre compte avec la même adresse e-mail (${p.email}) : votre PMS servira directement à paramétrer l'application.`,
    `Télécharger l'application (iPhone, iPad, Android) : ${URL_APP}`,
    "",
    CAUTION,
    "Désinscription : écrivez à contact@lockhaccp.fr",
  ].join("\n");

  return { sujet, html, texte };
}

/** Envoi par l'API HTTP de Resend, dossier zip en pièce jointe. Lève une erreur si l'envoi échoue. */
export async function envoyerCourriel(
  cle: string,
  de: string,
  a: string,
  contenu: ContenuCourriel,
  piece: Uint8Array,
  nomFichier: string,
  delaiMs = 8000,
): Promise<void> {
  let binaire = "";
  for (let i = 0; i < piece.length; i += 0x8000) binaire += String.fromCharCode(...piece.subarray(i, i + 0x8000));
  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${cle}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: de,
      to: [a],
      subject: contenu.sujet,
      html: contenu.html,
      text: contenu.texte,
      attachments: [{ filename: nomFichier, content: btoa(binaire) }],
    }),
    signal: AbortSignal.timeout(delaiMs),
  });
  if (!reponse.ok) throw new Error(`Resend ${reponse.status} : ${await reponse.text()}`);
}
