// Couleurs et étiquettes partagées par le globe 3D et la carte de repli.
import { echapperHtml } from '../texte.js'

export const SELECTION = '#FF6B5B'

// Clair : un globe de crépuscule (océan encre, terres pêche) sur le ciel couchant.
// Sombre : un globe de nuit, terres bleu ardoise, halo corail.
export const COULEURS_GLOBE = {
  light: {
    sphere: '#1B2444', terre: '#FFD9C7', terreSurvol: '#FFBFA6', cote: 'rgba(27, 36, 68, 0.35)',
    flanc: 'rgba(255, 217, 199, 0.4)', atmosphere: '#FF8A6B', point: '#FFF8F3',
  },
  dark: {
    sphere: '#0F1630', terre: '#2B3A66', terreSurvol: '#3B4E86', cote: 'rgba(169, 184, 255, 0.28)',
    flanc: 'rgba(43, 58, 102, 0.6)', atmosphere: '#FF7A5C', point: '#FFE3D3',
  },
}

// Étiquette cliquable d'une ville. Doublon visuel de la liste accessible
// affichée à côté du globe : elle est donc masquée aux lecteurs d'écran et hors tabulation.
// globe.gl place l'élément renvoyé avec son propre transform : on renvoie une ancre
// de taille nulle, et l'étiquette se décale au-dessus du point en CSS.
export function creerEtiquetteVille(d, active, cote, onClic) {
  const ancre = document.createElement('div')
  ancre.className = 'globe-ancre'
  const el = document.createElement('button')
  el.type = 'button'
  el.tabIndex = -1
  el.setAttribute('aria-hidden', 'true')
  el.className = `globe-ville globe-ville--${cote}${active ? ' globe-ville--active' : ''}${d.nb ? '' : ' globe-ville--vide'}`
  el.innerHTML = `<span class="globe-ville__nom">${echapperHtml(d.ville)}</span>${d.nb ? `<span class="globe-ville__nb">${d.nb}</span>` : ''}`
  el.style.pointerEvents = 'auto'
  el.addEventListener('click', (e) => {
    e.stopPropagation()
    onClic(d)
  })
  ancre.append(el)
  return ancre
}

// Étiquettes affichées sur le globe : les villes où quelqu'un passe, plus la ville choisie.
// Chacune part du côté extérieur du pays (ouest à gauche, est à droite) pour limiter
// les chevauchements, comme Lagos et Faro à 60 km l'une de l'autre.
export function etiquettesVisibles(villes, villeActive, centreLng) {
  return villes
    .filter((v) => v.nb > 0 || v.ville === villeActive)
    .map((v) => ({ ...v, cote: v.lng < centreLng ? 'gauche' : 'droite' }))
}

// Recul et décalage de la caméra pour un pays : un peu plus loin sur mobile, et le pays
// remonté dans le cadre pour laisser la place au panneau des villes posé en bas.
export function vuePays(focus, compact) {
  const altitude = focus.altitude * (compact ? 1.4 : 1)
  return { lat: focus.lat - altitude * (compact ? 4 : 10), lng: focus.lng, altitude }
}
