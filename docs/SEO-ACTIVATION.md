# Activer la publication SEO

Le code est prêt à être raccordé. Aucun service ni calendrier n'a été activé pendant la correction.
Les tests locaux et les services simulés ne remplacent pas un essai sur le vrai projet Netlify.

## 1. Installer ces sources dans le bon dépôt

Cette archive est un projet Astro, pas le dossier statique à glisser dans Netlify Drop.
Intégrer les fichiers dans le dépôt de ce site. Si Claude a effectué d'autres changements entre-temps, fusionner les corrections, ne pas écraser son travail.

L'automatisation prévue exige que Netlify construise le site depuis ce dépôt :

- Commande : npm run build.
- Dossier publié : dist.
- Node : 22, défini dans netlify.toml.
- Module local netlify/plugins/editorial-confirm, déjà référencé dans netlify.toml.

Un dépôt manuel de dist sur Netlify reste possible pour une prévisualisation mais n'exécute ni le build, ni le module, ni la programmation.

## 2. Définir les accès, sans les coller dans un chat

Dans les variables du SEUL projet Netlify Impact Murals, contexte production et portée build :

| Variable | Valeur |
| --- | --- |
| CONTENT_SOURCE | airtable |
| AIRTABLE_BASE_ID | appwkQjq00zjOBZjt |
| AIRTABLE_TABLE_NAME | Contenus, facultatif |
| AIRTABLE_API_KEY | Jeton Airtable lecture seule, cette base uniquement |
| AIRTABLE_WRITE_API_KEY | Jeton séparé lecture + écriture, cette base uniquement |
| NETLIFY_AUTH_TOKEN | Jeton permettant la vérification du projet et de ses déploiements |
| CONTENT_CONFIRMATION_ENABLED | true, seulement pour l'essai contrôlé puis l'exploitation |
| PUBLISHING_PAUSED | false |

SITE_ID, DEPLOY_ID et CONTEXT sont fournis par Netlify lors du build. Ne pas recopier un identifiant de déploiement précédent.
Ne pas définir AIRTABLE_VIEW_NAME : l'intégralité de la table doit être lue.

Le jeton de lecture ne gagne aucun droit d'écriture. Le jeton d'écriture est utilisé par le module serveur après publication, jamais par le navigateur. Il est disponible dans l'environnement serveur : cela ne constitue pas une isolation de sécurité entre du code de build malveillant et le module. Protéger l'accès au dépôt et ne pas exposer les secrets aux pull requests non fiables.

NETLIFY_AUTH_TOKEN est distinct des jetons Airtable. Le code l'utilise uniquement pour deux lectures du site précis et du déploiement précis ; il ne configure ni ne déploie d'autres sites. Ne pas demander un accès à Artective.

## 3. Faire un essai réel limité

Importer un seul contenu relu, avec son identifiant stable. Vérifier qu'il est d'abord non autorisé.
La table vide est bloquée par défaut en mode Airtable. Un brouillon suffit pour tester le branchement sans publier d'article.

1. Construire avec un brouillon : aucune page éditoriale publique attendue.
2. Autoriser ce contenu avec une date passée, lancer un build.
3. Vérifier sa page, son canonical, le sitemap et le journal de confirmation.
4. Vérifier dans Airtable Live version hash, Live slug, Live type et Live source edited at.
5. Modifier le texte : l'indicateur d'attente doit se remplir. Reconstruire et contrôler sa remise à zéro.
6. Si l'essai de renommage est autorisé, renommer, construire, confirmer et contrôler les anciennes URL en HTTP.
7. Tester la pause : un build doit être refusé sans changer le site déjà en ligne.

Ne pas activer un volume important avant cet essai. Ne pas utiliser les articles synthétiques des tests locaux comme contenu public.

## 4. Ce que fait la confirmation

Le module s'exécute sur l'événement Netlify onSuccess, après le déploiement, uniquement en production et si CONTENT_CONFIRMATION_ENABLED=true.

