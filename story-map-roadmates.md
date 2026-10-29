# Story Map — RoadMates

*De la vision aux fonctionnalités : parcours, user stories, tranches de livraison*

| | |
| --- | --- |
| Version | 1.0 |
| Date | 29/10/2026 |
| Statut | Brouillon — critères d'acceptation proposés par l'équipe, à affiner en refinement |
| Documents liés | Vision produit v1.0 · Cahier des charges v1.0 |

---

## 1. Persona primaire

**Léa, 23 ans — étudiante Erasmus à Lisbonne** (vision produit §3.4). C'est elle qui guide les décisions d'interface. Karim (34 ans, persona secondaire) n'apparaît que dans les stories V1 et plus.

> Les personas restent des hypothèses tant que les entretiens de l'annexe A du CDC n'ont pas été menés : leurs verbatims sont à recueillir.

## 2. Colonne vertébrale — le parcours de Léa

Le flot de narration reprend les 8 phases du parcours type (vision produit §4.2).

| # | Activité | Ce que fait Léa |
| --- | --- | --- |
| A1 | Découvrir et s'inscrire | Crée son compte après avoir vu RoadMates sur les réseaux sociaux |
| A2 | Déclarer son voyage | Algarve du 10 au 17 juillet, étapes Lagos puis Faro |
| A3 | Trouver des compagnons | Parcourt les voyageurs de sa destination et ceux qui ont un itinéraire commun, filtre |
| A4 | Entrer en contact | Vérifie son identité, envoie 3 demandes, 2 acceptent, le groupe se forme |
| A5 | Partager les frais | Crée la location de voiture à 240 €, chacun paie 60 € |
| A6 | Se rencontrer | Choisit un lieu public pour le premier rendez-vous, prévient un proche |
| A7 | Vivre le voyage sur place | Voit qui est à Faro ce soir, rejoint une activité, profite d'une offre partenaire |
| A8 | Après le voyage | Note ses compagnons, les garde en amis de route |

## 3. La carte

Lecture : de gauche à droite, le parcours ; de haut en bas, de l'indispensable au confort. Chaque ligne est une tranche de livraison.

| Tranche | A1 S'inscrire | A2 Déclarer | A3 Trouver | A4 Contacter | A5 Partager les frais | A6 Se rencontrer | A7 Sur place | A8 Après |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Prototype** (29/10 après-midi) | US-01 | US-02, US-03 | US-04, US-05 | US-08, US-09, US-10 | US-13, US-14 *(paiement simulé)* | — | — | — |
| **MVP** | — | — | — | US-07, US-11, US-12 | US-15 | — | — | — |
| **V1** | — | — | US-06 | — | — | US-16, US-17 | US-18, US-19, US-20 | US-21 |
| **V2** | — | — | US-23 *(suggestions IA)* | — | US-24 *(remboursement)* | — | — | US-22 |

### Ligne du MVP

**Test de la tranche** : Léa peut s'inscrire, déclarer son voyage, trouver une voyageuse qui fait le même trajet, lui écrire après acceptation, créer la dépense de voiture et payer sa part. Le parcours est rudimentaire mais complet de bout en bout : il sert l'objectif n°1 du CDC (O-01, mise en relation).

Le **prototype** est la même tranche sans vérification d'identité réelle, sans signalement ni blocage, et avec un paiement simulé (décision D-01 du CDC). Il sert à démontrer la vision, pas à être mis en production.

## 4. User stories

Format : *En tant que [persona], je veux [fonctionnalité] afin de [valeur]*. Les critères d'acceptation décrivent le résultat attendu, pas l'implémentation, et couvrent les cas d'erreur. Colonne EF : exigence correspondante du CDC.

### A1 — Découvrir et s'inscrire

**US-01 · Créer un compte** — EF-01 · Must · Kano : base

En tant que Léa, je veux créer un compte avec mon adresse e-mail afin d'accéder aux voyageurs de ma destination.

