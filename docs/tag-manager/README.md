# Conversions Google Ads via Google Tag Manager

Le site ne parle plus directement à Google Ads pour les conversions : il signale chaque action
importante à Google Tag Manager (conteneur `GTM-TZPVKN3W`), qui transmet à Google Ads.
Code : `src/lib/conversions.ts`. Rien n'est signalé sans l'accord du visiteur pour la publicité
(bandeau cookies).

## Événements envoyés par le site

| Événement (dataLayer)       | Quand                                                        | Détail envoyé                       |
| --------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| `conversion_pms_commence`   | Choix du métier, 1re étape du PMS (1 fois par page)         |                                     |
| `conversion_pms_genere`     | Dossier PMS créé (1 fois par page)                           |                                     |
| `conversion_demo`           | Formulaire « Demander une démo » envoyé                      |                                     |
| `conversion_contact`        | Formulaire de contact envoyé                                 | `formulaire` : `info` / `entreprise` |
| `conversion_inscription`    | Clic vers app.lockhaccp.fr (sauf les liens « Connexion »)    |                                     |
| `conversion_app`            | Clic vers l'App Store ou Google Play                         | `store` : `app_store` / `google_play` |
| `conversion_telephone`      | Clic sur un numéro de téléphone                              |                                     |
| `conversion_email`          | Clic sur une adresse e-mail                                  |                                     |

## Mise en place

Seules les 2 conversions PMS partent vers Google Ads (les mêmes qu'avant : historique et
apprentissage conservés). Les autres événements arrivent dans Tag Manager mais ne sont
transmis à aucun outil tant qu'aucune balise ne les utilise (ex. Google Analytics 4 plus tard).

### 1. Tag Manager : importer les balises PMS

1. **Administration > Importer un conteneur**, choisir `docs/tag-manager/conversions-gtm.json`.
2. Espace de travail : **Existant** (Default Workspace), option **Fusionner > Renommer les
   éléments en conflit**, puis **Confirmer**.

Cela crée 2 balises « Suivi des conversions Google Ads » (PMS commencé, PMS généré), déjà
remplies (ID `18490045299` et libellés actuels) et leurs 2 déclencheurs. Pas de « Conversion Linker » : il se déclenchait sur toutes les pages
avant tout accord (requête sans cookie vers Google), et la balise Google du site fait déjà ce
travail après accord.

### 2. Publier, dans cet ordre

1. **Publier le conteneur Tag Manager d'abord** (bouton « Envoyer »). Tant que l'ancien site est
   en ligne, ces balises ne se déclenchent jamais : il n'envoie pas encore ces événements.
2. **Puis mettre en ligne le site** (fusion de la branche). Les conversions PMS passent alors
   par Tag Manager sans trou ni double comptage.

### 3. Vérifier

Dans Tag Manager, **Prévisualiser** sur `https://lockhaccp.fr`, accepter les cookies, puis
lancer un PMS : l'événement `conversion_pms_commence` apparaît à gauche et la balise
« Google Ads - PMS commencé » dans « Balises déclenchées ».
