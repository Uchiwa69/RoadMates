# Prompt Claude Code — Espace « Mon profil », navigation et partenaires locaux

> À coller dans une session Claude Code ouverte à la racine du dépôt RoadMates.

---

## 0. Ton rôle et l'objectif

Tu es designer produit **et** développeur front React senior. Tu travailles sur le prototype de **RoadMates** : l'application qui aide les voyageurs solo de 18–30 ans à trouver des compagnons de route, à se rencontrer en confiance et à partager les frais. C'est un projet de cours (Bachelor Dev Web). Le prototype sera montré à un jury comme une présentation d'investisseurs.

Trois chantiers, dans cet ordre :

1. **Navigation** : ajouter un onglet « Profil » dans la barre de navigation. Pour garder 5 onglets sur mobile, fusionner « Demandes » et « Groupes » en un onglet « Messages ».
2. **Espace « Mon profil »** : une page d'accueil du profil et ses sous-pages. On y retrouve le profil, la **confidentialité** (mode anonyme), les avis, les amis de route et le compte. On polit les écrans existants pour qu'ils soient au niveau du redesign.
3. **Partenaires et activités locales** : quand on cherche une ville, on voit aussi **ce qu'on peut y faire** et **les offres des partenaires** (restaurants, musées, activités, hébergements locaux, loueurs de voitures…). On commence par **Lyon, Paris, Marrakech et le Kosovo (Pristina, Prizren)**.

La qualité attendue est celle d'une vraie application grand public : Airbnb, Polarsteps, BlaBlaCar, GetYourGuide. Elle doit être claire, chaleureuse, rapide et accessible. **Rien de ce qui marche aujourd'hui ne doit casser.**

---

## 1. Contexte à lire avant tout

Lis ces fichiers en entier avant de proposer quoi que ce soit :

- `vision-produit-roadmates.md` : personas Léa (cible principale), Karim, Monique ; parcours de Léa en 21 étapes (les étapes 13, 15, 19 et 21 parlent des partenaires et des amis de route) ; § 3.5 sur les partenaires.
- `cahier-des-charges-roadmates.md` :
  - objectif O-03 (financement par les partenaires) ;
  - EF-16 et EF-17 (offres partenaires) ;
  - R2 (ville pilote Lyon) ;
  - R-01 et R-02 ;
  - exigences RSE-01 à RSE-07 (localisation déclarative, RGPD, accessibilité RGAA, sobriété).
- `story-map-roadmates.md` : **US-18** (voir les offres des partenaires) et **US-20** (publier une offre partenaire), avec leurs critères d'acceptation. Ces critères font foi.
- `PLAN-PROTOTYPE.md` : répartition partie A / partie B et parcours de démo.
- `PROMPT-REDESIGN.md` : direction artistique « coucher de soleil », design system et règles du globe. Tu la respectes.
- `docs/audit-*.md` : audits de la « vague 2 », avec les limites connues (chiffrement local, paiement simulé…).
- Le code : `app/src/shared/` (db, seed, paths, Layout, DemoPanel, ui/, globe/) et `app/src/features/*`.

---

## 2. Ce qui existe déjà : ne le refais pas

La vague 2 a déjà ajouté ces fonctionnalités. Ton travail est de **les réorganiser, les rendre accessibles et les polir**, pas de les réécrire.

| Fonctionnalité | Où | État |
|---|---|---|
| Profil enrichi : photo par URL, bio, langues, centres d'intérêt, style, rythme, budget, investissement (trajet / activités / tout le voyage), préférence de genre | `features/profil/EditionProfil.jsx`, route `/profil` | Fonctionne, mais n'est accessible que par un bouton dans Compagnons |
| Amis de route et destinations communes | dans `EditionProfil.jsx` (logique écrite dans le JSX) | Fonctionne |
| Mode anonyme : profil et/ou itinéraire masqué jusqu'à une date (24 h, 7 jours, fin du voyage) | `features/confidentialite/Confidentialite.jsx`, contrat `shared/confidentialite.js` | Fonctionne, accessible par une petite icône 🛡 dans l'en-tête |
| Suppression locale du compte | dans `Confidentialite.jsx` | Fonctionne |
| Messages de groupe chiffrés (AES-GCM local) | `shared/chiffrement.js`, `features/groupe/GroupPage.jsx` | Fonctionne. Libellé : « chiffrés localement pour cette démonstration ». Ne pas le présenter comme du bout en bout. |
| Filtres : genre, vérifiés, langue, intérêts, style, budget, investissement, âge, avec sauvegarde dans le profil | `features/decouverte/Filtres.jsx`, `filtres.js` | Fonctionne, mais 9 champs toujours ouverts : c'est lourd sur mobile |
| Avis mutuels | `features/avis/`, route `/avis` | Fonctionne, accessible depuis le profil seulement |
| Signalement et blocage | `features/securite/` | Fonctionne |

