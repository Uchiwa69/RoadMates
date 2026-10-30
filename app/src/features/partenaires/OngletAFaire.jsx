// Onglet « À faire » du guide de ville : lieux et activités, filtrables par catégorie.
// Contenu éditorial, sans badge : rien ici n'est sponsorisé.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, MapPin, Users } from 'lucide-react'
import { paths } from '../../shared/paths.js'
import { Chip, EmptyState } from '../../shared/ui/index.js'
import { CATEGORIES_ACTIVITE, activitesDe } from './activites.js'
import { ICONES_ACTIVITE } from './icones.js'

const PRIX = { gratuit: 'Gratuit', '€': '€', '€€': '€€', '€€€': '€€€' }

export default function OngletAFaire({ ville, carte, voyageurs }) {
  const activites = activitesDe(ville)
  const [categorie, setCategorie] = useState('')
  const categories = [...new Set(activites.map((x) => x.categorie))]
  const visibles = activites.filter((x) => !categorie || x.categorie === categorie || x.id === carte)

  // Arrivée depuis la recherche : la carte choisie est mise en évidence et reçoit le focus.
  useEffect(() => {
    if (!carte) return
    const minuteur = setTimeout(() => {
      const el = document.getElementById(`carte-${carte}`)
      el?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      el?.focus({ preventScroll: true })
    }, 400)
    return () => clearTimeout(minuteur)
  }, [carte])

  if (activites.length === 0) {
    return (
      <EmptyState icon={Compass} titre={`Pas encore d’activité référencée à ${ville}.`}>
        <p>Le guide s’enrichit ville après ville.</p>
      </EmptyState>
    )
  }

  return (
    <div className="guide">
      <h2 className="sr-only">Activités à {ville}</h2>
      <div className="guide__puces" role="group" aria-label="Filtrer par catégorie">
        <Chip actif={categorie === ''} onClick={() => setCategorie('')}>Tout</Chip>
        {categories.map((c) => {
          const Icone = ICONES_ACTIVITE[c]
          return <Chip key={c} actif={categorie === c} icon={Icone} onClick={() => setCategorie(categorie === c ? '' : c)}>{CATEGORIES_ACTIVITE[c]}</Chip>
        })}
      </div>
      <ul className="ui-grille guide__grille" aria-label={`Activités à ${ville}`}>
        {visibles.map((x) => {
          const Icone = ICONES_ACTIVITE[x.categorie]
          return (
            <li key={x.id}>
              <article id={`carte-${x.id}`} tabIndex={-1} className={`activite${x.id === carte ? ' activite--evidence' : ''}`} aria-labelledby={`titre-${x.id}`}>
                <div className={`activite__illustration activite__illustration--${x.categorie}`} aria-hidden="true">
                  <Icone size={30} />
                </div>
                <div className="activite__corps">
                  <p className="activite__meta">
                    <span>{CATEGORIES_ACTIVITE[x.categorie]}</span>
                    <span aria-hidden="true">·</span>
                    <span><MapPin size={14} aria-hidden="true" /> {x.quartier}</span>
                    <span className="activite__prix">{PRIX[x.prix]}</span>
                  </p>
                  <h3 id={`titre-${x.id}`} className="activite__titre">{x.titre}</h3>
                  <p className="activite__description">{x.description}</p>
                  <p className="activite__plusieurs"><strong>Mieux à plusieurs :</strong> {x.aPlusieurs}</p>
                  {voyageurs != null && voyageurs > 0 && (
                    <Link to={paths.destinationOnglet(ville, 'voyageurs')} className="activite__voyageurs">
                      <Users size={16} aria-hidden="true" />
                      {voyageurs} voyageur{voyageurs > 1 ? 's' : ''} RoadMates {voyageurs > 1 ? 'seront' : 'sera'} là pendant vos dates
                    </Link>
                  )}
                </div>
              </article>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
