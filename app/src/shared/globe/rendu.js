// Couleurs et étiquettes partagées par le globe 3D et la carte de repli.
import { echapperHtml } from '../texte.js'

export const SELECTION = '#FF6B5B'

// Clair : un globe de crépuscule (océan encre, terres crème) sur le ciel couchant.
// Les flancs des pays ont la couleur des terres : semi-transparents, ils dessinaient une ombre
// grise décalée le long des côtes qui donnait un aspect flou.
// Sombre : un globe de nuit, terres bleu ardoise, halo corail.
export const COULEURS_GLOBE = {
  light: {
    sphere: '#1B2444', terre: '#FFE6DA', terreSurvol: '#FFC7AE', cote: 'rgba(27, 36, 68, 0.5)',
    flanc: '#FFE6DA', atmosphere: '#FF7A5C', point: '#FFFFFF',
  },
  dark: {
    sphere: '#0F1630', terre: '#2B3A66', terreSurvol: '#3B4E86', cote: 'rgba(169, 184, 255, 0.28)',
    flanc: '#2B3A66', atmosphere: '#FF7A5C', point: '#FFE3D3',
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

// Étiquettes affichées sur le globe. Mode « actives » (vitrine) : les villes où quelqu'un
// passe et les villes choisies. Mode « toutes » (sélecteur d'étapes) : toutes les villes du pays.
// Chacune part du côté extérieur du pays (ouest à gauche, est à droite) ; si une voisine
// proche occupe déjà ce côté (Lisbonne et Sintra), elle passe de l'autre côté.
export function etiquettesVisibles(villes, villeActive, centreLng, mode = 'actives') {
  const placees = []
  const proche = (a, b) => Math.abs(a.lat - b.lat) < 1 && Math.abs(a.lng - b.lng) < 2.5
  return villes
    .filter((v) => mode === 'toutes' || v.nb > 0 || v.actif || v.ville === villeActive)
    .sort((a, b) => Number(!!b.actif) - Number(!!a.actif) || b.nb - a.nb)
    .map((v) => {
      let cote = v.lng < centreLng ? 'gauche' : 'droite'
      if (placees.some((p) => p.cote === cote && proche(p, v))) cote = cote === 'gauche' ? 'droite' : 'gauche'
      const e = { ...v, cote }
      placees.push(e)
      return e
    })
}

// Recul et décalage de la caméra pour un pays : un peu plus loin sur mobile, et le pays
// remonté dans le cadre pour laisser la place au panneau des villes posé en bas.
export function vuePays(focus, compact) {
  const altitude = focus.altitude * (compact ? 1.4 : 1)
  return { lat: focus.lat - altitude * (compact ? 4 : 10), lng: focus.lng, altitude }
}
