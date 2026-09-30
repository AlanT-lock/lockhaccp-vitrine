// QR code et badges officiels des stores pour installer l'application
// LockHACCP. Le QR code (ordinateur) mène à /app, qui choisit le bon store.
import { LIEN_APP_STORE, LIEN_GOOGLE_PLAY } from "@/lib/app-store";

export function BlocApplication(props: { qr?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
      {props.qr !== false && (
        <div className="hidden sm:flex flex-col items-center gap-1">
          <img src="/qr-app.svg" alt="QR code pour télécharger l'application LockHACCP" width={120} height={120}
            className="rounded-lg border border-border bg-white p-1" />
          <span className="text-xs text-muted-foreground">Scannez avec votre téléphone</span>
        </div>
      )}
      <div className="flex flex-col gap-3 items-center">
        <a href={LIEN_APP_STORE} target="_blank" rel="noreferrer" aria-label="Télécharger dans l'App Store">
          <img src="/badges/app-store.svg" alt="Télécharger dans l'App Store" height={48} className="h-12 w-auto" />
        </a>
        <a href={LIEN_GOOGLE_PLAY} target="_blank" rel="noreferrer" aria-label="Disponible sur Google Play">
          <img src="/badges/google-play.png" alt="Disponible sur Google Play" height={48} className="h-12 w-auto" />
        </a>
      </div>
    </div>
  );
}
