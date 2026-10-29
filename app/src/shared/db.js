// base de données de démo dans le localStorage (pas de back-end
// dans le prototype).
//
// Collections et propriétaire (seul le propriétaire écrit dedans) :
//   users     A  { id, prenom, age, genre: 'F'|'H'|'autre', langues: string[], bio, verifie: bool }
//   trips     A  { id, userId, destination, etapes: [{ ville, pays, debut, fin }] }  dates 'AAAA-MM-JJ'
//   requests  B  { id, fromId, toId, message, statut: 'en_attente'|'acceptee'|'refusee', creeLe }
//   groups    B  { id, nom, destination, membres: userId[], creeLe }
//   messages  B  { id, groupId, auteurId, texte, envoyeLe }
//   expenses  B  { id, groupId, createurId, libelle, categorie, montantCentimes, dateReservation,
//                  parts: [{ userId, montantCentimes, payee: bool }], creeLe }
//   session   —  { userId }  (voir session.js)
import { useSyncExternalStore } from 'react'
import { seed } from './seed.js'

const KEY = 'roadmates-db-v1'
const listeners = new Set()
let cache = null

function load() {
  if (cache) return cache
  try {
    const raw = localStorage.getItem(KEY)
    cache = raw ? JSON.parse(raw) : structuredClone(seed)
  } catch {
    cache = structuredClone(seed)
  }
  return cache
}

export function getDb() {
  return load()
}

// Applique une modification puis notifie les composants abonnés.
// Exemple : updateDb((db) => { db.trips.push(trip) })
export function updateDb(mutate) {
  const next = structuredClone(load())
  mutate(next)
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // stockage indisponible : la démo continue en mémoire
  }
  listeners.forEach((l) => l())
}

export function resetDb() {
  updateDb((db) => Object.assign(db, structuredClone(seed)))
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Hook de lecture : const trips = useDb((db) => db.trips)
export function useDb(selector) {
  return selector(useSyncExternalStore(subscribe, load))
}

export function newId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}
