// En-tête, navigation (en haut sur ordinateur, onglets en bas sur mobile),
// pastille de démo et transitions de page.
import { useEffect, useRef } from 'react'
import { NavLink, useLocation, useOutlet } from 'react-router-dom'
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import { Home, Inbox, Map, MessagesSquare, Moon, Sun, Users } from 'lucide-react'
import { useDb } from './db.js'
import { paths } from './paths.js'
import { basculerTheme, useTheme } from './theme.js'
import { ToastProvider } from './ui/index.js'
import Logo from './Logo.jsx'
import DemoPanel from './DemoPanel.jsx'
import './layout.css'

const liens = [
  { to: paths.accueil, label: 'Accueil', icon: Home, end: true },
  { to: paths.mesVoyages, label: 'Voyages', icon: Map },
  { to: paths.compagnons, label: 'Compagnons', icon: Users },
  { to: paths.demandes, label: 'Demandes', icon: Inbox, notif: true },
  { to: paths.groupes, label: 'Groupes', icon: MessagesSquare },
]

export default function Layout() {
  const theme = useTheme()
  const location = useLocation()
  const outlet = useOutlet()
  const main = useRef(null)
  const enAttente = useDb((db) => db.requests.filter((r) => r.toId === db.session.userId && r.statut === 'en_attente').length)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // HashRouter : un lien « #contenu » changerait de page, on déplace donc le focus à la main.
  const allerAuContenu = (e) => {
    e.preventDefault()
    main.current?.focus()
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <ToastProvider>
          <a href="#contenu" className="evitement" onClick={allerAuContenu}>Aller au contenu</a>
          <header className="entete">
            <div className="entete__inner">
              <NavLink to={paths.accueil} className="logo" aria-label="RoadMates, accueil">
                <Logo />
              </NavLink>

              <nav className="nav" aria-label="Navigation principale">
                <ul>
                  {liens.map(({ to, label, icon: Icon, end, notif }) => (
                    <li key={to}>
                      <NavLink to={to} end={end} className="nav__lien">
                        <span className="nav__icone">
                          <Icon size={22} aria-hidden="true" />
                          {notif && enAttente > 0 && <span className="nav__notif" aria-hidden="true">{enAttente}</span>}
                        </span>
                        <span className="nav__label">{label}</span>
                        {notif && enAttente > 0 && (
                          <span className="sr-only">, {enAttente} demande{enAttente > 1 ? 's' : ''} en attente</span>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="entete__outils">
                <button
                  type="button"
                  className="theme-btn"
                  onClick={basculerTheme}
                  aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}
                >
                  {theme === 'dark' ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
                </button>
                <DemoPanel />
              </div>
            </div>
          </header>

          <main id="contenu" ref={main} tabIndex={-1} className="main">
            <m.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 0.8, 0.36, 1] }}
            >
              {outlet}
            </m.div>
          </main>
        </ToastProvider>
      </LazyMotion>
    </MotionConfig>
  )
}
