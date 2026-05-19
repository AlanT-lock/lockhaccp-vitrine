import { ShieldCheck, MapPin, Lock, Sparkles } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    label: "Conforme DDPP",
    description: "Méthode HACCP",
  },
  {
    icon: Lock,
    label: "RGPD",
    description: "Données 100% sécurisées",
  },
  {
    icon: MapPin,
    label: "Hébergement Europe",
    description: "Vos données ne sortent pas",
  },
  {
    icon: Sparkles,
    label: "Sans engagement",
    description: "3 mois d'essai gratuit",
  },
];

export function TrustBadges({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";

  return (
    <div
      className={`flex flex-wrap items-center justify-center gap-6 sm:gap-10 ${className}`}
    >
      {BADGES.map(({ icon: Icon, label, description }) => (
        <div key={label} className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              isDark ? "bg-primary-foreground/10" : "bg-primary-light"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${isDark ? "text-primary-foreground" : "text-primary"}`}
            />
          </div>
          <div className="text-left">
            <div
              className={`text-sm font-semibold ${
                isDark ? "text-primary-foreground" : "text-foreground"
              }`}
            >
              {label}
            </div>
            <div
              className={`text-xs ${
                isDark ? "text-primary-foreground/70" : "text-muted-foreground"
              }`}
            >
              {description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
