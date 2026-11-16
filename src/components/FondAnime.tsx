// Fond de tout le site : blanc uni, avec des halos néon bleus et orange qui dérivent lentement.
// Fixé derrière le contenu (les sections sont transparentes), sans interaction.
// Dégradés radiaux sans filtre de flou, et seule la position est animée (composition GPU) :
// pas d'effet sur la vitesse d'affichage. Immobile si « réduire les animations » est activé.
import { useLocation } from "react-router-dom";

const HALOS = ["halo-bleu-1", "halo-orange-1", "halo-bleu-2", "halo-orange-2"];

export function FondAnime() {
  // L'administration et le générateur de PMS gardent un fond blanc uni.
  const chemin = useLocation().pathname;
  if (chemin.startsWith("/admin") || chemin === "/pms" || chemin.startsWith("/pms/")) return null;
  return (
    <div aria-hidden="true" className="fond-anime pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white">
      {HALOS.map((h) => (
        <span key={h} className={`halo ${h}`} />
      ))}
    </div>
  );
}
