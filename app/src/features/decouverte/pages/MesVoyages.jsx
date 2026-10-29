// US-02 — mes voyages déclarés, en carnets de route, avec accès aux voyageurs de chaque ville.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Luggage, Plus, Trash2, Users } from 'lucide-react'
import { useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { Button, EmptyState, EntetePage, Timeline, useToast } from '../../../shared/ui/index.js'
import { formatPeriode } from '../dates.js'
import { itinerairesCommuns, presentsDansLaVille } from '../matching.js'
import { supprimerVoyage } from '../voyages.js'

const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`

function Carnet({ voyage, db, userId }) {
  const [confirmer, setConfirmer] = useState(false)
  const toast = useToast()
  const etapes = [...voyage.etapes].sort((a, b) => a.debut.localeCompare(b.debut))
  const compagnons = itinerairesCommuns(db, voyage).length
  const periode = { debut: etapes[0].debut, fin: etapes.at(-1).fin }

  const supprimer = () => {
    supprimerVoyage(voyage.id)
    toast(`Voyage « ${voyage.destination} » supprimé.`)
  }

  return (
    <li className="carnet">
      <article className="carnet__carte" aria-labelledby={`carnet-${voyage.id}`}>
        <div className="carnet__tete">
          <div>
            <h2 id={`carnet-${voyage.id}`} className="carnet__titre">{voyage.destination}</h2>
            <p className="carnet__meta">{formatPeriode(periode)} · {pluriel(etapes.length, 'étape')}</p>
          </div>
          {!confirmer && (
            <button type="button" className="carnet__supprimer" onClick={() => setConfirmer(true)}>
              <Trash2 size={18} aria-hidden="true" /><span className="sr-only">Supprimer le voyage {voyage.destination}</span>
            </button>
          )}
        </div>

        {confirmer && (
          <div className="carnet__confirmer" role="alert">
            <p>Supprimer ce voyage ? Il disparaîtra des listes des autres voyageurs.</p>
            <div className="carnet__confirmer-actions">
              <Button variant="fantome" taille="petit" onClick={() => setConfirmer(false)}>Annuler</Button>
              <Button taille="petit" icon={Trash2} onClick={supprimer} className="carnet__btn-danger">Supprimer</Button>
            </div>
          </div>
        )}

        <Timeline
          items={etapes.map((e) => {
            const n = presentsDansLaVille(db, userId, e.ville).length
            return {
              key: `${e.ville}-${e.debut}`,
              titre: e.ville,
              sousTitre: formatPeriode(e),
              extra: (
                <Link to={paths.destination(e.ville)} className="carnet__qui">
                  <Users size={15} aria-hidden="true" />
                  Qui est à {e.ville} ?
                  <span className="carnet__nb">{n ? pluriel(n, 'voyageur') : 'personne encore'}</span>
                </Link>
              ),
            }
          })}
        />

        <Link to={paths.compagnons} className="carnet__compagnons">
          <span><strong>{compagnons}</strong> {compagnons > 1 ? 'compagnons possibles' : 'compagnon possible'} sur ce trajet</span>
          <span className="carnet__compagnons-action">Voir les itinéraires communs <ArrowRight size={16} aria-hidden="true" /></span>
        </Link>
      </article>
    </li>
  )
}

export default function MesVoyages() {
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const mesVoyages = db.trips.filter((t) => t.userId === user?.id)

  return (
    <section className="mes-voyages">
      <EntetePage
        surtitre="Carnets de route"
        titre="Mes voyages"
        actions={<Button to={paths.nouveauVoyage} icon={Plus}>Déclarer un voyage</Button>}
      >
        <p>Vos étapes, et qui sera sur place en même temps que vous.</p>
      </EntetePage>

      {mesVoyages.length === 0 ? (
        <EmptyState
          icon={Luggage}
          titre="Aucun voyage déclaré pour l'instant."
          action={<Button to={paths.nouveauVoyage}>Déclarer mon premier voyage</Button>}
        >
          <p>Un week-end se déclare en moins d'une minute.</p>
        </EmptyState>
      ) : (
        <ul className="carnets">
          {mesVoyages.map((t) => <Carnet key={t.id} voyage={t} db={db} userId={user.id} />)}
        </ul>
      )}
    </section>
  )
}
