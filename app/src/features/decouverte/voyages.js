// Écriture et validation des voyages (US-02, US-03). La partie A est seule à écrire dans trips.
import { updateDb, newId } from '../../shared/db.js'
import { aujourdhui, joursCommuns } from './dates.js'
import { trouverVille } from './villes.js'

export const MAX_ETAPES = 10

// Retourne { erreurs, etapes } : erreurs indexées par numéro d'étape, 'destination' ou 'general'.
export function validerVoyage({ destination, etapes }) {
  const erreurs = {}
  if (!destination.trim()) erreurs.destination = 'Donnez un nom à votre voyage (ex. Algarve).'
  if (etapes.length === 0) erreurs.general = 'Ajoutez au moins une étape.'
  if (etapes.length > MAX_ETAPES) erreurs.general = `${MAX_ETAPES} étapes au maximum.`

  const today = aujourdhui()
  const propres = etapes.map((e, i) => {
    const ville = trouverVille(e.ville)
    if (!e.ville.trim()) erreurs[i] = 'Choisissez une ville.'
    else if (!ville) erreurs[i] = 'Aucune ville trouvée.'
    else if (!e.debut || !e.fin) erreurs[i] = 'Indiquez les dates de début et de fin.'
    else if (e.fin < e.debut) erreurs[i] = 'La date de fin est antérieure à la date de début.'
    else if (e.debut < today) erreurs[i] = 'La date de début est passée.'
    return { index: i, ville: ville?.ville ?? e.ville, pays: ville?.pays ?? '', debut: e.debut, fin: e.fin }
  })

  // Les étapes s'affichent dans l'ordre chronologique, quel que soit l'ordre de saisie.
  const triees = [...propres].sort((a, b) => a.debut.localeCompare(b.debut))
  for (let k = 1; k < triees.length; k++) {
    const [prec, cour] = [triees[k - 1], triees[k]]
    if (prec.debut && cour.debut && !erreurs[cour.index] && joursCommuns(prec, cour) > 0) {
      erreurs[cour.index] = `Cette étape chevauche l'étape à ${prec.ville}.`
    }
  }

  return { erreurs, etapes: triees.map(({ index: _index, ...e }) => e) }
}

export function creerVoyage(userId, destination, etapes) {
  const voyage = { id: newId('t'), userId, destination: destination.trim(), etapes }
  updateDb((db) => {
    db.trips.push(voyage)
  })
  return voyage
}

export function supprimerVoyage(tripId) {
  updateDb((db) => {
    db.trips = db.trips.filter((t) => t.id !== tripId)
  })
}
