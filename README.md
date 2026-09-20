# Impact Murals : dossier de travail UX pour Claude

Ce dossier est une copie autonome des sources V2-80 corrigées. Il contient déjà le contexte, le brief final et les garde-fous pour la prochaine passe UX/UI.

Le code du site n'a pas été redessiné pour préparer ce pack. Les modifications de ce pack concernent uniquement la documentation.

## Où l'installer sur ton PC

Exemple de dossier dédié sous Windows :

`C:\Projects\Impact-Murals\impact-murals-ux`

Extrais l'archive dans `C:\Projects\Impact-Murals\`, puis ouvre le sous-dossier `impact-murals-ux` dans Claude Code. Le bon dossier contient directement `package.json`, `CLAUDE.md` et `src`.

Ne travaille pas à l'intérieur du ZIP. N'ouvre pas un dossier parent contenant aussi Artective ou plusieurs anciennes versions. N'écrase pas un dossier de travail existant : si tu as fait de nouvelles modifications après la V2-80 corrigée, conserve-les et fais comparer les versions avant toute intégration.

L'archive téléchargée constitue ta copie de départ. Aucun dépôt distant n'est configuré par ce pack.

## Message à donner à Claude

Lis intégralement CLAUDE.md, README.md, CONTEXT.md, UX-BRIEF.md et docs/UX-TECHNICAL-GUARDRAILS.md. Puis prends connaissance de docs/UX-REVIEW-LOG.md et docs/UX-HANDOFF.md.

Travaille uniquement dans ce dossier. Pars des sources V2-80 corrigées présentes ici, vérifie ce qui fonctionne déjà et implémente la prochaine passe UX/UI. Le brief complet est UX-BRIEF.md. Réalise au minimum 15 cycles réels de revue, correction si nécessaire et nouvelle vérification. Continue sans demander une validation intermédiaire pour les choix réversibles. Respecte les systèmes protégés, documente les vérifications réellement effectuées et ne prétends jamais avoir testé ce que l'environnement ne permet pas de vérifier.

## Documents actifs

| Fichier | Rôle |
| --- | --- |
| `CLAUDE.md` | Instructions de travail et ordre de lecture |
| `CONTEXT.md` | Positionnement, trois offres et objectifs commerciaux |
| `UX-BRIEF.md` | Prompt final complet pour cette passe |
| `docs/UX-TECHNICAL-GUARDRAILS.md` | Architecture et fonctionnement à préserver |
| `docs/UX-REVIEW-LOG.md` | Journal des 15 cycles minimum, à remplir réellement |
| `docs/UX-HANDOFF.md` | État de départ et point de reprise à tenir à jour |

Les anciennes versions de README, CLAUDE, START-HERE et BUILD_PROMPT sont conservées dans `docs/archive/pre-ux-pass/`. Les anciens PRODUCT, DESIGN, prompts V1 et comptes rendus restent consultables, mais ne définissent pas la mission actuelle.

En cas de divergence entre les documents du projet, les documents actifs ci-dessus remplacent les anciennes consignes de refonte. Ils ne permettent jamais de contourner une restriction de sécurité ou une instruction explicite de l'utilisateur.

## Prévisualisation locale, pour Claude

Utiliser les versions du fichier de verrouillage. Si les dépendances sont absentes et que l'installation est autorisée :

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Astro affiche l'adresse locale. Ne pas copier une ancienne adresse de session.

Sans connexion Airtable, le mode développement dispose déjà de contenus de démonstration. Ne pas demander de jeton et ne pas modifier la configuration du contenu réel pour cette passe visuelle.

Contrôles locaux disponibles :

```sh
npm run check
npm test
```

Si un outil ou l'installation est bloqué, noter précisément la limite et continuer les tâches sûres possibles. Ne pas installer de nouveaux outils ou remplacer la stack pour contourner le problème.

## État réel au départ

- Base : V2-80 corrigée, avec 89 tests réussis lors de la vérification précédente.
- Trois pages de projets fictifs sont exclues des routes publiques et des liens associés ; les données restent dans les sources.
- Le questionnaire est configuré en mode `preview`, la notice de confidentialité n'est pas renseignée : ne pas prétendre recevoir les demandes.
- La connexion réelle à Airtable et les services externes n'ont pas été vérifiés pour préparer ce pack.
- Les images restent provisoires. Leur remplacement n'est pas un prérequis à cette passe UX.
- Le design de cette nouvelle passe et les 15 cycles n'ont pas encore été réalisés.

<!-- production rebuild trigger: 2026-09-20 -->
