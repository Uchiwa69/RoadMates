import { lazy } from 'react'
import { paths } from '../../shared/paths.js'

const Confidentialite = lazy(() => import('./Confidentialite.jsx'))

export const confidentialiteRoutes = [
  { path: paths.confidentialite, element: <Confidentialite /> },
]
