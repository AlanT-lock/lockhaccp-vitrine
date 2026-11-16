// Page /app : envoie directement vers l'App Store ou Google Play selon le
// téléphone (QR code du PMS, e-mails) ; sur ordinateur, propose les deux.
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { BlocApplication } from "@/components/BlocApplication";
import { storePourAgent } from "@/lib/app-store";
import { Smartphone } from "lucide-react";
import { Accent } from "@/components/design/elements";
import { Telephone3D } from "@/components/accueil/Telephone3D";
import { VIDEOS_APP, VIDEO_HAUTEUR, VIDEO_LARGEUR } from "@/lib/videos-app";

const TelechargerApp = () => {
  useEffect(() => {
    const store = storePourAgent(navigator.userAgent, navigator.maxTouchPoints ?? 0);
    if (store) window.location.replace(store);
  }, []);

  return (
    <div className="min-h-screen">
      <Seo title="Télécharger l'application LockHACCP" description="Installez l'application LockHACCP sur iPhone, iPad ou Android pour vos relevés HACCP : températures, réceptions, nettoyage, traçabilité." path="/app" noindex />
      <Navbar />
      <main className="pb-24 pt-28 sm:pt-32 lg:pb-32 lg:pt-36">
        <div className="container mx-auto grid grid-cols-1 items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="text-center lg:col-span-7 lg:text-left">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/70 px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
              <Smartphone className="h-4 w-4" />
              iPhone, iPad et Android
            </p>
            <h1 className="font-heading text-[clamp(2.2rem,4.8vw,3.8rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-foreground">
              Téléchargez <Accent>l'application LockHACCP</Accent>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">Disponible sur iPhone, iPad et Android.</p>
            <div className="mt-8 inline-block rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_40px_80px_-45px_hsl(211_100%_20%/0.5)] sm:p-8">
              <BlocApplication />
            </div>
          </div>
          <div className="mx-auto w-[13rem] sm:w-[15rem] lg:col-span-5 lg:w-[16.5rem]">
            <Telephone3D inclinaison="droite" suivreSouris>
              <img
                src={VIDEOS_APP.tour.cle}
                alt="Écran des températures de l'application LockHACCP : réfrigérateur de cuisine à 3 °C, conforme"
                width={VIDEO_LARGEUR}
                height={VIDEO_HAUTEUR}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            </Telephone3D>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TelechargerApp;
