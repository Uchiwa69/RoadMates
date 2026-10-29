// SOCLE PARTAGÉ — en-tête, navigation et sélecteur d'utilisateur de démo.
import { NavLink, Outlet } from 'react-router-dom'
import { useDb, resetDb } from './db.js'
import { setCurrentUser } from './session.js'
import { paths } from './paths.js'

const liens = [
  { to: paths.accueil, label: 'Accueil', end: true },
  { to: paths.mesVoyages, label: 'Mes voyages' },
  { to: paths.compagnons, label: 'Compagnons' },
  { to: paths.demandes, label: 'Demandes' },
  { to: paths.groupes, label: 'Groupes' },
]

export default function Layout() {
  const users = useDb((db) => db.users)
  const userId = useDb((db) => db.session.userId)

  return (
    <div className="app">
      <header className="header">
        <NavLink to={paths.accueil} className="logo">RoadMates</NavLink>
        <nav className="nav" aria-label="Navigation principale">
          {liens.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>
        <div className="demo">
          <label>
            Je suis
            <select value={userId ?? ''} onChange={(e) => setCurrentUser(e.target.value)}>
              {users.map((u) => <option key={u.id} value={u.id}>{u.prenom}</option>)}
            </select>
          </label>
          <button type="button" className="btn-lien" onClick={resetDb}>Réinitialiser la démo</button>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
