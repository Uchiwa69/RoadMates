// Critères combinables de découverte et score de compatibilité des profils.
export const FILTRES_VIDES = {
  ageMin: '',
  ageMax: '',
  langue: '',
  genre: 'tous',
  centreInteret: '',
  styleVoyage: '',
  budgetMax: '',
  investissement: '',
  verifie: false,
}

export function preferenceAccepteGenre(preference, genre) {
  return preference !== 'H' && preference !== 'F' && preference !== 'tous'
    ? true
    : preference === 'tous' || preference === genre
}

export function preferencesGenresCompatibles(a, b) {
  return preferenceAccepteGenre(a?.preferenceGenre, b?.genre) && preferenceAccepteGenre(b?.preferenceGenre, a?.genre)
}

export function normaliserFiltres(filtres, preferenceGenre = 'tous') {
  const source = filtres && typeof filtres === 'object' ? filtres : {}
  const { femmes: ancienFiltreFemmes, ...criteres } = source
  const genre = ['H', 'F', 'tous'].includes(source.genre)
    ? source.genre
    : ancienFiltreFemmes === true
      ? 'F'
      : (['H', 'F'].includes(preferenceGenre) ? preferenceGenre : 'tous')
  return {
    ...FILTRES_VIDES,
    ...criteres,
    genre,
    ageMin: typeof source.ageMin === 'string' || typeof source.ageMin === 'number' ? String(source.ageMin) : '',
    ageMax: typeof source.ageMax === 'string' || typeof source.ageMax === 'number' ? String(source.ageMax) : '',
    langue: typeof source.langue === 'string' ? source.langue : '',
    centreInteret: typeof source.centreInteret === 'string' ? source.centreInteret : '',
    styleVoyage: typeof source.styleVoyage === 'string' ? source.styleVoyage : '',
    budgetMax: typeof source.budgetMax === 'string' || typeof source.budgetMax === 'number' ? String(source.budgetMax) : '',
    investissement: typeof source.investissement === 'string' ? source.investissement : '',
    verifie: source.verifie === true,
  }
}

export function appliquerFiltres(resultats, filtres, moi = null) {
  const criteres = normaliserFiltres(filtres, moi?.preferenceGenre)
  const ageMin = criteres.ageMin === '' ? null : Number(criteres.ageMin)
  const ageMax = criteres.ageMax === '' ? null : Number(criteres.ageMax)
  const ageMinValide = ageMin === null || (Number.isInteger(ageMin) && ageMin >= 18 && ageMin <= 99)
  const ageMaxValide = ageMax === null || (Number.isInteger(ageMax) && ageMax >= 18 && ageMax <= 99)
  const bornesValides = ageMinValide && ageMaxValide && (ageMin === null || ageMax === null || ageMin <= ageMax)
  const budget = criteres.budgetMax === '' ? null : Number(criteres.budgetMax)
  const budgetValide = budget === null || (Number.isFinite(budget) && budget >= 0 && budget <= 10000)
  const budgetMaxCentimes = budget === null || !budgetValide ? null : Math.round(budget * 100)
  return resultats.filter(({ user }) =>
    bornesValides && budgetValide &&
    (ageMin === null || user.age >= ageMin) &&
    (ageMax === null || user.age <= ageMax) &&
    (criteres.langue === '' || user.langues?.includes(criteres.langue)) &&
    (criteres.genre === 'tous' || user.genre === criteres.genre) &&
    (!moi || preferencesGenresCompatibles(moi, user)) &&
    (!criteres.centreInteret || user.centresInteret?.includes(criteres.centreInteret)) &&
    (!criteres.styleVoyage || user.styleVoyage === criteres.styleVoyage) &&
    (budgetMaxCentimes === null || (user.budgetJournalierCentimes != null && user.budgetJournalierCentimes <= budgetMaxCentimes)) &&
    (!criteres.investissement || user.investissement === criteres.investissement) &&
    (!criteres.verifie || user.verifie === true))
}

export function nombreFiltresActifs(filtres) {
  return Object.keys(FILTRES_VIDES).filter((cle) => filtres[cle] !== FILTRES_VIDES[cle]).length
}

export function scoreCompatibilite(voyageur, moi) {
  if (!voyageur || !moi || !preferencesGenresCompatibles(voyageur, moi)) return 0
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
