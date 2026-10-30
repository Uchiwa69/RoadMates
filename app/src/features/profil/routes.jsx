// Espace « Mon profil » : accueil et sous-pages, chargés à la demande.
import { lazy } from 'react'
import { Navigate } from 'react-router-dom'
import { paths } from '../../shared/paths.js'
import './profil.css'

const pages = {
  AccueilProfil: lazy(() => import('./AccueilProfil.jsx')),
  EditionProfil: lazy(() => import('./EditionProfil.jsx')),
  Confidentialite: lazy(() => import('../confidentialite/Confidentialite.jsx')),
  AvisAmis: lazy(() => import('./AvisAmis.jsx')),
  Compte: lazy(() => import('./Compte.jsx')),
}

export const profilRoutes = [
  { path: paths.monProfil, element: <pages.AccueilProfil /> },
  { path: paths.profilModifier, element: <pages.EditionProfil /> },
  { path: paths.profilConfidentialite, element: <pages.Confidentialite /> },
  { path: paths.profilAvis, element: <pages.AvisAmis /> },
  { path: paths.profilCompte, element: <pages.Compte /> },
  // Anciennes adresses
  { path: paths.confidentialite, element: <Navigate to={paths.profilConfidentialite} replace /> },
  { path: paths.avis, element: <Navigate to={paths.profilAvis} replace /> },
]
