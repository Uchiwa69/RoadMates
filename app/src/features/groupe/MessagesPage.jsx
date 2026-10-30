// Messages : demandes de contact (US-09) et groupes (US-10) réunis sous un même onglet de navigation.
// L'onglet affiché est dans l'URL (?onglet=demandes|groupes) : liens directs et bouton retour fonctionnent.
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDb } from '../../shared/db.js'
import { EntetePage, Tabs, TabPanel } from '../../shared/ui/index.js'
import RequestsPage from './RequestsPage.jsx'
import GroupsPage from './GroupsPage.jsx'

const ONGLETS = ['demandes', 'groupes']

export default function MessagesPage() {
  const [params, setParams] = useSearchParams()
  const enAttente = useDb((db) => db.requests.filter((r) => r.toId === db.session.userId && r.statut === 'en_attente').length)
  // Sans onglet dans l'URL : les demandes s'il y en a à traiter à l'arrivée, sinon les groupes.
  // Choix figé à l'arrivée : accepter la dernière demande ne doit pas faire changer d'onglet.
  const [parDefaut] = useState(() => (enAttente > 0 ? 'demandes' : 'groupes'))
  const demande = params.get('onglet')
  const onglet = ONGLETS.includes(demande) ? demande : parDefaut

  return (
    <section className="messages">
      <EntetePage surtitre="Entre compagnons" titre="Messages">
        <p>Vos demandes de contact et vos groupes de voyage. On ne discute qu’avec les voyageurs dont on a accepté la demande.</p>
      </EntetePage>

      <Tabs
        id="messages"
        label="Messages"
        valeur={onglet}
        onChange={(id) => setParams({ onglet: id }, { replace: true })}
        onglets={[
          { id: 'demandes', label: 'Demandes', compte: enAttente },
          { id: 'groupes', label: 'Groupes' },
        ]}
      />

      <TabPanel id="messages" onglet={onglet}>
        {onglet === 'demandes' ? <RequestsPage /> : <GroupsPage />}
      </TabPanel>
    </section>
  )
}
