// Carte d'un voyageur trouvé. Le profil complet appartient à la partie B : on n'y accède que par l'URL.
import { Link } from 'react-router-dom'
import { m } from 'motion/react'
import { ArrowRight, BadgeCheck, CalendarDays, Languages } from 'lucide-react'
import { paths } from '../../shared/paths.js'
import { Avatar, Badge, MatchRing } from '../../shared/ui/index.js'
import { formatPeriode } from './dates.js'

// score : { valeur, total } pour l'anneau « 2 étapes sur 2 » ; resume : la phrase qui l'accompagne.
export default function VoyageurCarte({ resultat, resume, score, rang = 0 }) {
  const { user, communes } = resultat
  const compatibilite = score ?? (resultat.compatibilite == null ? null : { valeur: resultat.compatibilite, total: 100 })
  return (
    <m.li
      className="voyageur"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(rang, 8) * 0.06, ease: [0.22, 0.8, 0.36, 1] }}
    >
      <article className="voyageur__carte">
        <div className="voyageur__tete">
          {user.photoUrl
            ? <img className="voyageur__photo" src={user.photoUrl} alt={`Photo de ${user.prenom}`} referrerPolicy="no-referrer" />
            : <Avatar user={user} taille={56} />}
          <div className="voyageur__identite">
            <h3 className="voyageur__nom">{user.prenom}, {user.age} ans</h3>
            {user.verifie
              ? <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>
              : <Badge ton="neutre">Identité non vérifiée</Badge>}
          </div>
          {compatibilite && <MatchRing valeur={compatibilite.valeur} total={compatibilite.total} />}
        </div>

        {resume && <p className="voyageur__commun">{resume}{compatibilite && !score ? ` · ${compatibilite.valeur}% de compatibilité` : ''}</p>}

        <ul className="voyageur__communes" aria-label="Dates en commun">
          {communes.map((c) => (
            <li key={`${c.ville}-${c.periode.debut}`}>
              <CalendarDays size={16} aria-hidden="true" />
              <span><strong>{c.ville}</strong> · {formatPeriode(c.periode)}</span>
              <span className="voyageur__jours">{c.jours} j</span>
            </li>
          ))}
        </ul>

        <p className="voyageur__langues">
          <Languages size={16} aria-hidden="true" />
          <span>Parle {user.langues.join(', ')}</span>
        </p>

        <Link to={paths.profil(user.id)} className="voyageur__lien">
          Voir le profil<span className="sr-only"> de {user.prenom}</span>
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </article>
    </m.li>
  )
}
