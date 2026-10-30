// Confidentialité (sous-page de « Mon profil ») : mode anonyme du profil et de l'itinéraire.
// Chaque réglage est enregistré dès qu'il change ; la visibilité revient seule à la date choisie.
import { useState } from 'react'
import { Eye, EyeOff, Lock, MapPinOff, UserRound } from 'lucide-react'
import { useCurrentUser } from '../../shared/session.js'
import { updateDb, useDb } from '../../shared/db.js'
import { formatJusqua, itineraireMasque, profilMasque } from '../../shared/confidentialite.js'
import { Avatar, Button, Card, Chip, EntetePage, Field, Input, Switch, useToast } from '../../shared/ui/index.js'
import { aujourdhui, formatPeriode } from '../decouverte/dates.js'
import RetourProfil from '../profil/RetourProfil.jsx'
import './confidentialite.css'

const JOUR_MS = 24 * 60 * 60 * 1000

function dateLocale(date) {
  const annee = date.getFullYear()
  const mois = String(date.getMonth() + 1).padStart(2, '0')
  const jour = String(date.getDate()).padStart(2, '0')
  return `${annee}-${mois}-${jour}`
}

// Dernier jour du voyage en cours ou à venir, ou null s'il n'y en a pas.
function finDuVoyage(trips, userId, today) {
  return trips
    .filter((trip) => trip.userId === userId)
    .flatMap((trip) => trip.etapes.map((etape) => etape.fin))
    .filter((fin) => fin && fin >= today)
    .sort()
    .at(-1) ?? null
}

function dateDuree(duree, finVoyage) {
  if (duree === '24h') return dateLocale(new Date(Date.now() + JOUR_MS))
  if (duree === '7j') return dateLocale(new Date(Date.now() + 7 * JOUR_MS))
  return finVoyage
}

// Durée correspondant à une date déjà enregistrée, pour surligner la bonne puce.
function dureeDe(jusqua, finVoyage) {
  if (!jusqua) return '7j'
  return ['24h', '7j', 'voyage'].find((d) => dateDuree(d, finVoyage) === jusqua) ?? 'date'
}

function RegleAnonymat({ id, icon: Icon, label, description, jusqua, actif, finVoyage, today, onChange }) {
  const [duree, setDuree] = useState(() => dureeDe(jusqua, finVoyage))
  const durees = [
    { id: '24h', libelle: '24 h' },
    { id: '7j', libelle: '7 jours' },
    ...(finVoyage ? [{ id: 'voyage', libelle: 'Jusqu’à la fin de mon voyage' }] : []),
    { id: 'date', libelle: 'Une date précise' },
  ]

  const choisir = (d) => {
    setDuree(d)
    if (d !== 'date') onChange(dateDuree(d, finVoyage))
  }

  return (
    <Card as="section" className={`anonymat${actif ? ' anonymat--actif' : ''}`} aria-labelledby={`${id}-titre`}>
      <div className="anonymat__tete">
        <span className="anonymat__icone" aria-hidden="true"><Icon size={22} /></span>
        <div className="anonymat__texte">
          <h2 id={`${id}-titre`}>{label}</h2>
          <p id={`${id}-desc`}>{description}</p>
        </div>
        <Switch
          actif={actif}
          labelledBy={`${id}-titre`}
          describedBy={`${id}-desc`}
          onChange={(on) => onChange(on ? dateDuree(duree === 'date' ? '7j' : duree, finVoyage) ?? dateDuree('7j') : null)}
        />
      </div>
      {actif && (
        <div className="anonymat__duree">
          <p className="anonymat__jusqua"><EyeOff size={16} aria-hidden="true" /> Masqué jusqu’au <strong>{formatJusqua(jusqua)}</strong> inclus</p>
          <div className="anonymat__puces" role="group" aria-label={`Durée : ${label.toLowerCase()}`}>
            {durees.map((d) => <Chip key={d.id} actif={duree === d.id} onClick={() => choisir(d.id)}>{d.libelle}</Chip>)}
          </div>
          {duree === 'date' && (
            <Field label="Masquer jusqu’au">
              <Input type="date" value={jusqua ?? ''} min={today} onChange={(e) => e.target.value >= today && onChange(e.target.value)} />
            </Field>
          )}
        </div>
      )}
    </Card>
  )
}

