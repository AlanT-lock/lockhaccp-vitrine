import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// Zones d'affichage des notifications (formulaires de contact, admin).
// Chargées à part, après l'affichage de la page (voir App.tsx).
const Notifications = () => (
  <>
    <Toaster />
    <Sonner />
  </>
);

export default Notifications;
