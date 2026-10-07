// Contenu éditorial des pages /fonctionnalites/* : réglementation, comparatif
// papier / application, questions fréquentes. Les faits réglementaires reprennent
// ceux des articles du blog (relus et sourcés) ; ne rien ajouter sans source.
import type { FaqItem } from "@/components/FaqSection";
import type { LigneComparatif, Point, Source } from "@/components/SectionsContenu";
import { SOURCES } from "@/lib/sources-reglementaires";

export interface ContenuFonctionnalite {
  reglementation: { titre: string; intro: string; points: Point[]; sources: Source[] };
  comparatif: { titre: string; intro: string; lignes: LigneComparatif[] };
  faq: { titre: string; items: FaqItem[] };
}

export type IdFonctionnalite =
  | "temperatures" | "receptions" | "tracabilite" | "nettoyage" | "huiles" | "etiquettes" | "checklist";

const CONNEXION: FaqItem = {
  question: "L'application fonctionne-t-elle sans connexion internet ?",
  answer: "Non. LockHACCP a besoin d'une connexion internet, en Wi-Fi ou en réseau mobile, pour enregistrer un contrôle.",
};

export const CONTENUS: Record<IdFonctionnalite, ContenuFonctionnalite> = {
  temperatures: {
    reglementation: {
      titre: "Relevé de température HACCP : ce que dit la réglementation",
      intro:
        "Le règlement européen 852/2004 oblige tout établissement qui manipule des denrées à maîtriser les températures et à garder la trace de ses contrôles. En France, les seuils à respecter sont fixés par l'arrêté du 21 décembre 2009.",
      points: [
        {
          titre: "Les seuils de conservation",
          texte:
            "+2 °C au plus pour la viande hachée et les produits de la pêche frais, +3 °C pour les plats cuisinés élaborés à l'avance, +4 °C pour les autres denrées très périssables, −18 °C pour les surgelés et +63 °C minimum pour les plats maintenus au chaud.",
        },
        {
          titre: "Deux relevés par jour",
          texte:
            "Aucun texte ne fixe un nombre de relevés. La pratique attendue, reprise par les guides de bonnes pratiques, est de relever chaque appareil froid deux fois par jour : à l'ouverture et avant la fermeture.",
        },
        {
          titre: "Une action à chaque écart",
          texte:
            "Un dépassement noté avec ce qui a été fait (cause recherchée, produits contrôlés à cœur, appareil recontrôlé) montre une cuisine qui maîtrise. Une fiche sans aucun écart pendant des mois paraît peu crédible à un inspecteur.",
        },
        {
          titre: "Un thermomètre vérifié",
          texte:
            "Une fois par mois, le test du point de glace (glaçons pilés et un peu d'eau) doit afficher 0 °C, à un degré près. Notez la date du test : l'inspecteur peut la demander.",
        },
      ],
      sources: [SOURCES.arrete2009Temperatures, SOURCES.hygiene852],
    },
    comparatif: {
      titre: "Fiche papier ou application : ce qui change",
      intro: "Les deux supports sont acceptés lors d'un contrôle. La différence se joue au quotidien.",
      lignes: [
        { critere: "Rappel des relevés", papier: "Aucun : la fiche attend qu'on y pense.", application: "Une notification chaque matin, selon vos jours d'ouverture et vos services." },
        { critere: "Consigne de l'appareil", papier: "À connaître par cœur ou à afficher sur la porte.", application: "Affichée à chaque relevé, l'écart est signalé tout de suite." },
        { critere: "Action corrective", papier: "À écrire dans la marge, souvent oubliée.", application: "Demandée dès qu'une température hors consigne est saisie." },
        { critere: "Qui et quand", papier: "Des initiales, rarement l'heure exacte.", application: "Date, heure et personne enregistrées automatiquement." },
        { critere: "Le jour du contrôle", papier: "Retrouver les bonnes fiches dans le classeur.", application: "L'historique de chaque appareil s'affiche en quelques secondes." },
      ],
    },
    faq: {
      titre: "Questions fréquentes sur le relevé de température",
      items: [
        {
          question: "Combien de relevés de température faut-il faire par jour ?",
          answer:
            "Aucun texte n'impose un nombre précis. La pratique attendue est de deux relevés par appareil froid : un à l'ouverture, un avant la fermeture. Dans LockHACCP, le rappel du matin suit vos jours d'ouverture et vos services.",
        },
        {
          question: "Quelle température pour un réfrigérateur de restaurant ?",
          answer:
            "+4 °C au plus pour la plupart des denrées très périssables, +3 °C pour les plats préparés à l'avance et +2 °C pour la viande hachée et le poisson frais (arrêté du 21 décembre 2009). Beaucoup de cuisines règlent leur chambre froide entre 0 et +3 °C pour garder de la marge.",
        },
        {
          question: "Un relevé sur téléphone est-il accepté lors d'un contrôle sanitaire ?",
          answer:
            "Oui. La réglementation demande de garder une trace des contrôles, pas un support particulier. Un relevé sur application est daté, rattaché à la personne qui l'a saisi et consultable à tout moment.",
        },
        CONNEXION,
      ],
    },
  },

  receptions: {
    reglementation: {
      titre: "Contrôle à réception : ce que dit la réglementation",
      intro:
        "La livraison est le premier endroit où un danger peut entrer dans votre cuisine. Le règlement 852/2004 vous demande de maîtriser cette étape, et le règlement 178/2002 impose de pouvoir dire de quel fournisseur vient chaque produit.",
      points: [
        {
          titre: "Les températures à l'arrivée",
          texte:
            "Pour juger une livraison, les repères sont les températures de conservation de l'arrêté du 21 décembre 2009 : +4 °C au plus pour la plupart des denrées très périssables, +2 °C pour la viande hachée et le poisson frais, −18 °C pour les surgelés.",
        },
        {
          titre: "Retrouver le fournisseur",
          texte:
            "L'article 18 du règlement 178/2002 impose d'identifier le fournisseur de chaque denrée. En pratique : garder les bons de livraison et les étiquettes, ou leur photo.",
        },
        {
          titre: "Refuser quand il le faut",
          texte:
            "Un emballage abîmé, une date limite dépassée ou une température hors limite justifient un refus. Noter le motif, avec une photo, sert de preuve dans vos échanges avec le fournisseur.",
        },
        {
          titre: "Le cas des coquillages",
          texte:
            "Pour les huîtres et autres coquillages vivants, l'étiquette sanitaire de chaque bourriche se garde 60 jours (règlement 853/2004).",
        },
      ],
      sources: [SOURCES.hygiene852, SOURCES.legislation178, SOURCES.arrete2009, SOURCES.coquillages853],
    },
    comparatif: {
      titre: "Cahier de réception ou application",
      intro: "Le contrôle se fait devant le livreur, souvent dans l'urgence : le support compte.",
      lignes: [
        { critere: "Température des produits", papier: "Notée sur un cahier, quand on y pense.", application: "Saisie à la livraison, avec un seuil par type de marchandise." },
        { critere: "Preuve d'une anomalie", papier: "Une description écrite, sans photo.", application: "Photo prise depuis l'application et rattachée à la réception." },
        { critere: "Refus de marchandise", papier: "Rarement consigné.", application: "Motif et photo enregistrés pour vos échanges avec le fournisseur." },
        { critere: "Bons et étiquettes", papier: "Classés, quand ils ne sont pas jetés.", application: "Photo de l'étiquette rattachée à la livraison, rangée par date." },
      ],
    },
    faq: {
      titre: "Questions fréquentes sur le contrôle à réception",
      items: [
        {
          question: "Que faut-il contrôler à la réception d'une livraison ?",
          answer:
            "La température des produits réfrigérés et surgelés, les dates limites, l'état des emballages et l'aspect des produits. Il faut aussi garder de quoi retrouver le fournisseur et le lot : bon de livraison, étiquette ou sa photo.",
        },
        {
          question: "Que faire si une livraison n'est pas conforme ?",
          answer:
            "Vous pouvez refuser le produit et le rendre au livreur. Notez le motif et prenez une photo : dans LockHACCP, le refus est enregistré avec la photo et le commentaire.",
        },
        {
          question: "LockHACCP se connecte-t-il à mon logiciel de commande ou à ma caisse ?",
          answer:
            "Non, LockHACCP ne propose pas d'intégration avec d'autres logiciels. Les réceptions se saisissent dans l'application, et les données de traçabilité s'exportent en PDF ou en Excel.",
        },
        {
          question: "Faut-il un matériel particulier ?",
          answer:
            "Un téléphone ou une tablette avec une connexion internet suffit pour l'application. Pour mesurer la température des produits, un thermomètre à sonde reste nécessaire.",
        },
      ],
    },
  },

  tracabilite: {
    reglementation: {
      titre: "Traçabilité alimentaire : vos obligations",
      intro:
        "Depuis 2005, l'article 18 du règlement européen 178/2002 impose à tout professionnel de l'alimentation de savoir de qui il a reçu chaque denrée. La traçabilité fait aussi partie du Plan de Maîtrise Sanitaire que l'inspecteur de la DDPP peut vous demander.",
      points: [
        {
          titre: "Identifier vos fournisseurs",
          texte:
            "Pour chaque produit reçu, vous devez pouvoir dire qui vous l'a livré et quand. Les bons de livraison, les étiquettes ou leur photo servent de preuve.",
        },
        {
          titre: "Réagir à un rappel produit",
          texte:
            "En cas d'alerte sanitaire sur un produit, vous devez retrouver rapidement si vous l'avez reçu, et quand, pour le retirer de votre cuisine.",
        },
        {
          titre: "Dater vos propres préparations",
          texte:
            "L'inspecteur vérifie que les produits entamés et les préparations sont filmés et étiquetés avec une date. Une étiquette avec le nom, la date de fabrication et la date limite permet de savoir ce qu'il y a dans chaque bac.",
        },
        {
          titre: "Garder les enregistrements",
          texte:
            "Les contrôles à réception et les étiquettes font partie des documents demandés lors d'un contrôle sanitaire, avec les relevés de température et le plan de nettoyage.",
        },
      ],
      sources: [SOURCES.legislation178, SOURCES.hygiene852],
    },
    comparatif: {
      titre: "Classeur de traçabilité ou application",
      intro: "La traçabilité ne sert qu'au moment où l'on en a besoin : tout tient à la rapidité pour retrouver l'information.",
      lignes: [
        { critere: "Retrouver une livraison", papier: "Feuilleter des classeurs ou des bons de livraison.", application: "Recherche par date : fournisseur, température relevée et photo de l'étiquette." },
        { critere: "Rappel produit", papier: "Vérifier un à un les bons de la période.", application: "Retrouver quand le produit a été reçu et de quel fournisseur." },
        { critere: "Qui a enregistré", papier: "Une signature, quand elle y est.", application: "Chaque enregistrement indique la personne et l'heure." },
        { critere: "Documents pour un contrôle", papier: "Photocopies.", application: "Export en PDF ou en Excel." },
      ],
    },
    faq: {
      titre: "Questions fréquentes sur la traçabilité",
      items: [
        {
          question: "Qu'est-ce que la traçabilité en restauration ?",
          answer:
            "C'est la capacité de retrouver d'où vient un produit : quel fournisseur, quelle livraison, quel lot. Le règlement 178/2002 l'impose à tous les professionnels de l'alimentation, restaurants compris.",
        },
        {
          question: "Faut-il garder les étiquettes des produits reçus ?",
          answer:
            "Il faut pouvoir identifier le fournisseur et le lot de ce que vous avez reçu : garder l'étiquette ou sa photo est la façon la plus simple. Pour les coquillages vivants, l'étiquette sanitaire se garde 60 jours.",
        },
        {
          question: "Comment LockHACCP aide-t-il en cas de rappel produit ?",
          answer:
            "Les réceptions sont rangées jour par jour avec le fournisseur, la température relevée et la photo de l'étiquette. Vous retrouvez en quelques instants si vous avez reçu le produit rappelé, et quand.",
        },
        {
          question: "Puis-je exporter mes données de traçabilité ?",
          answer: "Oui, en PDF ou en Excel, par exemple pour les montrer lors d'un contrôle sanitaire.",
        },
      ],
    },
  },

  nettoyage: {
    reglementation: {
      titre: "Plan de nettoyage HACCP : ce que dit la réglementation",
      intro:
        "Le règlement 852/2004 (annexe II) exige que les locaux, le matériel et les surfaces en contact avec les aliments soient propres, entretenus et, si besoin, désinfectés. Le plan de nettoyage écrit et sa fiche de suivi font partie du Plan de Maîtrise Sanitaire.",
      points: [
        {
          titre: "Cinq questions par surface",
          texte:
            "Quoi, quand, comment, avec quel produit et qui. Découper le planning par zone (préparation, cuisson, plonge, stockage, sanitaires) le rend lisible pour toute l'équipe.",
        },
        {
          titre: "Nettoyer, puis désinfecter",
          texte:
            "Un désinfectant ne fonctionne pas sur une surface sale. L'ordre : retirer le gros, nettoyer, rincer, désinfecter en respectant le temps de contact indiqué sur le bidon, rincer si le produit l'exige, sécher.",
        },
        {
          titre: "Des produits adaptés",
          texte:
            "Sur les surfaces en contact avec les aliments, utilisez des produits autorisés pour cet usage : les désinfectants concernés relèvent des biocides de type 4 (règlement 528/2012).",
        },
        {
          titre: "Une trace de ce qui est fait",
          texte:
            "Le plan dit ce qu'il faut faire, la fiche de suivi prouve que c'est fait. L'inspecteur compare aussi la fiche à ce qu'il voit : une hotte cochée propre qui goutte de graisse, c'est pire que pas de fiche.",
        },
      ],
      sources: [SOURCES.hygiene852, SOURCES.biocides528, SOURCES.arrete2009],
    },
    comparatif: {
      titre: "Planning affiché au mur ou application",
      intro: "Un planning de nettoyage n'a de valeur que s'il est suivi chaque jour, par toute l'équipe.",
      lignes: [
        { critere: "Tâches du jour", papier: "Affichées au mur, à relire chaque matin.", application: "Rappel chaque matin des tâches du jour." },
        { critere: "Qui a nettoyé", papier: "Une case cochée, parfois des initiales.", application: "Tâche datée et signée par la personne connectée." },
        { critere: "Avancement", papier: "Visible seulement en relisant la fiche.", application: "Progression par zone, tâches en retard repérées." },
        { critere: "Protocoles et fiches produits", papier: "Dans un classeur, loin de la plonge.", application: "Accessibles depuis l'application." },
      ],
    },
    faq: {
      titre: "Questions fréquentes sur le planning de nettoyage",
      items: [
        {
          question: "Comment faire un planning de nettoyage en cuisine ?",
          answer:
            "Listez vos zones (préparation, cuisson, plonge, stockage, sanitaires), puis, pour chaque surface, la fréquence, la méthode, le produit et la personne responsable. Quatre fréquences suffisent presque toujours : après chaque usage, chaque jour, chaque semaine, chaque mois.",
        },
        {
          question: "Quelle différence entre plan de nettoyage et planning de nettoyage ?",
          answer:
            "Le plan de nettoyage décrit ce qu'il faut faire, surface par surface. Le planning répartit ces tâches dans la journée, la semaine et le mois, avec la personne qui s'en charge. Dans LockHACCP, chaque tâche a sa zone, sa fréquence et son rappel.",
        },
        {
          question: "Le plan de nettoyage est-il obligatoire ?",
          answer:
            "Le règlement 852/2004 impose de tenir propres les locaux et le matériel. Le plan de nettoyage écrit, avec sa fiche de suivi, est la façon attendue de le montrer : il fait partie du Plan de Maîtrise Sanitaire.",
        },
        {
          question: "Puis-je obtenir un plan de nettoyage tout prêt ?",
          answer:
            "Oui. Le générateur de Plan de Maîtrise Sanitaire gratuit de LockHACCP vous fait choisir vos zones et vos surfaces, puis produit un plan avec le type de produit adapté à chaque surface et une fiche de suivi par zone.",
        },
      ],
    },
  },

  huiles: {
    reglementation: {
      titre: "Huiles de friture : ce que dit la réglementation",
      intro:
        "En France, le décret n° 2008-184 du 26 février 2008 fixe une limite : une huile de friture dont la teneur en composés polaires dépasse 25 % ne doit plus être utilisée. L'inspecteur de la DDPP peut la tester sur place.",
      points: [
        {
          titre: "Le seuil de 25 %",
          texte:
            "Les composés polaires se forment quand l'huile chauffe et se dégrade, friture après friture. Au-delà de 25 %, l'huile doit être changée.",
        },
        {
          titre: "Comment la mesurer",
          texte:
            "Un testeur de composés polaires, plongé dans l'huile chaude, affiche directement le pourcentage. Le résultat se note ensuite, avec la date et la friteuse concernée.",
        },
        {
          titre: "Un danger chimique",
          texte:
            "L'huile dégradée fait partie des dangers chimiques à prendre en compte dans votre analyse HACCP, au même titre que les résidus de produits de nettoyage.",
        },
        {
          titre: "Une trace écrite",
          texte:
            "Notez chaque test et chaque changement d'huile, avec la date et la personne. Ces enregistrements montrent à l'inspecteur que l'huile est surveillée.",
        },
      ],
      sources: [SOURCES.huiles2008, SOURCES.hygiene852],
    },
    comparatif: {
      titre: "Fiche près de la friteuse ou application",
      intro: "Tester l'huile prend une minute. Ce qui manque souvent, c'est la trace et le suivi dans le temps.",
      lignes: [
        { critere: "Résultat du test", papier: "Noté sur une fiche graisseuse près de la friteuse.", application: "Enregistré par friteuse, avec un seuil de conformité." },
        { critere: "Moment de changer l'huile", papier: "À l'œil ou à l'odeur.", application: "Alerte quand l'huile approche du seuil de remplacement." },
        { critere: "Changements d'huile", papier: "Rarement notés.", application: "Datés et rattachés à la personne qui les fait." },
        { critere: "Plusieurs friteuses", papier: "Une fiche par friteuse, souvent mélangées.", application: "Chaque friteuse identifiée, avec son historique." },
      ],
    },
    faq: {
      titre: "Questions fréquentes sur le contrôle des huiles",
      items: [
        {
          question: "Quel est le taux maximal de composés polaires autorisé ?",
          answer: "25 %. Au-delà, l'huile de friture ne doit plus être utilisée (décret n° 2008-184 du 26 février 2008, article 8).",
        },
        {
          question: "À quelle fréquence tester l'huile de friture ?",
          answer:
            "Aucun texte ne fixe de fréquence. Un test chaque jour d'utilisation de la friteuse permet de changer l'huile au bon moment, ni trop tôt ni trop tard.",
        },
        {
          question: "LockHACCP mesure-t-il lui-même l'huile ?",
          answer:
            "Non, la mesure se fait avec un testeur de composés polaires. LockHACCP sert à enregistrer les résultats, à suivre chaque bain d'huile et à garder l'historique des changements.",
        },
        {
          question: "Comment prouver à l'inspecteur que l'huile est contrôlée ?",
          answer: "En montrant l'historique des tests et des changements d'huile. Dans LockHACCP, il s'affiche par friteuse en quelques secondes.",
        },
      ],
    },
  },

  etiquettes: {
    reglementation: {
      titre: "Étiquetage des productions : ce que dit la réglementation",
      intro:
        "Ce que vous préparez à l'avance doit pouvoir être identifié : ce que c'est, quand ça a été fait et jusqu'à quand le garder. Lors d'un contrôle, l'inspecteur vérifie que les produits entamés et les préparations sont filmés et datés.",
      points: [
        {
          titre: "La durée de vie de vos préparations",
          texte:
            "Aucun texte ne fixe une date limite unique pour une préparation maison. C'est à vous de fixer la durée de vie de vos productions et de pouvoir la justifier dans votre Plan de Maîtrise Sanitaire.",
        },
        {
          titre: "Les 14 allergènes",
          texte:
            "Le règlement 1169/2011 liste 14 allergènes. Pour les plats servis non emballés, le décret du 17 avril 2015 impose une information écrite et accessible au client. Les reprendre sur l'étiquette de production aide la salle à répondre.",
        },
        {
          titre: "Un numéro de lot",
          texte:
            "Le numéro de lot relie une préparation à sa date de production, ce qui permet de retrouver les bacs concernés si un ingrédient fait l'objet d'un rappel.",
        },
        {
          titre: "La température de conservation",
          texte:
            "Un plat cuisiné élaboré à l'avance se conserve à +3 °C au plus (arrêté du 21 décembre 2009). L'étiquette rappelle la température à respecter.",
        },
      ],
      sources: [SOURCES.information1169, SOURCES.allergenes2015, SOURCES.arrete2009Temperatures],
    },
    comparatif: {
      titre: "Étiquette au feutre ou étiquette imprimée",
      intro: "Une étiquette illisible ou une date mal calculée, c'est une remarque assurée lors d'un contrôle.",
      lignes: [
        { critere: "Date limite", papier: "Calculée de tête, avec un risque d'erreur.", application: "Calculée selon vos règles de conservation." },
        { critere: "Allergènes", papier: "Écrits quand on y pense.", application: "Repris sur l'étiquette." },
        { critere: "Lisibilité", papier: "Variable selon l'écriture.", application: "Étiquette imprimée, identique pour toute l'équipe." },
        { critere: "Numéro de lot", papier: "Rarement noté.", application: "Généré automatiquement." },
      ],
    },
    faq: {
      titre: "Questions fréquentes sur les étiquettes de production",
      items: [
        {
          question: "Que mettre sur une étiquette de production en cuisine ?",
          answer:
            "Le nom du produit, la date de fabrication et la date limite permettent de savoir ce qu'il y a dans chaque bac. Les étiquettes LockHACCP indiquent aussi l'heure, un numéro de lot et les allergènes.",
        },
        {
          question: "Quelles étiqueteuses sont compatibles ?",
          answer: "Les étiqueteuses Brother, Zebra et Epson connectées au réseau. L'impression part directement de l'application.",
        },
        {
          question: "Quels formats d'étiquettes sont disponibles ?",
          answer: "Trois formats : 29 × 62 mm, 38 × 90 mm et 50 × 80 mm.",
        },
        {
          question: "Faut-il un ordinateur pour imprimer ?",
          answer: "Non, l'impression part directement de l'application vers l'étiqueteuse.",
        },
        {
          question: "Puis-je louer une étiqueteuse ?",
          answer: "Oui, une étiqueteuse professionnelle est proposée en location, en option de l'abonnement, sans achat de matériel.",
        },
      ],
    },
  },

  checklist: {
    reglementation: {
      titre: "Check-lists et méthode HACCP",
      intro:
        "Le règlement 852/2004 (article 5) demande d'appliquer les principes HACCP. Les check-lists servent à trois d'entre eux : surveiller, vérifier et documenter.",
      points: [
        {
          titre: "Les 7 principes en bref",
          texte:
            "Analyser les dangers, déterminer les points critiques (CCP), fixer leurs limites, les surveiller, prévoir les actions correctives, vérifier que le système fonctionne, et documenter le tout.",
        },
        {
          titre: "Surveiller au quotidien",
          texte:
            "Une check-list d'ouverture ou de fermeture rassemble les contrôles du jour : températures des chambres froides, dates des produits, propreté des surfaces, état du matériel.",
        },
        {
          titre: "Vérifier que ça tient",
          texte:
            "Un audit interne régulier, sous forme de check-list, montre que vos procédures sont appliquées et repère ce qui dérive avant l'inspecteur.",
        },
        {
          titre: "Documenter",
          texte:
            "Sans trace, aucun moyen de prouver que la méthode est appliquée. Une check-list validée, datée et rattachée à une personne, c'est un enregistrement.",
        },
      ],
      sources: [SOURCES.hygiene852, SOURCES.arrete2009],
    },
    comparatif: {
      titre: "Liste photocopiée ou check-list dans l'application",
      intro: "Une check-list utile est courte, adaptée à votre cuisine et faite au bon moment.",
      lignes: [
        { critere: "Contenu", papier: "Une liste photocopiée, identique pour tous.", application: "Des check-lists créées pour votre établissement, par poste ou par rôle." },
        { critere: "Rappel", papier: "Aucun.", application: "Notification à l'heure définie." },
        { critere: "Suivi", papier: "Relire les feuilles une à une.", application: "Taux de réalisation visible, points oubliés repérés." },
        { critere: "Preuve", papier: "Feuille cochée, parfois perdue.", application: "Validation datée et rapport de synthèse." },
      ],
    },
    faq: {
      titre: "Questions fréquentes sur les check-lists HACCP",
      items: [
        {
          question: "Que mettre dans une check-list d'ouverture de cuisine ?",
          answer:
            "Les contrôles à faire avant le service : températures des chambres froides, dates des produits, propreté des surfaces, fonctionnement du matériel. Quatre ou cinq points tenus chaque jour valent mieux qu'une longue liste survolée.",
        },
        {
          question: "Quelle différence entre check-list et plan de nettoyage ?",
          answer:
            "Le plan de nettoyage organise les tâches de nettoyage par zone et par fréquence. La check-list rassemble des contrôles variés à un moment donné, comme l'ouverture ou la fermeture. LockHACCP propose les deux.",
        },
        {
          question: "Peut-on attribuer une check-list à une personne ?",
          answer:
            "Oui, chaque check-list peut être attribuée selon le rôle des membres de l'équipe, qui se connectent chacun avec leur propre code.",
        },
        CONNEXION,
      ],
    },
  },
};
