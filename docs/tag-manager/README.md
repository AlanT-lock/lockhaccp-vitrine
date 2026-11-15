# Conversions Google Ads et GA4 via Google Tag Manager

Le site ne parle pas directement à Google pour les conversions : il signale chaque action
importante à Google Tag Manager (conteneur `GTM-TZPVKN3W`), qui transmet à Google Ads et à
Google Analytics 4. Code : `src/lib/conversions.ts`.

## Consentement (bandeau cookies)

- Le site ne pousse rien dans `dataLayer` sans accord pour la **mesure** ou la **publicité**.
  Avant la réponse au bandeau, les conversions attendent en mémoire (envoyées après un accord,
  oubliées sinon).
- Chaque balise GTM vérifie ensuite sa propre finalité (« Exiger une autorisation
  supplémentaire ») : les balises **Google Ads** exigent `ad_storage`, les balises **GA4**
  `analytics_storage`. Un visiteur qui n'accepte que la mesure est donc compté dans GA4, jamais
  dans Google Ads.

## État du conteneur (depuis la version 6, novembre 2026)

| Balise                                | Déclencheur                                   | Consentement exigé  |
| ------------------------------------- | --------------------------------------------- | ------------------- |
| GA4 - Balise Google (`G-TK28FGXHXC`)  | Initialisation + `lhc_consentement`           | `analytics_storage` |
| GA4 - page_view (changement de page)  | Changement d'historique                       | `analytics_storage` |
| GA4 - Conversions du site             | Événements `conversion_*` (nom = `{{Event}}`, paramètres `formulaire`, `store`) | `analytics_storage` |
| Google Ads - PMS commencé / généré    | `conversion_pms_commence` / `conversion_pms_genere` | `ad_storage`  |

Dans GA4 (propriété 515170580), la mesure améliorée « changements de page basés sur
l'historique » est désactivée : c'est la balise page_view ci-dessus qui compte les pages
(site à page unique). Événements clés GA4 : `conversion_pms_genere`, `conversion_demo`,
`conversion_contact`, `conversion_inscription`.

**Ordre de mise en ligne** si le consentement change : publier d'abord le conteneur GTM
(les balises vérifient l'accord), ensuite seulement le site.

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
