// Schema additions used both by setup and the September 2026 correction.
export const TRACKING_FIELDS = [
  {
    "name": "Editorial changed at",
    "type": "formula",
    "description": "Modification des seuls champs éditoriaux, y compris Intent. Les écritures de confirmation ne changent pas cette date.",
    "options": {
      "formula": "IF(LAST_MODIFIED_TIME({Title}, {Content ID}, {Type}, {Slug}, {SEO description}, {Offer}, {Topics}, {Body (Markdown)}, {Author}, {Image URL}, {Image alt text}, {Image caption}, {Publish date}, {Approved to publish}, {Exclude from search engines}, {Intent}), DATETIME_FORMAT(SET_TIMEZONE(LAST_MODIFIED_TIME({Title}, {Content ID}, {Type}, {Slug}, {SEO description}, {Offer}, {Topics}, {Body (Markdown)}, {Author}, {Image URL}, {Image alt text}, {Image caption}, {Publish date}, {Approved to publish}, {Exclude from search engines}, {Intent}), \"UTC\"), \"YYYY-MM-DDTHH:mm:ss.SSS[Z]\"), \"\")"
    }
  },
  {
    "name": "Live source edited at",
    "type": "singleLineText",
    "description": "TECHNICAL. Date éditoriale exacte capturée dans le build confirmé, jamais la date d'une lecture plus récente."
  },
  {
    "name": "Live type",
    "type": "singleLineText",
    "description": "TECHNICAL. Section réellement confirmée : insight ou guide."
  },
  {
    "name": "Modifiee depuis le deploiement",
    "type": "formula",
    "description": "Indicateur prudent : une édition ou un suivi manquant nécessite une nouvelle confirmation. Ne constitue pas une vérification HTTP.",
    "options": {
      "formula": "IF({Live version hash} != \"\", IF(OR({Live source edited at} = \"\", {Editorial changed at} = \"\", {Editorial changed at} != {Live source edited at}), \"oui\", \"\"), \"\")"
    }
  },
  {
    "name": "Erreurs",
    "type": "formula",
    "description": "Erreurs éditoriales courantes. Le validateur du build reste autoritaire, notamment pour les doublons et les liens.",
    "options": {
      "formula": "TRIM(IF({Approved to publish}, IF({Content ID} = \"\", \"identifiant manquant. \", \"\") & IF({Title} = \"\", \"titre manquant. \", \"\") & IF({Slug} = \"\", \"slug manquant. \", \"\") & IF({Type} = \"\", \"type manquant. \", \"\") & IF({Offer} = \"\", \"offre manquante. \", \"\") & IF({Author} = \"\", \"auteur manquant. \", \"\") & IF({Body (Markdown)} = \"\", \"texte manquant. \", \"\") & IF({SEO description} = \"\", \"description manquante. \", \"\") & IF({Publish date} = BLANK(), \"date manquante. \", \"\") & IF(AND({Type} = \"guide\", {Intent} = \"\"), \"intention manquante. \", \"\"), \"\") & IF(AND({Image URL} != \"\", {Image alt text} = \"\"), \"texte alternatif manquant. \", \"\") & IF(FIND(\"airtableusercontent.com\", {Image URL} & \"\") > 0, \"image temporaire. \", \"\"))"
    }
  }
];
