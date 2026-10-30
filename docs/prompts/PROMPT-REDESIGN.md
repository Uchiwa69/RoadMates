# Prompt — Redesign UX/UI de RoadMates

*À coller dans une session Claude Code ouverte à la racine du repo, sur la branche `design/front`.*

---

Tu es designer produit senior et développeur front React. Ta mission : transformer le prototype RoadMates en une application **magnifique, chaleureuse et évidente à utiliser**, avec un **effet « wow » dès la page d'accueil** grâce à un **globe terrestre 3D interactif**. Le résultat doit donner envie de partir en voyage et inspirer confiance.

## 1. Contexte à lire avant de toucher au code

Lis ces fichiers en entier, dans cet ordre :

1. `vision-produit-roadmates.md` — la promesse, la cible (Léa, 23 ans, Erasmus, budget serré, en quête de sécurité) et le parcours type.
2. `story-map-roadmates.md` — les user stories et leurs critères d'acceptation. **Le redesign ne doit en casser aucun.**
3. `PLAN-PROTOTYPE.md` — l'architecture du prototype et le déroulé de la démo (section 6).
4. `cahier-des-charges-roadmates.md`, §6 et §7 — les exigences de performance, d'accessibilité (RGAA) et d'écoconception (RSE).
5. Le code `app/src/` en entier.

**État actuel** : React 19 + Vite + React Router 6 (`HashRouter`, déployé sur GitHub Pages). Pas de back-end : les données vivent dans le `localStorage` via `app/src/shared/db.js`. Le code est en deux parties : `features/decouverte/` (inscription, voyages, compagnons) et `features/groupe/` (profil, demandes, groupes, dépenses). Le style actuel est volontairement minimal.

**Branche** : tu travailles uniquement sur `design/front`. Tu ne pousses jamais sur `main` et tu ne fusionnes rien.

## 2. Ce que tu ne dois pas casser

- **Le modèle de données et l'API** : `shared/db.js` (`useDb`, `updateDb`, `newId`), `shared/seed.js`, `shared/session.js`, `shared/paths.js`. Tu peux y ajouter, jamais renommer ni supprimer.
- **La logique métier** : `features/decouverte/{dates,matching,voyages,inscription,filtres}.js` et les fonctions de calcul de `features/groupe/` (parts, statuts de paiement). Tu changes l'affichage, pas les règles. Seule exception : tu peux ajouter des coordonnées `lat`/`lng` aux villes de `villes.js` et y ajouter des villes.
- **Les critères d'acceptation** de la story map : messages d'erreur, états vides, refus des dates passées, « 2 étapes sur 2 », part affichée en premier, paiement unique, etc.
- **Le parcours de démo** de `PLAN-PROTOTYPE.md` §6 doit se jouer de bout en bout à la fin de chaque lot.
- **Le sélecteur de démo « Je suis »** et le bouton « Réinitialiser la démo » restent accessibles, mais discrets (voir §5).

## 3. Direction artistique — « coucher de soleil »

**Intention** : la chaleur d'une fin de journée en voyage, entre amis rencontrés en route. Libre, solaire, rassurant, jamais « appli de rencontre ».

**Palette** : construis des tokens CSS sur `:root`, avec un mode clair et un mode sombre (`prefers-color-scheme` + bascule manuelle mémorisée).

| Rôle | Intention | Exemple de départ |
| --- | --- | --- |
| Primaire | Corail solaire, boutons et accents | `#FF6B5B` |
| Secondaire | Orange doré | `#FF9F45` |
| Accent | Rose crépuscule | `#F2558C` |
| Profondeur | Violet du soir, dégradés et mode sombre | `#6B3FD1` → `#1E1236` |
| Neutres | Sable et gris chauds, pas de gris froids | `#FFF8F3`, `#F3E9E1`, `#2A2230` |
| Succès / alerte / erreur | Lisibles, harmonisés avec la palette | à définir |

- **Signature visuelle** : un dégradé ciel couchant (orange → rose → violet) réservé au hero, aux moments forts (match, dépense complète) et au halo du globe. Ne pas en abuser.
- **Contraste** : le corail sur fond blanc ne passe pas en texte. Crée une variante foncée pour le texte et les liens, et vérifie **chaque** paire texte/fond à **4,5:1 minimum** (RSE-04).
- **Typographie** : une display expressive pour les titres et une sans-serif très lisible pour le texte. Par exemple Fraunces ou Clash Display, avec Plus Jakarta Sans ou Inter. **Auto-héberge les polices** avec `@fontsource`, pas d'appel à Google Fonts (RGPD).
- **Formes** : rayons généreux (12–24 px), ombres douces et chaudes (teintées de violet, pas de noir pur), surfaces légèrement translucides avec flou sur le hero.
- **Illustration** : pas de photos lourdes. Dégradés, formes SVG, avatars à initiales sur dégradé unique par voyageur, pictos d'une seule famille (Lucide ou Phosphor).

**Inspirations** : retiens les principes, ne copie ni les marques ni les visuels.

