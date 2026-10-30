import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Shield, Trash2 } from 'lucide-react'
import { useCurrentUser } from '../../shared/session.js'
import { newId, updateDb, useDb } from '../../shared/db.js'
import { profilMasque, itineraireMasque } from '../../shared/confidentialite.js'
import { paths } from '../../shared/paths.js'
import { Button, Card, EntetePage, Field, Input, useToast } from '../../shared/ui/index.js'
import './confidentialite.css'

const JOUR_MS = 24 * 60 * 60 * 1000

function dateLocale(date) {
  const annee = date.getFullYear()
  const mois = String(date.getMonth() + 1).padStart(2, '0')
  const jour = String(date.getDate()).padStart(2, '0')
  return `${annee}-${mois}-${jour}`
}

const AUJOURDHUI = dateLocale(new Date())

function finDuVoyage(trips, userId) {
  const today = dateLocale(new Date())
  const fins = trips
    .filter((trip) => trip.userId === userId)
    .flatMap((trip) => trip.etapes.map((etape) => etape.fin))
    .filter((fin) => fin && fin >= today)
    .sort()
  return fins.at(-1) ?? dateLocale(new Date(Date.now() + 7 * JOUR_MS))
}

function choixJusqua(choice, trips, userId) {
  if (choice === '24h') return dateLocale(new Date(Date.now() + JOUR_MS))
  if (choice === '7j') return dateLocale(new Date(Date.now() + 7 * JOUR_MS))
  return finDuVoyage(trips, userId)
}

function RegleAnonymat({ label, description, active, value, onChange, onQuick, id }) {
  return (
    <section className="confidentialite__regle" aria-labelledby={`${id}-titre`}>
      <div className="confidentialite__regle-tete">
        <div>
          <h2 id={`${id}-titre`}>{label}</h2>
          <p>{description}</p>
        </div>
        <span className={`confidentialite__etat${active ? ' confidentialite__etat--actif' : ''}`}>
          {active ? <><EyeOff size={16} aria-hidden="true" /> Masqué</> : <><Eye size={16} aria-hidden="true" /> Visible</>}
        </span>
      </div>
      <Field label="Masquer jusqu’au">
        <Input type="date" value={value} min={AUJOURDHUI} onChange={(event) => onChange(event.target.value)} />
      </Field>
      <div className="confidentialite__durees" aria-label={`Durée pour : ${label}`}>
        <button type="button" onClick={() => onQuick('24h')}>24 h</button>
        <button type="button" onClick={() => onQuick('7j')}>7 jours</button>
        <button type="button" onClick={() => onQuick('voyage')}>Jusqu’à la fin du voyage</button>
      </div>
    </section>
  )
}

