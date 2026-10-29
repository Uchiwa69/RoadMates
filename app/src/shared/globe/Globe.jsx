// Globe terrestre interactif, réutilisable (accueil, déclaration de voyage).
// three.js n'est chargé qu'ici, en différé : la page s'affiche d'abord avec un squelette.
// Sans WebGL : repli SVG statique. Mouvement réduit : globe immobile, transitions instantanées.
// Le globe n'est jamais le seul chemin : chaque page fournit un champ de recherche équivalent.
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useTheme } from '../theme.js'
import { useMouvementReduit } from '../useMediaQuery.js'
import './globe.css'

const GlobeWebGL = lazy(() => import('./GlobeWebGL.jsx'))
const GlobePlat = lazy(() => import('./GlobePlat.jsx'))

function webglDisponible() {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  } catch {
    return false
  }
}

function Squelette() {
  return (
    <div className="globe__squelette" aria-hidden="true">
      <span className="globe__squelette-sphere" />
    </div>
  )
}

// Si le globe 3D échoue (pilote graphique, contexte WebGL perdu…), on bascule sur
// la carte SVG : une panne du globe ne doit jamais faire tomber la page.
class Garde extends Component {
  state = { panne: false }
  static getDerivedStateFromError() {
    return { panne: true }
  }
  render() {
    return this.state.panne ? this.props.repli : this.props.children
  }
}

export default function GlobeTerre({ label, className = '', ...props }) {
  const boite = useRef(null)
  const [taille, setTaille] = useState(null)
  const [webgl] = useState(webglDisponible)
  const theme = useTheme()
  const mouvementReduit = useMouvementReduit()

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect
      if (width > 0 && height > 0) setTaille({ largeur: Math.round(width), hauteur: Math.round(height) })
    })
    ro.observe(boite.current)
    return () => ro.disconnect()
  }, [])

  const tous = { ...props, ...taille, theme, mouvementReduit }
  const plat = <Suspense fallback={<Squelette />}><GlobePlat {...tous} /></Suspense>

  return (
    <div ref={boite} className={['globe', className].filter(Boolean).join(' ')} role="img" aria-label={label}>
      {!taille ? <Squelette /> : webgl ? (
        <Garde repli={plat}>
          <Suspense fallback={<Squelette />}>
            <GlobeWebGL {...tous} />
          </Suspense>
        </Garde>
      ) : plat}
    </div>
  )
}
