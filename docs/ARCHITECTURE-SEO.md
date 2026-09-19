# Architecture SEO et publication

Comment ajouter du contenu sans toucher à la mise en page, et ce qui reste à brancher.

## Ajouter un article

Un seul fichier à modifier : `src/content/insights.ts`. Ajouter une entrée au tableau.

```ts
{
  id: "im-2026-001",            // identifiant stable, jamais réutilisé
  slug: "planifier-une-fresque",
  title: "...",
  description: "...",           // sert aussi de meta description
  offer: "public-art",          // rattachement commercial
  status: "published",          // draft | approved | published
  publishAt: "2026-03-01",
  author: "Alexis",             // personne vérifiable
  topics: ["murals", "production"],
  image: { src: "...", alt: "..." },
  body: ["paragraphe", "paragraphe"]
}
```

Se produisent alors **automatiquement**, sans autre édition :

- la route `/insights/planifier-une-fresque` ;
- l'entrée dans l'index `/insights` ;
- l'entrée dans `sitemap.xml` ;
- le fil d'Ariane `Home / Insights / Titre` et son `BreadcrumbList` ;
- le lien contextuel vers la page d'offre `public-art` ;
- l'apparition dans la section « More on this » de cette page d'offre ;
- les liens croisés avec les autres contenus partageant l'offre ou un `topic`.

## Ajouter une page spécialisée

Même principe dans `src/content/landing-pages.ts`. Route générée : `/guides/[slug]`.

Ces pages répondent à une intention distincte. Ce n'est pas un générateur
service × secteur × ville : une combinaison sans intention propre produit
exactement les pages creuses que ce modèle sert à éviter.

## Où vit quoi

| Fichier | Rôle |
| --- | --- |
| `src/lib/publishing.ts` | La règle de publication, écrite une seule fois |
| `src/lib/routes.ts` | Registre des routes, dérivé du contenu |
| `src/lib/relations.ts` | Liens internes, calculés depuis `offer` et `topics` |
| `src/lib/sitemap.ts` | Sitemap index et sitemaps par groupe, dérivés du registre |
| `src/content/*.ts` | Contenu pur, aucun markup, aucun import de composant |
| `src/pages/**` | Gabarits, qui lisent le contenu et jamais l'inverse |

Le sitemap, les fils d'Ariane et les index lisent tous `routes.ts`. Plus aucune
liste d'URL n'est écrite en dur nulle part.

## Maillage interne et sitemaps

Tout descend du même instantané de contenu, résolu une fois par build. Pages,
index, liens, redirections, manifeste et sitemaps décrivent donc le même
instant et ne peuvent pas se contredire.

### Index paginés, articles ET guides

| URL | Contenu |
| --- | --- |
| `/insights`, `/insights/page/2`, ... | Tous les articles publiés |
| `/guides`, `/guides/page/2`, ... | Toutes les pages spécialisées publiées |

12 entrées par page. Chaque numéro de page est un vrai lien HTML, pas un
contrôle piloté en JavaScript, et **tous** les numéros sont rendus plutôt
qu'une fenêtre glissante : un contenu tombé de la première page reste à un clic
de l'index de sa rubrique.

Les guides n'avaient aucun index : ils n'étaient atteignables que par les
sélections courtes de contenus liés, ce qui laissait sans accès tout guide
sortant de ces sélections. C'est ce chemin qui manquait.

Les deux index sont liés depuis le pied de page, présent sur toutes les pages y
compris l'accueil. Le chemin est donc : accueil, index de rubrique, numéro de
page, contenu. Le lien n'apparaît que si la rubrique existe.

`scripts/validate-content.mjs` parcourt réellement les ancres du HTML généré à
partir de `/` et signale en erreur toute page qu'il n'atteint pas.

### Sitemap index

`/sitemap.xml` est un **index** qui référence un sitemap par groupe :

| Groupe | Contenu |
| --- | --- |
| `/sitemap-core.xml` | Accueil, offres, projets, studio, contact |
| `/sitemap-insights.xml` | Index paginés et articles |
| `/sitemap-guides.xml` | Index paginés et pages spécialisées |

