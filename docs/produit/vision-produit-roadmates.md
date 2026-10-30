# Vision produit — RoadMates

*Compagnons de route pour voyageurs solo*

| | |
| --- | --- |
| Version | 1.0 |
| Date | 29/10/2026 |
| Statut | Brouillon — hypothèses à confirmer par les entretiens utilisateurs |
| Auteurs | À compléter |
| Document lié | Cahier des charges RoadMates v1.0 |

---

## 1. Vision

> **Personne ne devrait renoncer à un voyage, ou le vivre moins bien, parce qu'il part seul.**

RoadMates veut que chaque voyageur solo puisse, en quelques minutes, trouver des personnes qui vont au même endroit que lui, les rencontrer en confiance et partager avec elles la route, les activités et les frais.

### Énoncé de vision (modèle de Geoffrey Moore)

> **Pour** les voyageurs solo de tous âges
> **qui** veulent rencontrer d'autres voyageurs sans dépenser plus,
> **RoadMates** est une application web et mobile de compagnons de route
> **qui** permet de trouver, avant le départ ou sur place, des voyageurs qui vont au même endroit, puis de partager avec eux les frais (voiture, activités) en payant directement dans l'application.
> **Contrairement aux** réseaux de routards peu actifs, aux chats d'auberge réservés à leurs clients et au covoiturage limité au trajet,
> **notre produit** réunit la rencontre, l'itinéraire commun et le partage des frais dans un cadre de confiance : identité vérifiée et messagerie ouverte seulement si les deux personnes acceptent.

---

## 2. Le problème

### 2.1 Les douleurs du voyageur solo

| Douleur | Conséquence | Fréquence supposée |
| --- | --- | --- |
| Il paie seul ce qui se partage : location de voiture, essence, excursion, guide, chambre privée | Le voyage coûte plus cher ; il renonce à certaines activités | Forte — à confirmer |
| Il ne sait pas qui fait le même trajet ou se trouve dans la même ville aux mêmes dates | Il voyage isolé alors que d'autres voyageurs sont à côté | Forte — à confirmer |
| Les outils existants sont éparpillés et peu actifs | Il abandonne la recherche après quelques essais | Moyenne — à confirmer |
| Il a peur de rencontrer un inconnu | Il ne franchit pas le pas, surtout les voyageuses solo | Forte chez les voyageuses — à confirmer |

Ces douleurs sont des hypothèses de l'équipe. Elles seront validées ou corrigées par 10 entretiens avec des voyageurs solo, selon le guide de l'annexe A du cahier des charges.

### 2.2 Pourquoi maintenant

- Le voyage en solo se développe, chez les jeunes comme chez les jeunes retraités.
- Le budget des voyageurs est sous pression : le partage des frais devient un argument fort.
- Les outils de paiement pour places de marché (Stripe Connect et équivalents) permettent aujourd'hui d'intégrer un paiement entre utilisateurs sans être soi-même établissement de paiement.
- La vérification d'identité en ligne (pièce + selfie) est devenue accessible à une petite structure.

---

## 3. Les cibles

### 3.1 Le marché

Les voyageurs solo de tous âges, en Europe, qui partent pour des séjours de quelques jours à quelques semaines et qui veulent à la fois rencontrer du monde et maîtriser leur budget.

### 3.2 La réalité du terrain

*Recherche documentaire du 29/10/2026. Les chiffres viennent surtout de sondages commerciaux (Skyscanner, Ifop pour Tourlane, Insure&Go, Amadeus) : ils donnent des tendances, pas des statistiques officielles. Aucune source officielle française ne détaille les voyageurs solo par âge.*

**Le voyage solo progresse**

- Selon Skyscanner (2026), 74 % des Français ont déjà voyagé seuls et 41 % prévoient de repartir dans les 12 mois.
- Amadeus relève une hausse de 50 % des voyages solo vers la France à Pâques 2026 par rapport à 2025, portée par les courts séjours en ville.
- On part seul surtout pour rencontrer du monde : « solo, mais pas solitaire » (rapport Skyscanner 2026).

