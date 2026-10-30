import { createElement, lazy } from 'react'
import { paths } from '../../shared/paths.js'
import './profil.css'

export const profilRoutes = [
  { path: paths.monProfil, element: createElement(lazy(() => import('./EditionProfil.jsx'))) },
]
