# Chantier 3 — Blog LockHACCP

**Date** : 2026-10-02 — **Statut** : conception validée par Alan (spec à relire)
**Dépôt** : `lockhaccp-vitrine`. S'appuie sur le chantier 1 (pré-génération, `useMaintenant`, reconstruction nocturne) et le chantier 2 (`/plan-de-maitrise-sanitaire`).

## Objectif

Attirer des professionnels de l'alimentation depuis Google et les assistants IA sur leurs vraies questions (contrôle, températures, nettoyage, formation, allergènes), et les conduire vers le PMS gratuit puis l'application.

**Critères de réussite**
1. **Les articles doivent sembler écrits par un humain** — exigence n° 1 d'Alan, prioritaire sur toute technique SEO.
2. Contenu réglementaire exact (publication directe, sans relecture préalable d'Alan).
3. Tout article qui parle du PMS renvoie vers `/plan-de-maitrise-sanitaire`.
4. Ajouter un article = déposer un fichier texte.
5. Chaque article est pré-généré (HTML complet), dans le sitemap et `llms.txt`.

## Décisions d'Alan (2026-10-02)

- Signature : **Alan Touati, formateur en hygiène alimentaire (SF FORMATION)**, avec une page auteur.
- **Publication directe**, sans relecture préalable.
- **Premier lot de 6 articles**, **publiés au rythme d'un par semaine** à partir du 02/10/2026, automatiquement (un article daté dans le futur reste caché jusqu'à sa date). Pas d'antidatage.
- Articles parlant du PMS : liens vers `/plan-de-maitrise-sanitaire`.

## 1. Charte d'écriture « humaine » (exigence n° 1)

Les articles sont écrits à la première personne par un formateur qui parle à des restaurateurs, pas par une marque qui fait du référencement.

