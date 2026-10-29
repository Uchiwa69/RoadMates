// PARTIE A — DÉCOUVERTE (US-01 à US-05). Fichier possédé par la partie A.
import AFaire from '../../shared/AFaire.jsx'
import { paths } from '../../shared/paths.js'
import NouveauVoyage from './pages/NouveauVoyage.jsx'
import MesVoyages from './pages/MesVoyages.jsx'
import Compagnons from './pages/Compagnons.jsx'
import Destination from './pages/Destination.jsx'
import './decouverte.css'

export const decouverteRoutes = [
  { path: paths.accueil, element: <AFaire titre="Accueil" stories="présentation + accès à l'inscription" /> },
  { path: paths.inscription, element: <AFaire titre="Inscription" stories="US-01" /> },
  { path: paths.nouveauVoyage, element: <NouveauVoyage /> },
  { path: paths.mesVoyages, element: <MesVoyages /> },
  { path: '/destination/:ville', element: <Destination /> },
  { path: paths.compagnons, element: <Compagnons /> },
]
