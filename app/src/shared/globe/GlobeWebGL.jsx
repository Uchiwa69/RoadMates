// Globe 3D (react-globe.gl / three.js). Chargé en différé par Globe.jsx.
// Sobriété : polygones 110m, aucune texture, pixel ratio ≤ 2, rendu en pause hors écran.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import { PAYS_GEO, focusPays, vueInitiale } from './monde.js'
import { echapperHtml } from '../texte.js'
import { COULEURS_GLOBE, SELECTION, creerEtiquetteVille, etiquettesVisibles, vuePays } from './rendu.js'

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
    ctrl.enableZoom = false
    ctrl.enableDamping = true
    ctrl.autoRotateSpeed = 0.45
    // Un glissement vertical fait défiler la page, un glissement horizontal tourne le globe.
    g.renderer().domElement.style.touchAction = 'pan-y'
  }, [pret, g])

  // La ref n'expose pas le matériau de la sphère : on le retrouve dans la scène
  // (seul maillage en MeshPhongMaterial), ce qui évite d'importer three directement.
  // La couleur est aussi posée en émissif : sans cela, Firefox rend cette sphère presque noire
  // (ombrage Phong), alors que Chrome et Safari l'affichent bien.
  useEffect(() => {
    if (!pret || !g) return
    g.scene().traverse((o) => {
      if (!o.isMesh || !o.material?.isMeshPhongMaterial) return
      o.material.color.set(c.sphere)
      o.material.emissive.set(c.sphere)
      o.material.emissiveIntensity = 0.55
    })
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
  // Une fois zoomé, points et arcs s'affinent : leur taille est en degrés, pas en pixels.
  const zoome = !!focus

  return (
    <div ref={conteneur} className="globe__scene">
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
        pointRadius={(d) => (zoome ? 0.07 + Math.min(d.nb, 5) * 0.015 : 0.28 + Math.min(d.nb, 5) * 0.07)}
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
        arcStroke={zoome ? 0.12 : 0.5}
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
    </div>
  )
}
