// US-10 — la page d'un groupe : conversation en bulles et dépenses partagées.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, LogOut, MapPin, MessagesSquare, SendHorizontal, Wallet } from 'lucide-react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { chiffrerMessage, dechiffrerMessage } from '../../shared/chiffrement.js'
import { profilMasque } from '../../shared/confidentialite.js'
import { paths } from '../../shared/paths.js'
import { Avatar, AvatarStack, Button, EmptyState, useToast } from '../../shared/ui/index.js'
import { formatMoment } from './format.js'
import Expenses from './Expenses.jsx'

function Conversation({ groupId, currentUser, users }) {
  const allMessages = useDb((db) => db.messages)
  const messages = useMemo(() => allMessages.filter((message) => message.groupId === groupId), [allMessages, groupId])
  const [textesDechiffres, setTextesDechiffres] = useState({})
  const [texte, setTexte] = useState('')
  const [error, setError] = useState('')
  const fil = useRef(null)

  // Les anciens messages et les messages système restent en clair ; seuls les nouveaux
  // messages utilisateur portent les champs chiffre et iv.
  useEffect(() => {
    let actif = true
    Promise.all(messages.map(async (message) => {
      if (!message.chiffre || !message.iv) return [message.id, message.texte ?? '']
      try {
        return [message.id, await dechiffrerMessage(groupId, message)]
      } catch {
        return [message.id, 'Impossible de déchiffrer ce message.']
      }
    })).then((entries) => {
      if (actif) setTextesDechiffres(Object.fromEntries(entries))
    })
    return () => { actif = false }
  }, [groupId, messages])

  // Le fil défile jusqu'au dernier message à chaque nouveau message.
  useEffect(() => {
    if (fil.current) fil.current.scrollTop = fil.current.scrollHeight
  }, [messages.length])

  async function sendMessage(event) {
    event?.preventDefault()
    const cleanText = texte.trim()
    if (!cleanText) {
      setError('Le message ne peut pas être vide.')
      return
    }
    try {
      const chiffre = await chiffrerMessage(groupId, cleanText)
      updateDb((db) => {
        if (!db.groups.some((candidate) => candidate.id === groupId && candidate.membres.includes(currentUser?.id))) return
        db.messages.push({
          id: newId('m'),
          groupId,
          auteurId: currentUser.id,
          ...chiffre,
          envoyeLe: new Date().toISOString(),
        })
      })
      setTexte('')
      setError('')
    } catch {
      setError('Le message n’a pas pu être chiffré. Vérifiez que le stockage local est disponible, puis réessayez.')
    }
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
      <p className="conversation__chiffrement"><Lock size={15} aria-hidden="true" /> Conversation chiffrée de bout en bout</p>
      <div ref={fil} className="conversation__fil" role="log" aria-live="polite" aria-label="Messages du groupe" tabIndex={0}>
        {messages.length === 0 ? <p className="conversation__vide">Aucun message pour le moment. Lancez la discussion !</p> : (
          messages.map((message, i) => {
            const author = users.find((user) => user.id === message.auteurId)
            const moi = message.auteurId === currentUser?.id
            if (message.systeme) {
              return <p key={message.id} className="conversation__systeme">{message.texte}</p>
            }
            const suite = !messages[i - 1]?.systeme && messages[i - 1]?.auteurId === message.auteurId
            return (
              <article key={message.id} className={`bulle${moi ? ' bulle--moi' : ''}${suite ? ' bulle--suite' : ''}`}>
                {!moi && (suite ? <span className="bulle__place" aria-hidden="true" /> : <Avatar user={author} taille={32} />)}
                <div className="bulle__corps">
                  {!suite && (
                    <p className="bulle__auteur">
                      {moi ? 'Vous' : profilMasque(author) ? 'Voyageur anonyme' : author?.prenom ?? 'Voyageur inconnu'}
                      {message.envoyeLe && <span className="bulle__heure"> · {formatMoment(message.envoyeLe)}</span>}
                    </p>
                  )}
                  <p className="bulle__texte">{textesDechiffres[message.id] ?? (message.chiffre ? 'Déchiffrement…' : message.texte)}</p>
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
  const navigate = useNavigate()
  const toast = useToast()
  const [confirmerDepart, setConfirmerDepart] = useState(false)

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
  // US-10.4 — quitter le groupe : les autres membres en sont informés dans la conversation.
  // Les parts de dépenses déjà créées restent dues (les règles de partage ne changent pas).
  function quitter() {
    updateDb((db) => {
      const g = db.groups.find((candidate) => candidate.id === groupId)
      if (!g?.membres.includes(currentUser.id)) return
      g.membres = g.membres.filter((id) => id !== currentUser.id)
      db.messages.push({
        id: newId('m'),
        groupId,
        auteurId: currentUser.id,
        texte: `${currentUser.prenom} a quitté le groupe.`,
        envoyeLe: new Date().toISOString(),
        systeme: true,
      })
    })
    toast(`Vous avez quitté « ${group.nom} ».`)
    navigate(paths.groupes)
  }

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
        <div className="groupe__quitter">
          {confirmerDepart ? (
            <div className="groupe__confirmer" role="alert">
              <p>Quitter le groupe ? Les autres membres en seront informés.</p>
              <div>
                <Button variant="fantome" taille="petit" onClick={() => setConfirmerDepart(false)}>Annuler</Button>
                <Button taille="petit" icon={LogOut} onClick={quitter}>Quitter</Button>
              </div>
            </div>
          ) : (
            <Button variant="fantome" taille="petit" icon={LogOut} onClick={() => setConfirmerDepart(true)}>Quitter le groupe</Button>
          )}
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
