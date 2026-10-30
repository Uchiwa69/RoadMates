// « Proposer à mon groupe » : envoie l'offre comme message (chiffré, comme les autres) dans un groupe
// qui va dans cette ville. Sans groupe : on invite à trouver des compagnons, sans insister.
import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
import { newId, updateDb, useDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { chiffrerMessage } from '../../shared/chiffrement.js'
import { Button, useToast } from '../../shared/ui/index.js'
import { estBloque } from '../securite/securite.js'
import { groupesPourLaVille, texteOffre } from './partenaires.js'

export default function ProposerAuGroupe({ offre, partenaire, ville, pays }) {
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const toast = useToast()
  const selectId = useId()
  const groupes = user ? groupesPourLaVille(db, user.id, ville, pays) : []
  const [groupeId, setGroupeId] = useState(groupes[0]?.id ?? '')
  const [sansGroupe, setSansGroupe] = useState(false)
  const [envoi, setEnvoi] = useState(false)

  async function proposer() {
    if (groupes.length === 0) {
      setSansGroupe(true)
      return
    }
    const groupe = groupes.find((g) => g.id === groupeId) ?? groupes[0]
    if (groupe.membres.some((id) => id !== user.id && estBloque(db, user.id, id))) {
      toast('L’envoi est désactivé dans ce groupe car un blocage est actif.')
      return
    }
    setEnvoi(true)
    try {
      const chiffre = await chiffrerMessage(groupe.id, texteOffre(offre, partenaire))
      updateDb((base) => {
        if (!base.groups.some((g) => g.id === groupe.id && g.membres.includes(user.id))) return
        base.messages.push({ id: newId('m'), groupId: groupe.id, auteurId: user.id, ...chiffre, offreId: offre.id, envoyeLe: new Date().toISOString() })
      })
      toast(`Offre proposée au groupe « ${groupe.nom} ».`)
    } catch {
      toast('L’offre n’a pas pu être envoyée : le chiffrement local est indisponible.')
    } finally {
      setEnvoi(false)
    }
  }

  return (
    <div className="proposer">
      {groupes.length > 1 && (
        <div className="proposer__choix">
          <label htmlFor={selectId}>Groupe</label>
          <select id={selectId} className="ui-input" value={groupeId} onChange={(e) => setGroupeId(e.target.value)}>
            {groupes.map((g) => <option key={g.id} value={g.id}>{g.nom}</option>)}
          </select>
        </div>
      )}
      <Button variant="secondaire" icon={Send} onClick={proposer} loading={envoi}>Proposer à mon groupe</Button>
      {sansGroupe && (
        <p className="proposer__aide" role="status">
          Vous n’avez pas encore de groupe pour {ville}.{' '}
          <Link to={paths.destinationOnglet(ville, 'voyageurs')}>Trouvez des compagnons</Link> : à plusieurs, la réduction s’applique.
        </p>
      )}
    </div>
  )
}
