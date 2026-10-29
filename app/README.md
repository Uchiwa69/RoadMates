# RoadMates — prototype

Prototype React (Vite) du parcours de Léa. Pas de back-end : les données de démo vivent dans le `localStorage` du navigateur.

```
npm install
npm run dev
```

Organisation du code et répartition du travail : voir [PLAN-PROTOTYPE.md](../PLAN-PROTOTYPE.md).

- `src/shared/` — socle commun figé (routes, données de démo, session, styles)
- `src/features/decouverte/` — partie A : inscription, voyages, compagnons
- `src/features/groupe/` — partie B : contacts, groupes, dépenses partagées
