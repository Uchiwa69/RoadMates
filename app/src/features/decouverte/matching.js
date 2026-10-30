// Calcul des compagnons possibles (US-04, US-05). Lecture seule.
import { profilMasque, itineraireMasque } from '../../shared/confidentialite.js'
import { joursCommuns, periodeCommune } from './dates.js'
import { scoreCompatibilite } from './filtres.js'

// US-05 — pour un de mes voyages, les voyageurs qui ont au moins une étape commune
// (même ville et au moins 1 jour qui coïncide), triés par étapes puis jours communs.
export function itinerairesCommuns(db, monVoyage) {
  const resultats = []
  const moi = db.users.find((user) => user.id === monVoyage.userId)
  for (const autre of db.trips) {
    if (autre.userId === monVoyage.userId) continue
    const user = db.users.find((u) => u.id === autre.userId)
    if (!user || profilMasque(user) || itineraireMasque(user) || bloqueEntre(db, monVoyage.userId, user.id)) continue
    const communes = []
    for (const mienne of monVoyage.etapes) {
      for (const sienne of autre.etapes) {
        if (mienne.ville !== sienne.ville) continue
        const jours = joursCommuns(mienne, sienne)
        if (jours > 0) communes.push({ ville: mienne.ville, jours, periode: periodeCommune(mienne, sienne) })
      }
    }
    if (communes.length === 0) continue
    resultats.push({
      user,
      communes,
      nbEtapes: new Set(communes.map((c) => c.ville)).size,
      jours: communes.reduce((s, c) => s + c.jours, 0),
      compatibilite: scoreCompatibilite(user, moi),
    })
  }
  return fusionnerParUser(resultats).sort((a, b) => b.compatibilite - a.compatibilite || b.nbEtapes - a.nbEtapes || b.jours - a.jours)
}

// US-04 — les voyageurs présents dans une ville pendant mes dates dans cette ville.
export function presentsDansLaVille(db, userId, ville) {
  const mesEtapes = db.trips
    .filter((t) => t.userId === userId)
    .flatMap((t) => t.etapes)
    .filter((e) => e.ville === ville)
  return presentsPendant(db, userId, mesEtapes, (e) => e.ville === ville)
}

// Repli du risque R-01 : élargir au pays quand personne n'est dans la ville.
export function presentsDansLePays(db, userId, ville) {
  const mesEtapes = db.trips
    .filter((t) => t.userId === userId)
    .flatMap((t) => t.etapes)
    .filter((e) => e.ville === ville)
  const pays = mesEtapes[0]?.pays
  if (!pays) return []
  return presentsPendant(db, userId, mesEtapes, (e) => e.pays === pays)
}

// Recherche sans voyage déclaré (page de résultats) : les voyageurs présents dans la ville — ou,
// avec `pays`, dans tout le pays — au moins un jour entre `debut` et `fin`. Mêmes exclusions que
// ci-dessus : profils et itinéraires masqués, blocages, et soi-même.
export function presentsSurPeriode(db, userId, ville, debut, fin, pays = null) {
  return presentsPendant(db, userId, [{ ville, debut, fin }], pays ? (e) => e.pays === pays : (e) => e.ville === ville)
}

function presentsPendant(db, userId, mesEtapes, filtre) {
  const resultats = []
  const moi = db.users.find((user) => user.id === userId)
  for (const autre of db.trips) {
    if (autre.userId === userId) continue
    const user = db.users.find((candidat) => candidat.id === autre.userId)
    if (!user || profilMasque(user) || itineraireMasque(user) || bloqueEntre(db, userId, user.id)) continue
    const communes = []
    for (const sienne of autre.etapes.filter(filtre)) {
      for (const mienne of mesEtapes) {
        const jours = joursCommuns(mienne, sienne)
        if (jours > 0) communes.push({ ville: sienne.ville, jours, periode: periodeCommune(mienne, sienne) })
      }
    }
    if (communes.length) {
      resultats.push({ user, communes, nbEtapes: communes.length, jours: communes.reduce((s, c) => s + c.jours, 0), compatibilite: scoreCompatibilite(user, moi) })
    }
  }
  return fusionnerParUser(resultats).sort((a, b) => b.compatibilite - a.compatibilite || b.jours - a.jours)
}

function bloqueEntre(db, userId, autreId) {
  return (db.blocages ?? []).some((blocage) =>
    (blocage.bloqueurId === userId && blocage.bloqueId === autreId) ||
    (blocage.bloqueurId === autreId && blocage.bloqueId === userId),
  )
}

// Un voyageur peut avoir plusieurs voyages : on n'affiche qu'une carte par personne.
function fusionnerParUser(resultats) {
  const parUser = new Map()
  for (const r of resultats) {
    const deja = parUser.get(r.user.id)
    if (!deja) parUser.set(r.user.id, { ...r })
    else {
      deja.communes.push(...r.communes)
      deja.nbEtapes += r.nbEtapes
      deja.jours += r.jours
    }
  }
  return [...parUser.values()].sort((a, b) => b.compatibilite - a.compatibilite || b.jours - a.jours)
}
