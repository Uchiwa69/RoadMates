// utilisateur connecté (prototype : pas d'authentification réelle).
import { useDb, updateDb } from './db.js'

export function useCurrentUser() {
  return useDb((db) => db.users.find((u) => u.id === db.session.userId) ?? null)
}

export function setCurrentUser(userId) {
  updateDb((db) => {
    db.session.userId = userId
  })
}
