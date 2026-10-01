import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const racine = document.getElementById("root")!;
// Pages pré-générées : on reprend le HTML existant. Admin et développement : rendu complet.
if (racine.hasChildNodes()) {
  hydrateRoot(racine, <App />);
} else {
  createRoot(racine).render(<App />);
}
