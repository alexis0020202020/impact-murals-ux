# Base Airtable Impact Murals SEO

Base : `appwkQjq00zjOBZjt`. Table : `Contenus`, `tblEaF9ks8yJjDqoM`.

Les scripts d'import, de confirmation, de préparation et l'adaptateur de lecture sont verrouillés sur cette base. Ils ne parcourent aucune autre base. La source lit toute la table, sans vue filtrée susceptible de faire disparaître des pages.

## Champs éditoriaux

| Champ | Type | Utilisation |
| --- | --- | --- |
| Content ID | Texte court | Identifiant stable unique, jamais réutilisé |
| Type | Sélection | insight ou guide ; ne pas changer après publication sans migration |
| Title | Texte court | Titre du contenu |
| Slug | Texte court | Minuscules avec tirets |
| SEO description | Texte long | Description et résumé |
| Offer | Sélection | art-for-brands, art-for-places ou public-art |
| Topics | Sélection multiple | Thèmes pour le maillage |
| Body (Markdown) | Texte long | Une cellule, mise en page automatique |
| Author | Texte court | Auteur réel |
| Image URL | URL | URL durable ou chemin /assets/... |
| Image alt text | Texte court | Obligatoire si image |
| Image caption | Texte court | Facultatif |
| Publish date | Date | Date sans heure, YYYY-MM-DD |
| Approved to publish | Case à cocher | Autorisation, jamais cochée par un import |
| Exclude from search engines | Case à cocher | Page générée mais noindex et hors sitemap |
| Intent | Texte long | Question distincte pour un guide |

Une date future seule ne publie rien : il faut autorisation, contenu valide et build réussi après cette date. Ne pas reporter dans le futur une page déjà publiée : le build refusera cette opération pour éviter de supprimer son ancienne URL.

## Champs techniques et suivi

| Champ | Type | Utilisation |
| --- | --- | --- |
| Live version hash | Texte court | Empreinte du contenu réellement confirmé |
| Live slug | Texte court | Dernier slug confirmé |
| Slug history | Texte long | Historique cumulatif, virgules ou sauts de ligne |
| Last deploy confirmed | Texte court | Horodatage du build vérifié, utilisé contre les confirmations anciennes |
| Content changed at | Texte court | Date de changement de la version confirmée |
| Last edited | Dernière modification | Ancien témoin conservé ; il omet Intent, donc ne plus l'utiliser pour le suivi automatisé |
| Editorial changed at | Formule | Date des 16 champs éditoriaux, Intent inclus, champs techniques exclus |
| Live source edited at | Texte court | Valeur exacte d'Editorial changed at capturée dans le build confirmé |
| Live type | Texte court | Section confirmée, insight ou guide |
| Modifiee depuis le deploiement | Formule | oui si une édition ou un suivi incomplet nécessite une nouvelle confirmation |
| Erreurs | Formule | Signalement des principaux champs manquants ; le validateur reste autoritaire |

Les cinq derniers champs ont été créés et leurs types/formules vérifiés le 1 septembre 2026. **27 champs au total.** Aucun article ni enregistrement de test ajouté. Artective n'a pas été consulté ou modifié.

Les formules exécutables sont dans `scripts/lib/tracking-fields.mjs`, reprises par `scripts/setup-airtable.mjs`. Les outils disponibles ne permettent pas de régler les vues. Les filtres ci-dessous restent à appliquer ou vérifier dans l'interface.

## Vues conseillées

| Vue | Filtre |
| --- | --- |
| Brouillons | Approved to publish décochée |
| Prêts et programmés | Approved to publish cochée ET Live version hash vide |
| Versions confirmées | Approved to publish cochée ET Live version hash non vide ET Modifiee depuis le deploiement vide |
| Modifications en attente | Modifiee depuis le deploiement non vide |
| Erreurs | Erreurs non vide |

Un hash non vide isolé ne prouve pas que les dernières modifications sont en ligne. Une édition puis annulation de cette édition peut conserver l'indicateur d'attente jusqu'à la prochaine confirmation : c'est volontairement prudent. Ces vues ne sont pas un contrôle HTTP de disponibilité.

La confirmation ne touche jamais au contenu éditorial ni à l'autorisation. Elle enregistre le manifeste du build, et non une version relue ensuite. Pour un retrait volontaire présent dans ce manifeste, elle efface les marqueurs live tout en conservant l'historique des URL.

## Lastmod

Une date Content changed at n'est réutilisée que si le hash actuel correspond encore au hash confirmé. Sinon le sitemap omet lastmod jusqu'à disposer d'une date fiable ; il n'affiche pas la date de l'ancienne version. Les index ne disposent pas d'un historique de composition, donc leur lastmod est omis. L'absence de lastmod n'empêche pas l'indexation.

## Accès

| Variable | Droits Airtable | Emplacement |
| --- | --- | --- |
| AIRTABLE_API_KEY | data.records:read | Build Netlify |
| AIRTABLE_WRITE_API_KEY | data.records:read et data.records:write | Import local et confirmation serveur |
| AIRTABLE_SCHEMA_API_KEY | schema.bases:read et schema.bases:write | Préparation ponctuelle seulement |

Tous ces jetons sont limités à la seule base Impact Murals SEO. Ne pas étendre les droits du jeton de lecture pour résoudre une erreur d'import. La confirmation nécessite aussi la vérification Netlify décrite dans `SEO-ACTIVATION.md`.

## Commandes

```bash
npm run content:setup
npm run content:setup -- --apply
npm run content:import -- content-batches/mon-lot.json
```

Sans jeton de schéma, setup affiche la structure mais ne peut pas vérifier les champs distants. Les champs formule peuvent ne pas être créables par certaines versions de l'API de métadonnées ; ceux de cette base ont déjà été créés par l'intégration Airtable.

La table vide est refusée par défaut en mode Airtable. Pour un premier site sans articles, utiliser explicitement CONTENT_SOURCE=fixtures, confirmation désactivée. Ne jamais utiliser ce mode pour reconstruire un site ayant déjà des articles.
