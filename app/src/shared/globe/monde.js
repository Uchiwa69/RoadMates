// Polygones des pays (world-atlas 110m, le plus léger) et point de vue de chaque pays.
// Chargé seulement avec le globe : ce module n'entre dans aucune autre page.
import world from 'world-atlas/countries-110m.json'
import { feature } from 'topojson-client'
import { geoArea, geoCentroid } from 'd3-geo'
import { alpha2DepuisNumerique, nomPays } from './pays.js'

export const VUE_INITIALE = { lat: 36, lng: 6, altitude: 3.4 }

// Vue de départ adaptée au cadre : le globe entier occupe 84 % de la largeur du canevas
// (son atmosphère tient ainsi dans le cadre, sans être coupée ni estompée sur les bords)
// (72 % de sa hauteur au plus). La caméra de globe.gl a un champ vertical de 50° et le globe
// un rayon de 1 en unités d'altitude : on en déduit la distance qui donne ce diamètre.
export function vueInitiale(largeur, hauteur) {
  const diametre = Math.min(largeur * 0.84, hauteur * 0.72)
  const demiAngle = (diametre / hauteur) * 25 * (Math.PI / 180)
  return { ...VUE_INITIALE, altitude: Math.min(4, Math.max(1.6, 1 / Math.sin(demiAngle) - 1)) }
}

// Centre et recul de la caméra : on vise le plus grand polygone du pays,
// pour que la France ne soit pas centrée entre Paris et la Guyane.
function focusDe(geometrie) {
  let poly = geometrie
  if (geometrie.type === 'MultiPolygon') {
    poly = geometrie.coordinates
      .map((coordinates) => ({ type: 'Polygon', coordinates }))
      .reduce((a, b) => (geoArea(a) >= geoArea(b) ? a : b))
  }
  const [lng, lat] = geoCentroid(poly)
  const aire = Math.min(geoArea(poly), 4 * Math.PI - geoArea(poly))
  return { lat, lng, altitude: Math.min(2.2, Math.max(0.32, 0.18 + Math.sqrt(aire) * 3.2)) }
}

// Polygones sans code numérique ISO 3166 dans world-atlas : reliés par leur nom.
// Le Kosovo n'a pas de code numérique officiel ; XK est le code utilisé par l'UE et i18n-iso-countries.
const SANS_CODE = { Kosovo: 'XK' }

export const PAYS_GEO = feature(world, world.objects.countries).features.map((f) => {
  const iso2 = f.id ? alpha2DepuisNumerique(f.id) : SANS_CODE[f.properties.name] ?? null
  return { iso2, nom: iso2 ? nomPays(iso2) : f.properties.name, geometry: f.geometry, focus: focusDe(f.geometry) }
})

export function focusPays(iso2) {
  return PAYS_GEO.find((p) => p.iso2 === iso2)?.focus ?? null
}
