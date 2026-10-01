import { useEffect, useState } from "react";

/**
 * Faux au rendu serveur et au premier rendu navigateur (hydratation), vrai ensuite.
 * À utiliser pour tout affichage qui dépend de l'heure ou de l'appareil du visiteur,
 * afin que le HTML pré-généré et le premier rendu navigateur soient identiques.
 */
export function useApresMontage(): boolean {
  const [monte, setMonte] = useState(false);
  useEffect(() => setMonte(true), []);
  return monte;
}
