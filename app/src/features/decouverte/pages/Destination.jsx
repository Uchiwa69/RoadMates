// US-04 — les voyageurs présents dans la même ville que moi, aux mêmes dates.
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CalendarDays, Globe2, MapPin, Users } from 'lucide-react'
import { useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { Button, EmptyState, EntetePage } from '../../../shared/ui/index.js'
import { presentsDansLaVille, presentsDansLePays } from '../matching.js'
import { formatPeriode } from '../dates.js'
import VoyageurCarte from '../VoyageurCarte.jsx'

export default function Destination() {
  const { ville } = useParams()
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const [elargi, setElargi] = useState(false)

  const mesEtapes = db.trips.filter((t) => t.userId === user?.id).flatMap((t) => t.etapes).filter((e) => e.ville === ville)
  if (mesEtapes.length === 0) {
    return (
      <section>
        <EntetePage surtitre="Sur place" titre={`Voyageurs à ${ville}`} />
        <EmptyState
          icon={MapPin}
          titre={`Vous n'avez pas de voyage déclaré à ${ville}.`}
          action={<Button to={paths.nouveauVoyageVers(ville)}>Déclarer un voyage à {ville}</Button>}
        >
          <p>Déclarez vos dates pour voir qui sera là en même temps que vous.</p>
        </EmptyState>
      </section>
    )
  }

  const dansLaVille = presentsDansLaVille(db, user.id, ville)
  const dansLePays = elargi ? presentsDansLePays(db, user.id, ville) : []
  const pays = db.trips.flatMap((t) => t.etapes).find((e) => e.ville === ville)?.pays
  const n = dansLaVille.length

  return (
    <section className="destination">
      <EntetePage surtitre="Sur place" titre={`Voyageurs à ${ville}`}>
        <p>Présents au moins 1 jour pendant vos dates à {ville}.</p>
      </EntetePage>

      <div className="destination__resume">
        <p><CalendarDays size={18} aria-hidden="true" /> Vous y êtes : <strong>{mesEtapes.map(formatPeriode).join(', ')}</strong></p>
        <p aria-live="polite"><Users size={18} aria-hidden="true" /> <strong>{n}</strong> voyageur{n > 1 ? 's' : ''} en même temps que vous</p>
      </div>

      {n === 0 && (
        <EmptyState
          icon={Users}
          titre={`Personne pour l'instant à ${ville} sur ces dates.`}
          action={!elargi && pays && (
            <Button variant="secondaire" icon={Globe2} onClick={() => setElargi(true)}>Élargir à tout le pays ({pays})</Button>
          )}
        >
          <p>De nouveaux voyageurs déclarent leurs dates chaque jour.</p>
        </EmptyState>
      )}

      <ul className="ui-grille">
        {dansLaVille.map((r, i) => (
          <VoyageurCarte key={r.user.id} rang={i} resultat={r} resume={`${r.jours} jour${r.jours > 1 ? 's' : ''} en commun à ${ville}`} />
        ))}
      </ul>

      {elargi && (
        <section className="destination__pays" aria-labelledby="ailleurs">
          <h2 id="ailleurs">Ailleurs dans le pays ({pays}) pendant vos dates</h2>
          {dansLePays.length === 0
            ? <EmptyState icon={Globe2} titre="Personne non plus dans le reste du pays." />
            : (
              <ul className="ui-grille">
                {dansLePays.map((r, i) => <VoyageurCarte key={r.user.id} rang={i} resultat={r} />)}
              </ul>
            )}
        </section>
      )}
    </section>
  )
}
