// Essai offert avec le PMS : 2 mois à compter de la demande (même calcul que
// le serveur, supabase/functions/_shared/pms/essai.ts ; la base garantit en
// plus au moins 1 mois à partir du démarrage de l'essai dans l'app).
export function finEssaiOfferte(datePms: Date): Date {
  const fin = new Date(datePms);
  const jour = fin.getDate();
  fin.setDate(1);
  fin.setMonth(fin.getMonth() + 2);
  const dernierJour = new Date(fin.getFullYear(), fin.getMonth() + 1, 0).getDate();
  fin.setDate(Math.min(jour, dernierJour));
  return fin;
}

export const dateFr = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
