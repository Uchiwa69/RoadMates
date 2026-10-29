// PARTIE A — DÉCOUVERTE (US-01 à US-06). Fichier possédé par la partie A.
// Chaque page est chargée à la demande : la première visite ne télécharge que la page affichée.
import { lazy } from 'react'
import { paths } from '../../shared/paths.js'
import './decouverte.css'

const pages = {
  Accueil: lazy(() => import('./pages/Accueil.jsx')),
  Inscription: lazy(() => import('./pages/Inscription.jsx')),
  NouveauVoyage: lazy(() => import('./pages/NouveauVoyage.jsx')),
  MesVoyages: lazy(() => import('./pages/MesVoyages.jsx')),
  Compagnons: lazy(() => import('./pages/Compagnons.jsx')),
  Destination: lazy(() => import('./pages/Destination.jsx')),
}

export const decouverteRoutes = [
  { path: paths.accueil, element: <pages.Accueil /> },
  { path: paths.inscription, element: <pages.Inscription /> },
  { path: paths.nouveauVoyage, element: <pages.NouveauVoyage /> },
  { path: paths.mesVoyages, element: <pages.MesVoyages /> },
  { path: '/destination/:ville', element: <pages.Destination /> },
  { path: paths.compagnons, element: <pages.Compagnons /> },
]
