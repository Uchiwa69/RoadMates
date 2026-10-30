// PARTIE B — GROUPE ET FRAIS (US-08, US-09, US-10, US-13, US-14). Fichier possédé par la partie B.
// Chaque page est chargée à la demande : la première visite ne télécharge que la page affichée.
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { paths } from '../../shared/paths.js'
import './groupe.css'

const pages = {
  ProfilePage: lazy(() => import('./ProfilePage.jsx')),
  MessagesPage: lazy(() => import('./MessagesPage.jsx')),
  GroupPage: lazy(() => import('./GroupPage.jsx')),
}

export const groupeRoutes = [
  { path: '/voyageurs/:userId', element: <pages.ProfilePage /> },
  { path: paths.messages, element: <pages.MessagesPage /> },
  // Anciennes adresses : Demandes et Groupes sont devenus deux onglets de Messages.
  { path: paths.demandes, element: <Navigate to={paths.messagesOnglet('demandes')} replace /> },
  { path: paths.groupes, element: <Navigate to={paths.messagesOnglet('groupes')} replace /> },
  { path: '/groupes/:groupId', element: <pages.GroupPage /> },
]