export default function Confidentialite() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const users = useDb((db) => db.users)
  const trips = useDb((db) => db.trips)
  const toast = useToast()
  const [profilJusqua, setProfilJusqua] = useState(user?.anonymat?.profilJusqua ?? '')
  const [itineraireJusqua, setItineraireJusqua] = useState(user?.anonymat?.itineraireJusqua ?? '')
  const [confirmerSuppression, setConfirmerSuppression] = useState(false)
  const profilMasqueActif = profilMasque(user)
  const itineraireMasqueActif = itineraireMasque(user)

  function enregistrer() {
    updateDb((db) => {
      const current = db.users.find((candidate) => candidate.id === user?.id)
      if (!current) return
      current.anonymat = {
        ...current.anonymat,
        profilJusqua: profilJusqua || null,
        itineraireJusqua: itineraireJusqua || null,
      }
    })
    toast('Vos réglages de confidentialité sont enregistrés.')
  }

  function supprimerCompteLocal() {
    if (!confirmerSuppression || !user) return
    if (users.length <= 1) {
      toast('Suppression impossible : aucun autre compte de démonstration ne permet de poursuivre la navigation.')
      return
    }
    const idAnonyme = newId('anonyme')
    updateDb((db) => {
      const comptesRestants = db.users.filter((candidate) => candidate.id !== user.id)
      db.users = [...comptesRestants, {
        id: idAnonyme,
        prenom: 'Voyageur supprimé',
        age: null,
        genre: 'autre',
        langues: [],
        bio: '',
        verifie: false,
        photoUrl: '',
      }]
      db.trips = db.trips.filter((trip) => trip.userId !== user.id)
      db.requests = db.requests.filter((request) => request.fromId !== user.id && request.toId !== user.id)
      db.groups.forEach((group) => {
        group.membres = [...new Set(group.membres.map((memberId) => memberId === user.id ? idAnonyme : memberId))]
      })
      db.messages = db.messages.filter((message) => message.auteurId !== user.id)
      db.expenses.forEach((expense) => {
        if (expense.createurId === user.id) expense.createurId = idAnonyme
        expense.parts.forEach((part) => {
          if (part.userId === user.id) part.userId = idAnonyme
        })
      })
      db.blocages = (db.blocages ?? []).filter((item) => item.bloqueurId !== user.id && item.bloqueId !== user.id)
      db.signalements = (db.signalements ?? []).filter((item) => item.auteurId !== user.id && item.cibleId !== user.id)
      db.avis = (db.avis ?? []).filter((item) => item.auteurId !== user.id).map((item) => ({
        ...item,
        cibleId: item.cibleId === user.id ? idAnonyme : item.cibleId,
      }))
      db.session.userId = comptesRestants[0].id
    })
    setConfirmerSuppression(false)
    toast('Compte et données directement identifiantes supprimés de ce navigateur. Les références de dépenses et de groupe sont anonymisées.')
    navigate(paths.accueil, { replace: true })
  }

  function redevenirVisible() {
    setProfilJusqua('')
    setItineraireJusqua('')
    updateDb((db) => {
      const current = db.users.find((candidate) => candidate.id === user?.id)
      if (!current) return
      current.anonymat = { ...current.anonymat, profilJusqua: null, itineraireJusqua: null }
    })
    toast('Votre profil et votre itinéraire sont de nouveau visibles.')
  }

  return (
    <section className="confidentialite">
      <EntetePage surtitre="Vos données, vos choix" titre="Confidentialité">
        <p>Choisissez quand votre profil et votre itinéraire sont visibles par les autres voyageurs.</p>
      </EntetePage>
      <Card className="confidentialite__carte">
        <div className="confidentialite__intro">
          <Shield size={22} aria-hidden="true" />
          <p>Les réglages sont enregistrés localement dans cette démonstration. À la date choisie, votre visibilité revient automatiquement.</p>
        </div>
        <RegleAnonymat
          id="profil"
          label="Cacher mon profil"
          description="Votre prénom et votre profil seront masqués aux autres voyageurs."
          active={profilMasqueActif}
          value={profilJusqua}
          onChange={setProfilJusqua}
          onQuick={(choice) => setProfilJusqua(choixJusqua(choice, trips, user?.id))}
        />
        <RegleAnonymat
          id="itineraire"
          label="Cacher mon itinéraire"
          description="Les étapes de votre voyage seront masquées aux autres voyageurs."
          active={itineraireMasqueActif}
          value={itineraireJusqua}
          onChange={setItineraireJusqua}
          onQuick={(choice) => setItineraireJusqua(choixJusqua(choice, trips, user?.id))}
        />
        <div className="confidentialite__actions">
          <Button onClick={enregistrer}>Enregistrer les réglages</Button>
          {(profilMasqueActif || itineraireMasqueActif || profilJusqua || itineraireJusqua) && (
            <Button variant="secondaire" onClick={redevenirVisible}>Redevenir visible</Button>
          )}
        </div>
      </Card>
      <Card className="confidentialite__suppression">
        <h2>Supprimer mon compte</h2>
        <p>Cette action supprime les données du compte de ce navigateur et anonymise les références nécessaires aux dépenses et groupes. Dans ce prototype local, cela n’efface aucune donnée sur un serveur et ne déclenche aucune procédure réglementaire.</p>
        {!confirmerSuppression ? (
          <Button variant="secondaire" icon={Trash2} onClick={() => setConfirmerSuppression(true)}>Demander la suppression locale</Button>
        ) : (
          <div className="confidentialite__confirmation" role="group" aria-label="Confirmer la suppression locale du compte">
            <p>Cette action est irréversible dans les données de démonstration de ce navigateur.</p>
            <Button icon={Trash2} onClick={supprimerCompteLocal}>Confirmer la suppression locale</Button>
            <Button variant="fantome" onClick={() => setConfirmerSuppression(false)}>Annuler</Button>
          </div>
        )}
      </Card>
    </section>
  )
}
