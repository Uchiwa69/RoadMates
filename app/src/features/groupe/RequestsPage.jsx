import { Link } from 'react-router-dom'
import { useDb, updateDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('fr-FR')
}

export default function RequestsPage() {
  const currentUser = useCurrentUser()
  const requests = useDb((db) => db.requests)
  const users = useDb((db) => db.users)
  const received = requests.filter((request) => request.toId === currentUser?.id)
  const sent = requests.filter((request) => request.fromId === currentUser?.id)

  function updateStatus(requestId, status) {
    updateDb((db) => {
      const request = db.requests.find((candidate) => candidate.id === requestId)
      if (request?.toId === currentUser?.id && request.statut === 'en_attente') {
        request.statut = status
      }
    })
  }

  function person(userId) {
    return users.find((user) => user.id === userId)
  }

  return (
    <section className="groupe-page">
      <h1>Demandes de contact</h1>
      <h2>Demandes reçues</h2>
      {received.length === 0 ? <p className="vide">Vous n’avez pas de demande reçue.</p> : (
        <div className="groupe-liste">
          {received.map((request) => {
            const sender = person(request.fromId)
            return (
              <article className="carte" key={request.id}>
                <h3>{sender ? <Link to={paths.profil(sender.id)}>{sender.prenom}</Link> : 'Voyageur inconnu'}</h3>
                {request.creeLe && <p className="groupe-aide">Reçue le {formatDate(request.creeLe)}</p>}
                <p>{request.message}</p>
                {request.statut === 'en_attente' ? (
                  <div className="groupe-actions">
                    <button className="btn" type="button" onClick={() => updateStatus(request.id, 'acceptee')}>Accepter</button>
                    <button className="btn btn-secondaire" type="button" onClick={() => updateStatus(request.id, 'refusee')}>Refuser</button>
                  </div>
                ) : request.statut === 'acceptee' ? <p className="badge">Acceptée — vous êtes en contact</p>
                  : <p className="groupe-aide">Demande refusée</p>}
              </article>
            )
          })}
        </div>
      )}

      <h2>Demandes envoyées</h2>
      {sent.length === 0 ? <p className="vide">Vous n’avez pas envoyé de demande.</p> : (
        <div className="groupe-liste">
          {sent.map((request) => {
            const recipient = person(request.toId)
            return (
              <article className="carte" key={request.id}>
                <h3>{recipient ? <Link to={paths.profil(recipient.id)}>{recipient.prenom}</Link> : 'Voyageur inconnu'}</h3>
                {request.statut === 'en_attente' ? <p>En attente de réponse</p>
                  : request.statut === 'acceptee' ? <p className="badge">Acceptée — vous êtes en contact</p>
                    : <p className="erreur">Demande non acceptée</p>}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
