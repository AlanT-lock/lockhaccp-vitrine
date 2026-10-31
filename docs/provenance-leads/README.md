# Provenance des leads PMS dans Closera

Le site relève d'où vient chaque visiteur (Google Ads, recherche Google, autre site,
accès direct, page d'arrivée, campagne et mot-clé s'ils sont transmis) et le joint à la
demande de PMS (`src/lib/provenance.ts`, champ `provenance` du corps envoyé à `generer-pms`).

## État

| Élément | Où | État |
| --- | --- | --- |
| Envoi de la provenance par le site | ce dépôt | en ligne |
| Colonne `pms_demandes.provenance` (jsonb) | Supabase `ndoxvlikhmmixvhuqczs` | créée le 2026-10-31 (migration `pms_demandes_provenance`) |
| Lecture par la fonction `generer-pms`, ligne « Provenance : … » dans la note Closera | fonction Edge `generer-pms` (code hors de ce dépôt) | **à déployer** : `generer-pms-provenance.patch` |

Tant que la fonction n'est pas mise à jour, elle ignore ce champ : rien ne casse.

## Déployer la fonction

Le correctif s'applique au code de la fonction tel qu'il est déployé (version 16), à la
racine du projet Supabase qui contient `supabase/functions/generer-pms` :

```bash
patch -p1 < generer-pms-provenance.patch
```

La partie `supabase/migrations` du correctif est déjà appliquée en base : ne pas la rejouer
(elle est idempotente, `add column if not exists`). Puis :

```bash
supabase functions deploy generer-pms --project-ref ndoxvlikhmmixvhuqczs --no-verify-jwt
```

Résultat sur la fiche Closera, 2e ligne de la note :
`Provenance : Google Ads · mot-clé « pms gratuit » · arrivée sur /plan-de-maitrise-sanitaire`.

Le mot-clé n'apparaît que si la campagne Google Ads transmet `utm_term` (suffixe de l'URL
finale : `utm_source=google&utm_medium=cpc&utm_campaign=pms-recherche&utm_term={keyword}`).
La fonction de relance `relancer-pms` n'est pas couverte : elle écrira « non transmise ».
