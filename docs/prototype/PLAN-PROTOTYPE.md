# Plan du prototype — sprint de 25 minutes à deux

Objectif : jouer devant le jury le parcours de Léa **déclarer un voyage → trouver un itinéraire commun → contacter → partager une dépense** (CDC §11, tranche « Prototype » de la story map).

Le front est coupé en **deux parties qui ne se touchent pas**. Chacun travaille avec sa propre session Claude, dans son propre dossier, et peut commiter et pousser sans attendre l'autre.

---

## 1. Qui fait quoi

| | Partie A — Découverte | Partie B — Groupe et frais |
| --- | --- | --- |
| Activités de la story map | A1 S'inscrire · A2 Déclarer · A3 Trouver | A4 Contacter · A5 Partager les frais |
| Stories | US-01, US-02, US-03, US-04, US-05 | US-08, US-09, US-10, US-13, US-14 |
| Dossier possédé | `app/src/features/decouverte/` | `app/src/features/groupe/` |
| Collections écrites | `users`, `trips` | `requests`, `groups`, `messages`, `expenses` |
| Pages | `/`, `/inscription`, `/voyages`, `/voyages/nouveau`, `/destination/:ville`, `/compagnons` | `/voyageurs/:userId`, `/demandes`, `/groupes`, `/groupes/:groupId` |
| Responsable | ⚠️ à attribuer | ⚠️ à attribuer |

Chacun **lit** toutes les collections, mais n'**écrit** que dans les siennes.

## 2. Pourquoi on ne se gêne pas

- **Le socle est figé** : `app/src/App.jsx`, `app/src/main.jsx`, `app/src/index.css` et tout `app/src/shared/`. Personne ne le modifie pendant le sprint. Si c'est indispensable, on prévient l'autre à voix haute et une seule personne le fait.
- **Chacun ajoute ses pages dans son propre `routes.jsx`** (`features/decouverte/routes.jsx` ou `features/groupe/routes.jsx`), jamais dans `App.jsx`.
- **Le seul lien entre les deux parties, ce sont les URL** de `shared/paths.js`. Exemple : la carte d'un voyageur (partie A) pointe vers `paths.profil(user.id)`, une page de la partie B. A n'importe aucun composant de B, et inversement.
- **Les données de démo** (`shared/seed.js`) contiennent déjà Léa, Inès, Karim, Sofia, Tom et Maya, leurs voyages, une demande en attente et un groupe « Road trip Algarve ». B peut travailler sur les groupes sans attendre que A ait codé l'inscription.
- **Le sélecteur « Je suis »** dans l'en-tête permet de jouer Inès pour accepter une demande, puis de revenir à Léa.

### Modèle de données (rappel de `shared/db.js`)

```
users     { id, prenom, age, genre, langues[], bio, verifie }
trips     { id, userId, destination, etapes: [{ ville, pays, debut, fin }] }
requests  { id, fromId, toId, message, statut: en_attente | acceptee | refusee, creeLe }
groups    { id, nom, destination, membres: userId[], creeLe }
messages  { id, groupId, auteurId, texte, envoyeLe }
expenses  { id, groupId, createurId, libelle, categorie, montantCentimes, dateReservation,
            parts: [{ userId, montantCentimes, payee }], creeLe }
```

Lire : `useDb((db) => db.trips)` · Écrire : `updateDb((db) => { db.trips.push(...) })` · Utilisateur connecté : `useCurrentUser()`.
Les montants sont en **centimes** (240 € = 24000) pour éviter les erreurs d'arrondi.

## 3. Le sprint — 25 minutes chacun, en parallèle

| Temps | Cérémonie | Ce qu'on fait |
| --- | --- | --- |
| 0 → 2 min | **Sprint planning** | `git pull`, `git switch -c feat/decouverte` (A) ou `feat/groupe` (B), relire son backlog ci-dessous, coller le prompt de démarrage dans Claude |
| 2 → 20 min | **Développement** | Une story à la fois, dans l'ordre du backlog. Après chaque story : vérifier ses critères d'acceptation, puis `git commit` |
| 20 → 23 min | **Revue** | `npm run build` sans erreur, jouer son parcours dans le navigateur, noter ce qui n'est pas fini |
| 23 → 25 min | **Intégration** | `git fetch` puis `git rebase origin/main`, puis `git push origin HEAD:main`. Comme on ne touche pas aux mêmes fichiers, il n'y a pas de conflit |

