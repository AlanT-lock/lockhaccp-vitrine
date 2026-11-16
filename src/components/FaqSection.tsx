import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}

// Questions fréquentes (8 pages) : titre à gauche, questions à droite sur grand écran.
// Les réponses restent dans le HTML même repliées (robots, FAQ JSON-LD cohérente).
export function FaqSection({
  items,
  title = "Questions fréquentes",
  description,
}: {
  items: FaqItem[];
  title?: string;
  description?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-secondary-texte">FAQ</p>
              <h2 className="font-heading text-[clamp(1.9rem,3.6vw,2.9rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-foreground">
                {title}
              </h2>
              {description && <p className="mt-4 text-lg text-muted-foreground">{description}</p>}
              <div className="mt-8 rounded-2xl bg-[hsl(220_33%_97%)] p-5">
                <p className="font-semibold text-foreground">Une autre question ?</p>
                <p className="mt-1 text-sm text-muted-foreground">Nous répondons sous 24 h, par e-mail ou par téléphone.</p>
                <Link to="/contact" className="group mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Nous contacter
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-border">
              {items.map((item, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div key={item.question} className="border-b border-border">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span
                        className={cn(
                          "font-heading text-lg font-bold transition-colors sm:text-xl",
                          isOpen ? "text-primary" : "text-foreground group-hover:text-primary",
                        )}
                      >
                        {item.question}
                      </span>
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                          isOpen ? "rotate-45 border-primary bg-primary text-white" : "border-border text-primary group-hover:border-primary",
                        )}
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                    <div className={cn("grid transition-all duration-300", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-6 pr-14 leading-relaxed text-muted-foreground">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
