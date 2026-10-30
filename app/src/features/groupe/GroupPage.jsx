// US-10 — la page d'un groupe : conversation en bulles et dépenses partagées.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, LogOut, MapPin, MessagesSquare, SendHorizontal, Wallet } from 'lucide-react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { chiffrerMessage, dechiffrerMessage } from '../../shared/chiffrement.js'
import OffreDansMessage from '../partenaires/OffreDansMessage.jsx'
import { profilMasque } from '../../shared/confidentialite.js'
import { paths } from '../../shared/paths.js'
import { Avatar, AvatarStack, Button, EmptyState, useToast } from '../../shared/ui/index.js'
import { formatMoment } from './format.js'
import Expenses from './Expenses.jsx'
import ActionsSecurite from '../securite/ActionsSecurite.jsx'
import { estBloque } from '../securite/securite.js'

function Conversation({ groupId, groupMembers, currentUser, users }) {
  const allMessages = useDb((db) => db.messages)
  const signalements = useDb((db) => db.signalements ?? [])
  const blocages = useDb((db) => db.blocages ?? [])
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
    if (users.some((other) => other.id !== currentUser?.id && estBloque({ blocages }, currentUser?.id, other.id) && groupMembers.includes(other.id))) {
      setError('L’envoi de messages est désactivé car un blocage est actif dans ce groupe.')
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
      <p className="conversation__chiffrement"><Lock size={15} aria-hidden="true" /> Messages chiffrés localement pour cette démonstration</p>
      <div ref={fil} className="conversation__fil" role="log" aria-live="polite" aria-label="Messages du groupe" tabIndex={0}>
        {messages.length === 0 ? <p className="conversation__vide">Aucun message pour le moment. Lancez la discussion !</p> : (
          messages.map((message, i) => {
            const author = users.find((user) => user.id === message.auteurId)
            const auteurMasque = profilMasque(author)
            const auteurAffiche = auteurMasque ? { ...author, prenom: 'Voyageur anonyme' } : author
            const moi = message.auteurId === currentUser?.id
            const masqueApresSignalement = !moi && signalements.some((signalement) =>
              signalement.auteurId === currentUser?.id && signalement.cibleId === message.auteurId && (!signalement.groupId || signalement.groupId === groupId),
            )
            if (masqueApresSignalement) {
              return <p key={message.id} className="conversation__systeme">Message masqué après votre signalement.</p>
            }
            if (message.systeme) {
              const auteurSysteme = users.find((user) => user.id === message.auteurId)
              const texteSysteme = textesDechiffres[message.id] ?? (message.chiffre ? 'Déchiffrement…' : message.texte)
              const texteAffiche = profilMasque(auteurSysteme) && texteSysteme?.includes('a quitté le groupe')
                ? 'Un voyageur anonyme a quitté le groupe.'
                : texteSysteme
              return <p key={message.id} className="conversation__systeme">{texteAffiche}</p>
            }
            const suite = !messages[i - 1]?.systeme && messages[i - 1]?.auteurId === message.auteurId
            return (
              <article key={message.id} className={`bulle${moi ? ' bulle--moi' : ''}${suite ? ' bulle--suite' : ''}`}>
                {!moi && (suite ? <span className="bulle__place" aria-hidden="true" /> : <Avatar user={auteurAffiche} taille={32} />)}
                <div className="bulle__corps">
                  {!suite && (
                    <p className="bulle__auteur">
                      {moi ? 'Vous' : auteurAffiche?.prenom ?? 'Voyageur inconnu'}
                      {message.envoyeLe && <span className="bulle__heure"> · {formatMoment(message.envoyeLe)}</span>}
                    </p>
                  )}
                  <p className="bulle__texte">{textesDechiffres[message.id] ?? (message.chiffre ? 'Déchiffrement…' : message.texte)}</p>
                  {message.offreId && <OffreDansMessage offreId={message.offreId} />}
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
          disabled={users.some((other) => other.id !== currentUser?.id && estBloque({ blocages }, currentUser?.id, other.id) && groupMembers.includes(other.id))}
          className="ui-input conversation__champ"
          value={texte}
          rows={1}
          placeholder="Écrire au groupe…"
          aria-invalid={!!error || undefined}
          aria-describedby={error ? 'message-erreur' : undefined}
          onKeyDown={onKeyDown}
          onChange={(event) => { setTexte(event.target.value); setError('') }}
        />
        <button className="conversation__envoyer" type="submit" aria-label="Envoyer" disabled={users.some((other) => other.id !== currentUser?.id && estBloque({ blocages }, currentUser?.id, other.id) && groupMembers.includes(other.id))}>
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
    return <EmptyState icon={MessagesSquare} titre="Groupe introuvable" action={<Button to={paths.messagesOnglet('groupes')}>Retour à mes groupes</Button>} />
  }
  if (!isMember) {
    return (
      <EmptyState icon={Lock} titre="Accès refusé" action={<Button to={paths.messagesOnglet('groupes')}>Retour à mes groupes</Button>}>
        <p>Ce groupe ne fait pas partie de vos groupes.</p>
      </EmptyState>
    )
  }

  const membres = group.membres.map((id) => {
    const membre = users.find((user) => user.id === id)
    return membre && profilMasque(membre) ? { ...membre, prenom: 'Voyageur anonyme' } : membre
  }).filter(Boolean)
  // US-10.4 — quitter le groupe : les autres membres en sont informés dans la conversation.
  // Les parts de dépenses déjà créées restent dues (les règles de partage ne changent pas).
  async function quitter() {
    try {
      const chiffre = await chiffrerMessage(groupId, `${currentUser.prenom} a quitté le groupe.`)
      updateDb((db) => {
        const g = db.groups.find((candidate) => candidate.id === groupId)
        if (!g?.membres.includes(currentUser.id)) return
        g.membres = g.membres.filter((id) => id !== currentUser.id)
        db.messages.push({
          id: newId('m'),
          groupId,
          auteurId: currentUser.id,
          ...chiffre,
          envoyeLe: new Date().toISOString(),
          systeme: true,
        })
      })
      toast(`Vous avez quitté « ${group.nom} ».`)
      navigate(paths.messagesOnglet('groupes'))
    } catch {
      toast('Le message de départ n’a pas pu être chiffré. Vous êtes toujours dans le groupe.')
    }
  }

  const allerA = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <section className="groupe">
      <Link to={paths.messagesOnglet('groupes')} className="ui-retour"><ArrowLeft size={18} aria-hidden="true" /> Mes groupes</Link>
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

      {membres.some((member) => member.id !== currentUser?.id) && (
        <section className="securite-membres" aria-label="Actions de sécurité des membres">
          {membres.filter((member) => member.id !== currentUser?.id).map((member) => (
            <div className="securite-membres__ligne" key={member.id}>
              <span>{profilMasque(member) ? 'Voyageur anonyme' : member.prenom}</span>
              <ActionsSecurite cible={member} groupId={groupId} />
            </div>
          ))}
        </section>
      )}

      <section className="lieux-publics" aria-labelledby="lieux-publics-titre">
        <h2 id="lieux-publics-titre"><MapPin size={18} aria-hidden="true" /> Idées de premier rendez-vous</h2>
        <p>Pour une première rencontre, choisissez librement un lieu public fréquenté. Ces exemples ne sont ni vérifiés ni géolocalisés.</p>
        <ul>
          <li>Café ou salon de thé en centre-ville</li>
          <li>Hall d’un musée ou d’un lieu culturel ouvert au public</li>
          <li>Auberge partenaire ou espace commun d’un hébergement</li>
        </ul>
      </section>

      <nav className="groupe__raccourcis" aria-label="Sections du groupe">
        <button type="button" onClick={() => allerA('conversation-titre')}><MessagesSquare size={16} aria-hidden="true" /> Discussion</button>
        <button type="button" onClick={() => allerA('depenses-titre')}><Wallet size={16} aria-hidden="true" /> Dépenses ({nbDepenses})</button>
      </nav>

      <div className="groupe__grille">
        <Conversation groupId={groupId} groupMembers={group.membres} currentUser={currentUser} users={users} />
        <Expenses group={group} />
      </div>
    </section>
  )
}
