// Connexion simulée (prototype) : on retrouve le compte par son e-mail.
// Le mot de passe n'est jamais stocké (voir inscription.js), il n'est donc pas vérifié.
import { setCurrentUser } from '../../shared/session.js'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validerConnexion(form, users) {
  const e = {}
  const email = form.email.trim().toLowerCase()
  if (!EMAIL.test(email)) e.email = 'Adresse e-mail invalide.'
  else if (!users.some((u) => u.email?.toLowerCase() === email)) e.email = 'Aucun compte avec cette adresse.'
  if (!form.motDePasse) e.motDePasse = 'Indiquez votre mot de passe.'
  return e
}

export function connecter(form, users) {
  const user = users.find((u) => u.email?.toLowerCase() === form.email.trim().toLowerCase())
  if (user) setCurrentUser(user.id)
  return user
}
