# Corrections SEO et Airtable

Livraison du 1 septembre 2026, à partir de impact-murals-source(1).zip.

Un ZIP de dist a ensuite été généré pour dépôt manuel. Les quatre redirections des anciennes offres et les en-têtes nécessaires sont désormais aussi inclus dans le dossier publié. Aucun article de test n'est présent dans ce dist. Le dépôt manuel n'active pas la synchronisation Airtable.

## Corrigé dans les sources

- Import : jeton d'écriture distinct, scope verrouillé sur Impact Murals, validation et détection des collisions aussi sur les mises à jour.
- Reprise d'import : aucun rejeu aveugle de POST après une réponse perdue ; reprise par relecture. noIndex pris en charge.
- Redirections : historique texte Airtable correctement parsé, contrôlé et conservé après plusieurs renommages.
- Pause : refus de tous les builds de production, y compris si des autorisations ou des lignes ont disparu.
- Date du sitemap : omission lorsqu'elle ne correspond plus à la version générée ; pas de date inventée pour les index.
- Pages existantes : report dans le futur et changement de section refusés sans migration explicite.
- Confirmation : module Netlify onSuccess branché dans le code, vérification réelle du site et du déploiement par API, manifeste lié au déploiement par une empreinte, contrôles contre les confirmations anciennes et reprises idempotentes.
- Prévisualisations Netlify : en-tête noindex.
- Calendrier : créneaux prêts, activation par variable GitHub ; rien activé à distance.
- Build : fichiers de redirections/manifeste obligatoires ; liens internes cassés désormais bloquants.
- .env local chargé aussi pour les builds Astro.

## Modifié réellement dans Airtable

Dans la seule base Impact Murals SEO, cinq champs ajoutés :
Editorial changed at, Live source edited at, Live type, Modifiee depuis le deploiement et Erreurs.
Les trois formules ont été acceptées et déclarées valides par Airtable.

La table passe de 22 à 27 champs. Aucun article ajouté ou modifié. Aucun accès à Artective.
Les filtres des vues n'ont pas été modifiés : les outils disponibles ne donnent pas accès à ces réglages. Les filtres prêts à appliquer sont dans docs/AIRTABLE-SCHEMA.md ; ils ne bloquent pas le pipeline.

## Tests réalisés

- Suite de tests de production et de régression : 87 tests réussis après ajout du contrôle de dépôt manuel.
- Build initial complet : 11 pages, contrôles réussis.
- Test de volume de 100 contenus : 103 pages, 95 URL dans les sitemaps, 8 pages noindex exclues, aucune page orpheline.
- Test d'intégration local : vrai adaptateur Airtable, vrai build Astro, pages article et guide, brouillon incomplet et date future exclus, trois redirections, sitemap cohérent, manifeste puis confirmation simulée idempotente.
- Compatibilité contrôlée avec Node 22.23.2 ; tests également exécutés sous Node 24.19.0.

Les API d'écriture ont été simulées pendant les tests. Aucun déploiement public effectué. Le comportement HTTP réel sur le projet Netlify reste à vérifier après configuration.

## À faire une seule fois

Suivre docs/SEO-ACTIVATION.md : intégrer les sources au dépôt, configurer les jetons dans le bon projet Netlify, faire un essai avec un contenu relu, vérifier le domaine et activer le calendrier.

Un seul pipeline doit gérer les publications ; ne pas lancer des imports ou confirmations concurrents. Les limites de concurrence et de rollback sont explicites dans le guide.

## Important pour transmettre à Claude

Ce ZIP contient les SOURCES corrigées, pas dist. Ne pas le déposer directement dans Netlify Drop.
S'il a modifié le site entre-temps, lui demander de fusionner les corrections SEO sans écraser ses changements. Aucune refonte visuelle n'est nécessaire pour cette intégration.

Le design, les offres, les images provisoires et le questionnaire ont été conservés. Le questionnaire reste en preview ; la réception des demandes et la notice de confidentialité constituent un travail distinct avant la prospection.
