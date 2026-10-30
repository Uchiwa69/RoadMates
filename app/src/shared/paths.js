// le contrat des URL entre les deux parties.
// Partie A (découverte) et partie B (groupe) se lient uniquement par ces chemins.

export const paths = {
  // Partie A — découverte
  accueil: '/',
  inscription: '/inscription',
  connexion: '/connexion',
  nouveauVoyage: '/voyages/nouveau',
  nouveauVoyageVers: (ville) => `/voyages/nouveau?ville=${encodeURIComponent(ville)}`,
  mesVoyages: '/voyages',
  destination: (ville) => `/destination/${encodeURIComponent(ville)}`,
  // Résultats de recherche « Où · Quand » (sans voyage déclaré) : la ville et la période.
  destinationRecherche: (ville, du, au) =>
    `/destination/${encodeURIComponent(ville)}${du && au ? `?du=${du}&au=${au}` : ''}`,
  // Guide de ville : onglet 'voyageurs' | 'a-faire' | 'bons-plans', et carte à mettre en évidence.
  destinationOnglet: (ville, onglet, carte) =>
    `/destination/${encodeURIComponent(ville)}?onglet=${onglet}${carte ? `&carte=${encodeURIComponent(carte)}` : ''}`,
  compagnons: '/compagnons',

  // Partie B — groupe
  profil: (userId) => `/voyageurs/${userId}`,
  demandes: '/demandes',  // redirige vers messagesOnglet('demandes')
  groupes: '/groupes',    // redirige vers messagesOnglet('groupes')
  groupe: (groupId) => `/groupes/${groupId}`,
  messages: '/messages',
  messagesOnglet: (onglet) => `/messages?onglet=${onglet}`,

  // Step-up — confidentialité (agent A) et profil enrichi (agent B)
  confidentialite: '/confidentialite',  // redirige vers profilConfidentialite
  monProfil: '/profil',
  avis: '/avis',                        // redirige vers profilAvis

  // Espace partenaire (US-20), accessible en incarnant un partenaire dans le mode démo
  partenaire: '/partenaire',
  partenaireProfil: '/partenaire/profil',

  // Espace « Mon profil » : accueil et sous-pages
  profilModifier: '/profil/modifier',
  profilModifierChamp: (champ) => `/profil/modifier?champ=${champ}`,
  profilConfidentialite: '/profil/confidentialite',
  profilAvis: '/profil/avis',
  profilCompte: '/profil/compte',
}
