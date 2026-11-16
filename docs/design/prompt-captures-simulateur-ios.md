# Prompt : vidéos de l'application LockHACCP dans le simulateur iOS

À coller dans une session Claude Code **sur votre Mac**, ouverte dans le dépôt de
l'**application mobile** LockHACCP (celui qui se compile avec Xcode).

---

Tu vas produire des vidéos d'écran de l'application LockHACCP, enregistrées dans le
simulateur iOS, pour la refonte du site vitrine lockhaccp.fr. Le site affichera ces vidéos
dans un iPhone en 3D qu'il dessine lui-même : je veux donc des **enregistrements bruts de
l'écran**, sans cadre de téléphone, sans fond, sans montage décoratif.

## 1. Préparer le simulateur

1. Compile et lance l'application dans le simulateur **iPhone 16 Pro** (à défaut iPhone 15
   Pro), iOS le plus récent installé. Utilise la configuration de build du dépôt (Debug
   convient). Si tu ne sais pas comment la compiler, lis le README du dépôt et demande-moi
   plutôt que de modifier la configuration du projet.
2. Langue et région : **français, France**, format 24 h. Mode **clair**. Taille de texte par
   défaut.
3. Barre d'état propre, la même sur toutes les vidéos :
   `xcrun simctl status_bar booted override --time "9:41" --dataNetwork wifi --wifiBars 3 --cellularMode active --cellularBars 4 --batteryState charged --batteryLevel 100`
4. Clavier : affiche le clavier logiciel (menu Simulator : I/O > Keyboard > décoche
   « Connect Hardware Keyboard ») pour que la saisie soit visible à l'écran.
5. Aucune notification système, aucune bannière de débogage, aucun overlay de
   développement (inspecteur, compteur FPS, avertissements). Si l'application affiche un
   bandeau « développement » ou « test », dis-le-moi avant d'enregistrer.

## 2. Données de démonstration (important)

- Utilise un **compte de démonstration** avec l'établissement fictif **« Le Bistrot
  Français »** (c'est celui des visuels actuels du site). Demande-moi les identifiants s'il
  existe déjà ; n'invente pas de compte et n'utilise **jamais** un compte client réel.
- Les écrans ne doivent montrer **aucune donnée personnelle réelle** : pas de vrai nom de
  client, d'e-mail, de téléphone ou d'adresse. Prénoms d'équipe fictifs (ex. Julien, Sarah,
  Karim).
- Données réalistes et cohérentes : 3 frigos et 1 congélateur avec consignes (ex. Frigo
  cuisine 0 à 4 °C, Chambre froide 0 à 3 °C, Congélateur ≤ −18 °C), zones de nettoyage
  (Préparation, Cuisson, Plonge, Stockage froid), quelques produits et fournisseurs
  (ex. Maraîcher Dubois, Boucherie Martin), quelques préparations (Sauce béarnaise, Crème
  pâtissière, Fond de veau).
- Aucune tuile ou fonction marquée « en construction », « bientôt » ou équivalent ne doit
  apparaître. Si c'est le cas d'une fonction utilisée ci-dessous, préviens-moi.

## 3. Les 5 vidéos à enregistrer

Rythme : naturel mais vif, comme un utilisateur qui connaît l'application. Marque une pause
d'environ **1 seconde** sur chaque état important (valeur saisie, coche verte, étiquette
générée). Chaque vidéo **commence et finit sur le même écran** pour pouvoir tourner en
boucle sans saut. Durée cible indiquée après montage.

| Fichier | Durée | Scénario |
|---|---|---|
| `tour` | 10 à 12 s | Accueil → Températures → relevé du « Frigo cuisine » à **3,2 °C** → validation (coche verte) → retour à l'accueil → Plan de nettoyage → coche 2 tâches de la zone Préparation → retour à l'accueil. |
| `temperatures` | 6 à 9 s | Températures → relevé de la « Chambre froide » à **7,4 °C** (hors consigne) → l'alerte s'affiche → choix d'une action corrective (ex. « Produits déplacés, technicien appelé ») → enregistré → retour à la liste. |
| `etiquettes` | 6 à 9 s | Production ou Étiqueteuse → choix de la préparation « Sauce béarnaise » → la DLC est calculée automatiquement → aperçu de l'étiquette (date, DLC, lot, allergènes) → appui sur « Imprimer ». Si l'impression demande une imprimante réelle, arrête-toi sur l'aperçu avec le bouton visible. |
| `reception` | 6 à 9 s | Contrôle à réception → nouvelle livraison → photo de l'étiquette ou du bon de livraison (utilise une image de test fictive dans la photothèque du simulateur, `xcrun simctl addmedia booted …`) → la lecture automatique remplit fournisseur, produit, lot et DLC → saisie de la température du produit → validé. |
| `historique` | 6 à 9 s | Historique → la semaine en cours → ouverture d'une journée complète (tous les contrôles verts) → export ou partage du PDF. Arrête-toi sur l'aperçu du PDF ou la feuille de partage. |

