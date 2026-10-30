# RoadMates — prototype

Prototype React (Vite) du parcours de Léa. Pas de back-end : les données de démo vivent dans le `localStorage` du navigateur.

```
npm install
npm run dev
```

Vue d'ensemble, commandes et personnages de démo : voir le [README à la racine](../README.md).
Organisation du code et répartition du travail : voir [PLAN-PROTOTYPE.md](../docs/prototype/PLAN-PROTOTYPE.md).

- `src/shared/` — socle commun (base locale, jeu de démo, URL, session, design system, globe)
- `src/features/decouverte/` — partie A : accueil, inscription, voyages, compagnons, page ville
- `src/features/groupe/` — partie B : messages, demandes, groupes, dépenses partagées
- `src/features/profil/`, `confidentialite/`, `avis/`, `securite/` — espace « Mon profil »
- `src/features/partenaires/` — activités, bons plans et espace partenaire