**À faire**
- « Je » et « vous ». Phrases de longueurs variées, dont des très courtes. Ton direct, parfois un avis tranché (« franchement, le relevé rempli le vendredi pour toute la semaine, l'inspecteur le voit tout de suite »).
- Vocabulaire de cuisine réel : sonde, chambre froide, bac gastro, cellule, plonge, DLC secondaire, carnet de réception, étiquette sanitaire.
- Les questions que posent vraiment les stagiaires, reformulées comme on les entend en formation.
- Des exemples concrets et chiffrés (températures, durées, fréquences) tirés des textes ou des guides de bonnes pratiques.
- Structure propre à chaque article : longueur, nombre de sections et présence d'une FAQ varient selon le sujet. Pas de squelette identique.
- Titres de section en langage parlé (« Et si le frigo dépasse 4 °C ? ») plutôt que des titres de catalogue.

**Interdit** (contrôlé automatiquement, le build échoue)
- Formules typiques des textes générés : « Dans cet article », « Dans ce guide », « Plongeons », « Il est important de noter », « Il convient de », « En conclusion », « En résumé », « En somme », « N'hésitez pas », « Que vous soyez … ou … », « Véritable », « incontournable », « crucial », « essentiel » en tête de phrase, « En effet, », « Ainsi, » en ouverture de paragraphe répétée, « Force est de constater », « À l'ère de », « Le saviez-vous ».
- Plus de 2 tirets cadratins (—) par article ; aucun emoji ; pas de gras décoratif (au plus 4 passages en gras par article).
- Listes à puces systématiques : au plus 3 listes par article ; la prose domine.
- Conclusion-résumé qui répète l'article.

**Honnêteté** : aucune anecdote inventée présentée comme vécue (pas de « un restaurant que j'ai formé à Nice… »). Les remarques de terrain restent générales et vraies pour tout formateur du métier (« ce qu'on voit le plus souvent en contrôle… »). Aucun chiffre sans source. Alan peut ajouter ses propres anecdotes plus tard dans les fichiers.

**Sources** : chaque article cite ses textes en fin de page (Légifrance, EUR-Lex, ministère, GBPH), avec liens.

## 2. Le premier lot

| Ordre | Date de publication | Article | Recherche visée |
|---|---|---|---|
| 1 | 02/10/2026 | Contrôle sanitaire en restaurant : ce que regarde l'inspecteur | contrôle DDPP restaurant |
| 2 | 09/10/2026 | PMS et HACCP : quelle différence ? | différence PMS HACCP |
| 3 | 16/10/2026 | Relevé de température en restaurant : règles, fréquence, fiche | relevé température HACCP |
| 4 | 23/10/2026 | Plan de nettoyage et de désinfection : comment le construire | plan de nettoyage HACCP |
| 5 | 30/10/2026 | Formation hygiène alimentaire : qui doit la suivre | formation hygiène alimentaire obligatoire |
| 6 | 06/11/2026 | Tableau des allergènes en restaurant : obligations et modèle | tableau allergènes restaurant |

Points réglementaires à respecter (déjà vérifiés avec Alan) : aucun texte n'impose au restaurant en remise directe un document intitulé « PMS » (règlement 852/2004 art. 5 : procédures HACCP + enregistrements ; l'intitulé vient de l'agrément) ; formation 14 h : arrêté du 12 février 2024 (dont 4 h de mises en situation) et autorisation préfectorale des organismes depuis le 1er février 2026 (décret 2025-922), n° ROFHYA supprimé ; restauration collective : aucune durée imposée. Tout autre point est vérifié sur Légifrance avant écriture et cité.

**Migration** : les 2 articles existants (`/blog/affichages-obligatoires-restaurant-2026`, `/blog/methode-haccp-guide-complet`) passent au nouveau format, adresses inchangées, date de publication réelle = 11/05/2026, date de mise à jour = 02/10/2026, relus contre la charte (réécriture des passages trop « générés ») et contre les règles PMS ci-dessus.

## 3. Fonctionnement technique

- **Fichiers** : `content/blog/<slug>.md`, en-tête YAML simple :
  `titre`, `description` (meta, ≤ 160 caractères), `date` (AAAA-MM-JJ), `maj` (facultatif), `motCle`, `resume` (2-3 phrases « la réponse courte »), `illustration` (facultatif, image d'un vrai document ou de l'app).
- **Conversion à la construction** : plugin Vite maison qui transforme chaque `.md` en module `{ meta, html, sommaire }` (titres H2 avec ancres). Dépendance ajoutée : `marked` en **devDependency** uniquement (aucun code envoyé au navigateur pour la conversion).
- **Index** : `src/lib/blog.ts` charge tous les articles (`import.meta.glob`, eager), les trie par date et ne garde que ceux dont la date (minuit, heure de Paris) est atteinte à l'instant de rendu (`instantDeRendu`). Fonction pure testée.
- **Routes** : `/blog/:slug` → gabarit `BlogArticle` ; slug inconnu ou pas encore publié → page introuvable (et absent de la pré-génération → 404 Vercel). Les articles publiés s'ajoutent automatiquement à `PAGES_PUBLIQUES` (donc pré-génération, sitemap, `llms.txt`, fil d'Ariane).
- **Publication programmée** : la reconstruction nocturne existante (23:15 UTC = 00:15/01:15 à Paris) publie l'article du jour sans intervention.
- **Page auteur** `/auteur/alan-touati` : bio factuelle (formateur en hygiène alimentaire chez SF FORMATION, organisme certifié Qualiopi et autorisé par la préfecture pour la formation de 14 h ; fondateur de LockHACCP), liste de ses articles. Photo facultative (monogramme en attendant).
- **JSON-LD** : `BlogPosting` (author = `Person` avec `url` de la page auteur, `datePublished`, `dateModified`), `Person` sur la page auteur, `FAQPage` seulement si l'article contient une vraie FAQ.
- Les pages `BlogAffichageObligatoire.tsx`, `BlogMethodeHACCP.tsx` et `Resources.tsx` sont supprimées après migration.

## 4. Design

Même exigence que la page PMS : rien qui ressemble à un gabarit.
- **Page Blog** (`/blog`) : liste éditoriale (titre, résumé, date, temps de lecture), le dernier article mis en avant ; pas de cartes identiques, pas de photos génériques.
- **Article** : colonne de lecture d'environ 68 caractères, corps en 18 px, titres en Plus Jakarta Sans ; sommaire fixe à droite sur ordinateur, repliable sur mobile ; encadré « La réponse courte » en tête ; tableaux lisibles sur mobile ; illustration = vraie fiche du dossier PMS ou capture de l'application quand le sujet s'y prête ; encart PMS au milieu (pour les articles qui parlent du PMS) et en fin ; bloc sources ; encart auteur.
- Accessible, sans débordement sur mobile, mouvement réduit respecté.

## Vérification (automatique, bloque le build)

- Chaque article : en-tête complet, description ≤ 160 caractères, au moins une source, H2 présents.
- **Charte humaine** : aucune formule interdite, ≤ 2 tirets cadratins, 0 emoji, ≤ 4 passages en gras, ≤ 3 listes.
- Tout article contenant « PMS » ou « Plan de Maîtrise Sanitaire » contient un lien vers `/plan-de-maitrise-sanitaire`.
- Un article daté dans le futur n'est ni listé, ni pré-généré, ni dans le sitemap.
- Vérificateur post-build existant (titre, canonical, h1, texte) sur chaque article publié.

## Hors périmètre

Commentaires, newsletter, catégories/étiquettes, recherche, images d'aperçu (OG) par article (image par défaut conservée).
