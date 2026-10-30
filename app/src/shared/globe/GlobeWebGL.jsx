// Globe 3D (react-globe.gl / three.js). Chargé en différé par Globe.jsx.
// Sobriété : polygones 110m, aucune texture, pixel ratio ≤ 2, rendu en pause hors écran.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { PAYS_GEO, focusPays, vueInitiale } from './monde.js'
import { echapperHtml } from '../texte.js'
import { COULEURS_GLOBE, SELECTION, creerEtiquetteVille, etiquettesVisibles, vuePays } from './rendu.js'
import CommandesZoom from './CommandesZoom.jsx'

// Bornes du zoom, en altitude de caméra (rayon du globe = 1). globe.gl place le globe à 100 unités.
// ALT_MIN reste au-dessus de l'atmosphère (0,22) : vue de l'intérieur, Firefox la rend noire.
const ALT_MIN = 0.26
const ALT_MAX = 3.8
const RAYON = 100
const borner = (alt) => Math.min(ALT_MAX, Math.max(ALT_MIN, alt))

export default function GlobeWebGL({
  largeur, hauteur, theme, mouvementReduit, pays, villeActive, points, arcs, villes, onPays, onVille, rotation = true,
  etiquettes: modeEtiquettes = 'actives',
}) {
  // L'instance du globe est gardée dans un état : selon le navigateur, onGlobeReady arrive avant
  // ou après l'attache de la ref, et les effets doivent se relancer quand les deux sont là.
  const [g, setG] = useState(null)
  const attacher = useCallback((instance) => { if (instance) setG(instance) }, [])
  const conteneur = useRef(null)
  const rappels = useRef({ onPays, onVille })
  const [pret, setPret] = useState(false)
  const [survol, setSurvol] = useState(null)
  const [astuce, setAstuce] = useState(false)
  // Altitude de la caméra, arrondie au quart (on ne redessine pas les points à chaque image).
  // Elle règle la taille des points et des arcs, et « proche » : le globe déborde de son cadre.
  const [altitude, setAltitude] = useState(null)
  const minuteurAstuce = useRef(null)
  const c = COULEURS_GLOBE[theme] ?? COULEURS_GLOBE.light
  const compact = largeur < 560
  const focus = pays ? focusPays(pays) : null
  const etiquettes = useMemo(
    () => (focus ? etiquettesVisibles(villes, villeActive, focus.lng, modeEtiquettes) : []),
    [villes, villeActive, focus, modeEtiquettes],
  )

  useEffect(() => {
    rappels.current = { onPays, onVille }
  }, [onPays, onVille])

  // Réglages qui n'existent pas en props : pixel ratio, contrôles, défilement tactile.
  useEffect(() => {
    if (!pret || !g) return
    g.renderer().setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    const ctrl = g.controls()
    ctrl.enableZoom = true
    ctrl.zoomSpeed = 0.8
    ctrl.minDistance = RAYON * (1 + ALT_MIN)
    ctrl.maxDistance = RAYON * (1 + ALT_MAX)
    ctrl.enableDamping = true
    ctrl.autoRotateSpeed = 0.45
    // Un glissement vertical fait défiler la page, un glissement horizontal tourne le globe,
    // un pincement à deux doigts zoome (pan-y n'autorise pas le zoom de page sur le globe).
    g.renderer().domElement.style.touchAction = 'pan-y'
    // Dès qu'on manipule le globe (rotation, zoom), il arrête de tourner tout seul.
    const arreter = () => { ctrl.autoRotate = false }
    const mesurer = () => setAltitude(Math.round(g.pointOfView().altitude * 4) / 4)
    ctrl.addEventListener('start', arreter)
    ctrl.addEventListener('change', mesurer)
    return () => {
      ctrl.removeEventListener('start', arreter)
      ctrl.removeEventListener('change', mesurer)
    }
  }, [pret, g])

  // Molette : seule, elle fait défiler la page (on ne piège pas le défilement) ;
  // avec Ctrl ou ⌘ (ou un pincement de pavé tactile), elle zoome. Un rappel s'affiche sinon.
  useEffect(() => {
    const el = conteneur.current
    if (!el) return
    const filtrer = (e) => {
      if (e.ctrlKey || e.metaKey) return
      e.stopPropagation()
      setAstuce(true)
      clearTimeout(minuteurAstuce.current)
      minuteurAstuce.current = setTimeout(() => setAstuce(false), 1600)
    }
    el.addEventListener('wheel', filtrer, { capture: true, passive: true })
    return () => {
      el.removeEventListener('wheel', filtrer, { capture: true })
      clearTimeout(minuteurAstuce.current)
    }
  }, [])

  const duree = mouvementReduit ? 0 : 450
  const zoomer = (facteur) => {
    if (!g) return
    g.controls().autoRotate = false
    const vue = g.pointOfView()
    g.pointOfView({ ...vue, altitude: borner(vue.altitude * facteur) }, duree)
  }
  const recentrer = () => {
    if (!g) return
    g.pointOfView(focus ? vuePays(focus, compact) : vueInitiale(compact), mouvementReduit ? 0 : 900)
    g.controls().autoRotate = rotation && !focus && !mouvementReduit
  }

  // Matériau de la sphère. La ref ne l'expose pas : on le retrouve dans la scène. Celui par défaut
  // (Phong) est rendu noir par Firefox de près ; on le remplace par un matériau Lambert, celui des
  // pays, dont on reprend le constructeur dans la scène pour ne pas importer three directement.
  // La couleur est aussi posée en émissif pour un rendu identique dans tous les navigateurs.
  useEffect(() => {
    if (!pret || !g) return
    const scene = g.scene()
    let essais = 0
    let minuteur
    // Les polygones des pays (et leur matériau) arrivent parfois juste après onGlobeReady.
    const appliquer = () => {
      let Lambert = null
      scene.traverse((o) => { if (!Lambert && o.isMesh && o.material?.isMeshLambertMaterial) Lambert = o.material.constructor })
      scene.traverse((o) => {
        if (!o.isMesh || !(o.userData.sphereRoadMates || o.material?.isMeshPhongMaterial)) return
        if (Lambert && !o.material.isMeshLambertMaterial) {
          o.material.dispose()
          o.material = new Lambert()
        }
        o.userData.sphereRoadMates = true
        o.material.color.set(c.sphere)
        o.material.emissive.set(c.sphere)
        o.material.emissiveIntensity = 0.55
      })
      if (!Lambert && essais++ < 20) minuteur = setTimeout(appliquer, 150)
    }
    appliquer()
    return () => clearTimeout(minuteur)
  }, [pret, g, c.sphere])

  // Pays choisi : on arrête de tourner, on pivote et on zoome dessus.
  useEffect(() => {
    if (!pret || !g) return
    g.pointOfView(focus ? vuePays(focus, compact) : vueInitiale(compact), mouvementReduit ? 0 : 1500)
    g.controls().autoRotate = rotation && !focus && !mouvementReduit
  }, [focus, pret, g, mouvementReduit, rotation, compact])

  // Rendu en pause quand le globe est hors écran ou l'onglet masqué (RSE-05, RSE-06).
  useEffect(() => {
    if (!pret || !g) return
    let visible = true
    const maj = () => (visible && !document.hidden ? g.resumeAnimation() : g.pauseAnimation())
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; maj() })
    io.observe(conteneur.current)
    document.addEventListener('visibilitychange', maj)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', maj)
    }
  }, [pret, g])

  const estChoisi = (d) => d.iso2 && d.iso2 === pays
  // « Proche » dès qu'on s'est approché de 10 % par rapport à la vue de départ.
  const reference = vueInitiale(compact).altitude
  const proche = altitude !== null && altitude < reference * 0.9
  // Les tailles sont en degrés : on les réduit avec l'altitude pour garder une taille constante à l'écran.
  const echelle = Math.min(1, Math.max(0.12, (altitude ?? reference) / reference))
  const zoome = !!focus || proche

  return (
    <div ref={conteneur} className="globe__scene" data-proche={proche || undefined}>
      <Globe
        ref={attacher}
        width={largeur}
        height={hauteur}
        backgroundColor="rgba(0,0,0,0)"
        rendererConfig={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        animateIn={!mouvementReduit}
        onGlobeReady={() => setPret(true)}
        showAtmosphere
        atmosphereColor={c.atmosphere}
        atmosphereAltitude={0.22}
        polygonsData={PAYS_GEO}
        polygonGeoJsonGeometry="geometry"
        polygonCapColor={(d) => (estChoisi(d) ? SELECTION : d === survol ? c.terreSurvol : c.terre)}
        polygonSideColor={(d) => (estChoisi(d) ? 'rgba(194, 65, 47, 0.9)' : c.flanc)}
        polygonStrokeColor={() => c.cote}
        polygonAltitude={(d) => (estChoisi(d) ? 0.03 : 0.006)}
        polygonLabel={(d) => `<div class="globe-bulle">${echapperHtml(d.nom)}</div>`}
        polygonsTransitionDuration={mouvementReduit ? 0 : 600}
        onPolygonHover={setSurvol}
        onPolygonClick={(d) => d.iso2 && rappels.current.onPays?.(d.iso2)}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => c.point}
        pointAltitude={(d) => (d.iso === pays ? 0.032 : 0.012)}
        pointRadius={(d) => (0.28 + Math.min(d.nb, 5) * 0.07) * echelle}
        pointLabel={(d) => `<div class="globe-bulle">${echapperHtml(d.texte)}</div>`}
        onPointClick={(d) => rappels.current.onVille?.(d)}
        pointsTransitionDuration={mouvementReduit ? 0 : 600}
        ringsData={mouvementReduit || zoome ? [] : points}
        ringColor={() => (t) => `rgba(255, 138, 107, ${1 - t})`}
        ringAltitude={0.013}
        ringMaxRadius={2.4}
        ringPropagationSpeed={1.4}
        ringRepeatPeriod={1800}
        arcsData={arcs}
        arcColor={() => ['#FF9F45', '#F2558C']}
        arcAltitudeAutoScale={0.35}
        arcStroke={Math.max(0.1, 0.5 * echelle)}
        arcDashLength={mouvementReduit ? 1 : 0.6}
        arcDashGap={mouvementReduit ? 0 : 0.3}
        arcDashAnimateTime={mouvementReduit ? 0 : 2200}
        arcsTransitionDuration={0}
        htmlElementsData={etiquettes}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.035}
        htmlElement={(d) => creerEtiquetteVille(d, d.actif || d.ville === villeActive, d.cote, (v) => rappels.current.onVille?.(v))}
        htmlTransitionDuration={0}
      />
      {pret && <CommandesZoom onPlus={() => zoomer(0.6)} onMoins={() => zoomer(1.6)} onRecentrer={recentrer} astuce={astuce} />}
    </div>
  )
}