Si un scénario n'est pas faisable tel quel dans l'application, adapte-le au plus proche de
ce qui existe vraiment, et note l'écart dans le manifeste (section 5). N'invente pas de
fonction.

## 4. Enregistrer et automatiser

- Pilote l'interface de façon reproductible plutôt qu'à la main : **Maestro** de
  préférence (flux YAML, `tapOn`, `inputText`, `waitForAnimationToEnd`), sinon **idb**
  (`idb ui tap`, `idb ui text`). Garde les flux dans un dossier temporaire, ne les commite
  pas dans le dépôt de l'application.
- Enregistre avec `xcrun simctl io booted recordVideo --codec=h264 --force brut-<id>.mp4`
  lancé en arrière-plan, puis arrête-le proprement avec `kill -INT <pid>` (sinon le fichier
  est corrompu).
- Refais une prise si un geste rate, si un chargement traîne ou si un élément parasite
  apparaît.

## 5. Traiter les fichiers (ffmpeg)

Pour chaque vidéo `<id>` :

1. Couper au début et à la fin pour obtenir la durée cible, avec une boucle propre.
2. MP4 (H.264), largeur **780 px**, hauteur proportionnelle, 30 i/s, sans son :
   `ffmpeg -i brut.mp4 -ss <début> -to <fin> -vf "scale=780:-2,fps=30" -c:v libx264 -profile:v high -preset slow -crf 26 -pix_fmt yuv420p -an -movflags +faststart <id>.mp4`
3. WebM (VP9), mêmes réglages d'image :
   `ffmpeg -i brut.mp4 -ss <début> -to <fin> -vf "scale=780:-2,fps=30" -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -an <id>.webm`
4. Image d'attente : la première image en WebP, qualité 80 : `<id>-poster.webp`.
5. Image fixe nette de l'état le plus parlant (valeur validée, étiquette générée…), en WebP
   780 px : `<id>-cle.webp`.
6. Poids maximal : **1,5 Mo par MP4** (1,2 Mo pour `tour`). Si c'est trop lourd, monte le
   CRF par pas de 2 plutôt que de réduire la largeur.
7. Vérifie avec `ffprobe` que chaque fichier se lit, a la bonne taille et pas de piste son.
8. Fais une planche contact (`ffmpeg … -vf "fps=1,scale=200:-1,tile=6x2"`) par vidéo pour
   que je puisse vérifier d'un coup d'œil : `<id>-planche.jpg` (ne pas la commiter).

Crée aussi `manifest.json` :

```json
[
  {
    "id": "tour",
    "fichiers": ["tour.mp4", "tour.webm", "tour-poster.webp", "tour-cle.webp"],
    "duree_s": 11.2,
    "largeur": 780,
    "hauteur": 1696,
    "description": "Relevé du frigo cuisine à 3,2 °C validé, puis deux tâches de nettoyage cochées.",
    "ecart_scenario": null
  }
]
```

La `description` servira de texte alternatif sur le site : une phrase simple, en français,
qui décrit ce qu'on voit.

## 6. Livrer dans le dépôt du site

1. Clone ou ouvre le dépôt du site : `github.com/AlanT-lock/lockhaccp-vitrine`.
2. Pars de `main` à jour et crée la branche **`assets/videos-app`**.
3. Place les fichiers dans **`public/videos/app/`** : les `.mp4`, `.webm`, `-poster.webp`,
   `-cle.webp` et `manifest.json`. Rien d'autre : pas de vidéo brute, pas de planche contact,
   pas de flux Maestro, aucune modification du code du site.
4. Un seul commit, message : `assets : vidéos de l'application pour la refonte de l'accueil`.
5. Pousse la branche (`git push -u origin assets/videos-app`). N'ouvre pas de pull request et
   ne fusionne rien : la session qui fait la refonte s'en charge.
6. Termine par un récapitulatif : liste des fichiers avec poids et durée, écarts éventuels
   avec les scénarios, et les planches contact affichées pour validation.