Ce que l'utilisateur constate : **il n'y a pas d'onglet « Mon profil » dans la barre de navigation**, et la confidentialité doit être rangée **dans** l'espace profil.

---

## 3. Ce qu'il ne faut pas casser

1. **Le parcours de démo** (`PLAN-PROTOTYPE.md` § 6) doit rester jouable de bout en bout :
   - Léa → Compagnons → profil de Karim → demande de contact ;
   - « Je suis Karim » → il accepte ;
   - groupe → location de voiture 240 € → 4 parts de 60 € → paiement d'Inès.

   Tu le rejoues à la fin de chaque lot.
2. **Les données du Portugal (Lagos, Faro, Lisbonne, Porto) ne changent pas.** Aucun nouveau voyageur ni aucune nouvelle offre n'y est ajouté, pour que les résultats de la démo restent identiques. Faro sert justement d'exemple d'état vide pour les partenaires : « Pas encore d'offre partenaire à Faro » (US-18, critère 3).
3. **L'API de `shared/db.js`** : `getDb`, `updateDb`, `resetDb`, `useDb` et `newId` restent identiques. Si tu ajoutes des collections :
   - documente-les dans l'en-tête de `db.js`, en indiquant leur propriétaire ;
   - ajoute-les dans `completerAvecSeed` (la boucle ne traite aujourd'hui que `users`, `trips`, `requests`, `groups` et `messages`) ;
   - **incrémente `seed.version`**, pour que les navigateurs qui ont déjà joué la démo reçoivent les nouvelles données sans perdre les leurs.
4. **Les fichiers de logique déjà testés** (`dates.js`, `matching.js`, `filtres.js`, `voyages.js`, `confidentialite.js`, `chiffrement.js`, `avis.js`, `securite.js`) : leurs signatures ne changent pas. Tu peux y ajouter des fonctions.
5. **Les anciennes URL fonctionnent toujours.** `/demandes`, `/groupes`, `/confidentialite` et `/avis` redirigent vers leur nouvel emplacement (`<Navigate replace>`). `/groupes/:groupId` et `/voyageurs/:userId` ne changent pas. `paths.js` reste le seul contrat d'URL : on y ajoute des chemins, on n'en supprime aucun.
6. **Le mode démo** (pastille « Mode démo » → « Je suis… » et « Réinitialiser la démo ») reste accessible partout.
7. **Le mode anonyme** reste respecté partout où un voyageur apparaît, y compris dans les nouvelles surfaces (activités et partenaires : « X voyageurs RoadMates seront là »). Un profil masqué n'est jamais compté nominativement, et un itinéraire masqué n'est jamais déduit.
8. **Les dépendances** : aucune nouvelle sans justification dans le plan. Celles déjà installées couvrent tout le besoin : react-router, motion, lucide-react, react-globe.gl, world-atlas, i18n-iso-countries.

---

## 4. Chantier 1 — Navigation

### 4.1 La nouvelle barre (5 onglets, sur mobile comme sur ordinateur)

`Accueil · Voyages · Compagnons · Messages · Profil`

- **Messages** remplace Demandes et Groupes. Le badge rouge affiche le nombre de **demandes reçues en attente**, comme aujourd'hui. L'annonce pour les lecteurs d'écran est conservée : « , 2 demandes en attente ».
- **Profil** affiche **l'avatar** de l'utilisateur connecté (photo ou initiale, via le composant `Avatar` du design system) à la place d'une icône. Le libellé est « Profil ». S'il y a une action à faire dans le profil (profil incomplet, ou avis à laisser), une petite pastille discrète apparaît, sans chiffre.
- **L'icône 🛡 de l'en-tête disparaît.** La confidentialité vit désormais dans le profil.
- Le bouton de thème clair/sombre reste dans l'en-tête sur ordinateur. Sur mobile, il est **aussi** proposé dans l'accueil du profil (réglage « Apparence »).
- Pour l'onglet actif, `aria-current="page"` est géré par NavLink. Il doit rester actif sur les sous-pages : Messages est actif sur `/messages*` et `/groupes/:id`, Profil est actif sur `/profil*`.

### 4.2 La page Messages (`/messages`)

- Un en-tête « Messages », puis des onglets `Tabs` du design system : **Demandes** (avec le compteur) et **Groupes**.
- L'onglet actif est reflété dans l'URL (`/messages?onglet=demandes` / `?onglet=groupes`) pour que le bouton retour et les liens fonctionnent.
- Onglet par défaut : **Demandes** s'il y en a en attente, sinon **Groupes**.
- Le contenu des onglets réutilise les composants existants de `RequestsPage.jsx` et `GroupsPage.jsx`. Extrais leur contenu en composants si nécessaire, mais **ne réécris pas leur logique**.
- `/demandes` et `/groupes` redirigent vers le bon onglet.
- Tous les liens internes qui pointaient vers `paths.demandes` ou `paths.groupes` mènent au bon endroit.

> ⚠️ Ce chantier modifie des fichiers de la partie B (Meven). Liste-les dans le plan pour que l'équipe soit prévenue avant.

---

## 5. Chantier 2 — L'espace « Mon profil »

### 5.1 Structure (accueil du profil + sous-pages, modèle Airbnb / Instagram)

| Route | Page | Contenu |
|---|---|---|
| `/profil` | **Accueil du profil** | Voir 5.2 |
| `/profil/modifier` | Modifier mon profil | L'actuel `EditionProfil`, poli (voir 5.3) |
| `/profil/confidentialite` | Confidentialité | L'actuel mode anonyme, poli (voir 5.4) |
| `/profil/avis` | Avis et amis de route | La page Avis existante, plus la section amis de route qui sort de `EditionProfil` |
| `/profil/compte` | Compte et données | E-mail (lecture seule), vérification d'identité (état), **Télécharger mes données** (export JSON de tout ce qui concerne l'utilisateur, au titre de la portabilité RGPD), **Supprimer mon compte** (déplacé depuis Confidentialité, avec la même logique et la même double confirmation) |

