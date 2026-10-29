// US-10 — la page d'un groupe : conversation en bulles et dépenses partagées.
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, MapPin, MessagesSquare, SendHorizontal, Wallet } from 'lucide-react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { Avatar, AvatarStack, Button, EmptyState } from '../../shared/ui/index.js'
import { formatMoment } from './format.js'
import Expenses from './Expenses.jsx'

function Conversation({ groupId, currentUser, users }) {
  const messages = useDb((db) => db.messages.filter((message) => message.groupId === groupId))
  const [texte, setTexte] = useState('')
  const [error, setError] = useState('')
  const fil = useRef(null)

  // Le fil défile jusqu'au dernier message à chaque nouveau message.
  useEffect(() => {
    if (fil.current) fil.current.scrollTop = fil.current.scrollHeight
  }, [messages.length])

  function sendMessage(event) {
    event?.preventDefault()
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

  // Entrée envoie, Maj + Entrée passe à la ligne.
  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <section className="conversation" aria-labelledby="conversation-titre">
      <h2 id="conversation-titre" className="conversation__titre"><MessagesSquare size={20} aria-hidden="true" /> Conversation</h2>
      <div ref={fil} className="conversation__fil" role="log" aria-live="polite" aria-label="Messages du groupe" tabIndex={0}>
        {messages.length === 0 ? <p className="conversation__vide">Aucun message pour le moment. Lancez la discussion !</p> : (
          messages.map((message, i) => {
            const author = users.find((user) => user.id === message.auteurId)
            const moi = message.auteurId === currentUser?.id
            const suite = messages[i - 1]?.auteurId === message.auteurId
            return (
              <article key={message.id} className={`bulle${moi ? ' bulle--moi' : ''}${suite ? ' bulle--suite' : ''}`}>
                {!moi && (suite ? <span className="bulle__place" aria-hidden="true" /> : <Avatar user={author} taille={32} />)}
                <div className="bulle__corps">
                  {!suite && (
                    <p className="bulle__auteur">
                      {moi ? 'Vous' : author?.prenom ?? 'Voyageur inconnu'}
                      {message.envoyeLe && <span className="bulle__heure"> · {formatMoment(message.envoyeLe)}</span>}
                    </p>
                  )}
                  <p className="bulle__texte">{message.texte}</p>
                </div>
              </article>
            )
          })
        )}
      </div>
      <form className="conversation__saisie" onSubmit={sendMessage} noValidate>
        <label htmlFor="message-groupe" className="sr-only">Votre message</label>
        <textarea
          id="message-groupe"
          className="ui-input conversation__champ"
          value={texte}
          rows={1}
          placeholder="Écrire au groupe…"
          aria-invalid={!!error || undefined}
          aria-describedby={error ? 'message-erreur' : undefined}
          onKeyDown={onKeyDown}
          onChange={(event) => { setTexte(event.target.value); setError('') }}
        />
        <button className="conversation__envoyer" type="submit" aria-label="Envoyer">
          <SendHorizontal size={20} aria-hidden="true" />
        </button>
        {error && <p id="message-erreur" className="ui-field__erreur conversation__erreur" role="alert">{error}</p>}
      </form>
    </section>
  )
}

export default function GroupPage() {
  const { groupId } = useParams()
  const currentUser = useCurrentUser()
  const group = useDb((db) => db.groups.find((candidate) => candidate.id === groupId) ?? null)
  const users = useDb((db) => db.users)
  const nbDepenses = useDb((db) => db.expenses.filter((e) => e.groupId === groupId).length)
  const isMember = group?.membres.includes(currentUser?.id) ?? false

  if (!group) {
    return <EmptyState icon={MessagesSquare} titre="Groupe introuvable" action={<Button to={paths.groupes}>Retour à mes groupes</Button>} />
  }
  if (!isMember) {
    return (
      <EmptyState icon={Lock} titre="Accès refusé" action={<Button to={paths.groupes}>Retour à mes groupes</Button>}>
        <p>Ce groupe ne fait pas partie de vos groupes.</p>
      </EmptyState>
    )
  }

  const membres = group.membres.map((id) => users.find((u) => u.id === id)).filter(Boolean)
  const allerA = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section className="groupe">
      <Link to={paths.groupes} className="ui-retour"><ArrowLeft size={18} aria-hidden="true" /> Mes groupes</Link>
      <header className="groupe__tete">
        <div className="groupe__titres">
          <h1 className="groupe__nom">{group.nom}</h1>
          <p className="groupe__destination"><MapPin size={16} aria-hidden="true" /> {group.destination}</p>
        </div>
        <div className="groupe__membres">
          <AvatarStack users={membres} max={5} taille={36} />
          <p>
            <span className="sr-only">Membres ({membres.length}) : </span>
            {membres.map((m) => (m.id === currentUser?.id ? `${m.prenom} (vous)` : m.prenom)).join(', ')}
          </p>
        </div>
      </header>

      <nav className="groupe__raccourcis" aria-label="Sections du groupe">
        <button type="button" onClick={() => allerA('conversation-titre')}><MessagesSquare size={16} aria-hidden="true" /> Discussion</button>
        <button type="button" onClick={() => allerA('depenses-titre')}><Wallet size={16} aria-hidden="true" /> Dépenses ({nbDepenses})</button>
      </nav>

      <div className="groupe__grille">
        <Conversation groupId={groupId} currentUser={currentUser} users={users} />
        <Expenses group={group} />
      </div>
    </section>
  )
}
