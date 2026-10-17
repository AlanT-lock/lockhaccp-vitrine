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

### 1. Google Ads : créer les 5 nouvelles conversions

Les 2 conversions PMS existent déjà : on garde les mêmes (historique et apprentissage conservés).

Dans Google Ads : **Objectifs > Conversions > Récapitulatif > + Nouvelle action de conversion >
Site Web**, saisir `lockhaccp.fr`, puis **Ajouter une action de conversion manuellement**.
Pour chacune, à la fin, choisir **Utiliser Google Tag Manager** et noter le **libellé de
conversion** affiché (l'ID est toujours `18490045299`).

| Nom à donner                     | Catégorie                  | Valeur | Comptabilisation | Rôle        |
| -------------------------------- | -------------------------- | ------ | ---------------- | ----------- |
| Demande de démo                  | Envoi de formulaire pour prospects | 1 €    | Une              | Principale  |
| Formulaire de contact            | Envoi de formulaire pour prospects | 1 €    | Une              | Principale  |
| Clic inscription                 | Inscription                | 1 €    | Une              | Secondaire  |
| Téléchargement app               | Téléchargement             | 1 €    | Une              | Secondaire  |
| Contact direct (tél. / e-mail)   | Contact                    | 1 €    | Une              | Secondaire  |

« Principale » = utilisée par Google pour optimiser les enchères ; « Secondaire » = visible
dans les rapports seulement. Un clic n'est qu'une intention : mieux vaut ne pas laisser Google
optimiser dessus. Les valeurs peuvent être ajustées plus tard (ex. une démo vaut plus qu'un clic).

### 2. Tag Manager : importer les balises

1. **Administration > Importer un conteneur**, choisir `docs/tag-manager/conversions-gtm.json`.
2. Espace de travail : **Existant** (Default Workspace), option **Fusionner > Renommer les
   éléments en conflit**, puis **Confirmer**.
3. Dans **Balises**, ouvrir les 5 balises dont le libellé vaut `LIBELLE_..._A_REMPLACER` et
   coller le libellé noté à l'étape 1. Les 2 balises PMS et le « Conversion Linker » sont prêts.

Cela crée 7 balises « Suivi des conversions Google Ads », leurs 7 déclencheurs
(« Événement personnalisé ») et un Conversion Linker.

### 3. Publier, dans cet ordre

1. **Publier le conteneur Tag Manager d'abord** (bouton « Envoyer »). Tant que l'ancien site est
   en ligne, ces balises ne se déclenchent jamais : il n'envoie pas encore ces événements.
2. **Puis mettre en ligne le site** (fusion de la branche). Les conversions PMS passent alors
   par Tag Manager sans trou ni double comptage.

### 4. Vérifier

Dans Tag Manager, **Prévisualiser** sur `https://lockhaccp.fr`, accepter les cookies, puis
lancer un PMS, envoyer un formulaire, cliquer sur un bouton d'inscription : l'événement
`conversion_...` apparaît à gauche et la balise correspondante dans « Balises déclenchées ».
Dans Google Ads, l'état des conversions passe à « Enregistrement des conversions » sous 24 h.
