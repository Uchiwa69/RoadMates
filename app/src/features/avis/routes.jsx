import { createElement, lazy } from 'react'
import { paths } from '../../shared/paths.js'

export const avisRoutes = [
  { path: paths.avis, element: createElement(lazy(() => import('./AvisPage.jsx'))) },
]
