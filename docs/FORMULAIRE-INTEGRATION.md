# Formulaire de demande : intégration

Le module `impact-murals-enquiry` remplace l'ancien questionnaire. Il n'existe
qu'un seul parcours sur le site.

## Raccords effectués

| Élément | Décision |
| --- | --- |
| Runtime | `assets/*` copiés dans `src/lib/enquiry/` (5 fichiers JS/CSS + 2 `.d.ts`) |
| Licence | `LICENSE.md` et `COPYING` conservés à côté du code (GPL-2.0-or-later) |
| Montage | `src/components/EnquiryFlow.astro`, monté une seule fois sur `/discuss-a-project` |
| Ancien parcours | `src/lib/enquiry-transport.ts` supprimé, `src/content/enquiry.ts` réduit au texte de page |
| Coordonnées | Lues depuis `src/content/global.ts`, jamais codées en dur dans le module |
| Thème | Variables `--imq-*` surchargées vers les tokens du site, dans le composant |

Le vert de démo, les arrondis 16 px et la carte flottante ont été neutralisés
par surcharge CSS, sans éditer le module : il reste remplaçable tel quel.

Non copiés, conformément à la consigne : `index.html`, `demo.css`, `demo.js`,
`qa/`, `tests/`, `README.md`, `package.json` et `_headers`. Ce dernier contient
un `noindex` global destiné à la démo. Vérifié : aucun `noindex` sur le site.

## Mappage des CTA

Vérifié sur les 9 pages construites.

| Provenance | Destination |
| --- | --- |
| CTA générique | `/discuss-a-project` |
| Art for Brands | `/discuss-a-project?offer=art-for-brands` |
| Art for Places | `/discuss-a-project?offer=art-for-places` |
| Public Art & Mural Production | `/discuss-a-project?offer=public-art` |

## Tests exécutés

Suite du module, telle que fournie : **64/64 passent**.

Dans le site reconstruit, en prévisualisation de production :

| Test | Résultat |
| --- | --- |
| 4 routes (brands, places, public-art, unsure) jusqu'au bout | Complètes |
| Sans brief, sans société, sans budget, sans dimensions | Envoi possible |
| Email seul | Accepté |
| Téléphone seul | Accepté |
| Les deux | Accepté |
| Ni l'un ni l'autre | Refusé, message explicite sur les deux champs |
| 3 présélections | Démarrent à l'étape 2 avec la bonne offre |
| Présélection invalide | Retombe sur l'étape 1 |
| Retour arrière après saisie | Brief et contact conservés |
| Changement d'offre après saisie | Brief et contact conservés, formats obsolètes retirés |
| Déclaration Netlify | 1 seule, 14/14 champs, `form-name`, `data-netlify`, honeypot |
| Requêtes sortantes en mode preview | Aucune |
| Stockage navigateur | Vide |
| Focus au changement d'étape | Revient sur le titre, titre dans le viewport |
| Labels | Tous les champs étiquetés |
| Honeypot | `aria-hidden`, `tabindex="-1"`, non focusable, ne déborde pas |
| Cibles tactiles | 48 px minimum |
| 320 px et 390 px | Aucun débordement sur les 3 étapes |
| Desktop 1440 | Conforme |

`astro check` 0 erreur, build 11 pages, sitemap 11 URLs, aucune fixture de
test, aucun tiret cadratin.

Un `hint` TypeScript subsiste dans `src/lib/enquiry/enquiry.js` (variable
`index` inutilisée). Non corrigé volontairement : éditer le module vendored
compliquerait son remplacement. Ce n'est ni une erreur ni un avertissement.

## Non vérifié

**La réception réelle n'a pas été testée.** Le site n'a pas été déployé et le
mode est `preview`. Rien ne permet aujourd'hui d'affirmer que le site est prêt
à recevoir des prospects.

## Ce qui reste à activer

L'envoi réel est bloqué par **deux verrous indépendants**, et c'est voulu :

1. `global.enquiry.mode` vaut `"preview"`.
2. Le module refuse d'envoyer si `global.privacyUrl` est vide **ou** si le
   formulaire statique n'est pas détecté par Netlify. Le drapeau seul ne peut
   donc pas produire une fausse confirmation.

Pour passer en réel, dans cet ordre :

1. **Publier une notice de confidentialité** et renseigner `privacyUrl` dans
   `src/content/global.ts`. Sans elle, le module refuse d'envoyer, ce qui est
   le comportement correct : pas de collecte de données personnelles sans
   notice publiée.
2. **Déployer une fois** pour que Netlify détecte le formulaire
   `impact-project-enquiry` dans le HTML construit.
3. **Vérifier la détection** dans Netlify, Forms. Le formulaire doit apparaître
   avec ses 14 champs.
4. **Configurer la notification** vers le destinataire souhaité. Attention :
   `contactEmail` dans le site est un lien public affiché au visiteur, ce n'est
   pas le destinataire serveur. Aucun destinataire de l'ancien plugin
   Graffiti.ae n'a été repris.
5. **Basculer** `global.enquiry.mode` sur `"netlify"` et redéployer.
6. **Tester avec des données fictives** : réception dans Netlify, notification
   email, échec réseau, nouvelle tentative, double clic. Une réponse HTTP 200
   signifie que la requête a été acceptée, **pas** qu'un email est arrivé.

Tant que l'étape 6 n'est pas faite, ne pas annoncer que le site reçoit des
demandes.
