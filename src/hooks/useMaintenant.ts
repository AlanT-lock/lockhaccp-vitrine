import { useEffect, useState } from "react";
import { instantDeRendu } from "@/lib/maintenant";

/**
 * Instant à utiliser pour un rendu qui dépend de la date : celui de la construction
 * pendant l'hydratation (rendu identique au HTML pré-généré), l'heure réelle ensuite.
 */
export function useMaintenant(): Date {
  const [maintenant, setMaintenant] = useState(() => instantDeRendu());
  useEffect(() => setMaintenant(new Date()), []);
  return maintenant;
}