1. Le formulaire demande : e-mail, mot de passe, prénom, date de naissance, genre déclaré, langues parlées.
2. Un e-mail de confirmation est reçu en moins d'1 minute ; le lien active le compte.
3. De l'ouverture du formulaire au compte actif : moins de 2 minutes.
4. Adresse déjà utilisée → message « Un compte existe déjà avec cette adresse » et lien vers la connexion.
5. Mot de passe de moins de 8 caractères → le message indique la règle non respectée, le formulaire garde les autres champs.
6. Moins de 18 ans → inscription refusée avec un message explicite.
7. Lien de confirmation de plus de 24 h → message « Lien expiré » et bouton « Renvoyer le lien ».

### A2 — Déclarer son voyage

**US-02 · Déclarer un voyage** — EF-03 · Must · Kano : base

En tant que Léa, je veux déclarer ma destination et mes dates afin que les voyageurs qui vont au même endroit me trouvent.

1. La destination se choisit dans une liste de villes et de pays avec autocomplétion ; aucune position GPS n'est demandée (RSE-01).
2. Un voyage d'un week-end se déclare en moins d'1 minute.
3. Date de fin antérieure à la date de début → message d'erreur, le voyage n'est pas créé.
4. Date de début passée → message d'erreur, le voyage n'est pas créé.
5. Ville inconnue → « Aucune ville trouvée », aucune création.
6. Le voyage créé apparaît dans mon profil et dans la liste de sa destination.
7. Je peux modifier ou supprimer mon voyage ; supprimé, il disparaît des listes des autres voyageurs.

**US-03 · Ajouter des étapes** — EF-05 · Must · Kano : base

En tant que Léa, je veux découper mon voyage en étapes (Lagos puis Faro) afin de trouver des voyageurs qui partagent une partie de mon trajet.

1. J'ajoute jusqu'à 10 étapes, chacune avec une ville et des dates.
2. Les étapes s'affichent dans l'ordre chronologique, quel que soit l'ordre de saisie.
3. Deux étapes dont les dates se chevauchent → message d'erreur sur l'étape concernée.
4. Une étape hors des dates du voyage → message d'erreur.
5. Un voyage sans étape compte comme une étape unique sur sa destination.

### A3 — Trouver des compagnons

**US-04 · Voir qui est dans la même ville** — EF-04 · Must · Kano : performance

En tant que Léa, je veux voir les voyageurs présents dans la même ville que moi aux mêmes dates afin de rencontrer du monde sur place.

1. Apparaissent les voyageurs qui ont au moins 1 jour commun avec moi dans la même ville.
2. Chaque carte montre : prénom, âge, photo, badge « vérifié » s'il y a lieu, langues, dates communes.
3. La liste est triée par nombre de jours communs, du plus grand au plus petit.
4. La liste est consultable sans avoir vérifié son identité (recommandation R5).
5. La liste s'affiche en 2 s au plus au 75e percentile en 4G (ENF-01).
6. Mon propre profil et les profils que j'ai bloqués n'apparaissent pas.
7. 0 résultat → message « Personne pour l'instant à Faro sur ces dates » et proposition d'élargir la recherche au pays (repli du risque R-01).

**US-05 · Voir les itinéraires communs** — EF-05 · Must · Kano : attractif

En tant que Léa, je veux voir avant mon départ les voyageurs dont l'itinéraire croise le mien afin de constituer un groupe pour le road trip.

1. Une étape est commune si la ville est la même et qu'au moins 1 jour coïncide.
2. Chaque voyageur affiche le nombre d'étapes communes (« 2 étapes sur 3 ») et lesquelles.
3. Tri par nombre d'étapes communes décroissant, puis par nombre de jours communs.
4. Un voyageur sans étape commune n'apparaît pas.
5. Consultable sans vérification d'identité.
6. 0 résultat → message « Aucun itinéraire commun pour l'instant » et lien vers la liste par ville (US-04).

**US-06 · Filtrer les profils** — EF-06, EF-07, EF-08 · Should · Kano : performance