**Pour les femmes, la sécurité conditionne le départ**

- La sécurité est le premier frein pour 66 % des femmes (Tourlane-Ifop).
- Sur un sondage britannique, 49 % des femmes seulement se sentent confiantes pour rester en sécurité en voyageant seules ; près d'une sur quatre dit avoir subi une attention non désirée ou du harcèlement en voyage.
- Sur un sondage australien (Insure&Go), les moins de 30 ans sont les plus nombreuses à voyager seules et les plus prêtes à payer pour leur sécurité : 31 %, contre 16 % des plus de 50 ans.

**Pour les jeunes, le prix passe avant tout**

- Une enquête 2024 auprès de 2 304 étudiants Erasmus+ place le prix en premier critère de choix des déplacements (29 %), devant la durée du trajet (25 %). L'échantillon n'est pas représentatif.
- Une étude plus ancienne indique que 81,7 % des étudiants Erasmus voyagent hors de leur pays d'accueil pendant leur mobilité.

**Les seniors sont nombreux mais déjà servis**

- Selon Ulysse, les femmes de plus de 55 ans restent majoritaires parmi les voyageurs solo.
- Elles disposent déjà d'offres organisées : circuits entre femmes, voyages pour célibataires, croisières avec tarifs « single », suppression progressive du supplément single.

### 3.3 Cible prioritaire : pour qui on code

**Les voyageurs solo de 18 à 30 ans, au budget serré, qui font des séjours courts en Europe — avec une attention particulière aux voyageuses, pour qui la sécurité conditionne le passage à l'acte.**

Pourquoi cette cible :

1. C'est elle qui voyage le plus seule, et le plus souvent (week-ends, Erasmus, vacances courtes).
2. Le prix est son premier critère : le partage des frais lui parle immédiatement.
3. Elle est déjà sur mobile et sur les réseaux sociaux, son premier canal de découverte.
4. Elle se concentre aux mêmes endroits (villes étudiantes, auberges de jeunesse), ce qui répond au risque de l'application vide.
5. Les auberges de jeunesse et les activités de groupe sont des partenaires naturels pour ce public.

Ce que cela impose au produit :

- **Sécurité visible dès le premier écran** : badge d'identité vérifiée, filtre « femmes uniquement », partage du rendez-vous avec un proche.
- **Prix d'abord** : la part de chacun s'affiche en premier dans une dépense partagée.
- **Courts séjours** : déclarer un voyage d'un week-end en moins d'une minute.
- **Ville pilote étudiante** : Lyon proposée, à confirmer.

### 3.4 Personas

| Persona | Priorité | Raison |
| --- | --- | --- |
| Léa, 23 ans | Cible principale (MVP) | Le prix et la sécurité, ses deux attentes, sont confirmés par le terrain |
| Karim, 34 ans | Cible secondaire (V1) | Besoin réel de rencontre sur place, moins de partage de frais |
| Monique, 58 ans | Plus tard (V2) | Elle achète un cadre organisé plutôt qu'une mise en relation entre inconnus ; à toucher via des partenariats avec des voyagistes |

**Léa, 23 ans — étudiante en Erasmus à Lisbonne (cible principale)**

- Situation : budget serré, voyage souvent le week-end.
- Objectif : faire un road trip dans l'Algarve.
- Frein : elle ne peut pas payer seule la location d'une voiture.
- Ce que RoadMates lui apporte : trouver 3 voyageurs qui font le même trajet et diviser la voiture par 4.

**Karim, 34 ans — cadre en télétravail (cible secondaire)**

- Situation : voyage seul entre deux missions, une semaine par mois.
- Objectif : ne pas dîner seul tous les soirs, faire une randonnée avec d'autres.
- Frein : il ne connaît personne dans les villes où il passe.
- Ce que RoadMates lui apporte : voir qui est dans la même ville ce soir-là et proposer une sortie.

**Monique, 58 ans — jeune retraitée (plus tard)**