- Chaque sous-page a un **bouton retour** « ‹ Mon profil » en haut sur mobile, et un fil d'Ariane discret sur ordinateur.
- Les routes sont déclarées dans `features/profil/routes.jsx`. `/confidentialite` et `/avis` y sont redirigés.
- Corrige l'avertissement de lint `only-export-components` de `features/confidentialite/routes.jsx`. Ce fichier devient probablement inutile.

### 5.2 Ce que montre l'accueil du profil

1. **Une carte d'identité** : grand avatar, prénom, âge, badge « Identité vérifiée » (ou un appel à vérifier), style de voyage, et les 3 premiers centres d'intérêt en puces. Elle comporte un bouton **« Voir mon profil public »**, qui ouvre `paths.profil(monId)`, la page telle que les autres la voient. Vérifie que `ProfilePage` gère le cas où l'on regarde son propre profil : pas de bouton « Envoyer une demande ».
2. **La complétude du profil** : une barre de progression (`ProgressBar`) et la liste des 1 ou 2 éléments qui manquent (« Ajoutez une photo », « Indiquez votre budget »), chacun avec un lien direct. La règle de calcul va dans un fichier `.js` testable.
3. **La liste des réglages**, comme un menu de réglages iOS : une ligne cliquable par sous-page, avec icône, titre et **état résumé à droite**. Par exemple :
   - « Confidentialité · Profil visible » ;
   - « Confidentialité · Itinéraire masqué jusqu'au 17 juil. » (dans un ton d'avertissement doux) ;
   - « Avis · 4,8 ★ (3) » ;
   - « 1 avis à laisser ».
