import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { suivreClicsConversions } from "./lib/conversions";
import { noterProvenance } from "./lib/provenance";

// Avant tout rendu : la première navigation interne efface les paramètres de l'adresse d'arrivée.
noterProvenance();

const racine = document.getElementById("root")!;
// Pages pré-générées : on reprend le HTML existant. Admin et développement : rendu complet.
if (racine.hasChildNodes()) {
  hydrateRoot(racine, <App />);
} else {
  createRoot(racine).render(<App />);
}
suivreClicsConversions();
