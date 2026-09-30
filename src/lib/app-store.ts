// Liens vers l'application LockHACCP sur les stores, et choix du bon store
// selon l'appareil (page /app, QR code du PMS, e-mails).
export const LIEN_APP_STORE = "https://apps.apple.com/fr/app/lockhaccp/id6747192726";
export const LIEN_GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=fr.lockhaccp.app";

/**
 * Store à ouvrir pour cet appareil, ou null sur ordinateur (page de choix).
 * `pointsDeContact` = navigator.maxTouchPoints : un iPad récent se présente
 * comme un Mac, mais avec un écran tactile.
 */
export function storePourAgent(agent: string, pointsDeContact: number): string | null {
  if (/android/i.test(agent)) return LIEN_GOOGLE_PLAY;
  if (/iphone|ipad|ipod/i.test(agent)) return LIEN_APP_STORE;
  if (/macintosh/i.test(agent) && pointsDeContact > 1) return LIEN_APP_STORE;
  return null;
}
