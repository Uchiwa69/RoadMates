// Complétude du profil : ce qui aide les autres voyageurs à vous choisir.
// Chaque critère a le même poids ; `champ` désigne le champ à compléter dans « Modifier mon profil ».
import { pairesAvisEligibles } from '../avis/avis.js'

const CRITERES = [
  { champ: 'photo', libelle: 'Ajoutez une photo', rempli: (u) => Boolean(u.photoUrl) },
  { champ: 'bio', libelle: 'Présentez-vous en quelques mots', rempli: (u) => (u.bio ?? '').trim().length >= 30 },
  { champ: 'langues', libelle: 'Indiquez les langues que vous parlez', rempli: (u) => (u.langues ?? []).length > 0 },
  { champ: 'interets', libelle: 'Ajoutez au moins 2 centres d’intérêt', rempli: (u) => (u.centresInteret ?? []).length >= 2 },
  { champ: 'budget', libelle: 'Indiquez votre budget', rempli: (u) => u.budgetJournalierCentimes != null },
  { champ: 'style', libelle: 'Choisissez votre style de voyage', rempli: (u) => Boolean(u.styleVoyage) },
]

export function completude(user) {
  if (!user) return { faits: 0, total: CRITERES.length, pourcentage: 0, manquants: [] }
  const manquants = CRITERES.filter((c) => !c.rempli(user)).map(({ champ, libelle }) => ({ champ, libelle }))
  const faits = CRITERES.length - manquants.length
  return { faits, total: CRITERES.length, pourcentage: Math.round((faits / CRITERES.length) * 100), manquants }
}

// Avis que l'utilisateur peut encore laisser (voyage terminé, dépense réglée, pas encore noté).
export function avisALaisser(db, userId, dateActuelle) {
  const dejaNotes = new Set((db.avis ?? []).filter((a) => a.auteurId === userId).map((a) => `${a.groupId}:${a.cibleId}`))
  return pairesAvisEligibles(db, userId, dateActuelle).filter((p) => !dejaNotes.has(`${p.groupId}:${p.cibleId}`))
}

// Pastille discrète sur l'onglet Profil : quelque chose à faire dans l'espace profil.
export function profilAAction(db, user) {
  if (!user) return false
  return completude(user).manquants.length > 0 || avisALaisser(db, user.id).length > 0
}