4. **Apparence** : thème clair, sombre ou automatique.
5. Si le mode anonyme est actif, un **bandeau** en haut de l'accueil le rappelle, avec un bouton « Redevenir visible ».

### 5.3 Polir « Modifier mon profil »

- **La photo se choisit depuis l'appareil** (`<input type="file" accept="image/*">`), avec un aperçu immédiat.
  - Redimensionne-la côté client avec un canvas, à 256 px maximum, en JPEG ou WebP qualité ~0,8. Elle est stockée en data URL, et la taille finale doit rester **≤ 60 Ko**, à cause du quota de localStorage.
  - Propose « Retirer la photo ».
  - Garde la lecture de l'ancien champ `photoUrl` pour les données existantes, mais retire la saisie d'URL. C'est une mauvaise UX, et un risque de traçage via une image externe.
- **Langues et centres d'intérêt** : remplace la saisie séparée par des virgules par une **sélection de puces** (`Chip`). Propose des suggestions tirées des valeurs existantes, et permets d'ajouter une valeur libre.
- **Budget** : retire l'aide « Montant enregistré en centimes », qui est un détail technique. Préfère un choix lisible : €, €€, €€€ avec des fourchettes, ou un champ en euros avec un exemple.
- **Investissement** (trajet / activités / tout le voyage) : renomme-le en **« Ce que je veux partager »**, avec une phrase d'explication sous chaque choix. Le mot « investissement » prête à confusion avec l'argent.
- **L'aperçu en direct** (« Comment les autres vous voient ») est conservé. Sur mobile, il devient un bouton « Aperçu » qui ouvre une feuille modale.
- Si le formulaire a des modifications non enregistrées et qu'on quitte la page, l'utilisateur est prévenu.
- La logique des amis de route (calcul des destinations communes) **sort du JSX** et va dans un fichier `.js` testé. Les dates s'affichent au format français (`formatPeriode`), plus en ISO.

### 5.4 Polir « Confidentialité »

- Deux cartes : « Cacher mon profil » et « Cacher mon itinéraire ». Chacune a un **interrupteur** (`role="switch"`) et, quand il est activé, un choix de durée en puces : 24 h, 7 jours, jusqu'à la fin de mon voyage, ou une date précise. La date effective s'affiche toujours en clair : « Masqué jusqu'au jeudi 17 juillet ».
- Ajoute **« Ce que voient les autres »** : un mini-aperçu de la carte voyageur telle qu'elle apparaît en mode anonyme (« Voyageur anonyme », sans photo ni étapes).
- Corrige `AUJOURDHUI`, calculé au chargement du module : il doit être calculé au rendu.
- Ajoute une ligne d'information sur le chiffrement des messages, avec un texte honnête : « Vos messages de groupe sont chiffrés sur cet appareil. Dans cette démo, il ne s'agit pas d'un chiffrement de bout en bout. »
- L'enregistrement est confirmé par un toast. Le bouton « Redevenir visible » reste disponible.

### 5.5 Filtres de découverte (Compagnons et Destination)

Les 9 champs ouverts en permanence sont trop lourds.

- Garde **visibles** : genre souhaité, profils vérifiés, langue.
- Mets le reste (intérêts, style, budget, ce que je veux partager, âge) dans **« Plus de filtres (n) »**. Sur ordinateur, c'est un panneau dépliant. Sur mobile, c'est une feuille modale avec « Afficher X voyageurs ».
- Garde le compteur animé, la réinitialisation et la sauvegarde dans le profil.
- `filtres.js` ne change pas.

---

## 6. Chantier 3 — Partenaires et activités locales

### 6.1 L'idée

Aujourd'hui, une ville = des voyageurs. Demain, une ville = **des voyageurs + des choses à faire + des bons plans partenaires**.

