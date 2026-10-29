---
titre: RoadMates — compagnons de route pour voyageurs solo
sous_titre: Cahier des charges
client: RoadMates (projet de startup fictif)
agence: ⚠️ À COMPLÉTER
version: "1.0"
statut: Brouillon
date: 2026-10-29
auteur: ⚠️ À COMPLÉTER
module: Exercice de vision produit
confidentialite: Document pédagogique
---

## Table des versions

| Version | Date | Contenu | Auteurs |
| --- | --- | --- | --- |
| v1.0 | 29/10/2026 | §1 à §13 en brouillon, annexe A (guide d'entretien non encore mené), §14 à tenir | ⚠️ À COMPLÉTER |

<!-- saut-de-page -->

## §1 · Contexte

**Le besoin réel de nos utilisateurs, c'est de ne plus voyager seul quand ils n'en ont pas envie, et de ne plus payer seul ce qui coûte moins cher à plusieurs.**

RoadMates est un projet de startup fictif, porté par l'équipe dans le cadre d'un exercice de vision produit. Il n'y a donc pas de client externe : l'équipe est à la fois maîtrise d'ouvrage et maîtrise d'œuvre, et les « clients » à interroger sont les voyageurs solo eux-mêmes (annexe A).

**Le problème constaté (hypothèses de l'équipe, à confirmer en entretien)** :

- Un voyageur solo paie seul ce qui se partage : location de voiture, essence, excursion avec guide, chambre privée. ⚠️ À VÉRIFIER À L'ENTRETIEN — part du budget concernée.
- Il ne sait pas qui, parmi les autres voyageurs, fait le même trajet ou se trouve dans la même ville aux mêmes dates.
- Les outils existants sont éclatés : réseaux sociaux de routards peu actifs, chats limités aux clients d'une auberge, applications d'hébergement chez l'habitant devenues payantes, covoiturage limité au trajet.
- La peur de la mauvaise rencontre freine le passage à l'acte, en particulier chez les voyageuses solo. ⚠️ À VÉRIFIER À L'ENTRETIEN.

**Ce qui est demandé par l'équipe (atelier du 29/10/2026)** :

- Angle : petit budget (partager voiture, activités) et compagnon d'itinéraire (trouver avant le départ quelqu'un qui fait le même voyage, voir sur place les voyageurs venus d'ailleurs présents dans la même ville ou le même pays).
- Cible : voyageurs solo de tous âges, avec des filtres.
- Paiement intégré pour le partage des frais.
- Modèle économique : partenariats.
- Supports : web et mobile.

**Existant** : aucun — projet créé ex nihilo. Un prototype doit être réalisé le 29/10/2026 après-midi avec des agents IA ; il sert à démontrer la vision, pas à être mis en production.

## §2 · Objectifs

Les valeurs cibles sont des hypothèses de l'équipe, à fixer définitivement après les entretiens (annexe A).

| ID | Objectif SMART | Indicateur | Valeur actuelle | Cible | Échéance |
| --- | --- | --- | --- | --- | --- |
| O-01 | Mettre en relation les voyageurs solo qui partagent une destination | Part des voyages déclarés ayant obtenu au moins 1 contact accepté | 0 (lancement) | ≥ 40 % — ⚠️ À COMPLÉTER | 6 mois après le lancement |
| O-02 | Faire baisser le coût du voyage par le partage des frais | Nombre de dépenses partagées payées via l'application par mois | 0 | 500 / mois — ⚠️ À COMPLÉTER | 12 mois après le lancement |
| O-03 | Financer le service par les partenaires | Nombre de partenaires actifs dans la ville pilote | 0 | 20 — ⚠️ À COMPLÉTER | 6 mois après le lancement |
| O-04 | Garantir des rencontres sans incident | Signalements pour comportement dangereux pour 1 000 rencontres | Non mesuré | ≤ 5 | 12 mois après le lancement |

L'objectif n°1 est **O-01** : sans mise en relation, ni le partage des frais ni les partenariats n'ont de sens. C'est lui que le MVP doit servir.

## §3 · Parties prenantes

| Partie prenante | Rôle | Intérêt | Pouvoir | Position matrice | Attente principale |
| --- | --- | --- | --- | --- | --- |
| Équipe fondatrice — ⚠️ À COMPLÉTER | MOA · sponsor | 4 | 4 | Gérer étroitement | Démontrer une vision produit défendable |
| Équipe de réalisation et agents IA | MOE | 4 | 3 | Gérer étroitement | Un périmètre réalisable en prototype l'après-midi du 29/10 |
| Voyageurs solo (tous âges) | Utilisateurs finaux | 4 | 2 | Informer | Trouver un compagnon de route fiable, payer moins |
| Voyageuses solo | Utilisatrices finales | 4 | 2 | Informer | Pouvoir filtrer les profils et se sentir en confiance |
| Auberges et hébergements partenaires | Partenaires payeurs | 3 | 3 | Gérer étroitement | Recevoir des clients en groupe, visibilité dans l'application |
| Prestataires d'activités (excursions, location de voitures) | Partenaires payeurs | 3 | 3 | Gérer étroitement | Remplir leurs départs avec des groupes constitués |
| Offices de tourisme | Partenaires institutionnels | 2 | 2 | Surveiller | Promouvoir la destination auprès des voyageurs solo |
| Prestataire de paiement (Stripe Connect envisagé) | Fournisseur | 2 | 4 | Satisfaire | Respect de ses conditions d'utilisation et de la conformité anti-fraude |
| Prestataire de vérification d'identité | Fournisseur | 2 | 3 | Satisfaire | Volume de vérifications, intégration conforme |
| Apple App Store et Google Play | Plateformes de distribution | 1 | 4 | Satisfaire | Respect des règles de publication (contenus entre utilisateurs, modération) |
| CNIL / référent RGPD de l'équipe | Autorité / conformité | 2 | 4 | Satisfaire | Minimisation des données de localisation et d'identité |
| Enseignant / jury du cours | Évaluateur | 3 | 4 | Gérer étroitement | Un besoin réel, un périmètre clair, des risques couverts |

<!-- saut-de-page -->

## §4 · Périmètre

### IN — ce qu'on livre

- Inscription avec vérification d'e-mail, puis vérification d'identité.
- Déclaration d'un voyage : destination (ville ou pays) et dates.
- Recherche des voyageurs qui ont un itinéraire commun avant le départ.
- Liste des voyageurs présents dans la même ville ou le même pays aux mêmes dates.
- Filtres par âge, langue et genre.
- Demande de contact, puis messagerie ouverte après acceptation mutuelle.
- Dépenses partagées (voiture, activité) avec paiement intégré de sa part.
- Signalement, blocage et avis après un voyage commun.
- Offres des partenaires dans la ville de destination.
- Application web responsive et applications mobiles iOS et Android.

### OUT — ce qu'on ne fera pas

- **Hébergement chez l'habitant** — responsabilité juridique et assurantielle hors de portée, marché déjà occupé par des acteurs installés.
- **Vente de billets de transport ou de séjours** — impose une immatriculation d'opérateur de voyages et une garantie financière, sans rapport avec le besoin de mise en relation.
- **Fonctions de rencontre amoureuse** (swipe, « likes ») — brouille le positionnement et aggrave le risque de comportements inadaptés (R-06, O-04).
- **Publicité ciblée** — l'équipe a retenu les partenariats comme modèle, et la publicité ciblée exige des traceurs contraires à RSE-03.
- **Géolocalisation GPS en temps réel des autres voyageurs** — risque de traque, contraire à la minimisation des données ; la ville suffit au besoin (recommandation R1).

### LATER — reporté à une version suivante

- Activités ouvertes : un voyageur propose une sortie que d'autres rejoignent (V1).
- Suggestions de compagnons par IA selon le rythme, le budget et l'itinéraire (V2).
- Programme de voyage commun généré à plusieurs (V2).
- Traduction automatique des messages (V2).

### Recommandations

| # | Constat | Recommandation | Bénéfice → objectif servi |
| --- | --- | --- | --- |
| R1 | Voir « qui est dans la même ville » est le cœur du besoin, mais une position précise expose les voyageurs | Localisation déclarative à la ville, jamais de position GPS stockée ni affichée | Réduit le risque de traque et la donnée collectée — sert O-04 |
| R2 | Une application de mise en relation vide n'a aucune valeur pour le premier inscrit (effet réseau) | Lancement sur une ville pilote — ⚠️ À COMPLÉTER (Lyon proposé) — avec les auberges partenaires comme canal d'acquisition | Densité de voyageurs suffisante pour obtenir des contacts — sert O-01 et O-03 |
| R3 | Encaisser l'argent des voyageurs pour le reverser ferait de RoadMates un établissement de paiement soumis à agrément | Paiement intégré via une plateforme de paiement pour places de marché (Stripe Connect envisagé), qui porte la conformité | Paiement intégré sans agrément propre — sert O-02 |
| R4 | La peur de la mauvaise rencontre freine l'usage | Messagerie ouverte seulement après acceptation mutuelle, identité vérifiée affichée par un badge | Rencontres consenties, profils vérifiés — sert O-04 et O-01 |

## §5 · Exigences fonctionnelles

| ID | Exigence | Priorité | Critère d'acceptation | Source |
| --- | --- | --- | --- | --- |
| EF-01 | Le voyageur crée un compte avec une adresse e-mail vérifiée | Must | Given un formulaire d'inscription rempli, When je clique sur le lien reçu, Then mon compte est actif en moins de 2 minutes | Équipe, atelier du 29/10 |
| EF-02 | Le voyageur fait vérifier son identité par une pièce officielle | Must | Given un compte actif, When j'envoie ma pièce d'identité et un selfie, Then un badge « vérifié » s'affiche sur mon profil après validation | Équipe, recommandation R4 |
| EF-03 | Le voyageur déclare un voyage avec une destination et des dates | Must | Given un compte vérifié, When je saisis Lisbonne du 10 au 17 juillet, Then le voyage apparaît dans mon profil | Équipe, atelier du 29/10 |
| EF-04 | Le voyageur voit les autres voyageurs présents dans la même ville aux mêmes dates | Must | Given 3 voyageurs déclarés à Lisbonne avec au moins 1 jour commun avec mes dates, When j'ouvre la destination, Then les 3 profils s'affichent | Équipe, atelier du 29/10 |
| EF-05 | Le voyageur voit, avant son départ, les voyageurs qui ont un itinéraire commun | Must | Given un voyageur dont 2 étapes sur 3 coïncident avec les miennes, When je consulte mes compagnons possibles, Then il apparaît avec le nombre d'étapes communes | Équipe, atelier du 29/10 |
| EF-06 | Le voyageur filtre les profils par tranche d'âge | Should | Given un filtre 25–35 ans, When j'affiche la liste, Then aucun profil hors de cette tranche n'apparaît | Équipe, atelier du 29/10 |
| EF-07 | Le voyageur filtre les profils par langue parlée | Should | Given un filtre « espagnol », When j'affiche la liste, Then seuls les profils déclarant l'espagnol apparaissent | Équipe, atelier du 29/10 |
| EF-08 | Le voyageur filtre les profils par genre | Should | Given un filtre « femmes uniquement », When j'affiche la liste, Then 0 profil d'un autre genre déclaré n'apparaît | Équipe, atelier du 29/10 |
| EF-09 | Le voyageur envoie une demande de contact, la messagerie s'ouvrant après acceptation | Must | Given une demande envoyée, When le destinataire l'accepte, Then une conversation s'ouvre pour les deux ; sans acceptation, aucun message ne peut être envoyé | Équipe, recommandation R4 |
| EF-10 | Le voyageur crée une dépense partagée entre les membres d'un groupe | Must | Given une location de voiture de 240 € entre 4 voyageurs, When je crée la dépense, Then chaque membre voit une part de 60 € à régler | Équipe, atelier du 29/10 |
| EF-11 | Le voyageur paie sa part dans l'application | Must | Given une part de 60 € à régler, When je paie par carte, Then le créateur de la dépense voit ma part « payée » en moins d'1 minute | Équipe, atelier du 29/10 |
| EF-12 | Le voyageur signale un profil | Must | Given un profil au comportement inadapté, When je le signale avec un motif, Then le signalement est transmis à la modération ; la conversation est masquée pour moi | Équipe, recommandation R4 |
| EF-13 | Le voyageur bloque un profil | Must | Given un profil bloqué, When ce profil consulte ma destination, Then mon profil ne lui apparaît plus | Équipe, recommandation R4 |
| EF-14 | Le voyageur partage le lieu et l'heure d'un rendez-vous avec un proche | Should | Given un rendez-vous planifié, When je choisis un contact de confiance, Then ce contact reçoit par SMS le lieu, l'heure et le profil rencontré | Équipe, objectif O-04 |
| EF-15 | Le voyageur laisse un avis après un voyage commun | Should | Given une dépense partagée réglée avec un voyageur, When le voyage est terminé, Then je peux le noter de 1 à 5 avec un commentaire | Équipe, objectif O-04 |
| EF-16 | Le voyageur consulte les offres des partenaires dans sa ville de destination | Should | Given 5 partenaires actifs à Lisbonne, When j'ouvre la destination, Then les 5 offres s'affichent avec leur réduction de groupe | Équipe, modèle économique (partenariats) |
| EF-17 | Le partenaire publie une offre réservée aux groupes RoadMates | Should | Given un compte partenaire validé, When je publie une offre « −15 % dès 3 voyageurs », Then elle apparaît dans la destination en moins de 5 minutes | Équipe, modèle économique (partenariats) |
| EF-18 | Le voyageur propose une activité ouverte que d'autres voyageurs rejoignent | Could | Given une activité « kayak samedi 10h, 4 places », When 4 voyageurs la rejoignent, Then elle s'affiche « complète » | Équipe, LATER §4 |
| EF-19 | Le voyageur reçoit des suggestions de compagnons calculées par IA | Could | Given un profil « petit budget, culture », When j'ouvre mes suggestions, Then 5 profils classés par compatibilité s'affichent avec la raison du classement | Équipe, LATER §4 |
| EF-20 | Le voyageur est remboursé si une activité partagée est annulée | Could | Given une activité annulée par son créateur, When l'annulation est confirmée, Then ma part est remboursée sous 7 jours | Équipe, proposition |

## §6 · Exigences non fonctionnelles

| ID | Exigence | Priorité | Critère d'acceptation | Source |
| --- | --- | --- | --- | --- |
| ENF-01 | Performance — la liste des voyageurs d'une destination s'affiche en ≤ 2 s | Must | 75e percentile ≤ 2 s en 4G, mesuré sur 100 chargements | Équipe, proposition |
| ENF-02 | Sécurité — aucune donnée de carte bancaire ne transite ni n'est stockée sur les serveurs RoadMates | Must | Saisie de carte dans le composant du prestataire de paiement ; audit du code : 0 champ de carte côté RoadMates | Équipe, recommandation R3 |
| ENF-03 | Sécurité — authentification à deux facteurs obligatoire pour les comptes de modération | Must | Given un compte modérateur, When il se connecte, Then un second facteur est exigé à chaque nouvelle session | Équipe, proposition |
| ENF-04 | Compatibilité mobile — application sur iOS 16+ ou Android 10+ | Must | Recette des parcours EF-01 à EF-11 réussie sur 1 appareil iOS 16 et 1 appareil Android 10 | Équipe, atelier du 29/10 (web + mobile) |
| ENF-09 | Compatibilité web — site sur les 2 dernières versions de Chrome, Firefox, Safari, Edge | Must | Recette des parcours EF-01 à EF-11 réussie sur les 8 versions ciblées | Équipe, atelier du 29/10 (web + mobile) |
| ENF-05 | Intégration — reversement des parts via l'API d'une plateforme de paiement pour places de marché | Must | Paiement test de 60 € reçu sur le compte du créateur de la dépense en environnement de test | Équipe, recommandation R3 |
| ENF-06 | Disponibilité — service accessible 99,5 % du temps par mois | Should | Supervision externe : indisponibilité ≤ 3 h 39 par mois | Équipe, proposition |
| ENF-07 | Langues — interface disponible en français et en anglais | Should | 100 % des écrans traduits dans les 2 langues à la mise en ligne | Équipe, cible internationale |
| ENF-08 | Modération — un signalement est traité en ≤ 24 h | Must | Délai médian entre signalement et décision ≤ 24 h, mesuré chaque mois | Équipe, objectif O-04 |

## §7 · Exigences RSE

| ID | Exigence | Priorité | Critère d'acceptation | Source |
| --- | --- | --- | --- | --- |
| RSE-01 | Éthique des données — la localisation est déclarée à la ville, aucune position GPS n'est collectée | Must | Revue du code : 0 appel aux API de géolocalisation ; registre RGPD à jour | Équipe, recommandation R1 |
| RSE-02 | Éthique des données — les pièces d'identité sont supprimées après vérification | Must | Copie de la pièce supprimée sous 30 jours ; seul le statut « vérifié » est conservé | Équipe, proposition (RGPD) |
| RSE-03 | Éthique des données — 0 traceur publicitaire | Must | Scan des cookies et SDK : 0 traceur publicitaire détecté | Équipe, OUT §4 |
| RSE-04 | Social — parcours d'inscription et de paiement conformes au RGAA 4.1 | Must | Audit RGAA : parcours EF-01, EF-10, EF-11 100 % conformes ; global ≥ 75 % ; contraste ≥ 4,5:1 | Équipe, proposition (European Accessibility Act) |
| RSE-05 | Environnement — page de destination ≤ 1 Mo et ≤ 40 requêtes | Should | Audit EcoIndex ≥ B sur les 5 pages principales | Équipe, proposition (RGESN) |
| RSE-06 | Environnement — application utilisable sur un smartphone de 6 ans en 3G | Should | Parcours EF-03 à EF-05 réalisés en ≤ 10 s par étape sur un appareil Android de 2020 en 3G | Équipe, proposition (RGESN) |
| RSE-07 | Éthique des données — comptes inactifs supprimés après 3 ans | Should | Given un compte sans connexion depuis 36 mois, When la purge mensuelle passe, Then le compte est anonymisé ; le voyageur est prévenu 30 jours avant | Équipe, proposition (RGPD) |

## §8 · Contraintes

| Famille | Contrainte | Origine | Conséquence sur le projet |
| --- | --- | --- | --- |
| Délais | Prototype réalisé l'après-midi du 29/10/2026 avec des agents IA | Équipe, consigne de l'exercice | Le prototype ne couvre qu'une partie du MVP (voir §10) ; il n'est pas destiné à la production |
| Budget | Budget de construction et de fonctionnement — ⚠️ À COMPLÉTER | Équipe, « on verra plus tard » | Le TCO du §12 ne peut pas être conclu tant que le budget n'est pas fixé |
| Économique | Le modèle de revenus repose sur les partenariats, sans publicité | Équipe, atelier du 29/10 | Les partenaires doivent être recrutés avant le lancement de la ville pilote (R-05) |
| Technique | Supports web et mobile | Équipe, atelier du 29/10 | Code partagé recommandé entre web et mobile pour limiter l'effort |
| Légale | Paiement entre utilisateurs | Directive européenne sur les services de paiement (DSP2) | Passage obligé par un prestataire agréé (R3), vérification d'identité des payeurs |
| Légale | Données d'identité et de localisation | RGPD | Minimisation (RSE-01, RSE-02), registre des traitements, analyse d'impact à prévoir |
| Distribution | Contenus échangés entre utilisateurs | Règles de l'App Store et de Google Play | Signalement, blocage et modération obligatoires pour être publié (EF-12, EF-13, ENF-08) |

<!-- saut-de-page -->

## §9 · Faisabilité

### Estimation de charge

Hypothèse : une équipe classique réalisant le MVP complet destiné à la production, hors prototype de l'après-midi. Les charges sont des estimations de l'équipe.

| Lot | Charge (j) |
| --- | --- |
| Cadrage & conception (maquettes, parcours) | 5 |
| Front web et mobile (code partagé) | 24 |
| Back & API (comptes, voyages, messagerie, dépenses) | 20 |
| Intégrations (paiement, vérification d'identité, SMS) | 12 |
| Recette & déploiement (dont publication sur les stores) | 8 |
| Gestion de projet | 10 |
| **Total** | **79** |

PERT sur les trois tâches les plus incertaines :

| Lot | O | M | P | E = (O+4M+P)/6 | σ = (P−O)/6 |
| --- | --- | --- | --- | --- | --- |
| Intégration du paiement pour places de marché (comptes connectés, reversements) | 5 | 8 | 15 | 8,7 | 1,7 |
| Intégration de la vérification d'identité | 2 | 4 | 8 | 4,3 | 1,0 |
| Publication sur l'App Store et Google Play | 2 | 4 | 10 | 4,7 | 1,3 |

E total = 17,7 j · σ total = √(1,7² + 1,0² + 1,3²) ≈ 2,4 j · engagement à 84 % : **20,1 j** pour ces trois tâches.

### Build / Buy / Low-code

| | Build (code sur mesure) | Buy (SaaS de place de marché, ex. Sharetribe) | Low-code (ex. Bubble) |
| --- | --- | --- | --- |
| Coût initial | 79 j × TJM — ⚠️ À COMPLÉTER | Faible | Faible à moyen |
| Coût récurrent | Hébergement + maintenance | Abonnement — prix ⚠️ À VÉRIFIER | Licence — prix ⚠️ À VÉRIFIER |
| Adéquation | Totale (itinéraires communs, filtres, dépenses partagées) | Partielle : pensé pour vendre un service, pas pour mettre en relation des voyageurs | Bonne pour un prototype web, faible pour des applications mobiles publiées |
| Réversibilité | Totale | À négocier | Faible |

**Choix retenu : Build**, avec un prototype généré par agents IA le 29/10. La recherche d'itinéraires communs (EF-05) et les dépenses partagées (EF-10, EF-11) sont le cœur différenciant : aucun outil du marché ne les couvre tels quels. Sert O-01 et O-02.

### SWOT

| Forces | Faiblesses |
| --- | --- |
| Combinaison inédite : compagnon d'itinéraire, rencontre sur place, partage des frais | Effet réseau : valeur nulle tant que peu de voyageurs sont inscrits |
| Paiement intégré qui fidélise le groupe | Revenus dépendants de partenaires à convaincre |
| **Opportunités** | **Menaces** |
| Hausse du voyage solo et du budget contraint des voyageurs | Une auberge ou une plateforme de réservation ajoute la même fonction |
| Partenaires locaux en quête de clients en groupe | Incident grave lors d'une rencontre, à fort impact médiatique |

### Grille de faisabilité

| Dimension | Statut | Justification |
| --- | --- | --- |
| Technique | OK | Briques connues : API de paiement, vérification d'identité, messagerie |
| Légale | Sous réserve | Faisable si le paiement passe par un prestataire agréé (R3) et si l'analyse d'impact RGPD est menée |
| Sécurité des personnes | Sous réserve | Dépend de la vérification d'identité et d'une modération en ≤ 24 h (ENF-08) |
| Accessibilité | OK | RGAA intégré dès les maquettes (RSE-04) |
| Données | OK | Localisation à la ville, pas de GPS (RSE-01) |
| Financière | Bloquant | Budget non fixé et modèle partenaires non validé ; à lever par le chiffrage du TJM et 5 lettres d'intention de partenaires |
| Délais | Sous réserve | Le prototype du 29/10 ne couvre qu'une partie du MVP ; la date de lancement est ⚠️ À COMPLÉTER |

## §10 · Priorisation & roadmap

### MoSCoW

Effort des exigences fonctionnelles : Must 41 j sur 70 j, soit **59 %** — sous la limite de 60 %. Chaque Must sert O-01 ou O-04 : sans compte vérifié, sans voyage déclaré, sans liste de voyageurs et sans messagerie consentie, aucune mise en relation n'a lieu. Le paiement des parts (EF-10, EF-11) est Must car c'est le partage des frais qui distingue RoadMates d'un réseau social de voyageurs.

### Valeur / effort

| Exigence | Valeur (1-5) | Objectif servi | Effort (j) | Quadrant |
| --- | --- | --- | --- | --- |
| EF-01 · inscription | 4 | O-01 | 3 | Quick win |
| EF-02 · vérification d'identité | 5 | O-04 | 4 | Quick win |
| EF-03 · déclarer un voyage | 5 | O-01 | 3 | Quick win |
| EF-04 · voyageurs dans la même ville | 5 | O-01 | 5 | Gros projet — cœur du MVP |
| EF-05 · itinéraire commun | 5 | O-01 | 5 | Gros projet — cœur du MVP |
| EF-09 · demande de contact et messagerie | 5 | O-01, O-04 | 7 | Gros projet — cœur du MVP |
| EF-10 · dépense partagée | 4 | O-02 | 4 | Quick win |
| EF-11 · paiement de sa part | 4 | O-02 | 8 | Gros projet |
| EF-12, EF-13 · signaler, bloquer | 5 | O-04 | 2 | Quick win |
| EF-06 à EF-08 · filtres | 3 | O-01 | 3 | Quick win |
| EF-14 · partage du rendez-vous | 4 | O-04 | 3 | Quick win |
| EF-15 · avis | 3 | O-04 | 3 | Bouche-trou |
| EF-16, EF-17 · offres partenaires | 4 | O-03 | 5 | Gros projet |
| EF-18 · activités ouvertes | 3 | O-01 | 4 | Bouche-trou |
| EF-19 · suggestions par IA | 2 | O-01 | 8 | Piège à temps — reporté |
| EF-20 · remboursement automatique | 2 | O-02 | 3 | Bouche-trou |

### Roadmap

- **Prototype — 29/10/2026 après-midi (agents IA)** : EF-01, EF-03, EF-04, EF-05, EF-09, EF-10, avec paiement simulé. Objectif : démontrer la vision devant le jury.
- **MVP — ⚠️ À COMPLÉTER** : EF-01 à EF-05, EF-09 à EF-13, ENF-01 à ENF-05, ENF-08, RSE-01 à RSE-04. Test du MVP : mis en production demain dans la ville pilote, un voyageur trouve un compagnon et partage une dépense avec lui — O-01 est servi.
- **V1** : EF-06 à EF-08, EF-14 à EF-18, ENF-06, ENF-07, RSE-05 à RSE-07.
- **V2** : EF-19, EF-20, programme de voyage commun, traduction des messages.
- **Won't** : hébergement chez l'habitant, vente de billets, fonctions de rencontre amoureuse, publicité, GPS en temps réel (§4).

## §11 · Livrables & planning

| Livrable | Format | Jalon | Date | Critère d'acceptation |
| --- | --- | --- | --- | --- |
| Cahier des charges | PDF | Cadrage | 29/10/2026 | Vérificateur sans anomalie bloquante |
| Prototype démontrable | Application web | Démonstration | 29/10/2026 | Parcours EF-03 → EF-05 → EF-09 → EF-10 joué de bout en bout |
| Synthèse des entretiens voyageurs | PDF | Validation du besoin | ⚠️ À COMPLÉTER | 10 entretiens menés avec le guide de l'annexe A |
| Maquettes du MVP | Figma | Conception validée | ⚠️ À COMPLÉTER | Parcours critiques audités RGAA |
| MVP web et mobile | En production, ville pilote | Lancement | ⚠️ À COMPLÉTER | Recette sans anomalie bloquante, applications publiées sur les 2 stores |
| Kit partenaires | PDF + compte partenaire | Lancement | ⚠️ À COMPLÉTER | 5 partenaires signés avant le lancement |

## §12 · Budget

Le budget est reporté à plus tard par l'équipe : les montants dépendent du TJM retenu. La structure de calcul est posée pour être complétée.

### Construire — une fois

| Poste | Charge (j) | TJM | Coût |
| --- | --- | --- | --- |
| Cadrage & conception | 5 | ⚠️ À COMPLÉTER | 5 × TJM |
| Front web et mobile | 24 | ⚠️ À COMPLÉTER | 24 × TJM |
| Back & API | 20 | ⚠️ À COMPLÉTER | 20 × TJM |
| Intégrations | 12 | ⚠️ À COMPLÉTER | 12 × TJM |
| Recette & déploiement | 8 | ⚠️ À COMPLÉTER | 8 × TJM |
| Gestion de projet | 10 | ⚠️ À COMPLÉTER | 10 × TJM |
| **Sous-total** | **79** | | **79 × TJM** |
| Marge d'aléas (15 %) | | | 11,9 × TJM |
| Comptes développeur (Apple 99 $/an, Google 25 $ une fois) | | | ≈ 125 $ la 1re année |

### Faire tourner — par mois

| Poste | Coût mensuel |
| --- | --- |
| Hébergement, base de données, domaine | ⚠️ À COMPLÉTER |
| Envoi d'e-mails et de SMS | ⚠️ À COMPLÉTER |
| Vérification d'identité (coût par vérification) | ⚠️ À VÉRIFIER auprès du prestataire |
| Frais du prestataire de paiement (par transaction) | ⚠️ À VÉRIFIER — refacturés au voyageur ou absorbés : ⚠️ À COMPLÉTER |
| Modération (temps humain) | ⚠️ À COMPLÉTER |
| TMA (≈ 15 % du build par an, lissé) | ≈ 1 × TJM |

### TCO 3 ans

`TCO = 90,9 × TJM + 36 × coût mensuel`. **Conclusion : non concluable tant que le TJM et le budget ne sont pas fixés.** Les revenus attendus des partenaires (O-03) devront couvrir au minimum le coût mensuel.

<!-- saut-de-page -->

## §13 · Risques

| ID | Risque | P | I | Criticité | Niveau | Stratégie | Mesure préventive | Plan de repli | Responsable |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| R-01 | Trop peu de voyageurs par destination : l'application paraît vide | 4 | 4 | 16 | Critique | Réduire | Lancement sur une seule ville pilote, acquisition via les auberges partenaires | Élargir la recherche du niveau ville au niveau pays ; mettre en avant les activités ouvertes des partenaires | Équipe fondatrice |
| R-02 | Les partenaires refusent de payer : modèle économique non validé | 3 | 4 | 12 | Critique | Réduire | 5 lettres d'intention de partenaires avant le développement du MVP | Commission sur les dépenses partagées payées via l'application | Équipe fondatrice |
| R-03 | Agression ou comportement dangereux lors d'une rencontre | 2 | 4 | 8 | Élevé | Réduire | Identité vérifiée, messagerie après acceptation, partage du rendez-vous avec un proche | Suspension immédiate du compte, coopération avec les autorités, procédure documentée | Modération |
| R-04 | Fraude au paiement ou litige sur une dépense partagée | 3 | 3 | 9 | Élevé | Transférer | Paiement via un prestataire qui porte la lutte anti-fraude | Gel de la dépense, médiation, remboursement par le prestataire | Équipe de réalisation |
| R-05 | Non-conformité RGPD sur les données d'identité | 2 | 4 | 8 | Élevé | Réduire | Analyse d'impact, suppression des pièces sous 30 jours (RSE-02) | Purge des données concernées, notification CNIL sous 72 h | Référent RGPD |
| R-06 | Usage détourné en application de rencontre amoureuse | 3 | 2 | 6 | Modéré | Réduire | Aucune fonction de « like », charte d'usage acceptée à l'inscription | Avertissement puis suspension après 2 signalements confirmés | Modération |
| R-07 | Faux profils malgré la vérification d'identité | 2 | 3 | 6 | Modéré | Transférer | Vérification par un prestataire spécialisé avec contrôle du selfie | Retrait du badge, nouvelle vérification exigée | Modération |
| R-08 | Refus de publication sur l'App Store ou Google Play | 2 | 3 | 6 | Modéré | Réduire | Signalement, blocage et modération livrés dès le MVP | Lancement en web responsive installable, le temps de corriger | Équipe de réalisation |
| R-09 | Coût de la vérification d'identité trop élevé par voyageur | 3 | 2 | 6 | Modéré | Accepter | Négociation d'un tarif au volume | Vérification exigée seulement avant le premier paiement ou le premier rendez-vous | Équipe fondatrice |
| R-10 | Prototype généré par agents IA non maintenable pour le MVP | 3 | 2 | 6 | Modéré | Accepter | Le prototype est déclaré jetable dès le départ | Réécriture du MVP à partir du CDC, en réutilisant les maquettes | Équipe de réalisation |

## §14 · Validation

**Revue** : ⚠️ À COMPLÉTER — date, participants (équipe, enseignant ou jury), ordre du jour.

**Décision** : ⚠️ À COMPLÉTER — `GO`, `GO sous réserves` ou `NO GO`.

| ID | Décision | Motif | Impact | Porteur | Échéance | Version |
| --- | --- | --- | --- | --- | --- | --- |
| D-01 | Réaliser le prototype du 29/10 sur le périmètre décrit au §10 | Démontrer la vision dans le temps imparti | Paiement simulé, pas de vérification d'identité réelle | Équipe | 29/10/2026 | v1.0 |

**Points ouverts**

| Point | Porteur | Échéance |
| --- | --- | --- |
| Composition de l'équipe et page de garde — ⚠️ À COMPLÉTER | Équipe | ⚠️ À COMPLÉTER |
| Budget, TJM et date de lancement — ⚠️ À COMPLÉTER | Équipe | ⚠️ À COMPLÉTER |
| Choix de la ville pilote — ⚠️ À COMPLÉTER | Équipe | ⚠️ À COMPLÉTER |

<!-- saut-de-page -->

## Annexe A · Entretien

Guide d'entretien semi-directif à mener auprès de 10 voyageurs solo (dont au moins 4 voyageuses solo et 3 personnes de plus de 45 ans), 20 minutes chacun. Entretiens non encore menés : la colonne Réponse est à remplir.
Rôles : animateur, scribe, reformulateur — ⚠️ À COMPLÉTER.

| # | Thème | Question | Réponse / verbatim |
| --- | --- | --- | --- |
| 1 | Contexte | Racontez-moi votre dernier voyage seul : où, combien de temps, pourquoi seul ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 2 | Contexte | Qu'est-ce qui vous fait choisir de partir seul plutôt qu'accompagné ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 3 | Problème | À quel moment du voyage avez-vous regretté d'être seul ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 4 | Problème | Quelles dépenses vous ont semblé trop chères parce que vous les payiez seul ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 5 | Problème | Combien estimez-vous avoir payé en plus, sur ce voyage, faute de pouvoir partager ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 6 | Utilisateurs | Comment avez-vous rencontré d'autres voyageurs, la dernière fois ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 7 | Utilisateurs | Avec quel type de personne aimeriez-vous partager une partie du voyage ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 8 | Existant | Quelles applications ou quels groupes utilisez-vous pour trouver des compagnons de route ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 9 | Existant | Qu'est-ce qui vous a déçu dans ces outils ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 10 | Attentes | Qu'est-ce qui vous donnerait confiance avant de rencontrer un inconnu en voyage ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 11 | Attentes | Préférez-vous trouver quelqu'un avant le départ ou une fois sur place ? Pourquoi ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 12 | Attentes | Comment réglez-vous aujourd'hui une dépense partagée avec quelqu'un que vous connaissez peu ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 13 | Attentes | Selon quels critères voudriez-vous choisir vos compagnons de route ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 14 | Contraintes | Quelles informations sur vous refuseriez-vous de partager dans une telle application ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 15 | Contraintes | Qu'est-ce qui vous ferait supprimer l'application après la première utilisation ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 16 | Budget | Si une auberge ou une activité vous proposait une réduction de groupe via l'application, à partir de quel pourcentage cela changerait-il votre choix ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 17 | Partenaires | (Pour un gérant d'auberge) Combien vous coûte aujourd'hui l'arrivée d'un nouveau client, et que paieriez-vous pour un groupe constitué ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |
| 18 | Ouverture | Qu'est-ce que je ne vous ai pas demandé et que je devrais savoir ? | ⚠️ À VÉRIFIER À L'ENTRETIEN |

Relances prévues : « C'est-à-dire ? », « Par exemple ? », reformulation, passage au chiffre (« Combien ? », « À quelle fréquence ? »).

## Annexe B · Points à compléter

| Section | Point | Nature | Qui tranche | Échéance |
| --- | --- | --- | --- | --- |
| Page de garde · §3 | Composition de l'équipe | À compléter | Équipe | ⚠️ À COMPLÉTER |
| §2 | Valeurs cibles des objectifs O-01 à O-03 | À compléter | Équipe, après entretiens | ⚠️ À COMPLÉTER |
| §1 · §2 | Réalité du besoin et montant des frais partageables | À vérifier à l'entretien | Voyageurs solo (annexe A) | ⚠️ À COMPLÉTER |
| §4 | Ville pilote | À compléter | Équipe | ⚠️ À COMPLÉTER |
| §8 · §12 | Budget, TJM, coûts mensuels, TCO | À compléter | Équipe | ⚠️ À COMPLÉTER |
| §9 | Prix des solutions Sharetribe et Bubble | À vérifier | Équipe | ⚠️ À COMPLÉTER |
| §11 | Dates du MVP et du lancement | À compléter | Équipe | ⚠️ À COMPLÉTER |
| §13 · R-02 | Intérêt réel des partenaires | À vérifier à l'entretien | Auberges, prestataires d'activités | Avant le MVP |
| §14 | Revue et décision | À compléter | Jury / équipe | ⚠️ À COMPLÉTER |
