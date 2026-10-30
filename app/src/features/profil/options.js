// Choix proposés dans le profil, partagés par l'édition, l'accueil du profil et les filtres.
// Les valeurs enregistrées ne changent pas (styleVoyage, rythme, investissement) : seuls les libellés évoluent.

export const STYLES = [
  { valeur: 'routard', libelle: 'Routard' },
  { valeur: 'confort', libelle: 'Confort' },
  { valeur: 'aventure', libelle: 'Aventure' },
  { valeur: 'culture', libelle: 'Culture' },
  { valeur: 'fête', libelle: 'Fête' },
]

export const RYTHMES = [
  { valeur: 'tranquille', libelle: 'Tranquille' },
  { valeur: 'modéré', libelle: 'Modéré' },
  { valeur: 'actif', libelle: 'Actif' },
]

// « Ce que je veux partager » (champ historique : investissement).
export const PARTAGES = [
  { valeur: 'trajet', libelle: 'Un trajet', explication: 'Partager une voiture ou un transfert, puis chacun sa route.' },
  { valeur: 'activites', libelle: 'Quelques activités', explication: 'Se retrouver pour une rando, un resto ou une visite.' },
  { valeur: 'tout', libelle: 'Tout le voyage', explication: 'Voyager ensemble du départ au retour.' },
]

// Repères de budget par jour (logement, repas, transports sur place), en euros.
export const BUDGETS = [
  { valeur: 30, libelle: '€', detail: 'moins de 40 €' },
  { valeur: 60, libelle: '€€', detail: '40 à 80 €' },
  { valeur: 100, libelle: '€€€', detail: 'plus de 80 €' },
]

const trouver = (liste, valeur) => liste.find((o) => o.valeur === valeur)?.libelle ?? valeur ?? ''
export const libelleStyle = (valeur) => trouver(STYLES, valeur)
export const libellePartage = (valeur) => trouver(PARTAGES, valeur)

// Repère €, €€ ou €€€ correspondant à un budget en centimes.
export function niveauBudget(centimes) {
  if (centimes == null) return null
  const euros = centimes / 100
  return euros < 40 ? BUDGETS[0] : euros <= 80 ? BUDGETS[1] : BUDGETS[2]
}
