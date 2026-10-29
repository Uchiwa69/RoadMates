// Polygones des pays (world-atlas 110m, le plus léger) et point de vue de chaque pays.
// Chargé seulement avec le globe : ce module n'entre dans aucune autre page.
import world from 'world-atlas/countries-110m.json'
import { feature } from 'topojson-client'
import { geoArea, geoCentroid } from 'd3-geo'
import { alpha2DepuisNumerique, nomPays } from './pays.js'

// Sur ordinateur, le globe entier tient dans sa colonne ; sur mobile, il est plus proche.
export const VUE_INITIALE = { lat: 36, lng: 6, altitude: 3.4 }
export const vueInitiale = (compact) => (compact ? { ...VUE_INITIALE, altitude: 2.3 } : VUE_INITIALE)

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

export const PAYS_GEO = feature(world, world.objects.countries).features.map((f) => {
  const iso2 = f.id ? alpha2DepuisNumerique(f.id) : null
  return { iso2, nom: iso2 ? nomPays(iso2) : f.properties.name, geometry: f.geometry, focus: focusDe(f.geometry) }
})

export function focusPays(iso2) {
  return PAYS_GEO.find((p) => p.iso2 === iso2)?.focus ?? null
}
