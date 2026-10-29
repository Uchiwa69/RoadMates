// Carte d'un voyageur trouvé. Le profil complet appartient à la partie B : on n'y accède que par l'URL.
import { Link } from 'react-router-dom'
import { paths } from '../../shared/paths.js'
import { formatPeriode } from './dates.js'

export default function VoyageurCarte({ resultat, resume }) {
  const { user, communes } = resultat
  return (
    <li className="carte voyageur">
      <div className="voyageur-tete">
        <h3>{user.prenom}, {user.age} ans</h3>
        {user.verifie && <span className="badge">✓ Identité vérifiée</span>}
      </div>
      <p className="meta">Parle {user.langues.join(', ')}</p>
      {resume && <p className="commun">{resume}</p>}
      <ul className="meta">
        {communes.map((c) => (
          <li key={`${c.ville}-${c.periode.debut}`}>{c.ville} · {formatPeriode(c.periode)} ({c.jours} j en commun)</li>
        ))}
      </ul>
      <Link to={paths.profil(user.id)} className="btn btn-secondaire">Voir le profil</Link>
    </li>
  )
}
