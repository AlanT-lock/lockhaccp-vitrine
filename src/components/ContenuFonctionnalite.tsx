// Sections communes des pages /fonctionnalites/* : réglementation, contenu
// propre à la page (facultatif), comparatif papier / application, FAQ.
import type { ReactNode } from "react";
import { FaqSection } from "@/components/FaqSection";
import { SectionComparatif, SectionReglementation } from "@/components/SectionsContenu";
import { CONTENUS, type IdFonctionnalite } from "@/lib/contenus-fonctionnalites";

export function ContenuFonctionnalite({ id, children }: { id: IdFonctionnalite; children?: ReactNode }) {
  const c = CONTENUS[id];
  return (
    <>
      <SectionReglementation {...c.reglementation} />
      {children}
      <SectionComparatif {...c.comparatif} />
      <FaqSection items={c.faq.items} title={c.faq.titre} />
    </>
  );
}