// Mini-carte telle que la voient les autres voyageurs.
function Apercu({ user, trips }) {
  const profil = profilMasque(user)
  const itineraire = itineraireMasque(user)
  const etapes = trips.filter((t) => t.userId === user.id).flatMap((t) => t.etapes).filter((e) => e.fin >= aujourdhui()).slice(0, 2)
  return (
    <Card as="section" className="apercu-anonymat" aria-labelledby="apercu-titre">
      <h2 id="apercu-titre">Ce que voient les autres</h2>
      <div className="apercu-anonymat__carte">
        <div className="apercu-anonymat__qui">
          {profil
            ? <span className="apercu-anonymat__anonyme" aria-hidden="true"><UserRound size={26} /></span>
            : <Avatar user={user} taille={52} photo />}
          <div>
            <p className="apercu-anonymat__nom">{profil ? 'Voyageur anonyme' : `${user.prenom}${user.age ? `, ${user.age} ans` : ''}`}</p>
            <p className="apercu-anonymat__detail">{profil ? 'Ni photo, ni présentation' : user.bio ? `${user.bio.slice(0, 60)}${user.bio.length > 60 ? '…' : ''}` : 'Profil visible'}</p>
          </div>
        </div>
        <p className="apercu-anonymat__etapes">
          {itineraire || profil
            ? <><MapPinOff size={16} aria-hidden="true" /> Itinéraire masqué</>
            : etapes.length
              ? etapes.map((e) => `${e.ville} (${formatPeriode(e)})`).join(' · ')
              : 'Aucune étape à venir'}
        </p>
      </div>
    </Card>
  )
}

export default function Confidentialite() {
  const user = useCurrentUser()
  const trips = useDb((db) => db.trips)
  const toast = useToast()
  if (!user) return null

  const today = aujourdhui()
  const finVoyage = finDuVoyage(trips, user.id, today)
  const profilActif = profilMasque(user)
  const itineraireActif = itineraireMasque(user)

  function enregistrer(champ, jusqua, quoi) {
    updateDb((db) => {
      const moi = db.users.find((candidate) => candidate.id === user.id)
      if (moi) moi.anonymat = { ...moi.anonymat, [champ]: jusqua }
    })
    toast(jusqua ? `${quoi} masqué jusqu’au ${formatJusqua(jusqua)}.` : `${quoi} de nouveau visible.`)
  }

  function redevenirVisible() {
    updateDb((db) => {
      const moi = db.users.find((candidate) => candidate.id === user.id)
      if (moi) moi.anonymat = { ...moi.anonymat, profilJusqua: null, itineraireJusqua: null }
    })
    toast('Votre profil et votre itinéraire sont de nouveau visibles.')
  }

  return (
    <section className="espace-profil espace-profil--etroit confidentialite">
      <EntetePage
        avant={<RetourProfil page="Confidentialité" />}
        surtitre="Vos données, vos choix"
        titre="Confidentialité"
        actions={(profilActif || itineraireActif) && <Button variant="secondaire" icon={Eye} onClick={redevenirVisible}>Redevenir visible</Button>}
      >
        <p>Choisissez quand votre profil et votre itinéraire sont visibles. À la date choisie, ils redeviennent visibles automatiquement.</p>
      </EntetePage>

      <div className="confidentialite__grille">
        <div className="confidentialite__regles">
          <RegleAnonymat
            key={`profil-${user.id}`}
            id="profil"
            icon={UserRound}
            label="Cacher mon profil"
            description="Votre prénom, votre photo et votre présentation sont remplacés par « Voyageur anonyme »."
            jusqua={user.anonymat?.profilJusqua}
            actif={profilActif}
            finVoyage={finVoyage}
            today={today}
            onChange={(jusqua) => enregistrer('profilJusqua', jusqua, 'Profil')}
          />
          <RegleAnonymat
            key={`itineraire-${user.id}`}
            id="itineraire"
            icon={MapPinOff}
            label="Cacher mon itinéraire"
            description="Vos étapes et vos dates ne sont plus montrées aux autres voyageurs."
            jusqua={user.anonymat?.itineraireJusqua}
            actif={itineraireActif}
            finVoyage={finVoyage}
            today={today}
            onChange={(jusqua) => enregistrer('itineraireJusqua', jusqua, 'Itinéraire')}
          />
        </div>
        <div className="confidentialite__cote">
          <Apercu user={user} trips={trips} />
          <p className="confidentialite__chiffrement">
            <Lock size={18} aria-hidden="true" />
            <span>Vos messages de groupe sont chiffrés sur cet appareil. Dans cette démo, il ne s’agit pas d’un chiffrement de bout en bout.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
