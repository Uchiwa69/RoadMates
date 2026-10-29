// PARTIE B — GROUPE ET FRAIS (US-08, US-09, US-10, US-13, US-14). Fichier possédé par la partie B.
import AFaire from '../../shared/AFaire.jsx'
import { paths } from '../../shared/paths.js'

export const groupeRoutes = [
  { path: '/voyageurs/:userId', element: <AFaire titre="Profil d'un voyageur" stories="US-08 (demande de contact)" /> },
  { path: paths.demandes, element: <AFaire titre="Demandes de contact" stories="US-09" /> },
  { path: paths.groupes, element: <AFaire titre="Mes groupes" stories="US-10" /> },
  { path: '/groupes/:groupId', element: <AFaire titre="Groupe" stories="US-09 (conversation), US-13, US-14" /> },
]