En tant que Léa, je veux filtrer les voyageurs par âge, langue et genre afin de ne voir que les profils avec qui je me sentirai à l'aise.

1. Filtre par tranche d'âge (minimum et maximum) : aucun profil hors tranche n'apparaît.
2. Filtre par langue : seuls les profils qui déclarent cette langue apparaissent.
3. Filtre « femmes uniquement » : 0 profil d'un autre genre déclaré n'apparaît.
4. Les filtres se cumulent ; le compteur de résultats se met à jour (« 4 voyageurs »).
5. Un bouton réinitialise tous les filtres.
6. 0 résultat → message « Aucun voyageur ne correspond à ces filtres ».

### A4 — Entrer en contact

**US-07 · Vérifier son identité au premier contact** — EF-02 · Must · Kano : base

En tant que Léa, je veux faire vérifier mon identité au moment de ma première demande de contact afin que les autres voyageurs sachent que je suis réelle.

1. La vérification n'est demandée qu'à la première demande de contact, jamais pour consulter.
2. Elle demande une pièce d'identité officielle et un selfie.
3. Pendant le traitement, le statut affiché est « vérification en cours ».
4. Validée → badge « vérifié » sur mon profil, et ma demande de contact en attente est envoyée.
5. Refusée → le motif est affiché et je peux recommencer.
6. La copie de la pièce est supprimée sous 30 jours ; seul le statut est conservé (RSE-02).

**US-08 · Envoyer une demande de contact** — EF-09 · Must · Kano : base

En tant que Léa, je veux envoyer une demande de contact à Inès afin de lui proposer de faire le trajet ensemble.

1. La demande part depuis le profil, avec un message de présentation de 300 caractères au plus.
2. Compte non vérifié → redirection vers la vérification (US-07), la demande est gardée en attente.
3. Inès reçoit une notification de la demande.
4. Une seule demande en attente par personne : le bouton est remplacé par « Demande envoyée ».
5. Impossible d'envoyer une demande à un profil qui m'a bloquée ou que j'ai bloqué.
6. Aucun message ne peut être envoyé tant que la demande n'est pas acceptée.

**US-09 · Accepter une demande et discuter** — EF-09 · Must · Kano : base

En tant qu'Inès, je veux accepter ou refuser une demande afin de ne parler qu'aux voyageurs que j'ai choisis.

1. J'accepte ou je refuse depuis la notification ou la liste des demandes.
2. Acceptée → une conversation s'ouvre pour nous deux.
3. Refusée → l'expéditrice voit « Demande non acceptée », sans motif.
4. Les messages envoyés s'affichent chez le destinataire en moins de 5 s.
5. Message non envoyé (perte de réseau) → il est marqué « non envoyé » avec un bouton « Réessayer ».

**US-10 · Former un groupe de voyage** — *exigence à créer au CDC* · Must · Kano : base

En tant que Léa, je veux réunir dans un groupe les voyageurs qui ont accepté ma demande afin de discuter et de partager les frais à plusieurs.

1. Je crée un groupe en y ajoutant des contacts qui ont accepté ma demande.
2. Une conversation de groupe s'ouvre pour tous les membres.
3. Seul un contact accepté peut être ajouté ; les autres profils ne sont pas proposés.
4. Un membre peut quitter le groupe ; les autres en sont informés dans la conversation.
5. Le groupe affiche ses membres et la destination commune.

**US-11 · Signaler un profil** — EF-12 · Must · Kano : base

En tant que Léa, je veux signaler un profil au comportement inadapté afin que la modération intervienne.

1. Le signalement se fait depuis le profil ou la conversation, avec un motif choisi dans une liste.
2. Il est transmis à la modération, traité en 24 h au plus (ENF-08).
3. La conversation avec ce profil est masquée pour moi.
4. Le profil signalé n'est pas informé de l'identité de l'auteur du signalement.
5. Je reçois une confirmation de prise en compte.

**US-12 · Bloquer un profil** — EF-13 · Must · Kano : base

