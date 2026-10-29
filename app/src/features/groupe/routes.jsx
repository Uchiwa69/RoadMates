// PARTIE B — GROUPE ET FRAIS (US-08, US-09, US-10, US-13, US-14). Fichier possédé par la partie B.
import AFaire from '../../shared/AFaire.jsx'
import { paths } from '../../shared/paths.js'
import ProfilePage from './ProfilePage.jsx'
import RequestsPage from './RequestsPage.jsx'
import GroupsPage from './GroupsPage.jsx'
import GroupPage from './GroupPage.jsx'
import './groupe.css'

export const groupeRoutes = [
  { path: '/voyageurs/:userId', element: <ProfilePage /> },
  { path: paths.demandes, element: <RequestsPage /> },
  { path: paths.groupes, element: <GroupsPage /> },
  { path: '/groupes/:groupId', element: <GroupPage /> },
]
