// PARTIE A — DÉCOUVERTE (US-01 à US-05). Fichier possédé par la partie A.
import AFaire from '../../shared/AFaire.jsx'
import { paths } from '../../shared/paths.js'

export const decouverteRoutes = [
  { path: paths.accueil, element: <AFaire titre="Accueil" stories="présentation + accès à l'inscription" /> },
  { path: paths.inscription, element: <AFaire titre="Inscription" stories="US-01" /> },
  { path: paths.nouveauVoyage, element: <AFaire titre="Déclarer un voyage" stories="US-02, US-03" /> },
  { path: paths.mesVoyages, element: <AFaire titre="Mes voyages" stories="US-02" /> },
  { path: '/destination/:ville', element: <AFaire titre="Voyageurs dans la même ville" stories="US-04" /> },
  { path: paths.compagnons, element: <AFaire titre="Itinéraires communs" stories="US-05" /> },
]
