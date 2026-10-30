// PARTIE PARTENAIRES (US-20) : espace du partenaire incarné dans le mode démo, chargé à la demande.
import { lazy } from 'react'
import { paths } from '../../shared/paths.js'
import './partenaires.css'

const pages = {
  EspacePartenaire: lazy(() => import('./EspacePartenaire.jsx')),
  ProfilPartenaire: lazy(() => import('./ProfilPartenaire.jsx')),
}

export const partenairesRoutes = [
  { path: paths.partenaire, element: <pages.EspacePartenaire /> },
  { path: paths.partenaireProfil, element: <pages.ProfilPartenaire /> },
]
