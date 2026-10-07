// Exemple de planning de nettoyage d'une cuisine de restaurant, tiré des zones
// et surfaces que propose le générateur de PMS (mêmes données, jamais recopiées).
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZONES_PROPOSEES, type Frequence } from "@/lib/pms/genere/suggestions";

const COLONNES: { frequence: Frequence; libelle: string }[] = [
  { frequence: "Quotidien", libelle: "Chaque jour" },
  { frequence: "Hebdo", libelle: "Chaque semaine" },
  { frequence: "Mensuel", libelle: "Chaque mois" },
];

// Zones présentes dans presque tous les restaurants, surfaces courantes uniquement.
const ZONES = ZONES_PROPOSEES.restauration_commerciale
  .filter((z) => z.precochee && z.surfaces.length > 0)
  .map((z) => ({ nom: z.nom, surfaces: z.surfaces.filter((s) => s.courante) }));

export function PlanningNettoyageExemple() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Exemple de planning de nettoyage en cuisine
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Voici les surfaces que LockHACCP propose par défaut pour un restaurant, rangées par fréquence. Partez de cette
            base et adaptez-la à vos locaux : un planning qui ne correspond pas à votre cuisine ne sera pas suivi.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th scope="col" className="p-4 font-semibold text-foreground">Zone</th>
                  {COLONNES.map((c) => (
                    <th key={c.frequence} scope="col" className="p-4 font-semibold text-foreground">{c.libelle}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ZONES.map((z) => (
                  <tr key={z.nom} className="border-b border-border last:border-0 align-top">
                    <th scope="row" className="p-4 font-medium text-foreground">{z.nom}</th>
                    {COLONNES.map((c) => (
                      <td key={c.frequence} className="p-4 text-muted-foreground">
                        {z.surfaces.filter((s) => s.frequence === c.frequence).map((s) => s.nom).join(", ") || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-muted-foreground">
            Planches à découper et plans de travail se nettoient en plus après chaque usage. Pour obtenir votre propre plan,
            avec le type de produit adapté à chaque surface et une fiche de suivi par zone, générez votre Plan de Maîtrise
            Sanitaire gratuitement.
          </p>
          <Button variant="hero" size="lg" className="mt-6" asChild>
            <Link to="/pms">
              Générer mon plan de nettoyage gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
