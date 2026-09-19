# Passe 1 : compte rendu

Mise à jour après consolidation ciblée (offres, intitulés, redirections, questionnaire).

## Les trois offres

| Offre | Route | Couverture |
| --- | --- | --- |
| **Art for Brands** | `/what-we-do/art-for-brands/` | Communication, lancements, événements, campagnes, packaging et éditions limitées, live painting, contenus photo et vidéo autour de l'œuvre |
| **Art for Places** | `/what-we-do/art-for-places/` | Créations sur mesure pour un lieu précis, développées dans le respect de l'intention de design de l'architecte ou du designer |
| **Public Art & Mural Production** | `/what-we-do/public-art/` | Fresques et commandes publiques **de toute taille**, de la proposition artistique à la peinture et à la coordination. La grande échelle n'est pas une condition. |

Direction artistique et sélection de l'artiste adapté apparaissent explicitement dans les trois,
via le bloc « IN ALL THREE » présent sur chaque page d'offre, et comme choix propres dans le
questionnaire.

## Routes

| Route | État |
| --- | --- |
| `/` | Conservée, réordonnée |
| `/what-we-do/` | Conservée, synthèse des trois offres |
| `/what-we-do/art-for-brands/` | Créée |
| `/what-we-do/art-for-places/` | Créée |
| `/what-we-do/public-art/` | Conservée (URL inchangée, intitulé modifié) |
| `/work/`, `/work/[slug]/` | Conservées |
| `/studio/` | Conservée |
| `/discuss-a-project/` | Conservée, questionnaire |
| `/insights/`, `/insights/[slug]/` | Fondations, absentes de la production tant qu'aucun article n'est approuvé |
| `/landing/[slug]/` | Gabarit de page spécialisée, absent de la production |

### Redirections : conflit identifié et corrigé

Les quatre anciennes URLs étaient **générées en HTML dans le build de production** tout en ayant
une règle 301 dans `netlify.toml`. Netlify résout un fichier statique existant avant d'évaluer une
redirection : le fichier aurait donc gagné et la 301 ne se serait jamais déclenchée. `force = true`
est censé inverser cette précédence, mais publier un fichier concurrent en même temps qu'une règle
de redirection reste une ambiguïté inutile.

Corrigé : ces pages ne sont plus émises en production (`getStaticPaths` les réserve au
développement). `netlify.toml` est désormais la seule source de vérité, `force = true` conservé
comme seconde garantie.

| Ancienne URL | Destination 301 |
| --- | --- |
| `/what-we-do/brand-retail-environments` | `/what-we-do/art-for-brands` |
| `/what-we-do/art-activations` | `/what-we-do/art-for-brands` |
| `/what-we-do/hospitality-property-destinations` | `/what-we-do/art-for-places` |
| `/what-we-do/workshops-community` | `/what-we-do/art-for-places` |

**Non vérifié :** le comportement HTTP réel de ces 301 n'est testable que sur Netlify. En
prévisualisation locale ces URLs renvoient 404, ce qui est le résultat attendu d'un build sans
moteur de redirection. À tester après le premier déploiement.

## Questionnaire : les quatre parcours

Chacun exécuté jusqu'au récapitulatif, sur le build de production.

| Parcours | Présélection | Questions adaptées | Champ dimensions | Contact | Récapitulatif |
| --- | --- | --- | --- | --- | --- |
| **Art for Brands** | `art-for-brands` | Retail, environnement de marque, événement, campagne, bureau, autre | Masqué | Email seul | Atteint |
| **Art for Places** | `art-for-places` | Hôtellerie, résidentiel, bureau, communauté, destination, autre | Masqué | **Téléphone seul** | Atteint |
| **Public Art & Mural Production** | `public-art` | Façade, grand mur, espace public, programme multisite, autre | **Affiché** | Email seul | Atteint |
| **Not sure yet** | aucune | Marque, lieu, extérieur, indécis | Masqué | Email seul | Atteint |

Récapitulatif Art for Brands : Focus, Stage (« We need an artistic direction »), Needs from the
studio (« Art direction, Selecting the right artist »), Project, Location, Scale, Timeline, Budget
« Not defined yet », Name, Email.

Récapitulatif Art for Places : Focus, Stage, Needs from the studio (« Selecting the right artist,
Coordination on site »), Project, Location, Scale, Timeline, Budget indicatif en AED, Name, Phone.

Autres comportements vérifiés : retour arrière conservant les saisies, changement d'offre purgeant
les réponses devenues incompatibles (dimensions vidées et retirées du récapitulatif), validation du
nom, du contact et du format email, aucune requête sortante sur les quatre parcours, aucune donnée
personnelle en stockage navigateur.

## Contrôles exécutés

| Contrôle | Résultat |
| --- | --- |
| `astro check` | 0 erreur, 0 avertissement (43 fichiers) |
| Build de production | 11 pages, sans erreur |
| Liens internes (9 pages parcourues) | 0 lien cassé |
| Anciennes URLs absentes du build | Vérifié (404 en local, 301 attendues sur Netlify) |
| Débordement horizontal 320 / 390 / 1440 | Aucun |
| Fixtures de test exclues de la production | Aucune route, aucune occurrence HTML, absentes du sitemap |
| Tirets cadratins publics | Aucun |
| « Large-Scale Murals » résiduel | Aucun |
| Console navigateur | Aucune erreur |

### Non vérifié

- **Redirections 301 réelles** : configurées, non testées en HTTP.
- **Animations en fonctionnement normal** : voir ci-dessous.
- Appareils réels, Safari, lecteurs d'écran, performance mesurée.

## Rendu final et animations : deux choses distinctes

Ce sont deux vérifications séparées, et une seule des deux a pu être faite ici.

**Rendu final : vérifié.** Les captures montrent l'état stabilisé, celui qu'un visiteur voit une
fois l'animation terminée. Positions et tailles lues dans le DOM.

**Animation en fonctionnement normal : NON VÉRIFIÉE.** Ce navigateur ne compose pas les images en
continu, donc `requestAnimationFrame` ne tourne pas et la timeline GSAP n'avance jamais d'elle-même.
Mesuré : sans intervention, le titre restait à opacité 0 même après 3 secondes.

Cela a révélé une fragilité réelle, indépendante de l'outillage : la séquence met le titre et les
CTA à opacité 0 avant de les révéler. Si le ticker cale, le hero reste vide. Un filet de sécurité a
été ajouté (`Hero.astro`) : au bout de 3 secondes, la timeline est forcée à son état final si elle
n'a pas abouti. Vérifié : le contenu se résout désormais seul, sans intervention.

La fluidité et le ressenti de l'animation restent à juger sur un vrai navigateur.

### Captures : limite

Les captures sont fiables en haut de page après chargement. Après défilement, le rendu revient
partiel ou noir dans cet environnement. Le contenu situé plus bas a donc été vérifié par mesure DOM
plutôt que par capture.