Un groupe vide ne produit aucun fichier et n'est pas référencé : un sitemap
vide est une erreur remontée par les moteurs, pas une information.
`robots.txt` continue de pointer sur `/sitemap.xml`.

Ne sont listées que les URL canoniques indexables **générées par ce build**.
Brouillons, contenus futurs, fixtures, redirections et pages `noindex` en sont
absents, pour la même raison qu'ils ne produisent pas de route.

### Contrôle d'indexation par contenu

La case `Exclude from search engines` publie la page, la garde liée et
navigable, mais la marque `noindex, follow` et l'exclut du sitemap. La décision
est prise une seule fois, dans le registre des routes ; le gabarit lit son état
au lieu de le recalculer. La balise `robots` et le sitemap ne peuvent donc pas
diverger, et le contrôle de sortie le vérifie sur le HTML réel.

L'URL canonique et le groupe de sitemap restent calculés automatiquement à
partir du type de contenu.

### `lastmod`

Écrit uniquement à partir de `Content changed at`, que la confirmation de
déploiement ne met à jour que si le hash de la version déployée a réellement
changé. Conséquences directes :

- un rebuild qui ne modifie rien ne déplace aucune date ;
- l'écriture technique de confirmation ne la déplace pas non plus, puisque le
  hash est calculé sur le contenu rendu et exclut les champs qu'elle écrit ;
- un contenu jamais confirmé n'a pas de date : le sitemap **omet** `lastmod`
  plutôt que d'en inventer une.

Les pages fixes ne portent pas de `lastmod` : leur contenu n'est pas suivi
enregistrement par enregistrement, donc aucune date ne serait honnête.

Vérifié : deux builds successifs sur le même contenu produisent des sitemaps
identiques octet pour octet.

### Test en volume

```bash
npm run content:stress -- 100
```

Construit le site avec 100 contenus générés, puis exécute le contrôle complet.
Les enregistrements générés sont étiquetés, et un build normal refuse cette
étiquette : cette sortie ne peut pas être déployée par accident.

## Règle de publication

Écrite dans `isPublic()` et partagée par tous les types de contenu :

1. Les fixtures de test n'existent qu'en développement.
2. Un statut différent de `published` n'est jamais public.
3. Une `publishAt` future n'est pas encore publique.

Vérifié : les fixtures sont absentes du build de production, de ses routes, de
son HTML, du sitemap **et du ZIP de production** (48 entrées, aucune occurrence
de `template-test`, aucun dossier `insights/` ni `guides/`).

## Ce qui reste à brancher pour la publication programmée

Le modèle porte déjà `status` et `publishAt`, et `isPublic()` les applique. Il
manque **uniquement le déclencheur de rebuild**, car un site statique fige la
comparaison de dates au moment du build.

Point de connexion préparé : `.github/workflows/scheduled-rebuild.yml`.
Il est **inactif** : le cron est commenté et le secret n'existe pas.

Trois étapes pour l'activer :

1. Netlify, Site settings, Build & deploy, Build hooks : créer un hook.
   Il fournit une URL `https://api.netlify.com/build_hooks/<id>`.
2. Dépôt GitHub, Settings, Secrets and variables, Actions : ajouter le secret
   `BUILD_HOOK_URL`. Ne jamais committer cette URL : quiconque la détient peut
   déclencher des builds sans limite.
3. Décommenter le bloc `schedule` (20:00 UTC = 00:00 heure du Golfe) et pousser.

Avant l'étape 3, le workflow reste lançable à la main depuis l'onglet Actions,
ce qui est le moyen le plus simple de vérifier le hook avant d'automatiser.

Le workflow échoue explicitement si le secret est absent, et n'accepte que des
réponses HTTP 200 ou 201 : un hook refusé ne sera jamais rapporté comme un
succès.

## Non construit dans cette passe, volontairement

Génération automatique d'articles, calendrier éditorial, file de publication,
intégration IA. Le modèle et ses tests constituent le livrable ; « trois
articles par jour » est une capacité future, pas une promesse.
