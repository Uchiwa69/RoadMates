// En haut des sous-pages du profil : « ‹ Mon profil » sur mobile, fil d'Ariane sur ordinateur.
import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { paths } from '../../shared/paths.js'

export default function RetourProfil({ page }) {
  return (
    <nav className="fil" aria-label="Fil d’Ariane">
      <ol>
        <li>
          <Link to={paths.monProfil} className="ui-retour fil__lien">
            <ChevronLeft size={18} aria-hidden="true" className="fil__chevron" /> Mon profil
          </Link>
        </li>
        <li className="fil__courant" aria-current="page">{page}</li>
      </ol>
    </nav>
  )
}
