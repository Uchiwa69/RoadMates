import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import Expenses from './Expenses.jsx'

function formatDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleString('fr-FR')
}

export default function GroupPage() {
  const { groupId } = useParams()
  const currentUser = useCurrentUser()
  const group = useDb((db) => db.groups.find((candidate) => candidate.id === groupId) ?? null)
  const users = useDb((db) => db.users)
  const messages = useDb((db) => db.messages.filter((message) => message.groupId === groupId))
  const [texte, setTexte] = useState('')
  const [error, setError] = useState('')
  const isMember = group?.membres.includes(currentUser?.id) ?? false

  if (!group) {
    return <section className="groupe-page"><h1>Groupe introuvable</h1><Link to={paths.groupes}>Retour à mes groupes</Link></section>
  }
  if (!isMember) {
    return <section className="groupe-page"><h1>Accès refusé</h1><p>Ce groupe ne fait pas partie de vos groupes.</p><Link to={paths.groupes}>Retour à mes groupes</Link></section>
  }

  function sendMessage(event) {
    event.preventDefault()
    const cleanText = texte.trim()
    if (!cleanText) {
      setError('Le message ne peut pas être vide.')
      return
    }
    updateDb((db) => {
      if (!db.groups.some((candidate) => candidate.id === groupId && candidate.membres.includes(currentUser?.id))) return
      db.messages.push({
        id: newId('m'),
        groupId,
        auteurId: currentUser.id,
        texte: cleanText,
        envoyeLe: new Date().toISOString(),
      })
    })
    setTexte('')
    setError('')
  }

  return (
    <section className="groupe-page">
      <Link to={paths.groupes}>← Retour à mes groupes</Link>
      <h1>{group.nom}</h1>
      <p><strong>Destination :</strong> {group.destination}</p>
      <h2>Membres ({group.membres.length})</h2>
      <ul className="groupe-membres">
        {group.membres.map((memberId) => {
          const member = users.find((user) => user.id === memberId)
          return <li key={memberId}>{member?.prenom ?? 'Voyageur inconnu'}{memberId === currentUser?.id ? ' (vous)' : ''}</li>
        })}
      </ul>

      <h2>Conversation</h2>
      {messages.length === 0 ? <p className="vide">Aucun message pour le moment.</p> : (
        <div className="groupe-messages" aria-live="polite">
          {messages.map((message) => {
            const author = users.find((user) => user.id === message.auteurId)
            return (
              <article className="carte" key={message.id}>
                <p><strong>{author?.prenom ?? 'Voyageur inconnu'}</strong>{message.envoyeLe && <span className="groupe-aide"> — {formatDate(message.envoyeLe)}</span>}</p>
                <p>{message.texte}</p>
              </article>
            )
          })}
        </div>
      )}
      <form className="groupe-formulaire" onSubmit={sendMessage}>
        <label htmlFor="message-groupe">Votre message</label>
        <textarea id="message-groupe" value={texte} rows={3} onChange={(event) => { setTexte(event.target.value); setError('') }} />
        {error && <p className="erreur" role="alert">{error}</p>}
        <button className="btn" type="submit">Envoyer</button>
      </form>
      <Expenses group={group} />
    </section>
  )
}
