# Audit vague 2 — confiance, sécurité, groupe et paiement

Périmètre vérifié sur le cahier des charges v1.0, la vision produit et le prototype localStorage. Le prototype n’a ni authentification réelle, ni backend, ni prestataire de paiement : les parcours de démonstration ne constituent pas des contrôles de sécurité ou une conformité de production.

## Priorité 1 — Sécurité des personnes et contact

1. **EF-02 / R4 — Vérification d’identité insuffisamment appliquée.** Le champ `user.verifie` et son badge existent, mais `ProfilePage.jsx` permet l’envoi d’une demande à un profil non vérifié et le destinataire peut accepter sans vérification. Le prototype simule une inscription par e-mail et n’a aucun prestataire d’identité. Le premier contact doit exiger une vérification effective des deux côtés avant de devenir messagerie.
2. **EF-12, EF-13 / ENF-08 / R-03, R-06, R-08 — Signalement, blocage et modération absents.** Aucune collection ni interface de signalement/blocage n’existe. Les pages de contact et groupe n’offrent pas d’action de sécurité, aucune transmission à la modération ni délai de traitement n’est possible. Une donnée locale ne peut pas garantir un traitement sous 24 h ; prévoir une interface de démonstration sans la présenter comme une modération opérationnelle.
3. **EF-14 / O-04 — Partage du rendez-vous avec un proche absent.** Aucun flux ou contact de confiance/SMS n’existe. Le SMS nécessite un service externe et le consentement du proche.
4. **Vision §4.2, étapes 15–16 / R-03 — Lieux publics non suggérés.** La page de groupe n’aide pas à choisir un premier lieu public ; aucune suggestion de café, lieu public ou partenaire n’est prévue. Une liste générique locale peut illustrer le parcours mais ne doit pas être présentée comme une recommandation géolocalisée ou vérifiée.

## Priorité 2 — Paiement et engagement du groupe

5. **EF-10, EF-11 / ENF-02, ENF-05 / R3, R-04 — Paiement uniquement simulé.** `Expenses.jsx` bascule `parts[].payee` localement après un délai. Aucun paiement réel, reversement, preuve prestataire, rapprochement, remboursement, anti-fraude ou litige n’existe. Le prototype affiche un avertissement mais son statut « payée » peut être pris à tort pour un règlement réel. ENF-02 et ENF-05 ne sont donc pas couverts.
6. **Vision §4.2, étape 13 / EF-20 — Porte de réservation et remboursement incomplets.** Le groupe affiche une date limite et indique qu’une réservation peut être lancée une fois les parts payées, mais aucun état de réservation, garde d’action ni scénario partenaire indisponible/remboursement au créateur n’existe. Ne jamais engager le groupe avant paiement intégral ; toute implémentation locale doit rester explicitement une simulation.
7. **Cas limites de dépenses —** aucune protection contre un deuxième clic simultané après délai, un payeur qui a quitté le groupe, une date de réservation passée, un montant hors limites, ou la mutation d’une dépense devenue complète/annulée. Pas de gestion de litige ni de preuve de remboursement.

## Priorité 3 — RGPD et robustesse

8. **RSE-02 / R-05 — Durée de conservation d’identité non applicable.** Le prototype ne collecte pas de pièce d’identité, mais `verifie` est un booléen sans date/source/expiration. Aucun effacement après validation sous 30 jours n’est représentable ou garanti.
9. **RSE-07 — Suppression des comptes inactifs absente.** Il n’y a ni dernière activité, avertissement 30 jours avant, purge automatique à 36 mois ni anonymisation des références de voyage.
10. **Consentement RGPD — manque de trace et de retrait.** L’inscription ne collecte ni consentement explicite et versionné, ni finalité/horodatage ; aucun écran ne permet le retrait ou l’export/suppression du compte. À signaler à l’agent B, propriétaire de l’inscription, avant modification de son périmètre.
11. **RSE-01, RSE-03 — Points conformes à confirmer.** Pas d’appel de géolocalisation repéré dans le flux de groupe et pas de traceur publicitaire identifié dans le périmètre. Cela ne remplace pas un scan global des cookies/SDK ni la tenue d’un registre RGPD.
12. **Chiffrement — protection de prototype seulement.** `chiffrement.js` conserve une clé AES-GCM commune au groupe en localStorage avec les messages ; tout script ayant accès à l’origine peut lire cette clé, chaque appareil ne possède pas d’identité cryptographique, et l’ajout/retrait de membres n’effectue pas de rotation. Ce n’est pas un chiffrement de bout en bout défendable en production.
13. **RSE-04 — Accessibilité non auditée.** Les interfaces de dépense ont des labels et états, mais aucun audit RGAA ni mesure de contraste/recette clavier n’a été exécuté pour les parcours critiques.

## Ordre de valeur proposé

1. Demander une vérification d’identité avant contact et ajouter des actions de signalement/blocage accessibles dans les points de contact du prototype (EF-02, EF-12, EF-13, R4).
2. Garantir les invariants de dépense : aucune réservation avant paiement intégral, et afficher les scénarios de réservation/remboursement au créateur uniquement comme simulation locale (EF-10, EF-11, EF-20, R3).
3. Ajouter des conseils de première rencontre en lieu public, sans géolocalisation ni garantie de sécurité (EF-14 / vision étapes 15–16).
4. Ajouter un choix/trace de consentement et un parcours de suppression locale, en coordination avec le propriétaire de l’inscription, sans prétendre couvrir les obligations de production (RGPD, RSE-02, RSE-07).
5. Pour une mise en production, remplacer les simulations par backend/prestataire agréé, modération accessible et procédures de conservation/suppression vérifiables (ENF-02, ENF-05, ENF-08, RSE-02, RSE-04, RSE-07).