En tant que Léa, je veux bloquer un profil afin qu'il ne puisse plus me voir ni me contacter.

1. Profil bloqué → mon profil n'apparaît plus dans ses listes (US-04, US-05).
2. Il ne peut plus m'envoyer de demande ni de message.
3. Le profil bloqué n'est pas notifié du blocage.
4. Je retrouve mes blocages dans mes paramètres et peux les lever.
5. Un profil bloqué membre d'un de mes groupes reste dans le groupe, mais ses messages me sont masqués.

### A5 — Partager les frais

**US-13 · Créer une dépense partagée** — EF-10 · Must · Kano : performance

En tant que Léa, je veux créer la dépense de location de voiture pour le groupe afin que chacun connaisse sa part.

1. Je saisis un libellé, un montant et une catégorie (voiture, activité, autre), et je choisis les membres du groupe qui participent.
2. La part de chacun s'affiche en premier : 240 € entre 4 → 60 € chacun.
3. Montant non divisible au centime → les centimes restants sont ajoutés aux premières parts, le total reste exact.
4. Montant nul ou négatif → message d'erreur, la dépense n'est pas créée.
5. Seuls les membres du groupe peuvent être ajoutés à la dépense.
6. Tant qu'aucune part n'est payée, je peux modifier ou supprimer la dépense.
7. Chaque membre est notifié de la part qu'il doit.

**US-14 · Payer sa part** — EF-11 · Must · Kano : base

En tant qu'Inès, je veux payer ma part dans l'application afin de ne pas avancer d'argent en espèces à une inconnue.

1. Le paiement se fait par carte dans le composant du prestataire de paiement ; aucune donnée de carte ne passe par RoadMates (ENF-02).
2. Le créateur de la dépense voit ma part « payée » en moins d'1 minute.
3. Paiement refusé → message clair, ma part reste « à payer ».
4. Une part déjà payée ne peut pas être payée une seconde fois.
5. Je reçois un reçu par e-mail.
6. *Prototype* : le paiement est simulé, le statut passe à « payée » sans transaction réelle.

**US-15 · Réservation seulement quand tout est payé** — EF-21 · Must · Kano : base

En tant que Léa, je veux que la réservation ne soit lancée qu'une fois toutes les parts payées afin que personne ne soit engagé si un membre ne paie pas.

1. Tant qu'une part reste impayée, la dépense est « en attente » ; aucune réservation, aucun reversement.
2. Chaque membre voit qui a payé et qui n'a pas encore payé.
3. Dernière part payée → la dépense passe à « complète ».
4. Loueur non partenaire → la somme est reversée au créateur de la dépense, qui réserve lui-même.
5. Le créateur fixe la date de réservation prévue en créant la dépense ; c'est la date limite de paiement.
6. Dépense non complète à la date de réservation → la réservation n'est pas lancée et chaque part payée est remboursée.

### A6 — Se rencontrer

**US-16 · Choisir un lieu public pour le premier rendez-vous** — EF-23 · Should · Kano : attractif

En tant que Léa, je veux qu'on me suggère des lieux publics pour le premier rendez-vous afin de rencontrer le groupe dans un cadre rassurant.

1. Au moins 2 lieux publics sont proposés dans la ville du rendez-vous.
2. Une auberge partenaire de la ville apparaît parmi les suggestions s'il y en a une.
3. Je peux saisir un autre lieu ; rien n'est imposé.
4. Le lieu choisi est partagé dans la conversation de groupe.
5. Aucune suggestion disponible → je saisis le lieu moi-même, sans blocage.

**US-17 · Prévenir un proche** — EF-14 · Should · Kano : base

En tant que Léa, je veux envoyer le lieu et l'heure de mon rendez-vous à un proche afin que quelqu'un sache où je suis.

1. Je choisis un contact de confiance (numéro de téléphone).
2. Il reçoit par SMS : le lieu, l'heure et le prénom des personnes rencontrées.
3. Le proche n'a pas besoin de compte RoadMates.
4. Échec d'envoi du SMS → je suis prévenue et peux réessayer.
5. Aucune position GPS n'est transmise (RSE-01).

