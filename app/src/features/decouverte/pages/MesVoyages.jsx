// US-02 — mes voyages déclarés, avec accès aux voyageurs de chaque ville.
import { Link } from 'react-router-dom'
import { useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { formatPeriode } from '../dates.js'
import { supprimerVoyage } from '../voyages.js'

export default function MesVoyages() {
  const user = useCurrentUser()
  const trips = useDb((db) => db.trips)
  const mesVoyages = trips.filter((t) => t.userId === user?.id)

  return (
    <section>
      <div className="entete-page">
        <h1>Mes voyages</h1>
        <Link to={paths.nouveauVoyage} className="btn">Déclarer un voyage</Link>
      </div>

      {mesVoyages.length === 0 && <p className="vide">Aucun voyage déclaré pour l'instant.</p>}

      <ul className="liste">
        {mesVoyages.map((t) => (
          <li key={t.id} className="carte">
            <div className="entete-page">
              <h2>{t.destination}</h2>
              <button type="button" className="btn-lien" onClick={() => supprimerVoyage(t.id)}>Supprimer</button>
            </div>
            <ol className="etapes-liste">
              {t.etapes.map((e) => (
                <li key={`${e.ville}-${e.debut}`}>
                  <strong>{e.ville}</strong> · {formatPeriode(e)} ·{' '}
                  <Link to={paths.destination(e.ville)}>Qui est à {e.ville} ?</Link>
                </li>
              ))}
            </ol>
            <Link to={paths.compagnons}>Voir les itinéraires communs</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
