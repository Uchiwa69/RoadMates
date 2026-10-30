// Données du globe : où sont les voyageurs, et les trajets entre leurs étapes. Lecture seule.
import { VILLES } from './villes.js'

const PAR_NOM = new Map(VILLES.map((v) => [v.ville, v]))

const mois = new Intl.DateTimeFormat('fr-FR', { month: 'long', timeZone: 'UTC' })
const jour = (iso) => Number(iso.slice(8, 10))
const nomMois = (iso) => mois.format(new Date(`${iso}T00:00:00Z`))

// « du 14 au 20 juillet », « du 30 juin au 3 juillet », « le 14 juillet »
export function periodeEnClair(debut, fin) {
  if (debut === fin) return `le ${jour(debut)} ${nomMois(debut)}`
  if (debut.slice(0, 7) === fin.slice(0, 7)) return `du ${jour(debut)} au ${jour(fin)} ${nomMois(fin)}`
  return `du ${jour(debut)} ${nomMois(debut)} au ${jour(fin)} ${nomMois(fin)}`
}

// Un point par ville où au moins un voyageur passe, avec la période couverte.
export function pointsVoyageurs(db) {
  const parVille = new Map()
  for (const t of db.trips) {
    for (const e of t.etapes) {
      const v = PAR_NOM.get(e.ville)
      if (!v) continue
      const p = parVille.get(e.ville) ?? { ...v, voyageurs: new Set(), debut: e.debut, fin: e.fin }
      p.voyageurs.add(t.userId)
      if (e.debut < p.debut) p.debut = e.debut
      if (e.fin > p.fin) p.fin = e.fin
      parVille.set(e.ville, p)
    }
  }
  return [...parVille.values()].map(({ voyageurs, ...p }) => {
    const nb = voyageurs.size
    return { ...p, nb, texte: `${nb} voyageur${nb > 1 ? 's' : ''} à ${p.ville} ${periodeEnClair(p.debut, p.fin)}` }
  })
}

// Un arc entre deux étapes successives d'un même voyage.
export function arcsVoyages(db) {
  return db.trips.flatMap((t) => {
    const etapes = [...t.etapes].sort((a, b) => a.debut.localeCompare(b.debut))
    return etapes.slice(1).flatMap((e, i) => {
      const de = PAR_NOM.get(etapes[i].ville)
      const a = PAR_NOM.get(e.ville)
      if (!de || !a || de === a) return []
      return [{ startLat: de.lat, startLng: de.lng, endLat: a.lat, endLng: a.lng }]
    })
  })
}

// Les villes proposées dans un pays, avec le nombre de voyageurs présents.
export function villesDuPays(iso, points) {
  return VILLES.filter((v) => v.iso === iso).map((v) => ({
    ...v,
    nb: points.find((p) => p.ville === v.ville)?.nb ?? 0,
  })).sort((a, b) => b.nb - a.nb || a.ville.localeCompare(b.ville, 'fr'))
}