### A7 — Vivre le voyage sur place

**US-18 · Voir les offres des partenaires** — EF-16 · Should · Kano : performance

En tant que Léa, je veux voir les offres de groupe des partenaires de ma destination afin de payer moins cher à plusieurs.

1. Les offres actives dans la ville s'affichent avec leur réduction et le nombre minimum de voyageurs.
2. Une offre expirée n'apparaît plus.
3. 0 offre → message « Pas encore d'offre partenaire à Faro ».
4. Les offres sont clairement identifiées comme partenaires, distinctes des profils de voyageurs.
5. Aucun traceur publicitaire n'est chargé (RSE-03).

**US-19 · Proposer une activité ouverte** — EF-18 · Could · Kano : attractif

En tant qu'Inès, je veux publier « resto ce soir 20h, 3 places » afin que des voyageurs présents à Faro me rejoignent.

1. L'activité a un titre, une date, une heure, une ville et un nombre de places.
2. Les voyageurs présents dans la ville à cette date la voient.
3. Places atteintes → l'activité s'affiche « complète », plus personne ne peut la rejoindre.
4. Une activité passée disparaît des listes.
5. La créatrice peut annuler ; les participants sont notifiés.

**US-20 · Publier une offre partenaire** — EF-17 · Should · Kano : base (pour le partenaire)

En tant que gérant d'une auberge partenaire, je veux publier une offre réservée aux groupes RoadMates afin de remplir mes lits avec des groupes déjà constitués.

1. Seul un compte partenaire validé peut publier.
2. L'offre indique la réduction, le nombre minimum de voyageurs et la période de validité.
3. Elle apparaît dans la destination en moins de 5 minutes.
4. Une offre sans date de fin ou avec une réduction de 0 % est refusée.
5. Le partenaire peut suspendre son offre à tout moment.

### A8 — Après le voyage

**US-21 · Noter ses compagnons** — EF-15, EF-22 · Should · Kano : performance

En tant que Léa, je veux noter les membres de mon groupe après le voyage afin d'aider les futurs voyageurs à choisir.

1. La notation est proposée à la fin du voyage, aux membres ayant partagé au moins une dépense réglée.
2. Note de 1 à 5 et commentaire de 500 caractères au plus.
3. Les avis ne sont publiés qu'une fois que tous les membres ont noté, pour éviter les notes de représailles.
4. Si un membre n'a pas noté 10 jours après la fin du voyage, les avis déjà déposés sont publiés.
5. Un avis peut être signalé (US-11).

**US-22 · Garder ses amis de route** — EF-24 · Could · Kano : attractif

En tant que Léa, je veux ajouter Inès et Karim à mes amis de route afin d'être prévenue s'ils repartent vers une destination où je vais.

1. J'ajoute un ami de route depuis un groupe passé ; l'ajout doit être accepté par l'autre personne.
2. Un ami de route qui déclare un voyage avec au moins 1 jour commun avec l'un des miens → je reçois une notification.
3. Je peux retirer un ami de route ; il n'est pas notifié.
4. Les notifications d'amis de route peuvent être désactivées.
5. Un ami de route bloqué est retiré automatiquement.

**US-23 · Suggestions de compagnons par IA** (EF-19, V2) et **US-24 · Remboursement automatique en cas d'annulation** (EF-20, V2) : à détailler au refinement de la V2.

## 5. Kano

Le classement est une hypothèse de l'équipe. Il se valide en entretien avec le questionnaire Kano : « Que ressentez-vous si la fonction est présente ? Et si elle est absente ? ».

