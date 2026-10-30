// contrat commun du mode anonyme, partagé par la découverte et le groupe.
// Un utilisateur peut porter user.anonymat = { profilJusqua, itineraireJusqua } (dates ISO 'AAAA-MM-JJ').
// Tant que la date n'est pas dépassée, la partie concernée est cachée aux autres voyageurs.

function actif(jusqua, maintenant = new Date()) {
  return Boolean(jusqua) && new Date(`${jusqua}T23:59:59`) >= maintenant
}

export function profilMasque(user, maintenant) {
  return actif(user?.anonymat?.profilJusqua, maintenant)
}

export function itineraireMasque(user, maintenant) {
  return actif(user?.anonymat?.itineraireJusqua, maintenant)
}
