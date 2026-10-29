// Accueil — la promesse de RoadMates et l'entrée dans le parcours de Léa.
import { Link } from 'react-router-dom'
import { paths } from '../../../shared/paths.js'

export default function Accueil() {
  return (
    <section className="accueil">
      <h1>Ne voyagez plus seul quand vous n'en avez pas envie.</h1>
      <p>
        Trouvez avant le départ les voyageurs qui font le même trajet que vous, rencontrez-les en confiance,
        et partagez la voiture et les activités en payant chacun sa part dans l'application.
      </p>
      <div className="actions">
        <Link to={paths.nouveauVoyage} className="btn">Déclarer mon voyage</Link>
        <Link to={paths.compagnons} className="btn btn-secondaire">Voir mes compagnons</Link>
      </div>
      <p className="meta">Pas encore de compte ? <Link to={paths.inscription}>Créer un compte</Link></p>
    </section>
  )
}
