# RoadMates

Application qui aide les voyageurs solo de 18 à 30 ans à trouver des compagnons de route, à se rencontrer en confiance et à partager les frais. Projet de cours (Bachelor Développement web) : ce dépôt contient la documentation produit et un **prototype front-end** destiné à une démonstration.

**Démo en ligne :** https://uchiwa69.github.io/RoadMates/

## Le prototype en bref

- **Front seul, sans back-end.** Les données de démonstration vivent dans le `localStorage` du navigateur ; l'authentification, la vérification d'identité, le paiement et le chiffrement des messages sont **simulés**.
- **Stack :** React 19, Vite 8, React Router 6 (`HashRouter`, pour GitHub Pages), `react-globe.gl` (three.js) pour le globe, `motion` pour les animations, `lucide-react` pour les icônes, polices auto-hébergées (`@fontsource`). Lint : `oxlint`.
- **Pas de tracker, pas d'appel réseau tiers à l'exécution** : polices, cartes du monde et images sont servies avec le site.

## Lancer le projet

Prérequis : Node.js 20.19 ou plus récent (le déploiement utilise Node 22).

```bash
cd app
npm install
npm run dev       # serveur de développement, http://localhost:5173
npm run lint      # oxlint
npm run build     # build de production dans app/dist
npm run preview   # sert le build, http://localhost:4173
```

Chaque push sur `main` est construit et déployé sur GitHub Pages par [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

## Jouer la démo

La pastille **« Mode démo »** (en bas à droite sur ordinateur, en haut sur mobile) permet de choisir qui l'on incarne et de réinitialiser les données.

| Personnage | Pour montrer |
| --- | --- |
| **Léa** | Le parcours principal : voyage en Algarve, compagnons, demande de contact, groupe, dépense partagée |
| **Full** | Un profil complet qui montre tout : avis, amis de route, groupes, dépenses, demandes reçues et envoyées |
| Inès, Karim, Sofia, Tom, Maya | Les autres rôles du parcours (accepter une demande, payer sa part…) |
| Partenaires (fictifs) | L'espace partenaire : publier, suspendre une offre de groupe ; un partenaire non validé ne peut pas publier |

Parcours de démo détaillé : [`docs/prototype/PLAN-PROTOTYPE.md`](docs/prototype/PLAN-PROTOTYPE.md), § 6.

## Organisation du code

```
app/src/
├── App.jsx               routes (chaque partie déclare les siennes dans son routes.jsx)
├── shared/               socle commun
│   ├── db.js             « base » localStorage : getDb, updateDb, useDb, migration du jeu de démo
│   ├── seed.js           jeu de démo (versionné : les nouvelles données s'ajoutent sans rien écraser)
│   ├── paths.js          contrat des URL entre les parties
│   ├── session.js        personnage incarné (voyageur ou partenaire)
│   ├── ui/               design system (Button, Card, Tabs, Combobox, Feuille, Switch…) et tokens CSS
│   └── globe/            globe 3D, repli 2D sans WebGL
└── features/
    ├── decouverte/       accueil, inscription, voyages, compagnons, page ville (recherche « Où · Quand »)
    ├── groupe/           messages, demandes, groupes, dépenses partagées
    ├── profil/           espace « Mon profil » (modifier, avis et amis de route, compte et données)
    ├── confidentialite/  mode anonyme
    ├── partenaires/      activités, bons plans, espace partenaire
    ├── avis/             avis mutuels
    └── securite/         signalement et blocage
```

Les fichiers `*.js` de `features/` contiennent la logique métier pure (matching, filtres, dépenses, complétude du profil, offres…) ; les `*.jsx` l'affichage.

## Documentation

| Dossier | Contenu |
| --- | --- |
| [`docs/produit/`](docs/produit/) | Vision produit et personas, cahier des charges (Markdown et PDF), story map et critères d'acceptation |
| [`docs/prototype/`](docs/prototype/) | Plan du prototype : répartition du travail, parcours de démo |
| [`docs/audits/`](docs/audits/) | Audits des fonctionnalités de la « vague 2 » (confidentialité, filtres, confiance et paiement, avis) |
| [`docs/prompts/`](docs/prompts/) | Cahiers des charges donnés à l'assistant IA pour le redesign et l'espace profil / partenaires |
| [`docs/archives/`](docs/archives/) | Ancienne version du cahier des charges |
| [`pitch/`](pitch/) | Présentation investisseurs (PDF, sources des diapos, préparation) |

## Limites connues

- Données locales au navigateur : rien n'est partagé entre appareils, et « Réinitialiser la démo » restaure le jeu de départ.
- Le dépôt ne contient pas de tests automatisés ; le contrôle qualité repose sur `oxlint` et sur les parcours rejoués lors du développement.
- Les partenaires et leurs offres sont fictifs ; les activités citent de vrais lieux publics, sans horaires, prix précis ni notes.
