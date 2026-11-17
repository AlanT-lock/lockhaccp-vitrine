# Provenance des leads PMS dans Closera

Le site relève d'où vient chaque visiteur (Google Ads, recherche Google, autre site,
accès direct, page d'arrivée, campagne et mot-clé s'ils sont transmis) et le joint à la
demande de PMS (`src/lib/provenance.ts`, champ `provenance` du corps envoyé à `generer-pms`).

## État

| Élément | Où | État |
| --- | --- | --- |
| Envoi de la provenance par le site | ce dépôt | en ligne depuis le 2026-10-31 |
| Colonne `pms_demandes.provenance` (jsonb) | Supabase `ndoxvlikhmmixvhuqczs` | créée le 2026-10-31 (migration `pms_demandes_provenance`) |
| Lecture par la fonction `generer-pms`, ligne « Provenance : … » dans la note Closera | fonction Edge `generer-pms` (code hors de ce dépôt) | en ligne depuis le 2026-11-01 (version 18) |
| Canal annoté (page rechargée, arrivée plus d'une heure avant l'envoi), heure d'arrivée, identifiant du clic Google Ads (avec l'accord pour la publicité) | ce dépôt | 2026-11-17 ; le canal annoté passe déjà par la version 18 |
| Clic Google Ads transmis à Closera (`attribution` → `lead_attributions`, section « Clic publicitaire » de la fiche) | fonction `generer-pms` | en ligne depuis le 2026-11-17 (version 19, voir `generer-pms-v19.md`) |

La version 18 reprend la version 16 à l'identique, sauf deux fichiers :
`_shared/pms/closera.ts` (types `Provenance`, `lireProvenance`, `decrireProvenance`, 2e ligne
de la note) et `_shared/pms/traitement.ts` (provenance lue dans la demande, enregistrée avec
elle et passée à `construireProspect`). Elle ajoute aussi `_shared/pms/types.ts`, copie de
`src/lib/pms/genere/types.ts`, absent de la version 16 déployée.

La version 17 (2026-11-01, 3 h 14) ne contenait qu'un `index.ts` vide : elle avait été déployée
depuis l'éditeur du tableau de bord Supabase. Cette fonction compte 27 fichiers : la déployer
avec la CLI, depuis un dossier qui contient tout son code :

```bash
supabase functions deploy generer-pms --project-ref ndoxvlikhmmixvhuqczs --no-verify-jwt
```

La vérification JWT doit rester désactivée : le site appelle la fonction sans connexion.

Résultat sur la fiche Closera, 2e ligne de la note :
`Provenance : Google Ads · mot-clé « pms gratuit » · arrivée sur /plan-de-maitrise-sanitaire`.

Le mot-clé n'apparaît que si la campagne Google Ads transmet `utm_term` (suffixe de l'URL
finale : `utm_source=google&utm_medium=cpc&utm_campaign=pms-recherche&utm_term={keyword}`).
La fonction de relance `relancer-pms` n'est pas couverte : elle écrira « non transmise ».

## Campagne d'un lead : ce que dit la note

Les paramètres d'une annonce restent dans l'adresse tant que le visiteur ne change pas de page.
Un onglet rechargé ou rouvert (un téléphone recharge les onglets mis en veille) les relit,
parfois des heures après le clic : avant le 17/11/2026, une demande de PMS faite ainsi était
attribuée à la campagne du clic d'origine sans le dire (cas du 17/11 : « pms-recherche » un
jour où la seule annonce cliquée de cette campagne avait amené un autre prospect). Depuis :

- `Google Ads (page rechargée, clic antérieur)` : la page a été rechargée, rouverte ou revenue
  par « Précédent » ; la campagne et le mot-clé sont ceux d'un clic plus ancien ;
- `Google Ads (arrivée le 16/11 à 21 h 05)` : la demande part plus d'une heure après l'arrivée.

Suffixes d'URL des campagnes (Google Ads) :

| Campagne | Suffixe |
| --- | --- |
| PMS (réseau de recherche) | `utm_source=google&utm_medium=cpc&utm_campaign=pms-recherche&utm_term={keyword}` |
| PMax – PMS gratuit | `utm_source=google&utm_medium=cpc&utm_campaign=pms-pmax` (depuis le 17/11/2026 ; Google ne fournit pas de mot-clé en Performance Max) |

## Version 19 déployée par l'API (2026-11-17)

Déployée depuis l'outil Supabase de Claude, qui exige le contenu de chaque fichier :
`_shared/pms/pdf/ressources.ts` (558 Ko d'images et de police en base64) y était trop lourd.
Il est donc versionné ici (`supabase/functions/_shared/pms/pdf/ressources.ts`, copie exacte
de la version 18) et les quatre fichiers PDF qui l'utilisent (`rendu.ts`, `documents.ts`,
`commun.ts`, `affiches_design.ts`) l'importent dans la version déployée depuis
`raw.githubusercontent.com/AlanT-lock/lockhaccp-vitrine/<commit>/…`. Deno l'intègre au
déploiement : aucun appel réseau à l'exécution. Contenu sans secret, déjà remis dans chaque PMS
(logo, badges des stores, affiches officielles, police DejaVu Sans sous licence libre).

**À reporter dans le code source de la fonction** (projet lockhaccp, avant tout prochain
déploiement avec la CLI, sinon la version 19 est écrasée) : `closera.ts` et `traitement.ts`
tels que décrits dans `generer-pms-v19.md` (`construireProspect(…, provenance, id)`).
Un déploiement CLI depuis ce code source garde l'import local de `ressources.ts`.
