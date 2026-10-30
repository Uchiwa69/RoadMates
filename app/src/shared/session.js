// utilisateur connecté (prototype : pas d'authentification réelle).
import { useDb, updateDb } from './db.js'

export function useCurrentUser() {
  return useDb((db) => db.users.find((u) => u.id === db.session.userId) ?? null)
}

// Incarner un voyageur quitte l'espace partenaire.
export function setCurrentUser(userId) {
  updateDb((db) => {
    db.session.userId = userId
    db.session.partenaireId = null
  })
}

// Partenaire incarné dans le mode démo (US-20), ou null. Le dernier voyageur reste en session :
// les pages voyageurs continuent de fonctionner si on y revient.
export function usePartenaire() {
  return useDb((db) => (db.partenaires ?? []).find((p) => p.id === db.session.partenaireId) ?? null)
}

export function setCurrentPartenaire(partenaireId) {
  updateDb((db) => {
    db.session.partenaireId = partenaireId
  })
}
