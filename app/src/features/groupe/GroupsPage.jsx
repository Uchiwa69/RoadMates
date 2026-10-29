import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'

export default function GroupsPage() {
  const currentUser = useCurrentUser()
  const groups = useDb((db) => db.groups)
  const requests = useDb((db) => db.requests)
  const users = useDb((db) => db.users)
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

  function toggleContact(userId) {
    setSelectedContacts((selected) => selected.includes(userId)
      ? selected.filter((id) => id !== userId)
      : [...selected, userId])
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
    setNom('')
    setDestination('')
    setSelectedContacts([])
    setError('')
  }

  return (
    <section className="groupe-page">
      <h1>Mes groupes</h1>
      {userGroups.length === 0 ? <p className="vide">Vous ne faites partie d’aucun groupe.</p> : (
        <div className="groupe-liste">
          {userGroups.map((group) => (
            <article className="carte" key={group.id}>
              <h2><Link to={paths.groupe(group.id)}>{group.nom}</Link></h2>
              <p><strong>Destination :</strong> {group.destination}</p>
              <p>{group.membres.length} membres</p>
            </article>
          ))}
        </div>
      )}

      <h2>Créer un groupe</h2>
      {contacts.length === 0 ? <p className="vide">Acceptez une demande de contact pour pouvoir créer un groupe.</p> : (
        <form className="groupe-formulaire" onSubmit={createGroup}>
          <label htmlFor="nom-groupe">Nom du groupe</label>
          <input id="nom-groupe" value={nom} onChange={(event) => { setNom(event.target.value); setError('') }} required />
          <label htmlFor="destination-groupe">Destination</label>
          <input id="destination-groupe" value={destination} onChange={(event) => { setDestination(event.target.value); setError('') }} required />
          <fieldset className="groupe-contacts">
            <legend>Membres à ajouter</legend>
            {contacts.map((contact) => (
              <label key={contact.id}>
                <input
                  type="checkbox"
                  checked={selectedContacts.includes(contact.id)}
                  onChange={() => toggleContact(contact.id)}
                />
                {contact.prenom}
              </label>
            ))}
          </fieldset>
          {error && <p className="erreur" role="alert">{error}</p>}
          <button className="btn" type="submit">Créer le groupe</button>
        </form>
      )}
    </section>
  )
}