C'est le cœur du modèle économique : RoadMates vit des partenariats, sans publicité (CDC § 4, O-03, EF-16 et EF-17, vision § 3.5). C'est aussi une réponse au risque R-01 (« l'application paraît vide ») : même sans voyageur sur place, la ville a de quoi donner envie.

On distingue **deux types de contenus**, qui ne doivent jamais être confondus visuellement :

| | **À faire** (activités et lieux) | **Bons plans partenaires** (offres) |
|---|---|---|
| Ce que c'est | Lieux publics et activités emblématiques de la ville : musée, quartier, marché, randonnée, café… | Offres réservées aux groupes RoadMates, publiées par des partenaires : « −15 % dès 3 voyageurs » |
| Catégories | Culture, Plein air, Food, Vie nocturne, Bien-être… | Restaurant, Musée et visite, Activité, Hébergement, Location de voiture ou de vélo |
| Badge | Aucun | **Badge « Partenaire »** et réduction de groupe bien visible (US-18, critère 4 : « clairement identifiées, distinctes des profils ») |
| Source | Contenu éditorial statique | Collection `offres` en base, modifiable par un compte partenaire (US-20) |

### 6.2 Règles de contenu (très important)

- **Activités** : tu peux citer de **vrais lieux publics** (Vieux Lyon, Fourvière, Musée des Confluences, Jemaa el-Fna, Jardin Majorelle, Newborn à Pristina, forteresse de Prizren…). Décris-les sobrement et factuellement. **N'invente ni horaires, ni prix précis, ni notes, ni avis.** Une indication « gratuit / € / €€ » suffit.
- **Partenaires** : ils sont **fictifs**. Invente des noms d'établissements crédibles mais imaginaires, par exemple « Auberge des Traboules », « Riad Zellige », « Vélo'Rhône ». Ne présente **jamais** une vraie entreprise comme partenaire de RoadMates, et ne lui attribue aucune réduction. Une mention discrète l'indique : « Partenaires fictifs — données de démonstration ».
- Pas de photos lourdes. Utilise des illustrations par catégorie (icône lucide sur un dégradé de la palette coucher de soleil), ou au plus quelques images compressées hébergées avec le site (≤ 40 Ko chacune). Respecte le budget de poids du CDC (RSE-05).
- Pas de géolocalisation (RSE-01). On reste à l'échelle de la ville, avec au mieux le nom du quartier.

### 6.3 Données

- **Nouvelles villes** dans `features/decouverte/villes.js` : `Pristina (Kosovo, XK, 42.66, 21.17)` et `Prizren (Kosovo, XK, 42.21, 20.74)`. Lyon, Paris et Marrakech existent déjà.
- **Le Kosovo et le globe** : dans `world-atlas`, le polygone « Kosovo » **n'a pas d'`id` numérique**, donc `alpha2DepuisNumerique` ne le trouve pas. Gère ce cas, par exemple avec une correspondance par `properties.name` vers `XK`. Vérifie aussi que :
  - la recherche « Kosovo » propose bien le pays dans `pays.js` ;
  - le zoom du globe fonctionne ;
  - le surlignage du pays fonctionne.
- **Activités** : un fichier statique, par exemple `features/partenaires/activites.js`. Prévois 6 à 8 activités par ville pour Lyon, Paris et Marrakech, et 4 à 6 pour Pristina et Prizren. Format : `{ id, ville, titre, categorie, quartier, description, prix: 'gratuit'|'€'|'€€'|'€€€', aPlusieurs: string }`. Le champ `aPlusieurs` dit pourquoi l'activité est mieux à plusieurs : c'est l'angle RoadMates.
- **Partenaires et offres** : de nouvelles collections en base (propriétaire : nouvelle partie « partenaires »), documentées dans `db.js` et ajoutées au seed et à `completerAvecSeed` :
  - `partenaires` `{ id, nom, ville, categorie, description, valide: bool }` ;
  - `offres` `{ id, partenaireId, titre, description, reduction: '−15 %', conditionGroupe: 'dès 3 voyageurs', active: bool, creeLe }`.

  Prévois 3 à 5 partenaires par ville pour Lyon, Paris et Marrakech, et 2 pour le Kosovo. **Aucun au Portugal.**
- **Voyageurs vitrine** : ajoute 2 ou 3 voyageurs avec des voyages en juillet 2027 à **Paris** et au **Kosovo**, pour que ces destinations ne soient pas vides. Lyon (Anouk) et Marrakech (Yasmine) en ont déjà. Aucun ne passe par le Portugal.
- Incrémente `seed.version`.

### 6.4 La page Destination devient un guide de ville

`/destination/:ville` s'organise en **onglets** :

**Voyageurs** · **À faire** · **Bons plans** (avec le nombre d'offres)

- **L'en-tête de la ville** comporte le nom, le pays, un petit résumé, et des compteurs : « 3 voyageurs pendant vos dates · 7 activités · 4 bons plans ».
- **L'onglet Voyageurs** reprend la page actuelle à l'identique (filtres, élargissement au pays, état vide). Si l'utilisateur n'a pas de voyage dans cette ville, l'onglet garde son état vide actuel (« Déclarer un voyage à … »). En revanche, **les onglets À faire et Bons plans restent consultables sans voyage déclaré** : la consultation est libre, sans vérification (CDC).
- **L'onglet À faire** affiche une grille de cartes, filtrable par catégorie avec des puces. Chaque carte montre la catégorie, le quartier, le prix indicatif, et la phrase « Mieux à plusieurs : … ». Si l'utilisateur a un voyage déclaré dans la ville, la carte indique combien de voyageurs RoadMates seront présents pendant ses dates, en respectant le mode anonyme et les blocages, avec un lien vers l'onglet Voyageurs.
- **L'onglet Bons plans** liste les offres **actives** de partenaires **validés**. Chaque carte affiche le badge Partenaire, le nom, la catégorie, la réduction en grand et la condition de groupe.
  - Bouton **« Proposer à mon groupe »** :
    - si l'utilisateur a un groupe dont la destination correspond, l'offre est envoyée comme message dans le groupe (message chiffré, via les fonctions existantes) ;
    - sinon, un message invite à trouver des compagnons.
  - S'il n'y a aucune offre : « Pas encore d'offre partenaire à {ville} » (US-18, critère 3). C'est le cas de Faro.
- L'onglet actif est dans l'URL (`?onglet=`).

### 6.5 La recherche montre aussi les activités

Les champs « Où partez-vous ? » de l'accueil (Hero) et de Destination proposent des **résultats groupés** dans le `Combobox` :

```
Villes          📍 Lyon · France
                📍 Lyon → 3 voyageurs en juillet
Activités       🏛 Musée des Confluences · Lyon
                🍽 Bouchon lyonnais en groupe · Lyon
Bons plans      🏷 −15 % Vélo'Rhône · Lyon
```

- Choisir une ville mène au zoom du globe ou à la destination, comme aujourd'hui.
- Choisir une activité ou une offre ouvre la destination sur le **bon onglet**, avec la carte mise en évidence.
- La recherche ignore les accents (même normalisation que `trouverVille`) et cherche dans le titre, la catégorie et le quartier.
- Le Combobox reste accessible : groupes annoncés, navigation au clavier, `aria-activedescendant`.

### 6.6 Le globe (bonus, si le budget de poids le permet)

- Quand le globe est zoomé sur une ville qui a des activités, affiche de **petits repères** pour les activités et les partenaires, avec une couleur différente pour les partenaires. Un clic ouvre la carte correspondante. Ces repères ne sont pas des coordonnées GPS précises : une petite dispersion autour du centre-ville suffit. Indique-le dans un commentaire.
- Sans WebGL ou avec le mouvement réduit, rien ne manque : la liste reste la référence.

### 6.7 L'espace partenaire (US-20)

- Dans le **mode démo**, ajoute un groupe « Partenaires » au sélecteur « Je suis… », avec par exemple « Auberge des Traboules (Lyon) ».
- Quand on incarne un partenaire, la navigation se réduit à : **Mon offre · Aperçu de la destination · Profil**. Sur la page `/partenaire` :
  - créer ou modifier son offre (titre, description, réduction, condition de groupe), avec validation des champs ;
  - **suspendre ou réactiver** l'offre (US-20, critère 5) ;
  - voir l'aperçu tel que le verront les voyageurs.
- Seul un partenaire `valide: true` peut publier (critère 1). Prévois un partenaire non validé dans le seed pour montrer le message « Compte en cours de validation ».
- L'offre publiée apparaît immédiatement dans l'onglet Bons plans de la ville.
- Respecte tous les critères d'US-20 dans `story-map-roadmates.md`.

---

## 7. Accessibilité, éthique et sobriété (non négociable)

- **RGAA** :
  - tout est utilisable au clavier ;
  - focus visible ;
  - onglets au motif ARIA tablist (le composant `Tabs` existe) ;
  - interrupteurs `role="switch"` avec `aria-checked` ;
  - feuilles modales avec focus piégé, fermeture par Échap et retour du focus ;
  - contraste ≥ 4,5:1 en clair **et** en sombre ;
  - cibles tactiles ≥ 44 px ;
  - `prefers-reduced-motion` respecté.
- Un **titre de page `h1` unique** sur chaque nouvelle page : le Layout s'en sert pour le titre de l'onglet et le focus.
- **Honnêteté** :
  - paiement, chiffrement, vérification et partenaires sont clairement des **simulations** de démo ;
  - pas de faux avis, pas de fausses notes sur de vrais lieux ;
  - pas de dark pattern pour pousser les offres.
- **RGPD** :
  - l'export de données et la suppression sont dans « Compte et données » ;
  - aucune ressource tierce : pas de polices Google, pas d'image distante dans les nouvelles surfaces.
- **Sobriété** :
  - les nouvelles pages sont chargées à la demande (`lazy`), comme les autres ;
  - compare le poids du build avant et après, et justifie chaque augmentation notable.

---

## 8. Méthode de travail

1. **Branche** : crée `feat/profil-partenaires` à partir de `main` à jour. Ne travaille jamais directement sur `main`. **Ne pousse jamais** : l'équipe décide.
2. **Plan d'abord** : avant d'écrire du code, présente un plan qui contient :
   - les fichiers créés et modifiés, **en signalant ceux de la partie B (Meven)** ;
   - les nouvelles routes et les redirections ;
   - le schéma de données ajouté ;
   - le découpage en lots ;
   - les risques.

   **Attends la validation** avant de commencer.
3. **Lots**, avec **un commit par lot**, aux messages en français et au même style que l'historique :
   1. Navigation à 5 onglets et page Messages, avec redirections.
   2. Accueil du profil et sous-pages (Modifier, Confidentialité, Avis et amis de route, Compte) ; déplacement de la suppression ; export des données.
   3. Polissage : photo depuis l'appareil, puces, budget lisible, « Ce que je veux partager », interrupteurs d'anonymat, filtres repliables.
   4. Données partenaires et activités : villes du Kosovo et globe, collections, seed, `completerAvecSeed`.
   5. Destination en guide de ville (onglets) et recherche groupée dans le Combobox.
   6. Espace partenaire (US-20) et « Proposer à mon groupe ».
   7. Bonus globe (repères) ; finitions.
4. **À chaque lot** :
   - `npm run lint` sans nouvel avertissement, et `npm run build` qui passe ;
   - tests en Node des nouvelles fonctions de logique : complétude du profil, amis de route, recherche groupée, filtrage des offres actives et validées, respect de l'anonymat dans les compteurs ;
   - captures d'écran à **375 px et 1280 px, en clair et en sombre**, des écrans touchés ;
   - **parcours de démo rejoué**.
5. Si une consigne de ce prompt entre en conflit avec le CDC, la story map ou le code existant, **arrête-toi et pose la question**. Ne tranche pas seul.

---

## 9. Rapport final

À la fin, donne :

1. Ce qui a été fait, lot par lot, avec les commits.
2. Les captures avant et après des écrans clés : barre de navigation, accueil du profil, confidentialité, destination à Lyon (3 onglets), destination à Faro (état vide des bons plans), recherche groupée, espace partenaire.
3. La couverture des critères d'acceptation **US-18** et **US-20**, critère par critère.
4. Les fichiers de la partie B modifiés, à relire par Meven.
5. Le poids du build avant et après.
6. Les mises à jour à prévoir dans le CDC et la story map. **Ne les fais pas toi-même**, liste-les :
   - Kosovo et nouvelles villes ;
   - activités éditoriales hors EF actuelle ;
   - « Proposer à mon groupe » ;
   - export des données.
7. Les limites et les points à valider par l'équipe.
