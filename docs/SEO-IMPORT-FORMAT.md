# Import d'articles et de guides

Un lot est un fichier JSON avec un tableau `records`, ou directement un tableau. Exemple :

```json
{
  "records": [{
    "id": "im-2026-0001",
    "type": "insight",
    "title": "Titre à remplacer",
    "slug": "titre-a-remplacer",
    "description": "Description à remplacer.",
    "offer": "public-art",
    "topics": ["murals", "production"],
    "author": "Alexis",
    "publishAt": "2026-09-15",
    "noIndex": false,
    "body": "## Première section\\n\\nTexte en Markdown."
  }]
}
```

## Champs

| Champ | Règle |
| --- | --- |
| id | Stable, unique, sans espaces autour ; ne pas le modifier après import |
| type | insight ou guide |
| title, slug, description, offer, author, body | Obligatoires |
| slug | Minuscules séparées par des tirets |
| offer | art-for-brands, art-for-places ou public-art |
| topics | Tableau de noms, recommandé |
| publishAt | Facultatif, date valide YYYY-MM-DD sans heure |
| intent | Obligatoire pour un guide |
| noIndex | Facultatif, booléen true/false |
| image | Facultatif, objet src + alt obligatoire + caption facultative |

Le corps est une seule cellule Markdown. Les titres, paragraphes, tableaux, listes, images, ancres, sommaire et CTA utilisent les gabarits du site. Aucune mise en page par article.

Utiliser des images durables. Les URL de pièces jointes airtableusercontent.com sont refusées. Le HTML est assaini par le moteur de rendu.

## Configuration locale

Copier `.env.example` en `.env`, sans jamais commiter le fichier rempli.

- AIRTABLE_BASE_ID : appwkQjq00zjOBZjt.
- AIRTABLE_WRITE_API_KEY : jeton lecture + écriture limité à cette base, obligatoire pour --apply.
- AIRTABLE_API_KEY : jeton lecture seule, facultatif pour comparer un lot en simulation.

Les scripts chargent .env. Les variables déjà définies dans l'environnement priment.

## Commandes

```bash
npm run content:import -- content-batches/mon-lot.json
npm run content:import -- content-batches/mon-lot.json --apply
npm run content:import -- content-batches/mon-lot.json --apply --allow-updates
```

Sans --apply, aucune écriture. Sans accès, la simulation valide seulement le fichier, pas ses collisions avec Airtable.
Sans --allow-updates, les identifiants déjà présents sont ignorés. Les champs facultatifs absents d'une mise à jour sont conservés. noIndex:false enlève explicitement l'exclusion.

L'import ne coche jamais Approved to publish et n'écrit jamais les champs de confirmation. **Cependant une mise à jour d'un article déjà autorisé pourra sortir au prochain build.** Pour relire une réécriture à l'abri de la publication, activer d'abord la pause Netlify ; ne pas décocher puis reconstruire en pensant conserver automatiquement l'ancienne page.

## Erreurs et reprise

Les doublons d'identifiant et collisions de routes sont contrôlés avant écriture, y compris lors des mises à jour et contre les URL historiques. Une migration de type insight vers guide est refusée sans procédure dédiée.

Un POST est envoyé une seule fois. Si sa réponse est perdue, l'importeur relit Airtable pour voir ce qui a réellement été créé. S'il manque une partie du lot, il s'arrête explicitement : relancer le même fichier reprend les créations manquantes. Il ne rejoue pas aveuglément la requête.

Une erreur de validation n'écrit rien. Une erreur réseau après le début d'un import peut laisser un lot partiel : l'import n'est pas une transaction. Ne pas lancer deux imports concurrents sur la même base ; Airtable n'impose pas l'unicité de Content ID au niveau de la base.

## Après import

Relire, choisir une date et autoriser dans Airtable. Le build programmé et la confirmation sont décrits dans `SEO-ACTIVATION.md`. Ils nécessitent un branchement initial, puis aucun ZIP ni ajustement de mise en page par article.
