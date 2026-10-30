// Repli sans WebGL : globe statique en SVG (projection orthographique d3-geo).
// Mêmes props que GlobeWebGL ; pas d'animation, transitions instantanées.
import { useState } from 'react'
import { geoDistance, geoOrthographic, geoPath } from 'd3-geo'
import { PAYS_GEO, VUE_INITIALE, focusPays } from './monde.js'
import { COULEURS_GLOBE, SELECTION, etiquettesVisibles } from './rendu.js'
import CommandesZoom from './CommandesZoom.jsx'

export default function GlobePlat({
  largeur, hauteur, theme, pays, villeActive, points, arcs, villes, onPays, onVille, etiquettes = 'actives',
}) {
  const c = COULEURS_GLOBE[theme] ?? COULEURS_GLOBE.light
  const focus = (pays && focusPays(pays)) || VUE_INITIALE
  const rayon = (Math.min(largeur, hauteur) / 2) * 0.86
  // Zoom manuel (boutons) : un facteur propre au pays affiché, remis à 1 quand le pays change.
  const [manuel, setManuel] = useState({ pays, facteur: 1 })
  const facteur = manuel.pays === pays ? manuel.facteur : 1
  const zoomer = (f) => setManuel({ pays, facteur: Math.min(8, Math.max(0.6, facteur * f)) })
  const zoom = (pays ? Math.min(Math.max(1.4 / focus.altitude, 1), 5) : 1) * facteur
  const projection = geoOrthographic()
    .rotate([-focus.lng, -focus.lat])
    .translate([largeur / 2, hauteur / 2])
    .scale(rayon * zoom)
    .clipAngle(90)
  const chemin = geoPath(projection)
  const centre = [focus.lng, focus.lat]
  const visible = (lng, lat) => geoDistance([lng, lat], centre) < Math.PI / 2 - 0.02

  return (
    <div className="globe__scene globe__scene--plat">
      <svg width={largeur} height={hauteur} aria-hidden="true">
        <defs>
          <radialGradient id="globe-plat-ombre" cx="38%" cy="32%" r="75%">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity=".14" />
            <stop offset="1" stopColor="#000000" stopOpacity=".28" />
          </radialGradient>
        </defs>
        <circle cx={largeur / 2} cy={hauteur / 2} r={rayon * zoom + 10} fill={c.atmosphere} opacity=".18" />
        <path d={chemin({ type: 'Sphere' })} fill={c.sphere} />
        {PAYS_GEO.map((p, i) => (
          <path
            key={p.iso2 ?? i}
            d={chemin(p.geometry) ?? ''}
            fill={p.iso2 && p.iso2 === pays ? SELECTION : c.terre}
            stroke={c.cote}
            strokeWidth=".6"
            onClick={() => p.iso2 && onPays?.(p.iso2)}
            className="globe-plat__pays"
          >
            <title>{p.nom}</title>
          </path>
        ))}
        {arcs.map((a, i) => (
          <path
            key={i}
            d={chemin({ type: 'LineString', coordinates: [[a.startLng, a.startLat], [a.endLng, a.endLat]] }) ?? ''}
            fill="none"
            stroke="#FF8A6B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}
        {points.filter((p) => visible(p.lng, p.lat)).map((p) => {
          const [x, y] = projection([p.lng, p.lat])
          return (
            <circle key={p.ville} cx={x} cy={y} r={3 + Math.min(p.nb, 5)} fill={c.point} stroke="#FF6B5B" strokeWidth="2" onClick={() => onVille?.(p)} className="globe-plat__point">
              <title>{p.texte}</title>
            </circle>
          )
        })}
        <path d={chemin({ type: 'Sphere' })} fill="url(#globe-plat-ombre)" pointerEvents="none" />
      </svg>
      {etiquettesVisibles(villes, villeActive, focus.lng, etiquettes).filter((v) => visible(v.lng, v.lat)).map((v) => {
        const [x, y] = projection([v.lng, v.lat])
        return (
          <button
            key={v.ville}
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            className={`globe-ville globe-ville--${v.cote}${v.actif || v.ville === villeActive ? ' globe-ville--active' : ''}${v.nb ? '' : ' globe-ville--vide'}`}
            style={{ left: x, top: y }}
            onClick={() => onVille?.(v)}
          >
            <span className="globe-ville__nom">{v.ville}</span>
            {v.nb > 0 && <span className="globe-ville__nb">{v.nb}</span>}
          </button>
        )
      })}
      <CommandesZoom onPlus={() => zoomer(1.5)} onMoins={() => zoomer(1 / 1.5)} onRecentrer={() => setManuel({ pays, facteur: 1 })} />
    </div>
  )
}