- Situation : temps libre, budget correct, première fois seule à l'étranger.
- Objectif : découvrir le Japon sans être isolée.
- Frein : elle a besoin de se sentir en confiance avant de rencontrer quelqu'un.
- Ce que RoadMates lui apporte : des profils vérifiés, des filtres par âge et par langue, le partage de son rendez-vous avec un proche.

### 3.5 Les partenaires (clients payeurs)

| Partenaire | Ce qu'il cherche | Ce que RoadMates lui apporte |
| --- | --- | --- |
| Auberges et hébergements | Remplir les lits, attirer des groupes | Visibilité auprès de voyageurs qui arrivent en groupe constitué |
| Prestataires d'activités (excursions, kayak, visites guidées) | Compléter leurs départs | Des groupes déjà formés, prêts à réserver ensemble |
| Loueurs de voitures | Louer plus longtemps, à plusieurs conducteurs | Des voyageurs qui partagent une location |
| Offices de tourisme | Promouvoir la destination | Un canal vers les voyageurs solo |

### 3.6 Sources

- [Skyscanner via Le Petit Journal — 2026, voyage solo pas solitaire](https://lepetitjournal.com/expat-mag/voyage/2026-tendance-voyage-solo-pas-solitaire-430347)
- [Amadeus — hausse des voyages vers la France à Pâques](https://amadeus.com/fr/newsroom/communique-presse/hausse-des-voyages-vers-la-france-a-paques)
- [Ulysse — voyage en solo en 2026](https://ulysse.com/news/voyage-solo-2026-guide-destinations)
- [Ulysse — circuits 100 % féminins](https://ulysse.com/news/voyage-organise-femmes-circuits-groupe-2026)
- [Euronews — tendances du voyage en solo en 2026](https://fr.euronews.com/travel/2026/08/04/liberte-securite-et-epanouissement-les-grandes-tendances-du-voyage-en-solo-en-2026)
- [CityNews — sécurité des femmes en voyage solo (Insure&Go)](https://citynews.com.au/2025/womens-safety-premium-for-solo-travel-peace-of-mind/)
- [ITIJ — inquiétudes des voyageuses face au harcèlement](https://www.itij.com/latest/news/womens-travel-safety-concerns-grow-harassment-reports-surge-60)
- [Enquête 2024 sur les déplacements des étudiants Erasmus+](https://sustain.cuni.cz/SUSEN-133-version1.txt)
- [Étude 2022 sur les habitudes des étudiants Erasmus](https://zenodo.org/records/10654122/files/2022_GE_Research-on-habits-of-Erasmus-students.pdf)
- [Plare — voyages pour célibataires](https://www.plare.fr/?p=302146)

---

## 4. La proposition de valeur

### 4.1 Les quatre promesses

1. **Trouver** — voir avant le départ qui a un itinéraire commun, et sur place qui est dans la même ville ou le même pays aux mêmes dates.
2. **Faire confiance** — identité vérifiée par une pièce officielle, filtres (âge, langue, genre), avis après le voyage, partage du rendez-vous avec un proche.
3. **Partager** — créer une dépense commune (voiture, activité) ; chacun paie sa part dans l'application.
4. **Économiser** — des réductions de groupe chez les partenaires de la destination.

### 4.2 Le parcours type

Léa, 23 ans, étudiante en Erasmus à Lisbonne, prépare un road trip d'une semaine dans l'Algarve en juillet.

**Phase 1 — Découverte (réseaux sociaux)**

1. Léa voit une vidéo TikTok d'une étudiante qui a fait le tour de l'Algarve à 4 avec RoadMates pour 60 € de voiture chacune. La même publication circule dans le groupe Instagram Erasmus de sa ville.
2. Elle télécharge l'application.

**Phase 2 — Inscription et exploration sans engagement**

3. Elle crée son compte (e-mail vérifié) en moins de 2 minutes.
4. Elle déclare son voyage : Algarve, du 10 au 17 juillet, étapes Lagos puis Faro.
5. Elle peut déjà parcourir les voyageurs de sa destination, mais ne peut écrire à personne : un bandeau lui indique qu'il faut vérifier son identité pour entrer en contact.

**Phase 3 — Choisir ses compagnons**

6. RoadMates lui montre 6 voyageurs qui ont au moins 2 étapes en commun avec elle.
7. Sur chaque profil, elle voit : une photo réelle et une courte présentation, le badge « identité vérifiée », la note moyenne et le nombre de voyages, les étapes et les dates communes.
8. Elle filtre sur les femmes de 20 à 30 ans.

**Phase 4 — Vérification puis premier contact**

9. Elle veut écrire à Inès : l'application lui demande alors de vérifier son identité (pièce d'identité et selfie).
10. Une fois vérifiée, elle envoie 3 demandes de contact.
11. Deux acceptent : la conversation de groupe s'ouvre.

**Phase 5 — Partager les frais**

12. Le groupe décide de louer une voiture à 4. Léa crée la dépense de 240 €.
13. Chacun paie sa part de 60 € dans l'application. La réservation n'est lancée que lorsque toutes les parts sont payées ; tant que ce n'est pas le cas, personne n'est engagé.
14. Deux cas selon le prestataire :
    - **loueur partenaire** : la réservation est faite directement dans l'application, avec la réduction de groupe ;
    - **loueur non partenaire** : l'argent est reversé à Léa, qui réserve elle-même.

**Phase 6 — La première rencontre**

15. Pour le premier rendez-vous à Lagos, l'application suggère des lieux publics : un café du centre ou l'auberge partenaire du groupe.
16. Le groupe reste libre de choisir un autre lieu : rien n'est imposé.

**Phase 7 — Sur place**

17. Un soir à Faro, Inès publie une activité ouverte : « resto ce soir 20h, 3 places ».
18. Léa consulte aussi la liste des voyageurs présents à Faro ce soir-là et envoie une demande à Karim, qui rejoint l'activité.
19. Le groupe profite de −15 % sur une sortie kayak proposée par un partenaire.

**Phase 8 — Après le voyage**

20. Chacun note les autres. Les avis ne deviennent visibles que lorsque tout le monde a noté, pour éviter les notes de représailles.
21. Léa ajoute Inès et Karim à ses « amis de route » : au prochain voyage, l'application lui signale s'ils partent vers la même destination.

### 4.3 Points de friction et réponses

| Moment | Friction possible | Réponse de RoadMates |
| --- | --- | --- |
| Découverte | « Encore une appli de rencontre ? » | Message centré sur le voyage et les économies, jamais sur la séduction |
| Exploration | Abandon avant d'avoir vu la valeur | Parcourir sans vérification : Léa voit qu'il y a du monde avant de s'engager |
| Vérification d'identité | Effort perçu, crainte pour ses données | Demandée seulement au premier contact, pièce supprimée sous 30 jours |
| Premier contact | Peur de l'inconnu | Badge vérifié, avis, filtre femmes uniquement, messagerie après acceptation |
| Paiement | Un membre ne paie pas | Réservation lancée seulement quand toutes les parts sont payées |
| Rencontre | Lieu inconnu, inquiétude | Lieux publics suggérés, choix libre du groupe |
| Après le voyage | Le lien se perd | Amis de route, alerte s'ils partent vers la même destination |

### 4.4 Le différenciateur

Aucun acteur ne réunit aujourd'hui les trois briques suivantes :

| Brique | Réseaux de routards | Chat d'auberge | Covoiturage | RoadMates |
| --- | --- | --- | --- | --- |
| Rencontre avant le départ sur un itinéraire commun | Partiel | Non | Trajet seul | Oui |
| Rencontre sur place dans la même ville | Oui | Clients de l'auberge seulement | Non | Oui |
| Partage et paiement des frais intégrés | Non | Non | Trajet seul | Oui |
| Identité vérifiée | Rarement | Non | Partiel | Oui |

