// Phrase de maillage interne placée dans le corps d'une page produit.
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export function LienContextuel({ to, ancre, children }: { to: string; ancre: string; children: ReactNode }) {
  return (
    <section className="pb-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="max-w-4xl mx-auto text-muted-foreground">
          {children}{" "}
          <Link to={to} className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
            {ancre}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
