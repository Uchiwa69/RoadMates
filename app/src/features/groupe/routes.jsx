// PARTIE B — GROUPE ET FRAIS (US-08, US-09, US-10, US-13, US-14). Fichier possédé par la partie B.
// Chaque page est chargée à la demande : la première visite ne télécharge que la page affichée.
import { lazy } from 'react'
import { paths } from '../../shared/paths.js'
import { confidentialiteRoutes } from '../confidentialite/routes.jsx'
import './groupe.css'

const pages = {
  ProfilePage: lazy(() => import('./ProfilePage.jsx')),
  RequestsPage: lazy(() => import('./RequestsPage.jsx')),
  GroupsPage: lazy(() => import('./GroupsPage.jsx')),
  GroupPage: lazy(() => import('./GroupPage.jsx')),
}

export const groupeRoutes = [
  { path: '/voyageurs/:userId', element: <pages.ProfilePage /> },
  { path: paths.demandes, element: <pages.RequestsPage /> },
  { path: paths.groupes, element: <pages.GroupsPage /> },
  { path: '/groupes/:groupId', element: <pages.GroupPage /> },
  ...confidentialiteRoutes,
]
