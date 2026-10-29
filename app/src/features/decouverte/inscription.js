// US-01 — validation et création du compte. Le mot de passe n'est jamais stocké :
// le prototype n'a pas d'authentification réelle.
import { updateDb, newId } from '../../shared/db.js'
import { setCurrentUser } from '../../shared/session.js'
import { ageDepuis } from './dates.js'

export const LANGUES = ['français', 'anglais', 'espagnol', 'portugais', 'italien', 'allemand', 'arabe']
export const AGE_MIN = 18

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validerInscription(form, users) {
  const e = {}
  if (!EMAIL.test(form.email.trim())) e.email = 'Adresse e-mail invalide.'
  else if (users.some((u) => u.email?.toLowerCase() === form.email.trim().toLowerCase())) {
    e.email = 'Un compte existe déjà avec cette adresse.'
  }
  if (form.motDePasse.length < 8) e.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères.'
  if (!form.prenom.trim()) e.prenom = 'Indiquez votre prénom.'
  if (!form.naissance) e.naissance = 'Indiquez votre date de naissance.'
  else if (ageDepuis(form.naissance) < AGE_MIN) e.naissance = `RoadMates est réservé aux plus de ${AGE_MIN} ans.`
  if (!form.genre) e.genre = 'Choisissez une option.'
  if (form.langues.length === 0) e.langues = 'Choisissez au moins une langue.'
  return e
}

export function creerCompte(form) {
  const user = {
    id: newId('u'),
    email: form.email.trim(),
    prenom: form.prenom.trim(),
    age: ageDepuis(form.naissance),
    genre: form.genre,
    langues: form.langues,
    bio: '',
    verifie: false,
  }
  updateDb((db) => {
    db.users.push(user)
  })
  setCurrentUser(user.id)
  return user
}
