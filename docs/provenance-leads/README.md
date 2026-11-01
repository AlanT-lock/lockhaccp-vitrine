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
