# Impact Murals

Site Astro statique, hébergement prévu sur Netlify, contenu éditorial dans Airtable.

## Commencer ici

Cette archive contient les **sources**, pas un dossier prêt à glisser dans Netlify Drop.
Les corrections SEO du 1 septembre 2026 sont décrites dans `LIRE-MOI-CORRECTIONS-SEO.md`.
Pour activer le système : `docs/SEO-ACTIVATION.md`.

```bash
npm ci
npm test
npm run dev
```

Pour une construction locale sans contenu Airtable : copier `.env.example` vers `.env`, conserver `CONTENT_SOURCE=fixtures`, puis `npm run build`.
Les vraies variables d'environnement priment sur le fichier local. Aucun jeton ne doit être commité.

## Contenu et fichiers utiles

- Trois offres : `src/content/offers.ts`.
- Coordonnées et mode du questionnaire : `src/content/global.ts`.
- Réglages SEO : `src/content/seo.ts` et `astro.config.mjs`.
- Articles et guides : Airtable, une cellule Markdown par contenu.
- Format des lots : `docs/SEO-IMPORT-FORMAT.md`.
- Schéma Airtable : `docs/AIRTABLE-SCHEMA.md`.
- Gabarits et routes : `src/pages`, `src/layouts`, `src/lib/routes.ts`.

Les anciens briefs dans `prompts/`, `START-HERE.md` et les comptes rendus antérieurs sont historiques. Ne pas relancer une refonte depuis ces briefs pour intégrer les corrections SEO.

## Vérifications

```bash
npm test
npm run build
npm run content:integration
npm run content:stress -- 100
```

Les deux dernières commandes génèrent des sorties de test dans `dist`. **Ne jamais déployer ces sorties.** Reconstruire avec la source voulue avant un déploiement. Aucun test de régression ne modifie la vraie base.

## État de livraison

Code corrigé et tests locaux réalisés. Cinq champs de suivi ajoutés dans la seule base Impact Murals SEO. Aucun déploiement, aucun import réel d'article et aucune programmation activée. Le questionnaire reste en mode prévisualisation, hors périmètre de cette correction SEO.
