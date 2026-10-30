# Préparation du pitch RoadMates

Durée visée : environ 20 minutes, dont plus de la moitié en démo, puis questions. Deux orateurs.
Pendant la démo, Personne 2 manipule l'app et Personne 1 raconte du point de vue du persona affiché.

## Répartition et minutage

| Diapo | Sujet | Orateur | Durée |
|---|---|---|---|
| 1 | Titre | Personne 1 | 0:30 |
| 2 | Vision | Personne 1 | 1:00 |
| 3 | Résultats Discovery | Personne 1 | 1:00 |
| 4 | User stories et personas | Personne 1 | 1:00 |
| 5 | Story map | Personne 2 | 1:30 |
| 6 | Kano et MoSCoW | Personne 2 | 1:00 |
| 7 | Contraintes | Personne 2 | 1:00 |
| 8 | Solutions techniques | Personne 2 | 1:00 |
| 9 | Démo : Léa | Personne 2 à l'app, Personne 1 raconte | 5:00 |
| 10 | Démo : Karim | Personne 2 à l'app, Personne 1 raconte | 3:00 |
| 11 | Démo : Monique | Personne 2 à l'app, Personne 1 raconte | 3:00 |
| 12 | Conclusion | Les deux | 0:30 |
| | **Total** | | **≈ 19:30** |

Une diapo courte par point de la consigne, puis la démo par persona. Le scénario de chaque démo est dans les notes de la diapo du persona.

## Avant de présenter

- Ouvrir l'app déployée, cliquer « Réinitialiser la démo », se connecter en Léa.
- Garder un second onglet de l'app ouvert, et des captures d'écran en secours si le réseau tombe.
- Partager la présentation depuis son menu Partager si quelqu'un d'autre doit l'ouvrir.

## Questions probables des investisseurs

**Qu'est-ce qui vous distingue de Couchsurfing, des groupes Facebook de voyageurs ou de BlaBlaCar ?**
Ils couvrent chacun un morceau : l'hébergement, une communauté peu active, le trajet seul. RoadMates réunit la rencontre, l'itinéraire commun jour par jour et le partage des frais avec paiement intégré, dans un cadre vérifié.

**Comment gagnez-vous de l'argent ?**
Commission sur les réservations de groupe chez nos partenaires : auberges, activités, loueurs. Les voyageurs ne paient rien, et il n'y a pas de publicité.

**Comment évitez-vous l'application vide au lancement ?**
Une seule ville pilote étudiante, des auberges partenaires qui relaient l'app à leurs clients, et une cible qui se concentre déjà aux mêmes endroits.

**Et la sécurité, notamment des voyageuses ?**
Identité vérifiée avant le premier contact, messagerie ouverte seulement si les deux acceptent, filtre de genre, lieux publics suggérés, signalement et blocage, mode anonyme temporaire. Localisation à la ville, jamais en temps réel.

**Le paiement entre utilisateurs, c'est légal ?**
Oui, via un prestataire agréé (Stripe Connect ou équivalent), conformément à la directive DSP2. Aucune donnée de carte ne passe par nos serveurs.

**Le chiffrement est-il réel ?**
Dans le prototype, les messages sont chiffrés mais la clé reste dans le navigateur : c'est une démonstration. Le MVP prévoit un vrai chiffrement de bout en bout, avec des clés par appareil.

**Vos chiffres de marché sont-ils fiables ?**
Ce sont des sondages commerciaux (Skyscanner, Ifop, Amadeus) : des tendances. Notre prochaine étape est de faire 10 entretiens avec des voyageurs solo, et notre guide d'entretien est prêt.

**Combien coûte le MVP et en combien de temps ?**
Le Must représente environ 43 jours de travail sur 78 au total. Le budget reste à chiffrer : [à compléter].

**Pourquoi des agents IA pour construire le prototype ?**
Pour aller vite : plusieurs agents ont travaillé en parallèle, chacun sur sa partie, avec une coordination écrite et une vérification avant chaque fusion. Le prototype sert à démontrer, pas à être mis en production.
