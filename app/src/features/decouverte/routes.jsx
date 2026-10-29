// PARTIE A — DÉCOUVERTE (US-01 à US-06). Fichier possédé par la partie A.
import { paths } from '../../shared/paths.js'
import Accueil from './pages/Accueil.jsx'
import Inscription from './pages/Inscription.jsx'
import NouveauVoyage from './pages/NouveauVoyage.jsx'
import MesVoyages from './pages/MesVoyages.jsx'
import Compagnons from './pages/Compagnons.jsx'
import Destination from './pages/Destination.jsx'
import './decouverte.css'

export const decouverteRoutes = [
  { path: paths.accueil, element: <Accueil /> },
  { path: paths.inscription, element: <Inscription /> },
  { path: paths.nouveauVoyage, element: <NouveauVoyage /> },
  { path: paths.mesVoyages, element: <MesVoyages /> },
  { path: '/destination/:ville', element: <Destination /> },
  { path: paths.compagnons, element: <Compagnons /> },
]
