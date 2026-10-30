// Routes de l'application. Chaque partie déclare ses pages dans son propre routes.jsx.
import { Routes, Route } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Layout from './shared/Layout.jsx'
import { paths } from './shared/paths.js'
import { Button, EmptyState } from './shared/ui/index.js'
import { decouverteRoutes } from './features/decouverte/routes.jsx'
import { groupeRoutes } from './features/groupe/routes.jsx'
import { partenairesRoutes } from './features/partenaires/routes.jsx'

function Introuvable() {
  return (
    <section>
      <h1 className="sr-only">Page introuvable</h1>
      <EmptyState
        icon={Compass}
        titre="Page introuvable"
        action={<Button to={paths.accueil}>Retour à l'accueil</Button>}
      >
        <p>Cette route ne mène nulle part… pour l'instant.</p>
      </EmptyState>
    </section>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {[...decouverteRoutes, ...groupeRoutes, ...partenairesRoutes].map((r) => (
          <Route key={r.path} path={r.path} element={r.element} />
        ))}
        <Route path="*" element={<Introuvable />} />
      </Route>
    </Routes>
  )
}
