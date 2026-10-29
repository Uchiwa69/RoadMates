// le contrat des URL entre les deux parties.
// Partie A (découverte) et partie B (groupe) se lient uniquement par ces chemins.

export const paths = {
  // Partie A — découverte
  accueil: '/',
  inscription: '/inscription',
  nouveauVoyage: '/voyages/nouveau',
  mesVoyages: '/voyages',
  destination: (ville) => `/destination/${encodeURIComponent(ville)}`,
  compagnons: '/compagnons',

  // Partie B — groupe
  profil: (userId) => `/voyageurs/${userId}`,
  demandes: '/demandes',
  groupes: '/groupes',
  groupe: (groupId) => `/groupes/${groupId}`,
}
