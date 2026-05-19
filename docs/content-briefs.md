# Briefs de contenu SEO — LockHACCP

Ces 5 briefs sont prêts à être rédigés. Chacun cible un keyword précis, avec une structure H2/H3 pour ranker, un objectif éditorial clair et des consignes SEO.

**Process recommandé** :
1. Écris le brouillon (ou délègue à un rédacteur). Vise 1500-2500 mots.
2. Ajoute un fichier `BlogXxx.tsx` dans `src/pages/` calqué sur les blogs existants.
3. Ajoute la route dans `App.tsx`.
4. Ajoute l'URL dans `scripts/generate-sitemap.mjs`.
5. Le sitemap se régénère au build (`npm run build`).
6. Ajoute des `RelatedLinks` en bas pour le maillage interne.

---

## Brief 1 — Plan de Maîtrise Sanitaire (PMS) : modèle gratuit + guide

- **URL** : `/blog/plan-maitrise-sanitaire-pms-modele-gratuit`
- **Mot-clé principal** : "plan de maîtrise sanitaire" (~210 recherches/mois)
- **Mots-clés secondaires** : PMS restauration, modèle PMS, PMS gratuit, plan maîtrise sanitaire DDPP
- **Intention de recherche** : informative + transactionnelle (recherche un modèle prêt à l'emploi)
- **Cible** : restaurateurs débutants ou en préparation contrôle DDPP

**Plan suggéré (H2/H3)**
- H1 : Plan de Maîtrise Sanitaire (PMS) : modèle gratuit + guide complet 2026
- H2 : Qu'est-ce qu'un PMS et pourquoi est-il obligatoire ?
  - H3 : Définition légale (arrêté du 8 octobre 2013, paquet Hygiène)
  - H3 : Qui doit avoir un PMS ?
- H2 : Les 3 piliers du PMS
  - H3 : 1. Les Bonnes Pratiques d'Hygiène (GBPH)
  - H3 : 2. Le plan HACCP
  - H3 : 3. La traçabilité et gestion des non-conformités
- H2 : Comment construire son PMS étape par étape
  - H3 : Étape 1 — Diagnostic initial
  - H3 : Étape 2 — Documentation des procédures
  - H3 : Étape 3 — Formation des équipes
  - H3 : Étape 4 — Mise en œuvre et audit régulier
- H2 : Télécharger un modèle PMS gratuit (CTA → email-gating)
- H2 : Les erreurs fréquentes lors d'un contrôle DDPP
- H2 : FAQ (avec FAQ JSON-LD)

**CTA** : "Téléchargez le modèle PMS gratuit" → formulaire email + livraison du PDF
**Maillage interne** : Méthode HACCP, Affichages obligatoires, Fonctionnalité traçabilité

---

## Brief 2 — Contrôle DDPP en restaurant : que vérifient-ils ?

- **URL** : `/blog/controle-ddpp-restaurant-que-verifier`
- **Mot-clé principal** : "contrôle DDPP restaurant" (~140 recherches/mois)
- **Mots-clés secondaires** : contrôle hygiène restaurant, DDPP que vérifie, contrôle sanitaire restaurant, préparer contrôle DDPP
- **Intention** : informative (anxiété → besoin de se préparer)
- **Cible** : restaurateurs anxieux d'un contrôle imminent ou récent

**Plan suggéré**
- H1 : Contrôle DDPP en restaurant : que vérifie-t-on en 2026 ?
- H2 : Qui est la DDPP et pourquoi vous contrôle-t-elle ?
- H2 : Comment se déroule un contrôle DDPP (chronologie)
  - H3 : L'arrivée des inspecteurs (sans préavis)
  - H3 : Les questions et la visite
  - H3 : Le rapport et les suites
- H2 : Les 10 points contrôlés dans 90% des cas
  - H3 : Hygiène générale des locaux et du matériel
  - H3 : Température des enceintes (frigos, congélateurs)
  - H3 : Traçabilité (lots, fournisseurs)
  - H3 : DLC et étiquetage
  - H3 : Plan de nettoyage et désinfection
  - H3 : Formation HACCP du personnel
  - H3 : Plan de Maîtrise Sanitaire (PMS)
  - H3 : Gestion des allergènes
  - H3 : Hygiène du personnel
  - H3 : Lutte contre les nuisibles
- H2 : Les 4 catégories de notes (de A à D) et leurs conséquences
- H2 : Que faire en cas de mise en demeure ou fermeture administrative
- H2 : Comment un logiciel HACCP simplifie la préparation à un contrôle
- H2 : FAQ

**CTA** : "Préparez votre prochain contrôle en 3 mois" → /demander-demo
**Maillage** : Méthode HACCP, PMS, Affichages obligatoires

---

## Brief 3 — Modèle relevé de température (Excel + PDF téléchargeables)

- **URL** : `/blog/modele-releve-temperature-restaurant-pdf-excel`
- **Mot-clé principal** : "modèle relevé température HACCP" (~150 recherches/mois)
- **Mots-clés secondaires** : feuille de relevé température excel, relevé température frigo restaurant, fiche relevé température HACCP gratuit
- **Intention** : transactionnelle (cherche un fichier à télécharger maintenant)
- **Cible** : restaurateurs qui veulent un outil simple immédiat (lead magnet)

**Plan suggéré**
- H1 : Modèle de relevé de température HACCP (PDF + Excel gratuit)
- H2 : Téléchargez votre modèle (CTA en haut + email-gate)
- H2 : Comment bien remplir une fiche de relevé de température
- H2 : Quelles températures relever en restaurant ?
  - H3 : Réfrigérateur positif (entre 0 et 4°C)
  - H3 : Congélateur négatif (entre -18 et -22°C)
  - H3 : Vitrine de service (entre 0 et 3°C)
  - H3 : Température à cœur en cuisson (≥63°C)
  - H3 : Refroidissement rapide (de +63°C à +10°C en 2h max)
- H2 : Fréquence des relevés selon le type d'enceinte
- H2 : Que faire en cas de température non conforme ?
- H2 : Pourquoi passer du papier au numérique ?
- H2 : FAQ

**CTA** : "Automatisez vos relevés avec LockHACCP" → /demander-demo + /fonctionnalites/temperatures
**Maillage** : Fonctionnalité Températures, Méthode HACCP

---

## Brief 4 — Logiciel HACCP pour pizzeria : ce qui change

- **URL** : `/blog/logiciel-haccp-pizzeria-besoins-specifiques`
- **Mot-clé principal** : "logiciel HACCP pizzeria" (~90 recherches/mois)
- **Mots-clés secondaires** : HACCP pizzeria, hygiène pizzeria, traçabilité pizzeria
- **Intention** : transactionnelle (proche de l'achat, cible verticalisée)
- **Cible** : pizzaiolos / gérants de pizzeria

**Plan suggéré**
- H1 : Logiciel HACCP pour pizzeria : pourquoi votre métier a des besoins spécifiques
- H2 : Les 5 défis HACCP propres à la pizzeria
  - H3 : Le four à très haute température (gestion sécurité)
  - H3 : La pâte fraîche (DLC courte, fermentation)
  - H3 : La rotation rapide des produits frais (mozzarella, légumes)
  - H3 : Les pics de service (peu de temps pour la traçabilité)
  - H3 : Les pizzas à emporter (DLC consommateur)
- H2 : Les contrôles HACCP indispensables en pizzeria
  - H3 : Températures des chambres froides
  - H3 : Traçabilité de la mozzarella et farines
  - H3 : Nettoyage du four et du laboratoire
  - H3 : Huile de friture (pour les fritures associées)
- H2 : Cas client : comment Pizzeria X a divisé son temps HACCP par 3
- H2 : Pourquoi un logiciel généraliste ne suffit pas
- H2 : LockHACCP pour pizzeria : pack et tarifs
- H2 : FAQ

**CTA** : "Demandez une démo dédiée pizzeria" → /demander-demo
**Maillage** : Plans tarifs, Méthode HACCP

---

## Brief 5 — LockHACCP vs Octopus vs Traqfood : comparatif 2026

- **URL** : `/blog/comparatif-logiciel-haccp-lockhaccp-octopus-traqfood`
- **Mot-clé principal** : "comparatif logiciel HACCP" (~180 recherches/mois)
- **Mots-clés secondaires** : meilleur logiciel HACCP, alternative Octopus, alternative Traqfood, logiciel HACCP avis
- **Intention** : transactionnelle (visiteur très chaud, comparaison finale)
- **Cible** : prospects qui ont déjà identifié 2-3 concurrents

**Plan suggéré (rester factuel/honnête, c'est ce qui crée la confiance)**
- H1 : Comparatif logiciels HACCP en 2026 : LockHACCP, Octopus, Traqfood
- H2 : Méthodologie du comparatif
- H2 : Tableau récapitulatif (fonctionnalités, tarifs, support)
- H2 : LockHACCP en détail
  - H3 : Points forts (prix, simplicité, IA)
  - H3 : Points à améliorer (jeune sur le marché, écosystème)
  - H3 : Pour qui ?
- H2 : Octopus en détail
  - H3 : Points forts (maturité, intégrations)
  - H3 : Points à améliorer (prix, complexité)
  - H3 : Pour qui ?
- H2 : Traqfood en détail
  - H3 : Points forts
  - H3 : Points à améliorer
  - H3 : Pour qui ?
- H2 : Quel logiciel HACCP choisir selon votre profil
  - H3 : Restaurant individuel < 5 employés → LockHACCP
  - H3 : Chaîne multi-restaurants → Octopus ou LockHACCP Entreprise
  - H3 : Restauration collective → Traqfood
- H2 : FAQ

**CTA** : "Essayez LockHACCP gratuitement pendant 3 mois" → app.lockhaccp.fr
**Maillage** : Tarifs, Fonctionnalités, Solution Entreprise

---

## Bonus : 10 autres briefs à explorer plus tard

- /blog/dlc-ddm-restauration-comprendre-difference (DLC vs DDM)
- /blog/allergenes-restaurant-14-categories-gerer
- /blog/checklist-ouverture-fermeture-restaurant-pdf
- /blog/refroidissement-rapide-restaurant-haccp
- /blog/audit-hygiene-restaurant-grille-evaluation
- /blog/formation-haccp-obligation-employeur
- /blog/etiquetage-allergenes-restaurant-loi-info-conso
- /blog/plan-nettoyage-cuisine-professionnelle-modele
- /blog/grossiste-restauration-traceabilite-bonnes-pratiques
- /blog/food-truck-haccp-obligations-specifiques

---

## Calendrier éditorial recommandé

| Semaine | Article | Effort |
|---------|---------|--------|
| S1 | Brief 1 — PMS modèle gratuit | 4h écriture + 1h dev |
| S2 | Brief 3 — Modèle relevé température | 3h + 1h |
| S3 | Brief 2 — Contrôle DDPP | 5h + 1h |
| S4 | Brief 5 — Comparatif logiciels | 6h + 1h |
| S5 | Brief 4 — Pizzeria | 4h + 1h |
| S6+ | Pickup dans la liste bonus | 4h/semaine |

À ce rythme : **1 article qualité par semaine = 25-30 articles dans l'année** = visibilité Google massive.
