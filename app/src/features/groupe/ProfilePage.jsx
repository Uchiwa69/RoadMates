import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'

export default function ProfilePage() {
  const { userId } = useParams()
  const user = useDb((db) => db.users.find((candidate) => candidate.id === userId) ?? null)
  const trips = useDb((db) => db.trips.filter((trip) => trip.userId === userId))
  const requests = useDb((db) => db.requests)
  const currentUser = useCurrentUser()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!user) {
    return <section className="groupe-page"><h1>Profil introuvable</h1><p>Ce voyageur n’existe pas.</p></section>
  }

  const connected = requests.some((request) =>
    request.statut === 'acceptee' &&
    ((request.fromId === currentUser?.id && request.toId === user.id) ||
      (request.fromId === user.id && request.toId === currentUser?.id)),
  )
  const outgoing = requests.some((request) =>
    request.fromId === currentUser?.id && request.toId === user.id && request.statut === 'en_attente',
  )
  const incoming = requests.some((request) =>
    request.fromId === user.id && request.toId === currentUser?.id && request.statut === 'en_attente',
  )

  function sendRequest(event) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      setError('Ajoutez un message de présentation avant d’envoyer la demande.')
      return
    }
    if (trimmedMessage.length > 300) {
      setError('Le message ne peut pas dépasser 300 caractères.')
      return
    }
    if (!currentUser || currentUser.id === user.id || connected || outgoing || incoming) return

    updateDb((db) => {
      db.requests.push({
        id: newId('r'),
        fromId: currentUser.id,
        toId: user.id,
        message: trimmedMessage,
        statut: 'en_attente',
        creeLe: new Date().toISOString(),
      })
    })
    setMessage('')
    setError('')
  }

  return (
    <section className="groupe-page">
      <Link to={paths.compagnons}>← Retour aux compagnons</Link>
      <h1>{user.prenom}</h1>
      <div className="carte profil-carte">
        <p><strong>Âge :</strong> {user.age} ans</p>
        <p><strong>Langues :</strong> {user.langues?.length ? user.langues.join(', ') : 'Non renseignées'}</p>
        <p><strong>Bio :</strong> {user.bio || 'Aucune présentation.'}</p>
        {user.verifie && <p><span className="badge">Vérifié</span></p>}
      </div>

      <h2>Étapes de voyage</h2>
      {trips.length === 0 ? <p className="vide">Aucun voyage déclaré pour le moment.</p> : (
        <div className="groupe-liste">
          {trips.map((trip) => (
            <article className="carte" key={trip.id}>
              <h3>{trip.destination}</h3>
              {trip.etapes?.length ? (
                <ol>
                  {trip.etapes.map((etape, index) => (
                    <li key={`${trip.id}-${etape.ville}-${index}`}>
                      {etape.ville}{etape.pays ? `, ${etape.pays}` : ''} — {etape.debut} au {etape.fin}
                    </li>
                  ))}
                </ol>
              ) : <p>{trip.destination}</p>}
            </article>
          ))}
        </div>
      )}

      <h2>Contact</h2>
      {connected ? <p className="badge">En contact</p>
        : outgoing ? <p className="badge">Demande envoyée</p>
          : incoming ? <p>Cette personne vous a écrit. <Link to={paths.demandes}>Voir la demande</Link></p>
            : currentUser?.id === user.id ? <p className="vide">C’est votre profil.</p>
              : (
                <form className="groupe-formulaire" onSubmit={sendRequest}>
                  <label htmlFor="message-contact">Message de présentation (300 caractères maximum)</label>
                  <textarea
                    id="message-contact"
                    value={message}
                    maxLength={300}
                    rows={4}
                    onChange={(event) => { setMessage(event.target.value); setError('') }}
                    aria-describedby="compteur-message erreur-contact"
                  />
                  <p id="compteur-message" className="groupe-aide">{message.length}/300 caractères</p>
                  {error && <p id="erreur-contact" className="erreur" role="alert">{error}</p>}
                  <button className="btn" type="submit">Demander le contact</button>
                </form>
              )}
    </section>
  )
}
