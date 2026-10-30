# Audit vague 2 — profil, découverte, filtres et avis

Périmètre : `app/src/features/decouverte/`, `app/src/features/profil/`, `app/src/features/groupe/ProfilePage.jsx`, futur espace avis, schéma de démonstration nécessaire à ces parcours. Sources : cahier des charges RoadMates §4–§7 et §10, vision produit §4.2–§4.3, code du worktree au 30/10/2026.

## Lacunes classées par valeur

### P0 — Préférence de genre absente des filtres, du profil et du score

- **EF-08 (Should), cible prioritaire de la vision §3.3 et étapes 7–8 du parcours** : `Filtres.jsx` ne propose que le bouton « Femmes uniquement » (`femmes` booléen), pas les trois choix « Hommes », « Femmes », « Les deux ». Le choix est volatil; `EditionProfil.jsx` ne permet pas de choisir une préférence par défaut et `seed.js` n'a pas de champ `preferenceGenre`. `appliquerFiltres` ne peut donc pas initialiser les résultats à partir du profil.
- **EF-08 / O-01 et O-04** : `scoreCompatibilite` ne tient pas compte des préférences réciproques. Le score peut classer favorablement deux profils qui ne souhaitent pas se rencontrer.
- **RSE-04** : le bouton bascule est annoncé par `aria-pressed`, mais un unique bouton ne communique ni les trois choix ni une préférence sauvegardée. Le critère doit être présenté avec un libellé et des contrôles nommés.
- **Cas limite / vie privée** : la préférence doit être facultative et avoir un défaut inclusif `tous`; ne pas inférer la préférence à partir du genre déclaré. Les données utilisateurs existantes doivent être complétées sans écraser leurs modifications.

### P1 — Découverte sur place moins complète que la découverte d’itinéraire

- **EF-04 (Must), R1 et étapes 17–18 de la vision** : `Destination.jsx` et `matching.js` trouvent bien les voyageurs d'une ville aux dates communes, excluent les profils/itinéraires masqués et n'utilisent pas de GPS. Cependant la page ne propose aucun des filtres âge, langue et genre promis par les **EF-06 à EF-08**; les critères enrichis sont également absents. Les compteurs et résultats doivent suivre les profils visibles après filtre.
- **EF-06/07/08 et RSE-04** : les filtres âge acceptent actuellement une borne minimale supérieure à la borne maximale; budget et nombres peuvent être invalides. Ajouter des valeurs contrôlées et un état vide récupérable, avec une interaction clavier et des libellés accessibles.
- **EF-04 / ENF-01 / RSE-01** : conserver la comparaison déclarative ville/pays et dates qui se chevauchent; ne jamais élargir en position précise ni exposer les profils/itinéraires masqués. Le fallback au pays reste explicitement déclenché par l'utilisateur.

### P1 — Pas d’avis après un voyage commun, ni de publication mutuelle différée

- **EF-15 (Should), O-04 et étapes 7–8 (étape 20) de la vision** : aucune collection, saisie de note/commentaire, règle d'éligibilité ou moyenne publique n'existe. Le critère exige une dépense partagée réglée et un voyage terminé, avec une note de 1 à 5 et commentaire.
- **Vision §4.2 étape 20** : les avis doivent rester invisibles jusqu'à ce que les deux participants aient noté; afficher immédiatement la moyenne ou le commentaire permettrait des représailles. Prévoir une seule note par auteur/cible/échange, empêcher l'auto-évaluation, et ne publier que les avis mutuels complets. Les comptes anciens sans données d'avis doivent fonctionner comme une liste vide.
- **RSE-04 / sécurité** : champs étiquetés, validation accessible des erreurs, longueur de commentaire bornée; ne pas exposer les commentaires en attente à l'autre participant.

### P2 — Pas d’amis de route ni de rappel des destinations communes

- **Vision §4.2 étape 21 et friction §4.3** : aucun moyen de conserver un lien après un voyage, ni de retrouver/alerter l'utilisateur quand un ami déclare la même destination. Cette étape soutient la rétention et le réusage après l'objectif O-01.
- Le prototype n'a pas de notifications externes; une vue locale « amis de route » peut montrer les prochaines destinations communes sans localisation GPS. Éviter de créer un lien depuis un profil non masqué ou sans interaction/éligibilité explicite.

### P2 — Filtres non sauvegardés et état de destination incomplet

- **EF-06 à EF-08, étape 8 et frictions §4.3** : les critères de `Compagnons.jsx` sont en mémoire seulement; retour ou navigation perd les choix. Sauvegarder les filtres dans le profil local améliore le parcours récurrent, sans traceur externe.
- Destination ne réutilise pas les mêmes filtres; les états « aucun résultat » y sont dus uniquement à l'absence brute de résultats. Ajouter une réinitialisation facile et distinguer absence de voyageurs, filtres trop restrictifs et absence de dates.
- Risque de compatibilité : les options sauvegardées doivent avoir des valeurs par défaut lors de la migration des données de démonstration et être validées au chargement.

## Choix d’implémentation recommandé

1. Corriger la préférence de genre persistée et son application au profil, à tous les écrans de découverte et au score (EF-08).
2. Partager la barre accessible de filtres avec la découverte sur place, persister les critères et traiter les bornes invalides/états vides (EF-04, EF-06–08, RSE-04).
3. Ajouter les avis éligibles, confidentiels jusqu'à notation mutuelle, avec affichage public uniquement après complétion (EF-15).
4. Ajouter les amis de route et les destinations communes visibles dans l'espace profil (vision étape 21), en restant sans géolocalisation et avec stockage local cohérent.

Le prototype utilise `localStorage`, sans authentification serveur, service de notifications ni modération des avis. Ces limites doivent rester explicites : la persistance locale ne constitue pas une garantie de sécurité ni de confidentialité de production.