- **Airbnb** : la barre de recherche hero, les cartes, la hiérarchie claire, les états vides soignés.
- **Polarsteps** : le voyage raconté en étapes sur une carte, les timelines.
- **Stripe / GitHub** : le globe hero vivant, avec arcs animés entre les points.
- **Hopper** : le côté ludique et la micro-célébration.
- **BlaBlaCar** : la confiance (badges vérifiés, avis) et la clarté du prix par personne.
- **Linear / Apple** : la finesse des transitions, la typographie, le soin des détails.

## 4. Le composant star : le globe 3D

Crée un composant réutilisable dans `app/src/shared/globe/`.

**Bibliothèque** : `react-globe.gl` (three.js) pour les polygones de pays, les points, les arcs, les étiquettes et l'animation de caméra `pointOfView`. Si tu as une meilleure option, justifie-la en une phrase avant de l'adopter. Données : `world-atlas` (countries-110m) et `topojson-client` ; noms de pays en français via `i18n-iso-countries`.

### Sur l'accueil — mode « vitrine »

- Grand globe en hero, sur fond de ciel couchant (ou de nuit en mode sombre), avec un halo atmosphérique corail.
- Rotation automatique lente ; on peut le faire tourner à la souris ou au doigt.
- Des **points lumineux** sur les villes où des voyageurs de démo sont présents, et des **arcs animés** entre les étapes des voyages (Lisbonne → Lagos → Faro…) : on voit que « des gens voyagent en ce moment ».
- Au survol d'un point : une bulle « 3 voyageurs à Faro du 14 au 17 juillet ».
- Au-dessus ou à côté du globe, une **grande barre « Où partez-vous ? »** avec autocomplétion des pays en français. On choisit un pays → le globe arrête de tourner, **pivote et zoome** sur le pays en 1,2 à 1,8 s (ease-in-out), le pays s'élève et se colore en corail, ses villes apparaissent en étiquettes cliquables. Un clic sur une ville mène à « Déclarer un voyage » prérempli, ou aux voyageurs de cette ville si Léa y a déjà un voyage.

### Dans « Déclarer un voyage » — mode « sélecteur »

