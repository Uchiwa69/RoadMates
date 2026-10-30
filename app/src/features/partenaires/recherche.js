// Recherche dans les activités et les bons plans (champ « Où partez-vous ? » et page Destination).
// Ignore accents et majuscules (même normalisation que trouverVille) ; cherche dans le titre,
// la catégorie, le quartier, la ville et, pour les offres, le nom du partenaire.
import { Tag } from 'lucide-react'
import { normaliser } from '../../shared/texte.js'
import { aujourdhui } from '../decouverte/dates.js'
import { ACTIVITES, CATEGORIES_ACTIVITE } from './activites.js'
import { CATEGORIES_PARTENAIRE, formatReduction, offreEnCours } from './partenaires.js'
import { ICONES_ACTIVITE } from './icones.js'

const contient = (q, ...textes) => textes.some((t) => t && normaliser(t).includes(q))
const commencePar = (q, ...textes) => textes.some((t) => t && normaliser(t).startsWith(q))

export function rechercherContenus(db, saisie, today = aujourdhui(), limite = 3) {
  const q = normaliser(saisie ?? '')
  if (q.length < 2) return { activites: [], offres: [] }
  const tri = (cles) => (a, b) => Number(commencePar(q, ...cles(b))) - Number(commencePar(q, ...cles(a)))
  const activites = ACTIVITES
    .filter((x) => contient(q, x.titre, CATEGORIES_ACTIVITE[x.categorie], x.quartier, x.ville))
    .sort(tri((x) => [x.titre, x.ville]))
    .slice(0, limite)
  const offres = (db.offres ?? [])
    .map((offre) => ({ offre, partenaire: (db.partenaires ?? []).find((p) => p.id === offre.partenaireId) }))
    .filter(({ offre, partenaire }) => offreEnCours(offre, partenaire, today) &&
      contient(q, offre.titre, partenaire.nom, CATEGORIES_PARTENAIRE[partenaire.categorie], partenaire.ville))
    .sort(tri(({ offre, partenaire }) => [partenaire.nom, offre.titre, partenaire.ville]))
    .slice(0, limite)
  return { activites, offres }
}

// Les mêmes résultats, prêts pour le Combobox (groupes « Activités » et « Bons plans »).
export function suggestionsContenus(db, saisie) {
  const { activites, offres } = rechercherContenus(db, saisie)
  return [
    ...activites.map((x) => ({
      id: `a-${x.id}`, groupe: 'Activités', label: x.titre, detail: x.ville,
      icon: ICONES_ACTIVITE[x.categorie], ville: x.ville, onglet: 'a-faire', carte: x.id,
    })),
    ...offres.map(({ offre, partenaire }) => ({
      id: `o-${offre.id}`, groupe: 'Bons plans', label: `${formatReduction(offre.reductionPct)} ${partenaire.nom}`, detail: partenaire.ville,
      icon: Tag, ville: partenaire.ville, onglet: 'bons-plans', carte: offre.id,
    })),
  ]
}