- Le build écrit .deploy/manifest.json hors du dossier public.
- Une empreinte de ce manifeste, sans son contenu privé, est servie dans deploy-proof.json, avec un en-tête noindex.
- Le module vérifie auprès de l'API Netlify que le déploiement est ready, de production et actuellement publié sur le bon site.
- Il compare son manifeste avec l'empreinte sur l'URL immuable de ce déploiement.
- Il confirme les versions exactes enregistrées dans le manifeste. Une édition Airtable arrivée pendant le build n'est pas présentée comme publiée.
- Il refuse une confirmation ancienne ou conflictuelle et revérifie le déploiement autour de chaque lot d'écriture.
- Un PATCH en erreur n'est pas rejoué aveuglément.

La variable DEPLOY_STATE=ready et l'ancien paramètre --allow-unverified-deploy ne permettent plus de contourner la vérification.

Le module sauvegarde aussi .deploy dans le cache privé de build lorsqu'il est activé. La confirmation normale utilise le manifeste du build courant, jamais un cache restauré à sa place. En cas d'échec de confirmation, le site peut déjà être en ligne : consulter l'erreur puis relancer un build contrôlé. Le cache n'est pas un historique d'archives durable.

### Concurrence et reprises

Utiliser un seul pipeline de production pour ce site, et éviter une confirmation manuelle pendant un build. Pour le démarrage, prévoir une seule construction de production à la fois. Le groupe concurrency du calendrier sérialise les demandes de lancement GitHub, pas l'intégralité des builds Netlify.

Les contrôles de fraîcheur détectent les confirmations anciennes et les déploiements remplacés, mais Airtable ne fournit pas ici de transaction distribuée entre son écriture et la publication Netlify. Une modification concurrente entre un contrôle et une écriture peut donc exiger une réconciliation. Ne pas promettre un verrou distribué que ce code n'implémente pas.

Un rollback vers un ancien manifeste n'est pas confirmé automatiquement contre un suivi plus récent. Pour rétablir un contenu, préférer un nouveau build de la version désirée, ou traiter le rollback comme une opération de maintenance explicite.

## 5. Activer le calendrier

Dans Netlify, créer un build hook pour la branche de production.
Dans le dépôt GitHub concerné :

- Secret BUILD_HOOK_URL : URL du hook.
- Variable SEO_AUTOPUBLISH_ENABLED : true après l'essai.

Le fichier .github/workflows/scheduled-rebuild.yml porte déjà les trois créneaux 09 h, 13 h et 18 h Dubaï. Sans la variable d'activation, les exécutions programmées sont ignorées. Un lancement manuel reste disponible.

Le champ Airtable Publish date est une date sans heure. Plusieurs articles portant la même date seront éligibles ensemble au premier build du jour. Trois créneaux ne signifient ni trois articles maximum, ni un étalement automatique du lot. Les déclencheurs programmés ne sont pas une garantie de publication à la minute près.

## Pause

Le commutateur autoritaire est PUBLISHING_PAUSED=true dans l'environnement de build Netlify.
Il refuse TOUS les nouveaux builds de production. Le déploiement existant reste en ligne, même si des lignes ont été supprimées ou des autorisations décochées depuis.
Il bloque également la publication d'un correctif de design ; lever la pause avant un build voulu.

La variable GitHub PUBLISHING_PAUSED=true arrête seulement les demandes du calendrier. Elle n'est pas transmise automatiquement par le hook à Netlify.
La pause ne retire pas un déploiement et n'annule pas rétroactivement un build déjà en cours.

## Domaine et prévisualisations

Le canonical reste https://impactmurals.ae. Raccorder ce domaine à la bonne version avant la soumission à Search Console. Vérifier en HTTP robots.txt, sitemap.xml, les trois groupes éventuels et les redirections.

Les déploiements Netlify de prévisualisation reçoivent X-Robots-Tag: noindex, nofollow par le module. Ce mécanisme ne s'exécute pas lors d'un simple upload manuel de dossier. Les URL Netlify de production conservent le canonical du domaine final.

Pour prévisualiser sans accès Airtable, définir CONTENT_SOURCE=fixtures dans les contextes deploy-preview et branch-deploy seulement. Garder les jetons d'écriture et CONTENT_CONFIRMATION_ENABLED=true réservés à la production.

## Références officielles

- [Événements des modules de build Netlify](https://docs.netlify.com/extend/develop-and-share/develop-build-plugins/).
- [API Netlify : sites et déploiements](https://open-api.netlify.com/).
- [Suivi des champs éditoriaux Airtable](https://support.airtable.com/articles/6644451618-returning-record-data-in-airtable).
