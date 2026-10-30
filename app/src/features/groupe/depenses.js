// Calculs des dépenses partagées (US-13, US-14, US-15). Fonctions pures, montants en centimes.
// repartir() reprend à l'identique l'algorithme d'origine d'Expenses.jsx.

const devise = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export function formatEuros(centimes) {
  return devise.format((centimes || 0) / 100)
}

// Parts égales ; les centimes restants vont aux premières parts : le total reste exact.
export function repartir(montantCentimes, memberIds) {
  const base = Math.floor(montantCentimes / memberIds.length)
  const remainder = montantCentimes % memberIds.length
  return memberIds.map((userId, index) => ({
    userId,
    montantCentimes: base + (index < remainder ? 1 : 0),
    payee: false,
  }))
}

export const estComplete = (expense) => expense.parts.every((part) => part.payee)
export const nbPayees = (expense) => expense.parts.filter((part) => part.payee).length
