// US-05 — les voyageurs dont l'itinéraire croise le mien, avant le départ.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { itinerairesCommuns } from '../matching.js'
import VoyageurCarte from '../VoyageurCarte.jsx'
import Filtres from '../Filtres.jsx'
import { appliquerFiltres, FILTRES_VIDES } from '../filtres.js'

export default function Compagnons() {
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const [filtres, setFiltres] = useState(FILTRES_VIDES)
  const mesVoyages = db.trips.filter((t) => t.userId === user?.id)
  const langues = [...new Set(db.users.flatMap((u) => u.langues))].sort()

  if (mesVoyages.length === 0) {
    return (
      <section>
        <h1>Itinéraires communs</h1>
        <p className="vide">Déclarez un voyage pour voir qui fait le même trajet que vous.</p>
        <Link to={paths.nouveauVoyage} className="btn">Déclarer un voyage</Link>
      </section>
    )
  }

  const parVoyage = mesVoyages.map((voyage) => {
    const tous = itinerairesCommuns(db, voyage)
    return { voyage, tous, visibles: appliquerFiltres(tous, filtres) }
  })
  const total = parVoyage.reduce((s, v) => s + v.visibles.length, 0)

  return (
    <section>
      <h1>Itinéraires communs</h1>
      <Filtres filtres={filtres} setFiltres={setFiltres} langues={langues} total={total} />
      {parVoyage.map(({ voyage, tous, visibles }) => {
        return (
          <div key={voyage.id}>
            <h2>{voyage.destination}</h2>
            {tous.length === 0 && (
              <p className="vide">
                Aucun itinéraire commun pour l'instant.{' '}
                <Link to={paths.destination(voyage.etapes[0].ville)}>Voir qui sera à {voyage.etapes[0].ville}</Link>
              </p>
            )}
            {tous.length > 0 && visibles.length === 0 && <p className="vide">Aucun voyageur ne correspond à ces filtres.</p>}
            <ul className="liste">
              {visibles.map((r) => (
                <VoyageurCarte
                  key={r.user.id}
                  resultat={r}
                  resume={`${r.nbEtapes} étape${r.nbEtapes > 1 ? 's' : ''} sur ${voyage.etapes.length} en commun`}
                />
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
