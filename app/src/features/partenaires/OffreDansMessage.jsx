// Offre partenaire proposée dans une conversation de groupe : rappel compact, badge et lien vers l'offre.
import { Link } from 'react-router-dom'
import { Tag } from 'lucide-react'
import { useDb } from '../../shared/db.js'
import { paths } from '../../shared/paths.js'
import { conditionGroupe, formatReduction, offreEnCours } from './partenaires.js'
import './partenaires.css'

export default function OffreDansMessage({ offreId }) {
  const offre = useDb((db) => (db.offres ?? []).find((o) => o.id === offreId))
  const partenaire = useDb((db) => (db.partenaires ?? []).find((p) => p.id === offre?.partenaireId))
  if (!offre || !partenaire) return null
  const enCours = offreEnCours(offre, partenaire)
  return (
    <div className="offre-message">
      <Tag size={16} aria-hidden="true" />
      <span className="offre-message__texte">
        <span className="offre-message__badge">Partenaire</span>{' '}
        <strong>{formatReduction(offre.reductionPct)}</strong> {partenaire.nom}, {conditionGroupe(offre.minVoyageurs)}
      </span>
      {enCours
        ? <Link to={paths.destinationOnglet(partenaire.ville, 'bons-plans', offre.id)}>Voir l’offre</Link>
        : <span className="offre-message__fin">Offre plus disponible</span>}
    </div>
  )
}
