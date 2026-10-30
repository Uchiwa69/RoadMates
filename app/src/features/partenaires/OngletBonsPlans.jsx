// Onglet « Bons plans » du guide de ville (US-18) : offres de groupe des partenaires validés.
// Badge « Partenaire » et réduction bien visibles : jamais confondus avec les profils ni avec « À faire ».
import { useEffect } from 'react'
import { Info, Store, Users } from 'lucide-react'
import { useDb } from '../../shared/db.js'
import { Badge, EmptyState } from '../../shared/ui/index.js'
import { formatJour } from '../groupe/format.js'
import { CATEGORIES_PARTENAIRE, conditionGroupe, formatReduction, offresDeLaVille } from './partenaires.js'
import { ICONES_PARTENAIRE } from './icones.js'
import ProposerAuGroupe from './ProposerAuGroupe.jsx'

export function CarteOffre({ offre, partenaire, evidence = false, apercu = false, ville, pays }) {
  const Icone = ICONES_PARTENAIRE[partenaire.categorie] ?? Store
  return (
    <article id={`carte-${offre.id}`} tabIndex={-1} className={`offre${evidence ? ' offre--evidence' : ''}`} aria-labelledby={`titre-${offre.id}`}>
      <div className="offre__tete">
        <span className="offre__icone" aria-hidden="true"><Icone size={22} /></span>
        <div className="offre__qui">
          <Badge ton="violet" className="offre__badge">Partenaire</Badge>
          <p className="offre__nom">{partenaire.nom}</p>
          <p className="offre__categorie">{CATEGORIES_PARTENAIRE[partenaire.categorie]}</p>
        </div>
        <p className="offre__reduction" aria-label={`Réduction de ${offre.reductionPct} %`}>{formatReduction(offre.reductionPct)}</p>
      </div>
      <h3 id={`titre-${offre.id}`} className="offre__titre">{offre.titre}</h3>
      {offre.description && <p className="offre__description">{offre.description}</p>}
      <p className="offre__conditions">
        <span><Users size={16} aria-hidden="true" /> {conditionGroupe(offre.minVoyageurs)}</span>
        <span>Jusqu’au {formatJour(offre.fin)} {offre.fin.slice(0, 4)}</span>
      </p>
      {!apercu && <ProposerAuGroupe offre={offre} partenaire={partenaire} ville={ville} pays={pays} />}
    </article>
  )
}

export default function OngletBonsPlans({ ville, pays, carte }) {
  const offres = useDb((db) => offresDeLaVille(db, ville))

  useEffect(() => {
    if (!carte) return
    const minuteur = setTimeout(() => {
      const el = document.getElementById(`carte-${carte}`)
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      el?.focus({ preventScroll: true })
    }, 400)
    return () => clearTimeout(minuteur)
  }, [carte])

  if (offres.length === 0) {
    return (
      <EmptyState icon={Store} titre={`Pas encore d’offre partenaire à ${ville}`}>
        <p>Les auberges, loueurs et restaurants partenaires publient ici leurs réductions pour les groupes RoadMates.</p>
      </EmptyState>
    )
  }

  return (
    <div className="guide">
      <h2 className="sr-only">Bons plans à {ville}</h2>
      <p className="guide__note"><Info size={16} aria-hidden="true" /> Réductions réservées aux groupes RoadMates. Partenaires fictifs — données de démonstration.</p>
      <ul className="ui-grille guide__grille" aria-label={`Bons plans à ${ville}`}>
        {offres.map(({ offre, partenaire }) => (
          <li key={offre.id}>
            <CarteOffre offre={offre} partenaire={partenaire} evidence={offre.id === carte} ville={ville} pays={pays} />
          </li>
        ))}
      </ul>
    </div>
  )
}
