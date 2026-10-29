// US-06 — logique des filtres âge, langue et genre, cumulables.
export const FILTRES_VIDES = { ageMin: '', ageMax: '', langue: '', femmes: false }

export function appliquerFiltres(resultats, f) {
  return resultats.filter(({ user }) =>
    (f.ageMin === '' || user.age >= Number(f.ageMin)) &&
    (f.ageMax === '' || user.age <= Number(f.ageMax)) &&
    (f.langue === '' || user.langues.includes(f.langue)) &&
    (!f.femmes || user.genre === 'F'))
}
