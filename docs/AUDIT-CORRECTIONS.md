# Corrections de l'audit du 1er septembre 2026

> Document historique. Pour les corrections et le branchement actuels, lire LIRE-MOI-CORRECTIONS-SEO.md et docs/SEO-ACTIVATION.md. Les anciennes consignes de confirmation, de pause et de configuration ne font plus référence.

Chaque point est traité, avec le test qui empêche la régression.
Aucun accès Airtable, Netlify, GitHub ou Artective n'a été utilisé.

## 1. Confirmation de publication : implémentée

Il n'y avait que des champs déclarés. Il y a maintenant une chaîne complète.

Le build écrit `.deploy/manifest.json` : la liste exacte des enregistrements
publiés, chacun avec un hash de version calculé sur le contenu réellement rendu
(`src/lib/content-source/manifest.ts`). Ce fichier est déplacé **hors de `dist`**
par l'intégration de build, donc jamais servi publiquement.

`npm run content:confirm` s'exécute **après** un déploiement réussi et écrit ces
versions dans Airtable. Il lit le manifeste, **jamais Airtable**, pour décider
quoi confirmer : un article modifié pendant le build serait sinon confirmé à une
version jamais déployée.

- `DEPLOY_STATE` doit valoir `ready`. Sinon le script s'arrête.
- Idempotent : un enregistrement déjà confirmé à cette version est ignoré.
- Jeton d'écriture **distinct** (`AIRTABLE_WRITE_API_KEY`). Le jeton de lecture
  du build reste en lecture seule.

Le hash ignore volontairement `Last edited` : ce champ bouge dès qu'une cellule
change, y compris celles que la confirmation écrit elle-même, ce qui ferait
paraître chaque article modifié après chaque déploiement.

## 2. Workflow GitHub : corrigé

`secrets.X` dans un `if:` est interdit par GitHub. Le secret passe maintenant par
`env:` et le contrôle se fait dans le script. L'URL du hook n'est jamais affichée.

Le prérequis manquant est documenté en tête du fichier : **ce circuit exige que
Netlify construise depuis un dépôt Git.** Un dépôt manuel de dossier statique ne
crée pas de pipeline, et un build hook ne transforme pas un ZIP en pipeline.

## 3. Site vidé par configuration absente : corrigé

C'était le trou le plus sérieux. Une configuration manquante basculait
silencieusement sur les fixtures, **y compris en production**, et le garde-fou
« réponse vide » ne se déclenchait jamais puisque Airtable n'était pas appelé.

`src/lib/content-source/config.ts` sépare maintenant trois modes :

| Situation | Résultat |
| --- | --- |
| Production sans configuration | **Build refusé** |
| Configuration partielle, quel que soit l'environnement | **Build refusé** |
| `CONTENT_SOURCE=fixtures` explicite | Fixtures, assumé |
| Développement sans configuration | Fixtures |
| Airtable répond zéro enregistrement | **Build refusé**, sauf `ALLOW_EMPTY_CONTENT=true` |

Vérifié : `npm run build` sans configuration sort en code non-zéro. Netlify ne
déploie que les builds réussis, donc la dernière version reste en ligne.

## 4. Pause : appliquée à tous les chemins

`PUBLISHING_PAUSED` est désormais lu **par le build lui-même**, pas seulement par
le cron. Un rebuild lancé depuis Netlify ou par un changement de code ne peut
plus publier derrière la pause : seuls les enregistrements dont un déploiement
antérieur a été confirmé (`liveVersion` non vide) restent générés.

Les pages déjà en ligne sont donc préservées, les nouvelles sont retenues.

## 5. Métadonnées SEO : assainies

`JSON.stringify` n'échappe pas `<`, donc un titre contenant une fermeture de
balise script sortait intact et devenait exécutable via `set:html`.

`src/lib/json-ld.ts` échappe `<`, `>`, `&` et les séparateurs U+2028/U+2029.
Appliqué aux **quatre** emplacements : article, guide, fil d'Ariane, layout.

Testé : la charge hostile ressort sans `<`, avec `<`, et reste du JSON
valide dont le texte d'origine est intact après parsing.

## 6. Brouillons : non bloquants

La validation est séparée en deux niveaux.

- **Structurelle**, sur tous les enregistrements : identité, format de slug,
  offre connue, collisions. Un brouillon incomplet produit des *avertissements*,
  visibles mais non bloquants.
- **Complétude**, uniquement sur ce qui va réellement être publié. Là, un champ
  manquant est une erreur qui arrête le build.

Testé : un brouillon réduit à un titre coexiste avec un article valide, et seul
l'article valide est publié.

## 7. Redirections : corrigées

Trois défauts, trois corrections.

- **Trop tôt** : plus aucune redirection tant que la destination n'est pas
  publiée. Un renommage daté du mois prochain ne crée plus de 301 vers une page
  inexistante ; l'ancienne URL reste servie.
- **Perdues** : `Slug history` est un historique durable et cumulatif, alimenté
  par la confirmation. Deux renommages successifs conservent les deux anciennes
  URL, et la confirmation ne les efface plus.
- **Conflits** : une redirection qui masquerait une page vivante, ou qui
  entrerait en conflit avec une autre, est refusée et **listée en commentaire**
  dans `_redirects` avec sa raison.

## 8. Import : fiabilisé

- **`.env` réellement chargé** (`scripts/lib/load-env.mjs`). L'environnement réel
  garde la priorité.
- **`--apply` sans configuration échoue** avec le code 1 et le message
  « NOTHING WAS IMPORTED ». Il affichait auparavant une simulation réussie.
- **Collisions contre l'existant détectées** : l'importeur lit désormais les
  slugs et les types, pas seulement les identifiants.
- **Reprises non idempotentes traitées** : un POST échoué n'est jamais rejoué à
  l'aveugle. La base est relue, ce qui a réellement été créé est compté, et un
  import partiel produit un bilan précis avec le code 1.

## 9. Tests et calendrier

Les tests importent maintenant **le vrai code de production**, via un petit
chargeur TypeScript (`tests/ts-loader.mjs`) qui résout aussi l'alias `@/`. Ils ne
peuvent plus rester verts si l'implémentation diverge.

**24 tests, 24 passent.** Couvrent : la règle de publication et la programmation,
les brouillons non bloquants, l'injection JSON-LD, les quatre cas de
redirection, le hash de version, la pause, et les cinq modes de configuration.

`npm run build` exécute désormais `astro check`, le build, **puis**
`validate-content.mjs`. Une page sans canonique, sans description, avec plusieurs
`h1` ou contenant une fixture fait échouer le build.

**Calendrier** : trois créneaux ne garantissent pas trois articles étalés. Trois
contenus partageant une date deviennent tous éligibles au premier créneau du
jour. C'est documenté en tête du workflow : donnez des dates distinctes, ou
acceptez la publication groupée. Le schéma n'a pas été compliqué pour cela.

## Reste non vérifiable localement

- Les réponses HTTP réelles de Netlify et le comportement effectif des 301.
- Les droits réels des futurs jetons Airtable.
- Le fonctionnement bout en bout de la confirmation, qui exige un déploiement.

Ces points ne pourront être certifiés qu'après une activation autorisée.
