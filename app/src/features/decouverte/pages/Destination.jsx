// US-04 — les voyageurs présents dans la même ville que moi, aux mêmes dates.
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { presentsDansLaVille, presentsDansLePays } from '../matching.js'
import VoyageurCarte from '../VoyageurCarte.jsx'

export default function Destination() {
  const { ville } = useParams()
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const [elargi, setElargi] = useState(false)

  const jySuis = db.trips.some((t) => t.userId === user?.id && t.etapes.some((e) => e.ville === ville))
  if (!jySuis) {
    return (
      <section>
        <h1>Voyageurs à {ville}</h1>
        <p className="vide">Vous n'avez pas de voyage déclaré à {ville}.</p>
        <Link to={paths.nouveauVoyage} className="btn">Déclarer un voyage</Link>
      </section>
    )
  }

  const dansLaVille = presentsDansLaVille(db, user.id, ville)
  const dansLePays = elargi ? presentsDansLePays(db, user.id, ville) : []
  const pays = db.trips.flatMap((t) => t.etapes).find((e) => e.ville === ville)?.pays

  return (
    <section>
      <h1>Voyageurs à {ville}</h1>
      <p className="meta">Présents au moins 1 jour pendant vos dates à {ville}.</p>

      {dansLaVille.length === 0 && (
        <div className="vide">
          <p>Personne pour l'instant à {ville} sur ces dates.</p>
          {!elargi && pays && (
            <button type="button" className="btn btn-secondaire" onClick={() => setElargi(true)}>
              Élargir à tout le pays ({pays})
            </button>
          )}
        </div>
      )}

      <ul className="liste">
        {dansLaVille.map((r) => (
          <VoyageurCarte key={r.user.id} resultat={r} resume={`${r.jours} jour${r.jours > 1 ? 's' : ''} en commun à ${ville}`} />
        ))}
      </ul>

      {elargi && (
        <>
          <h2>Ailleurs au {pays} pendant vos dates</h2>
          {dansLePays.length === 0 && <p className="vide">Personne non plus dans le reste du pays.</p>}
          <ul className="liste">
            {dansLePays.map((r) => <VoyageurCarte key={r.user.id} resultat={r} />)}
          </ul>
        </>
      )}
    </section>
  )
}