Après le sprint, 5 minutes ensemble : **démo** du parcours complet, puis **rétro** (ce qui a marché, ce qu'on change pour le sprint suivant).

### Backlog A — Découverte

Ordre de priorité : le différenciateur d'abord, l'inscription en dernier, puisque Léa existe déjà dans les données de démo.

| # | Story | Pages | Critère de fin (prototype) |
| --- | --- | --- | --- |
| 1 | **US-02 + US-03** Déclarer un voyage avec ses étapes | `/voyages/nouveau`, `/voyages` | Léa crée « Algarve, Lagos 10–13/07 puis Faro 14–17/07 » ; dates invalides et étapes qui se chevauchent refusées avec un message |
| 2 | **US-05** Itinéraires communs | `/compagnons` | Léa voit Inès « 2 étapes sur 2 », puis Karim, Sofia et Tom ; Maya n'apparaît pas ; état vide géré |
| 3 | **US-04** Voyageurs dans la même ville | `/destination/:ville` | `/destination/Faro` montre Inès et Karim, triés par jours communs ; état vide « Personne pour l'instant à … » |
| 4 | **US-01** Inscription | `/inscription` | Un nouveau compte est créé et devient l'utilisateur connecté ; e-mail déjà pris refusé (e-mail simulé, pas d'envoi réel) |
| 5 | Accueil | `/` | Une phrase de promesse et deux boutons : « Déclarer mon voyage », « Voir mes compagnons » |
| bonus | **US-06** Filtres âge, langue, genre | `/compagnons` | Les filtres se cumulent, le compteur se met à jour |

Chaque carte de voyageur pointe vers `paths.profil(user.id)` : c'est la page de B.

### Backlog B — Groupe et frais

| # | Story | Pages | Critère de fin (prototype) |
| --- | --- | --- | --- |
| 1 | **US-08** Profil et demande de contact | `/voyageurs/:userId` | Le profil affiche prénom, âge, langues, badge vérifié et étapes ; « Demander le contact » crée une demande `en_attente` avec un message de 300 caractères au plus ; bouton remplacé par « Demande envoyée » |
| 2 | **US-09** Accepter ou refuser | `/demandes` | En tant que Léa, accepter la demande de Tom → statut `acceptee` ; refus → l'expéditeur voit « Demande non acceptée » |
| 3 | **US-10** Groupe et conversation | `/groupes`, `/groupes/:groupId` | Créer un groupe avec des contacts acceptés ; la conversation du « Road trip Algarve » affiche et envoie des messages |
| 4 | **US-13** Créer une dépense partagée | `/groupes/:groupId` | 240 € entre 4 → 60 € chacun ; centimes répartis sans perte ; montant ≤ 0 refusé ; date de réservation obligatoire |
| 5 | **US-14** Payer sa part (simulé) | `/groupes/:groupId` | « Payer ma part » passe la part à `payee` ; impossible de payer deux fois ; le créateur voit qui a payé |
| bonus | **US-15** Statut de la dépense | `/groupes/:groupId` | « En attente » tant qu'une part est impayée, « Complète » quand tout est payé |

## 4. Prompts de démarrage à coller dans Claude

**Partie A**

```
Lis PLAN-PROTOTYPE.md et story-map-roadmates.md. Je suis la partie A (Découverte).
Tu travailles uniquement dans app/src/features/decouverte/. Ne modifie jamais
app/src/shared/, App.jsx, main.jsx, index.css ni app/src/features/groupe/.
Tu n'écris que dans les collections users et trips via updateDb.
Implémente mon backlog dans l'ordre (US-02+US-03, US-05, US-04, US-01, Accueil),
en respectant les critères d'acceptation de la story map. Après chaque story :
npm run build, puis propose-moi le commit. Les liens vers un profil utilisent paths.profil(id).
```

**Partie B**

```
Lis PLAN-PROTOTYPE.md et story-map-roadmates.md. Je suis la partie B (Groupe et frais).
Tu travailles uniquement dans app/src/features/groupe/. Ne modifie jamais
app/src/shared/, App.jsx, main.jsx, index.css ni app/src/features/decouverte/.
Tu n'écris que dans les collections requests, groups, messages et expenses via updateDb.
Implémente mon backlog dans l'ordre (US-08, US-09, US-10, US-13, US-14),
en respectant les critères d'acceptation de la story map. Paiement simulé, montants en centimes.
Après chaque story : npm run build, puis propose-moi le commit.
```

## 5. Lancer l'application

```
cd app
npm install
npm run dev
```

Puis ouvrir l'adresse affichée (http://localhost:5173). Le bouton « Réinitialiser la démo » remet les données de départ.

## 6. Démo devant le jury (parcours du CDC §11)

Dans les données de démo, Léa est déjà en contact avec Inès et Sofia. Le jury la voit donc ajouter un 4e voyageur, Karim.

1. *Je suis Léa* → **Mes voyages** : déclarer un voyage, pour montrer le formulaire (A).
2. **Compagnons** : Inès apparaît en tête avec 2 étapes communes, Karim avec 1 étape à Faro → ouvrir le profil de Karim (A → B).
3. Demander le contact (B) → *Je suis Karim* → **Demandes** : accepter (B).
4. *Je suis Léa* → **Groupes** : créer un groupe avec Inès, Sofia et Karim → créer la location de voiture à 240 € → chacun voit 60 € (B).
5. *Je suis Inès* → payer sa part → *Je suis Léa* : la part d'Inès est « payée » (B).
