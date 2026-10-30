// Critères combinables de découverte et score de compatibilité des profils.
export const FILTRES_VIDES = {
  ageMin: '',
  ageMax: '',
  langue: '',
  femmes: false,
  centreInteret: '',
  styleVoyage: '',
  budgetMax: '',
  investissement: '',
  verifie: false,
}

export function appliquerFiltres(resultats, filtres) {
  const budgetMaxCentimes = filtres.budgetMax === '' ? null : Number(filtres.budgetMax) * 100
  return resultats.filter(({ user }) =>
    (filtres.ageMin === '' || user.age >= Number(filtres.ageMin)) &&
    (filtres.ageMax === '' || user.age <= Number(filtres.ageMax)) &&
    (filtres.langue === '' || user.langues?.includes(filtres.langue)) &&
    (!filtres.femmes || user.genre === 'F') &&
    (!filtres.centreInteret || user.centresInteret?.includes(filtres.centreInteret)) &&
    (!filtres.styleVoyage || user.styleVoyage === filtres.styleVoyage) &&
    (budgetMaxCentimes === null || (user.budgetJournalierCentimes != null && user.budgetJournalierCentimes <= budgetMaxCentimes)) &&
    (!filtres.investissement || user.investissement === filtres.investissement) &&
    (!filtres.verifie || user.verifie === true))
}

export function nombreFiltresActifs(filtres) {
  return Object.keys(FILTRES_VIDES).filter((cle) => filtres[cle] !== FILTRES_VIDES[cle]).length
}

export function scoreCompatibilite(voyageur, moi) {
  if (!voyageur || !moi) return 0
  const comparaisons = []
  const ajouter = (poids, valeur) => comparaisons.push({ poids, valeur: Math.max(0, Math.min(1, valeur)) })

  if (moi.centresInteret?.length && voyageur.centresInteret?.length) {
    const interetsMoi = new Set(moi.centresInteret)
    const interetsVoyageur = new Set(voyageur.centresInteret)
    const partages = [...interetsMoi].filter((interet) => interetsVoyageur.has(interet)).length
    const totalInterets = new Set([...interetsMoi, ...interetsVoyageur]).size
    ajouter(30, totalInterets ? partages / totalInterets : 0)
  }
  if (moi.styleVoyage && voyageur.styleVoyage) ajouter(20, moi.styleVoyage === voyageur.styleVoyage ? 1 : 0)
  if (Number.isFinite(moi.budgetJournalierCentimes) && Number.isFinite(voyageur.budgetJournalierCentimes)) {
    const plusGrandBudget = Math.max(moi.budgetJournalierCentimes, voyageur.budgetJournalierCentimes, 1)
    ajouter(15, 1 - Math.abs(moi.budgetJournalierCentimes - voyageur.budgetJournalierCentimes) / plusGrandBudget)
  }
  if (moi.investissement && voyageur.investissement) ajouter(15, moi.investissement === voyageur.investissement ? 1 : 0)
  if (moi.rythme && voyageur.rythme) ajouter(10, moi.rythme === voyageur.rythme ? 1 : 0)
  if (typeof moi.verifie === 'boolean' && typeof voyageur.verifie === 'boolean') ajouter(5, voyageur.verifie ? 1 : 0)
  if (moi.langues?.length && voyageur.langues?.length) {
    ajouter(10, moi.langues.some((langue) => voyageur.langues.includes(langue)) ? 1 : 0)
  }
  if (Number.isFinite(moi.age) && Number.isFinite(voyageur.age)) {
    ajouter(10, 1 - Math.abs(moi.age - voyageur.age) / 20)
  }

  const poidsDisponibles = comparaisons.reduce((somme, comparaison) => somme + comparaison.poids, 0)
  if (!poidsDisponibles) return 0
  const points = comparaisons.reduce((somme, comparaison) => somme + comparaison.poids * comparaison.valeur, 0)
  return Math.round((points / poidsDisponibles) * 100)
}
