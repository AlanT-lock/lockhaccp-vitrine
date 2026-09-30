// Page /app : envoie directement vers l'App Store ou Google Play selon le
// téléphone (QR code du PMS, e-mails) ; sur ordinateur, propose les deux.
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Seo } from "@/components/Seo";
import { BlocApplication } from "@/components/BlocApplication";
import { storePourAgent } from "@/lib/app-store";

const TelechargerApp = () => {
  useEffect(() => {
    const store = storePourAgent(navigator.userAgent, navigator.maxTouchPoints ?? 0);
    if (store) window.location.replace(store);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Seo title="Télécharger l'application LockHACCP" description="Installez LockHACCP sur iPhone, iPad ou Android." path="/app" />
      <Navbar />
      <main className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 max-w-xl text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Téléchargez l'application LockHACCP</h1>
          <p className="text-muted-foreground">Disponible sur iPhone, iPad et Android.</p>
          <BlocApplication />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TelechargerApp;
