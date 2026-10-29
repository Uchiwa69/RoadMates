// US-10 — mes groupes de voyage, et création d'un groupe avec des contacts acceptés.
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CalendarDays, Check, MapPin, MessagesSquare, Plus, UserPlus } from 'lucide-react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { Avatar, AvatarStack, Button, Card, EmptyState, EntetePage, Field, Input, useToast } from '../../shared/ui/index.js'
import { aujourdhuiIso, formatJour } from './format.js'

export default function GroupsPage() {
  const currentUser = useCurrentUser()
  const navigate = useNavigate()
  const toast = useToast()
  const groups = useDb((db) => db.groups)
  const requests = useDb((db) => db.requests)
  const users = useDb((db) => db.users)
  const messages = useDb((db) => db.messages)
  const trips = useDb((db) => db.trips)
  const [nom, setNom] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedContacts, setSelectedContacts] = useState([])
  const [error, setError] = useState('')
  const userGroups = groups.filter((group) => group.membres.includes(currentUser?.id))

  const contactIds = [...new Set(requests
    .filter((request) => request.statut === 'acceptee')
    .flatMap((request) => {
      if (request.fromId === currentUser?.id) return [request.toId]
      if (request.toId === currentUser?.id) return [request.fromId]
      return []
    }))]
  const contacts = users.filter((user) => contactIds.includes(user.id) && user.id !== currentUser?.id)

  // Ma prochaine étape à venir, pour situer le groupe dans le temps.
  const today = aujourdhuiIso()
  const prochaine = trips
    .filter((t) => t.userId === currentUser?.id)
    .flatMap((t) => t.etapes)
    .filter((e) => e.fin >= today)
    .sort((a, b) => a.debut.localeCompare(b.debut))[0]

  function toggleContact(userId) {
    setSelectedContacts((selected) => selected.includes(userId)
      ? selected.filter((id) => id !== userId)
      : [...selected, userId])
    setError('')
  }

  function createGroup(event) {
    event.preventDefault()
    const cleanName = nom.trim()
    const cleanDestination = destination.trim()
    if (!cleanName || !cleanDestination) {
      setError('Renseignez le nom du groupe et sa destination.')
      return
    }
    const memberIds = [...new Set([currentUser?.id, ...selectedContacts.filter((id) => contactIds.includes(id))].filter(Boolean))]
    if (memberIds.length < 2) {
      setError('Choisissez au moins un contact accepté pour créer le groupe.')
      return
    }

    const groupId = newId('g')
    updateDb((db) => {
      db.groups.push({
        id: groupId,
        nom: cleanName,
        destination: cleanDestination,
        membres: memberIds,
        creeLe: new Date().toISOString(),
      })
    })
    toast(`Groupe « ${cleanName} » créé.`)
    navigate(paths.groupe(groupId))
  }

  return (
    <section className="groupes">
      <EntetePage surtitre="Entre compagnons" titre="Mes groupes">
        <p>Discutez et partagez les frais avec les voyageurs qui ont accepté votre demande.</p>
      </EntetePage>

      {userGroups.length === 0 ? (
        <EmptyState icon={MessagesSquare} titre="Vous ne faites partie d’aucun groupe.">
          <p>Créez-en un ci-dessous avec vos contacts acceptés.</p>
        </EmptyState>
      ) : (
        <ul className="ui-grille groupes__liste">
          {userGroups.map((group) => {
            const membres = group.membres.map((id) => users.find((u) => u.id === id)).filter(Boolean)
            const dernier = messages.filter((m) => m.groupId === group.id).at(-1)
            const auteur = dernier && users.find((u) => u.id === dernier.auteurId)
            return (
              <li key={group.id}>
                <article className="groupe-carte">
                  <div className="groupe-carte__tete">
                    <AvatarStack users={membres} max={4} taille={40} />
                    <span className="groupe-carte__nb">{membres.length} membres</span>
                  </div>
                  <h2 className="groupe-carte__nom">
                    <Link to={paths.groupe(group.id)} className="groupe-carte__lien">{group.nom}</Link>
                  </h2>
                  <p className="groupe-carte__info"><MapPin size={16} aria-hidden="true" /> {group.destination}</p>
                  {prochaine && (
                    <p className="groupe-carte__info">
                      <CalendarDays size={16} aria-hidden="true" /> Prochaine étape : {prochaine.ville}, {formatJour(prochaine.debut)}
                    </p>
                  )}
                  {dernier && (
                    <p className="groupe-carte__dernier">
                      <strong>{auteur?.id === currentUser?.id ? 'Vous' : auteur?.prenom}</strong> : {dernier.texte}
                    </p>
                  )}
                </article>
              </li>
            )
          })}
        </ul>
      )}

      <section className="groupes__creer" aria-labelledby="creer-titre">
        <h2 id="creer-titre"><Plus size={22} aria-hidden="true" /> Créer un groupe</h2>
        {contacts.length === 0 ? (
          <EmptyState
            icon={UserPlus}
            titre="Acceptez une demande de contact pour pouvoir créer un groupe."
            action={<Button to={paths.compagnons} variant="secondaire">Trouver des compagnons</Button>}
          />
        ) : (
          <Card as="form" className="groupes__form" onSubmit={createGroup} noValidate>
            <div className="groupes__champs">
              <Field label="Nom du groupe">
                <Input value={nom} onChange={(event) => { setNom(event.target.value); setError('') }} placeholder="Road trip Algarve" />
              </Field>
              <Field label="Destination">
                <Input value={destination} onChange={(event) => { setDestination(event.target.value); setError('') }} placeholder="Algarve" />
              </Field>
            </div>
            <fieldset className="groupes__contacts">
              <legend>Membres à ajouter</legend>
              <p className="groupes__aide">Seuls les contacts qui ont accepté votre demande sont proposés.</p>
              <div className="groupes__choix">
                {contacts.map((contact) => (
                  <label key={contact.id} className="groupes__contact">
                    <input
                      type="checkbox"
                      checked={selectedContacts.includes(contact.id)}
                      onChange={() => toggleContact(contact.id)}
                    />
                    <Avatar user={contact} taille={36} />
                    <span>{contact.prenom}</span>
                    <Check size={18} aria-hidden="true" className="groupes__coche" />
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p className="ui-field__erreur" role="alert">{error}</p>}
            <Button type="submit" icon={Plus} className="groupes__valider">Créer le groupe</Button>
          </Card>
        )}
      </section>
    </section>
  )
}
