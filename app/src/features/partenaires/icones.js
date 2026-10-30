// Une icône par catégorie, pour les illustrations des cartes (pas de photo : sobriété, RSE-05).
import { BedDouble, Bike, Compass, Flower2, Landmark, Music, Trees, Utensils } from 'lucide-react'

export const ICONES_ACTIVITE = {
  culture: Landmark,
  'plein-air': Trees,
  food: Utensils,
  nuit: Music,
  'bien-etre': Flower2,
}

export const ICONES_PARTENAIRE = {
  hebergement: BedDouble,
  restaurant: Utensils,
  musee: Landmark,
  activite: Compass,
  location: Bike,
}
