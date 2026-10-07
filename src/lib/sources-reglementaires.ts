// Textes officiels cités sur le site (mêmes liens que les sources des articles du blog).
import type { Source } from "@/components/SectionsContenu";

export const SOURCES = {
  hygiene852: {
    libelle: "Règlement (CE) n° 852/2004 relatif à l'hygiène des denrées alimentaires",
    url: "https://eur-lex.europa.eu/eli/reg/2004/852/oj",
  },
  arrete2009: {
    libelle: "Arrêté du 21 décembre 2009 relatif aux règles sanitaires applicables au commerce de détail",
    url: "https://www.legifrance.gouv.fr/loda/id/LEGITEXT000021676844/",
  },
  arrete2009Temperatures: {
    libelle: "Arrêté du 21 décembre 2009, annexe I : températures de conservation",
    url: "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000041864893",
  },
  legislation178: {
    libelle: "Règlement (CE) n° 178/2002, article 18 : traçabilité",
    url: "https://eur-lex.europa.eu/eli/reg/2002/178/oj",
  },
  coquillages853: {
    libelle: "Règlement (CE) n° 853/2004, annexe III : étiquetage et conservation des coquillages",
    url: "https://eur-lex.europa.eu/eli/reg/2004/853/oj",
  },
  huiles2008: {
    libelle: "Décret n° 2008-184 du 26 février 2008, article 8 : huiles de friture (composés polaires)",
    url: "https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000018191070",
  },
  information1169: {
    libelle: "Règlement (UE) n° 1169/2011 concernant l'information des consommateurs sur les denrées alimentaires",
    url: "https://eur-lex.europa.eu/eli/reg/2011/1169/oj",
  },
  allergenes2015: {
    libelle: "Décret n° 2015-447 du 17 avril 2015 relatif à l'information sur les allergènes",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000030491684",
  },
  biocides528: {
    libelle: "Règlement (UE) n° 528/2012 concernant les produits biocides",
    url: "https://eur-lex.europa.eu/eli/reg/2012/528/oj",
  },
  alimConfiance: {
    libelle: "Alim'confiance, résultats des contrôles sanitaires",
    url: "https://alim-confiance.gouv.fr/",
  },
} satisfies Record<string, Source>;
