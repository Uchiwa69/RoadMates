// Amis de route : voyageurs ajoutés après un parcours partagé, et voyages à venir en commun.
// Un ami anonyme ou bloqué (dans un sens ou dans l'autre) n'apparaît pas ; un itinéraire masqué
// n'est jamais utilisé pour déduire une destination commune.
import { profilMasque, itineraireMasque } from '../../shared/confidentialite.js'
import { estBloque } from '../securite/securite.js'
import { aujourdhui } from '../decouverte/dates.js'

export function amisVisibles(db, userId) {
  const moi = db.users.find((u) => u.id === userId)
  const ids = new Set(moi?.amisRoute ?? [])
  return db.users.filter((u) => ids.has(u.id) && !profilMasque(u) && !estBloque(db, userId, u.id))
}

// [{ amiId, ami, ville, debut, fin }] triés par date, pour les étapes communes pas encore terminées.
export function destinationsCommunes(db, userId, dateActuelle = aujourdhui()) {
  const mesEtapes = db.trips.filter((t) => t.userId === userId).flatMap((t) => t.etapes)
  return amisVisibles(db, userId)
    .filter((ami) => !itineraireMasque(ami))
    .flatMap((ami) => {
      const sesEtapes = db.trips.filter((t) => t.userId === ami.id).flatMap((t) => t.etapes)
      const communes = []
      for (const a of mesEtapes) for (const b of sesEtapes) {
        const debut = a.debut > b.debut ? a.debut : b.debut
        const fin = a.fin < b.fin ? a.fin : b.fin
        if (a.ville === b.ville && debut <= fin && fin >= dateActuelle) communes.push({ amiId: ami.id, ami: ami.prenom, ville: a.ville, debut, fin })
      }
      return communes
    })
    .sort((a, b) => a.debut.localeCompare(b.debut))
}
