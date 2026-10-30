// Partenaires et offres de groupe (US-18, US-20). Logique pure, testée en Node.
// Les partenaires du jeu de démo sont fictifs : aucune vraie entreprise n'est présentée comme partenaire.
import { aujourdhui } from '../decouverte/dates.js'
import { presentsDansLaVille } from '../decouverte/matching.js'
import { formatJour } from '../groupe/format.js'

export const CATEGORIES_PARTENAIRE = {
  hebergement: 'Hébergement',
  restaurant: 'Restaurant',
  musee: 'Musée et visite',
  activite: 'Activité',
  location: 'Location de voiture ou de vélo',
}

export const formatReduction = (pct) => `−${pct} %`
export const conditionGroupe = (min) => `dès ${min} voyageurs`

// Offre en cours : partenaire validé, offre active, dans sa période de validité (US-18 critère 2).
export function offreEnCours(offre, partenaire, today = aujourdhui()) {
  return Boolean(partenaire?.valide && offre.active && offre.debut <= today && today <= offre.fin)
}

// Les bons plans d'une ville, triés par réduction décroissante : [{ offre, partenaire }].
export function offresDeLaVille(db, ville, today = aujourdhui()) {
  return (db.offres ?? [])
    .map((offre) => ({ offre, partenaire: (db.partenaires ?? []).find((p) => p.id === offre.partenaireId) }))
    .filter(({ offre, partenaire }) => partenaire?.ville === ville && offreEnCours(offre, partenaire, today))
    .sort((a, b) => b.offre.reductionPct - a.offre.reductionPct)
}

// Validation d'une offre (US-20 critères 2 et 4) : { champ: message } ; objet vide si tout va bien.
export function validerOffre(o, today = aujourdhui()) {
  const erreurs = {}
  if (!o.titre?.trim()) erreurs.titre = 'Donnez un titre à votre offre.'
  else if (o.titre.trim().length > 80) erreurs.titre = 'Le titre ne doit pas dépasser 80 caractères.'
  if ((o.description ?? '').trim().length > 300) erreurs.description = 'La description ne doit pas dépasser 300 caractères.'
  const pct = Number(o.reductionPct)
  if (!Number.isInteger(pct) || pct <= 0) erreurs.reductionPct = 'Une offre doit proposer une réduction d’au moins 1 %.'
  else if (pct > 90) erreurs.reductionPct = 'La réduction ne peut pas dépasser 90 %.'
  const min = Number(o.minVoyageurs)
  if (!Number.isInteger(min) || min < 2 || min > 20) erreurs.minVoyageurs = 'Indiquez un groupe de 2 à 20 voyageurs.'
  if (!o.debut) erreurs.debut = 'Indiquez la date de début.'
  if (!o.fin) erreurs.fin = 'Une offre doit avoir une date de fin.'
  else if (o.fin < today) erreurs.fin = 'La date de fin est déjà passée.'
  else if (o.debut && o.fin < o.debut) erreurs.fin = 'La date de fin doit suivre la date de début.'
  return erreurs
}

// Nombre de voyageurs RoadMates présents en même temps que moi dans la ville.
// S'appuie sur presentsDansLaVille : profils et itinéraires masqués, et blocages, sont exclus.
export function voyageursPendantMesDates(db, userId, ville) {
  if (!userId) return 0
  return presentsDansLaVille(db, userId, ville).length
}

// Mes groupes qui vont dans cette ville (destination ou nom qui la cite, ou destination = son pays) :
// candidats pour « Proposer à mon groupe ».
export function groupesPourLaVille(db, userId, ville, pays) {
  const norm = (s) => (s ?? '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  return db.groups.filter((g) => g.membres.includes(userId) && (
    [g.destination, g.nom].some((texte) => norm(texte).includes(norm(ville))) ||
    (pays && norm(g.destination) === norm(pays))
  ))
}

// Texte du message envoyé au groupe par « Proposer à mon groupe ».
export function texteOffre(offre, partenaire) {
  return `Bon plan partenaire à ${partenaire.ville} : ${partenaire.nom}, « ${offre.titre} », ${formatReduction(offre.reductionPct)} ${conditionGroupe(offre.minVoyageurs)}, jusqu’au ${formatJour(offre.fin)}. Ça vous tente ?`
}