- Composant `DestinationPicker` : on tape un pays, ou on clique sur le globe → zoom sur le pays → clic sur une ville → elle devient une étape.
- Chaque étape ajoutée apparaît sur le globe, reliée à la précédente par un arc : l'itinéraire se dessine en direct.
- Le champ texte avec autocomplétion reste **toujours** disponible et suffit seul : le globe est un plus, jamais un passage obligé (clavier, lecteur d'écran, terminal sans WebGL).

### Exigences techniques du globe

- **Chargement différé** (`React.lazy` + `Suspense`) : le globe ne doit alourdir aucune autre page, et l'accueil s'affiche avant que le globe soit chargé (squelette animé élégant pendant le chargement).
- **Replis** : sans WebGL, ou si `prefers-reduced-motion` est activé, afficher un globe statique ou une carte 2D stylisée, sans rotation automatique et avec des transitions instantanées.
- **Sobriété (RSE-05, RSE-06)** : polygones 110m seulement, pas de texture photo lourde, `devicePixelRatio` plafonné à 2, rendu mis en pause quand le globe est hors écran ou l'onglet masqué. Mesure le poids du chunk du globe et note-le dans ton rapport final.
- **Mobile** : globe plus petit, gestes tactiles, la barre de recherche passe au premier plan.

## 5. L'expérience page par page

Ordre de priorité : ce que le jury verra pendant la démo d'abord.

**Navigation et socle**
- En-tête léger et translucide sur ordinateur ; sur mobile, une **barre d'onglets en bas** (Accueil, Voyages, Compagnons, Groupes) avec un badge de notifications sur Demandes. Ça corrige aussi le débordement horizontal actuel sur mobile : 0 défilement horizontal à 360 px.
- Le sélecteur « Je suis » et la réinitialisation deviennent une **pastille flottante « Mode démo »** qui ouvre un petit panneau : visible pour le jury, mais hors du chemin.
- Transitions de page douces, apparition des listes en cascade (`motion`, ex-Framer Motion), toutes désactivées si `prefers-reduced-motion`.

**Accueil** — le moment wow
1. Hero : promesse en très grand (« Ne voyagez plus seul quand vous n'en avez pas envie »), globe, barre « Où partez-vous ? ».
2. Les 4 promesses de la vision : Trouver · Faire confiance · Partager · Économiser, en cartes illustrées.
3. « Comment ça marche » en 3 étapes : je déclare mon voyage → je trouve mes compagnons → on partage la voiture.
4. Exemple chiffré : « Voiture 240 € → 60 € chacun à 4 », avec une petite animation de division.
5. Section confiance : identité vérifiée, messagerie seulement après acceptation, filtre femmes uniquement, signalement.
6. Appel à l'action final.

**Déclarer un voyage** : un parcours en étapes (Où → Quand → Récapitulatif), le globe sélecteur, un sélecteur de période agréable (plage de dates), un récapitulatif en timeline. Les messages d'erreur sont en ligne et bienveillants.

**Mes voyages** : chaque voyage en carte « carnet de route », timeline des étapes, accès direct à « Qui est à Faro ? » et aux compagnons.

**Compagnons et voyageurs d'une ville** : cartes façon Airbnb, avec avatar à dégradé, prénom, âge, langues, badge vérifié très visible, et le **score de correspondance** mis en avant (« 2 étapes sur 2 », jauge ou anneau). Filtres en puces, compteur animé, états vides illustrés qui proposent une action (« élargir au pays »).

**Inscription** : en plusieurs étapes courtes, avec une barre de progression, une validation en ligne et un ton chaleureux.

**Profil d'un voyageur** : une carte d'en-tête avec avatar, badges de confiance et étapes en timeline. Sur mobile, le bouton « Demander le contact » reste visible en bas de l'écran.

**Demandes** : onglets Reçues / Envoyées, actions Accepter / Refuser bien distinctes, statuts en pastilles colorées.

**Groupes** : cartes avec avatars empilés, destination et prochaine étape.

**Page d'un groupe** : la conversation en **bulles** (les miennes à droite), avec la zone de saisie fixée en bas. Les dépenses sont des cartes où **« Votre part : 60 € » est l'information la plus visible**, avec une barre de progression des paiements (« 3 parts payées sur 4 »), un gros bouton « Payer ma part » et une micro-célébration discrète (confettis légers) quand la dépense passe à « Complète ».

## 6. Design system

Dans `app/src/shared/ui/`, crée des composants simples et réutilisés partout : `Button` (primaire, secondaire, fantôme ; états chargement et désactivé), `Card`, `Badge`, `Avatar`, `AvatarStack`, `Field` (label, aide, erreur), `Input`, `Select`, `Chip`, `Tabs`, `EmptyState`, `Stepper`, `ProgressBar`, `Toast`. Les tokens (couleurs, espacements sur une échelle de 4 px, rayons, ombres, durées d'animation) sont des variables CSS. Pas de framework CSS lourd : CSS moderne, ou CSS Modules si tu les préfères.

## 7. Accessibilité et éthique (non négociable)

- Contraste ≥ 4,5:1 pour le texte et ≥ 3:1 pour les composants d'interface, en clair comme en sombre.
- Tout est utilisable au clavier, avec un focus visible et stylé. Un lien d'évitement « Aller au contenu ».
- Labels sur tous les champs, `aria-live` pour les compteurs et les confirmations, `alt` ou `aria-hidden` sur les visuels.
- Le globe a une alternative textuelle complète (le champ de recherche).
- Pas de dark pattern, pas de traceur, pas d'analytics (RSE-03). Aucun appel réseau vers un tiers à l'exécution.

## 8. Contraintes techniques

- Garde React 19, Vite, React Router 6 et `HashRouter`.
- Dépendances autorisées : `react-globe.gl` (ou alternative justifiée), `world-atlas`, `topojson-client`, `i18n-iso-countries`, `motion`, `@fontsource/*`, `lucide-react` ou `@phosphor-icons/react`, `canvas-confetti`. Toute autre dépendance : demande-moi d'abord.
- `npm run build` et `npm run lint` sans erreur ni avertissement à la fin de chaque lot.
- Les styles d'une page vivent à côté de la page ; les tokens et composants partagés vivent dans `shared/`.

## 9. Méthode de travail

1. **Commence par un plan** : la direction artistique (palette finale avec les ratios de contraste, typographie), la liste des composants, l'architecture du globe et l'ordre des lots. Présente-le-moi et **attends mon accord** avant de coder.
2. Puis avance **lot par lot**, avec **un commit par lot** sur `design/front` :
   1. Tokens, design system, navigation responsive, pastille « Mode démo », correction du mobile.
   2. Accueil et globe vitrine.
   3. Déclarer un voyage et globe sélecteur.
   4. Mes voyages, Compagnons, Destination, Inscription.
   5. Profil, Demandes, Groupes, page d'un groupe et dépenses (partie B).
   6. Finitions : mode sombre, micro-interactions, audit d'accessibilité, mesure du poids des pages.
3. **À la fin de chaque lot** : build et lint, puis captures d'écran de chaque page touchée **à 375 px et à 1280 px de large**, en clair et en sombre. Regarde-les vraiment et corrige ce qui n'est pas beau, ce qui déborde ou ce qui est mal aligné. Ensuite, rejoue le parcours de démo du plan §6.
4. Ne pousse rien sans me le demander.

## 10. Rapport final attendu

- Ce qui a été fait, lot par lot, avec les captures clés.
- Le poids de l'accueil et du chunk du globe, avec l'écart par rapport à RSE-05 (≤ 1 Mo) et la justification.
- Les paires de couleurs vérifiées et leurs ratios de contraste.
- Ce qui reste perfectible, classé par impact.
