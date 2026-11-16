// Bandeau défilant des métiers couverts (les 9 métiers du générateur de PMS).
const METIERS = [
  "Restaurants",
  "Restauration collective",
  "Traiteurs",
  "Boulangeries-pâtisseries",
  "Boucheries-charcuteries",
  "Poissonneries",
  "Crèmeries-fromageries",
  "Épiceries et primeurs",
  "Glaciers-chocolatiers",
];

export function BandeauMetiers() {
  return (
    <section aria-label="Métiers couverts" className="border-y border-border py-6">
      <p className="sr-only">LockHACCP s'adapte à votre métier : {METIERS.join(", ")}.</p>
      <div aria-hidden="true" className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <div className="defilement-metiers flex w-max items-center gap-10 pr-10">
          {[...METIERS, ...METIERS].map((m, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap font-heading text-lg font-bold text-foreground/70 sm:text-xl">
              {m}
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
