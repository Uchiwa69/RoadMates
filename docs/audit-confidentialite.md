# Audit — échange chiffré et mode anonyme

1. Les messages du groupe sont actuellement enregistrés en clair dans `messages[].texte`. Ajouter un chiffrement AES-GCM avant leur écriture, avec clé locale dérivée par groupe et IV aléatoire.
2. Le rendu lit directement `texte` ; le fil doit déchiffrer les nouveaux messages, tout en continuant à afficher les messages du seed qui n'ont que `texte`.
3. Le schéma du fil accepte déjà les messages système. Ceux-ci ne doivent pas être chiffrés en tant que messages utilisateur ni perdre leur rendu historique.
4. Aucune indication d'état de confidentialité n'existe dans la conversation. Ajouter un badge explicite « Conversation chiffrée de bout en bout ».
5. Le contrat commun `confidentialite.js` sait déjà déterminer les dates actives à partir de `user.anonymat`; la page doit modifier seulement ce champ via `updateDb`.
6. Le chemin `paths.confidentialite` est déjà défini, mais aucune page ne le traite ; créer une page autonome et l'exporter depuis les routes du groupe sans toucher à `App.jsx`.
7. La navigation `Layout.jsx` expose cinq entrées, dont une barre mobile à cinq colonnes ; relier la confidentialité via l'espace de navigation existant sans élargir le contrat de routes.
8. `GroupPage.jsx` et `RequestsPage.jsx` affichent directement les prénoms et les avatars ; appliquer `profilMasque` pour les libellés, y compris les membres du groupe et les demandes.
9. Le projet utilise `useDb`, `updateDb`, `useCurrentUser`, des composants UI partagés et du CSS de groupe ; conserver ces conventions et n'ajouter aucune dépendance.
