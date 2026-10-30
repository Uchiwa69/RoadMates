// US-09 — accepter ou refuser les demandes de contact ; suivre celles envoyées.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Clock, Inbox, Send, Users, X } from 'lucide-react'
import { useDb, updateDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { profilMasque } from '../../shared/confidentialite.js'
import { paths } from '../../shared/paths.js'
import { Avatar, Badge, Button, EmptyState, EntetePage, Tabs, TabPanel, useToast } from '../../shared/ui/index.js'
import { formatMoment } from './format.js'
import ActionsSecurite from '../securite/ActionsSecurite.jsx'
import { estBloque } from '../securite/securite.js'

function Statut({ statut, recue }) {
  if (statut === 'en_attente') return <Badge ton="alerte" icon={Clock}>{recue ? 'À traiter' : 'En attente de réponse'}</Badge>
  if (statut === 'acceptee') return <Badge ton="succes" icon={Check}>Acceptée — vous êtes en contact</Badge>
  return recue ? <Badge ton="neutre">Demande refusée</Badge> : <Badge ton="erreur">Demande non acceptée</Badge>
}

export default function RequestsPage() {
  const currentUser = useCurrentUser()
  const requests = useDb((db) => db.requests)
  const users = useDb((db) => db.users)
  const toast = useToast()
  const blocages = useDb((db) => db.blocages ?? [])
  const received = requests.filter((request) => request.toId === currentUser?.id)
  const sent = requests.filter((request) => request.fromId === currentUser?.id)
  const aTraiter = received.filter((r) => r.statut === 'en_attente').length
  const [onglet, setOnglet] = useState('recues')

  function person(userId) {
    return users.find((user) => user.id === userId)
  }

  function updateStatus(requestId, status) {
    const requestCourante = requests.find((request) => request.id === requestId)
    const cible = person(requestCourante?.fromId)
    if (cible && estBloque({ blocages }, currentUser?.id, cible.id)) {
      toast('Cette interaction est désactivée car un blocage est actif.')
      return
    }
    if (status === 'acceptee' && (!currentUser?.verifie || !cible?.verifie)) {
      toast('L’identité doit être vérifiée des deux côtés avant de devenir contacts.')
      return
    }
    updateDb((db) => {
      const request = db.requests.find((candidate) => candidate.id === requestId)
      if (request?.toId === currentUser?.id && request.statut === 'en_attente' && !estBloque(db, currentUser.id, request.fromId)) {
        request.statut = status
      }
    })
    const auteurDemande = person(requests.find((request) => request.id === requestId)?.fromId)
    const nomAffiche = profilMasque(auteurDemande) ? 'Voyageur anonyme' : auteurDemande?.prenom ?? 'ce voyageur'
    toast(status === 'acceptee' ? `Vous êtes en contact avec ${nomAffiche}.` : `Demande de ${nomAffiche} refusée.`)
  }

  const carte = (request, recue) => {
    const autre = person(recue ? request.fromId : request.toId)
    const masque = profilMasque(autre)
    return (
      <li key={request.id}>
        <article className={`demande demande--${request.statut}`}>
          <div className="demande__tete">
            {autre && <Avatar user={masque ? { ...autre, prenom: 'Voyageur anonyme' } : autre} taille={48} />}
            <div className="demande__qui">
              <h3 className="demande__nom">
                {autre ? masque ? 'Voyageur anonyme' : <Link to={paths.profil(autre.id)}>{autre.prenom}</Link> : 'Voyageur inconnu'}
              </h3>
              {request.creeLe && <p className="demande__date">{recue ? 'Reçue' : 'Envoyée'} {formatMoment(request.creeLe)}</p>}
            </div>
            <Statut statut={request.statut} recue={recue} />
          </div>
          {request.message && <p className="demande__message">{request.message}</p>}
          {autre && <ActionsSecurite cible={autre} />}
          {autre && estBloque({ blocages }, currentUser?.id, autre.id) && (
            <p className="groupe-aide">Cette interaction est désactivée à cause d’un blocage.</p>
          )}
          {recue && request.statut === 'en_attente' && !estBloque({ blocages }, currentUser?.id, autre?.id) && (
            <div className="demande__actions">
              <Button icon={Check} onClick={() => updateStatus(request.id, 'acceptee')}>Accepter</Button>
              <Button variant="secondaire" icon={X} onClick={() => updateStatus(request.id, 'refusee')}>Refuser</Button>
            </div>
          )}
          {request.statut === 'acceptee' && (
            <Link to={paths.groupes} className="demande__suite"><Users size={16} aria-hidden="true" /> Créer un groupe pour discuter</Link>
          )}
        </article>
      </li>
    )
  }

  return (
    <section className="demandes">
      <EntetePage surtitre="Contacts" titre="Demandes de contact">
        <p>On ne discute qu’avec les voyageurs dont on a accepté la demande.</p>
      </EntetePage>

      <Tabs
        id="demandes"
        label="Demandes de contact"
        valeur={onglet}
        onChange={setOnglet}
        onglets={[
          { id: 'recues', label: 'Reçues', compte: aTraiter },
          { id: 'envoyees', label: 'Envoyées' },
        ]}
      />

      {onglet === 'recues' ? (
        <TabPanel id="demandes" onglet="recues">
          <h2 className="sr-only">Demandes reçues</h2>
          {received.length === 0
            ? <EmptyState icon={Inbox} titre="Vous n’avez pas de demande reçue." action={<Button to={paths.compagnons} variant="secondaire">Voir mes compagnons</Button>} />
            : <ul className="demandes__liste">{received.map((r) => carte(r, true))}</ul>}
        </TabPanel>
      ) : (
        <TabPanel id="demandes" onglet="envoyees">
          <h2 className="sr-only">Demandes envoyées</h2>
          {sent.length === 0
            ? <EmptyState icon={Send} titre="Vous n’avez pas envoyé de demande." action={<Button to={paths.compagnons} variant="secondaire">Trouver des compagnons</Button>} />
            : <ul className="demandes__liste">{sent.map((r) => carte(r, false))}</ul>}
        </TabPanel>
      )}
    </section>
  )
}
