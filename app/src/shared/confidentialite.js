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

const jourLong = new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
const jourCourt = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', timeZone: 'UTC' })

// '2027-07-17' → « jeudi 17 juillet » (ou « 17 juil. » en version courte).
export function formatJusqua(jusqua, court = false) {
  return jusqua ? (court ? jourCourt : jourLong).format(new Date(`${jusqua}T00:00:00Z`)) : ''
}