| Catégorie | Effet | Stories |
| --- | --- | --- |
| **Base** — attendue ; absente, elle provoque le rejet | Leur présence passe inaperçue, leur absence fait désinstaller | US-01, US-02, US-03, US-07, US-08, US-09, US-10, US-11, US-12, US-14, US-15, US-17, US-20 |
| **Performance** — plus c'est bien fait, plus on est satisfait | Nombre de voyageurs trouvés, clarté de la part à payer, montant des réductions | US-04, US-06, US-13, US-18, US-21 |
| **Attractif** — inattendu, crée l'« effet wouah » | Ce qu'aucun concurrent ne propose (vision produit §4.4) | US-05, US-16, US-19, US-22, US-23 |

Lecture croisée avec MoSCoW : le MVP contient toutes les fonctions de base du parcours principal, plus **une** fonction attractive, l'itinéraire commun (US-05). C'est elle qui distingue RoadMates d'un groupe Facebook de routards.

## 6. MoSCoW

| Priorité | Stories | Part de l'effort fonctionnel |
| --- | --- | --- |
| **Must** — sans elles, aucune mise en relation ni partage des frais | US-01 à US-05, US-07 à US-15 | 55 % (CDC §10, + US-10 à chiffrer) |
| **Should** — importantes, contournables au lancement | US-06, US-16, US-17, US-18, US-20, US-21 | — |
| **Could** — confort | US-19, US-22, US-23, US-24 | — |
| **Won't** — hors périmètre, écrit | Hébergement chez l'habitant, vente de billets, fonctions de rencontre amoureuse, publicité ciblée, GPS en temps réel (CDC §4) | — |

## 7. Definition of Done

S'applique à toutes les stories, en plus de leurs critères d'acceptation.

| # | Critère | Prototype | MVP |
| --- | --- | --- | --- |
| 1 | Tous les critères d'acceptation de la story sont vérifiés | ✓ | ✓ |
| 2 | Le parcours fonctionne sur un écran de 360 px de large et sur ordinateur | ✓ | ✓ |
| 3 | Le code est relu par 1 pair avant fusion | ✓ | ✓ |
| 4 | Aucun secret (clé d'API, mot de passe) dans le dépôt | ✓ | ✓ |
| 5 | Tests automatisés sur la logique métier (calcul des parts, dates communes), couverture ≥ 80 % | — | ✓ |
| 6 | 0 erreur d'accessibilité critique à l'audit automatique, contraste ≥ 4,5:1 (RSE-04) | — | ✓ |
| 7 | Testé sur Chrome, Firefox, Safari et Edge, dans leurs 2 dernières versions (ENF-09) | — | ✓ |
| 8 | Déployé sur l'environnement de recette | — | ✓ |

## 8. Arbitrages et points ouverts

La priorisation est une décision produit : voici les compromis assumés, à présenter au pitch.

| # | Arbitrage | Décision | Pourquoi |
| --- | --- | --- | --- |
| A-01 | Quand vérifier l'identité ? | Au premier contact, pas à l'inscription | Léa voit qu'il y a du monde avant de faire l'effort (R5) ; personne ne peut écrire sans être vérifié |
| A-02 | Filtre « femmes uniquement » en Should (CDC) alors que la vision le veut visible dès le premier écran | **À trancher** | Le passer en Must ajoute 3 j au MVP mais répond au premier frein des voyageuses |
| A-03 | Le groupe de voyage (US-10) n'existe pas au CDC | Ajouter une exigence au CDC | Trou repéré en relisant la frise : sans groupe, pas de dépense partagée à 4 |
| A-04 | Paiement réel dans le prototype ? | Simulé | Un après-midi ne suffit pas pour intégrer un prestataire de paiement ; le parcours reste démontrable |
| A-05 | Âge minimum | 18 ans | Rencontres entre inconnus et paiements : un mineur ne peut pas s'engager seul — à valider par l'équipe |
| A-06 | Date limite de paiement d'une dépense | Avant la date de réservation fixée par le créateur ; sinon remboursement | Personne n'est engagé tant que le groupe n'a pas entièrement payé |
| A-07 | Délai de publication des avis si un membre ne note jamais | 10 jours après la fin du voyage | Un membre qui ne note pas ne peut pas bloquer les avis des autres |
