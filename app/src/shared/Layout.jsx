// En-tête, navigation (en haut sur ordinateur, onglets en bas sur mobile),
// pastille de démo et transitions de page.
import { Component, Suspense, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom'
import { LazyMotion, MotionConfig, m } from 'motion/react'
import { CloudOff, Eye, Home, Map, MessagesSquare, Moon, RotateCcw, Store, Sun, Users } from 'lucide-react'
import { useDb } from './db.js'
import { paths } from './paths.js'
import { useCurrentUser, usePartenaire } from './session.js'
import { basculerTheme, useTheme } from './theme.js'
import { Avatar, Button, EmptyState, ToastProvider } from './ui/index.js'
import Logo from './Logo.jsx'
import DemoPanel from './DemoPanel.jsx'
import { profilAAction } from '../features/profil/completude.js'
import './layout.css'

// Un onglet reste actif sur ses sous-pages : Messages sur une conversation de groupe,
// Profil sur Modifier, Confidentialité, etc. NavLink ne sait pas relier /groupes/:id à
// /messages, d'où les préfixes déclarés ici.
const sousChemin = (pathname, prefixe) => pathname === prefixe || pathname.startsWith(`${prefixe}/`)
const liens = [
  { to: paths.accueil, label: 'Accueil', icon: Home, actif: (p) => p === paths.accueil },
  { to: paths.mesVoyages, label: 'Voyages', icon: Map, actif: (p) => sousChemin(p, paths.mesVoyages) },
  { to: paths.compagnons, label: 'Compagnons', icon: Users, actif: (p) => sousChemin(p, paths.compagnons) },
  {
    to: paths.messages, label: 'Messages', icon: MessagesSquare, notif: true,
    actif: (p) => [paths.messages, paths.groupes, paths.demandes].some((prefixe) => sousChemin(p, prefixe)),
  },
  {
    to: paths.monProfil, label: 'Profil', avatar: true,
    actif: (p) => [paths.monProfil, paths.confidentialite, paths.avis].some((prefixe) => sousChemin(p, prefixe)),
  },
]

// Partenaire incarné (mode démo) : navigation réduite à son offre, l'aperçu de sa ville et son profil.
const liensPartenaire = (partenaire) => [
  { to: paths.partenaire, label: 'Mon offre', icon: Store, actif: (p) => p === paths.partenaire },
  { to: paths.destinationOnglet(partenaire.ville, 'bons-plans'), label: 'Aperçu', icon: Eye, actif: (p) => p.startsWith('/destination/') },
  { to: paths.partenaireProfil, label: 'Profil', avatar: true, actif: (p) => p === paths.partenaireProfil },
]

// Le moteur d'animation arrive après le premier affichage : la page n'attend pas ses ~20 Ko.
const chargerAnimations = () => import('./animations.js').then((module) => module.default)

const TITRE_SITE = 'RoadMates · Compagnons de route pour voyageurs solo'

// Squelette affiché pendant le chargement d'une page.
function ChargementPage() {
  return (
    <div className="chargement" role="status">
      <span className="sr-only">Chargement de la page…</span>
      <span className="chargement__ligne chargement__ligne--titre" aria-hidden="true" />
      <span className="chargement__ligne" aria-hidden="true" />
      <span className="chargement__bloc" aria-hidden="true" />
    </div>
  )
}

// Une page chargée à la demande peut échouer (réseau coupé, ou fichier remplacé par un nouveau
// déploiement pendant que l'onglet restait ouvert) : on le dit, sans faire tomber l'application.
class ErreurPage extends Component {
  state = { erreur: false }
  static getDerivedStateFromError() {
    return { erreur: true }
  }
  render() {
    if (!this.state.erreur) return this.props.children
    return (
      <EmptyState
        icon={CloudOff}
        titre="La page n’a pas pu être chargée"
        action={<Button icon={RotateCcw} onClick={() => window.location.reload()}>Recharger</Button>}
      >
        <p>Vérifiez votre connexion, puis rechargez la page.</p>
      </EmptyState>
    )
  }
}

export default function Layout() {
  const theme = useTheme()
  const location = useLocation()
  const outlet = useOutlet()
  const main = useRef(null)
  const voyageur = useCurrentUser()
  const partenaire = usePartenaire()
  const moi = partenaire ? { id: partenaire.id, prenom: partenaire.nom } : voyageur
  const liensAffiches = partenaire ? liensPartenaire(partenaire) : liens
  const aFaireProfil = useDb((db) => !partenaire && profilAAction(db, voyageur))
  const enAttente = useDb((db) => db.requests.filter((r) => r.toId === db.session.userId && r.statut === 'en_attente').length)

  // À chaque changement de page : retour en haut, titre de l'onglet tiré du h1 de la page
  // (RGAA 8.6), et focus sur ce h1 pour que les lecteurs d'écran annoncent la nouvelle page.
  // Les pages sont chargées à la demande et l'ancienne reste affichée pendant le chargement :
  // on cherche le h1 du conteneur marqué avec le nouveau chemin.
  const premiereVisite = useRef(true)
  useEffect(() => {
    window.scrollTo(0, 0)
    const deplacerFocus = !premiereVisite.current
    premiereVisite.current = false
    let essais = 0
    let minuteur
    const appliquer = () => {
      const page = [...(main.current?.querySelectorAll('[data-page]') ?? [])].find((el) => el.dataset.page === location.pathname)
      const h1 = page?.querySelector('h1')
      if (!h1) {
        if (essais++ < 40) minuteur = setTimeout(appliquer, 50)
        return
      }
      document.title = location.pathname === paths.accueil ? TITRE_SITE : `${h1.textContent.trim()} · RoadMates`
      // Si l'utilisateur a déjà pris la main (il tape dans un champ), on ne lui vole pas le focus.
      const dejaDansLaPage = main.current?.contains(document.activeElement) && document.activeElement !== main.current
      if (deplacerFocus && !dejaDansLaPage) {
        if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
        h1.focus({ preventScroll: true })
      }
    }
    appliquer()
    return () => clearTimeout(minuteur)
  }, [location.pathname])

  // HashRouter : un lien « #contenu » changerait de page, on déplace donc le focus à la main.
  const allerAuContenu = (e) => {
    e.preventDefault()
    main.current?.focus()
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={chargerAnimations} strict>
        <ToastProvider>
          <a href="#contenu" className="evitement" onClick={allerAuContenu}>Aller au contenu</a>
          <header className="entete">
            <div className="entete__inner">
              <NavLink to={paths.accueil} className="logo" aria-label="RoadMates, accueil">
                <Logo />
              </NavLink>

              <nav className="nav" aria-label="Navigation principale">
                <ul style={{ '--n': liensAffiches.length }}>
                  {liensAffiches.map(({ to, label, icon: Icon, notif, avatar, actif }) => {
                    const courant = actif(location.pathname)
                    return (
                      <li key={to}>
                        <Link to={to} className={`nav__lien${courant ? ' active' : ''}`} aria-current={courant ? 'page' : undefined}>
                          <span className="nav__icone">
                            {avatar ? <Avatar user={moi} taille={24} photo className="nav__avatar" /> : <Icon size={22} aria-hidden="true" />}
                            {notif && enAttente > 0 && <span className="nav__notif" aria-hidden="true">{enAttente}</span>}
                            {avatar && aFaireProfil && <span className="nav__point" aria-hidden="true" />}
                          </span>
                          <span className="nav__label">{label}</span>
                          {notif && enAttente > 0 && (
                            <span className="sr-only">, {enAttente} demande{enAttente > 1 ? 's' : ''} en attente</span>
                          )}
                          {avatar && aFaireProfil && <span className="sr-only">, action suggérée</span>}
                        </Link>
                      </li>
                    )
                  })}
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
            <ErreurPage key={location.pathname}>
              <Suspense fallback={<ChargementPage />}>
                <m.div
                  key={location.pathname}
                  data-page={location.pathname}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 0.8, 0.36, 1] }}
                >
                  {outlet}
                </m.div>
              </Suspense>
            </ErreurPage>
          </main>
        </ToastProvider>
      </LazyMotion>
    </MotionConfig>
  )
}
