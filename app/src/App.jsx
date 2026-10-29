// SOCLE PARTAGÉ — ne pas modifier sans prévenir l'autre binôme.
// Chaque partie déclare ses pages dans son propre routes.jsx.
import { Routes, Route } from 'react-router-dom'
import Layout from './shared/Layout.jsx'
import { decouverteRoutes } from './features/decouverte/routes.jsx'
import { groupeRoutes } from './features/groupe/routes.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {[...decouverteRoutes, ...groupeRoutes].map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<p>Page introuvable.</p>} />
      </Route>
    </Routes>
  )
}
