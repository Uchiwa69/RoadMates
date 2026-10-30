// US-13, US-14, US-15 — dépenses partagées : « Votre part » d'abord, paiement simulé,
// statut « En attente » tant qu'une part reste à payer, « Complète » ensuite.
import { useState } from 'react'
import { BadgeCheck, CalendarClock, Car, Check, Clock, PartyPopper, Plus, Receipt, Ticket, Wallet } from 'lucide-react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { profilMasque } from '../../shared/confidentialite.js'
import { Avatar, Badge, Button, Card, Field, Input, ProgressBar, useToast } from '../../shared/ui/index.js'
import { estComplete, formatEuros, nbPayees, repartir } from './depenses.js'
import { formatJourLong } from './format.js'

const CATEGORIES = [
  { id: 'voiture', label: 'Voiture', icon: Car },
  { id: 'activité', label: 'Activité', icon: Ticket },
  { id: 'autre', label: 'Autre', icon: Receipt },
]
const ICONES = { voiture: <Car size={22} />, activité: <Ticket size={22} />, autre: <Receipt size={22} /> }

// Micro-célébration discrète quand la dernière part est payée (chargée à la demande).
// Purement décoratif : si le module ne se charge pas (réseau, navigation en cours), on l'ignore.
async function celebrer(origine) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  let confetti
  try {
    ({ default: confetti } = await import('canvas-confetti'))
  } catch {
    return
  }
  confetti({
    particleCount: 70, spread: 70, startVelocity: 32, ticks: 160, scalar: 0.9, disableForReducedMotion: true,
    origin: origine, colors: ['#FF6B5B', '#FF9F45', '#F2558C', '#FFD9C7'],
  })
}

function Depense({ expense, users, currentUser, onPayer, paiement }) {
  const complete = estComplete(expense)
  const payees = nbPayees(expense)
  const total = expense.parts.length
  const mienne = expense.parts.find((part) => part.userId === currentUser?.id)

  return (
    <article className={`depense${complete ? ' depense--complete' : ''}`} aria-labelledby={`dep-${expense.id}`}>
      <div className="depense__tete">
        <span className="depense__icone" aria-hidden="true">{ICONES[expense.categorie] ?? ICONES.autre}</span>
        <div className="depense__titres">
          <h3 id={`dep-${expense.id}`} className="depense__libelle">{expense.libelle}</h3>
          <p className="depense__meta">
            {formatEuros(expense.montantCentimes)} au total · {expense.categorie}
          </p>
        </div>
        {complete
          ? <Badge ton="succes" icon={Check} className="depense__statut">Complète</Badge>
          : <Badge ton="alerte" icon={Clock} className="depense__statut">En attente</Badge>}
      </div>

      {mienne && (
        <div className={`depense__part${mienne.payee ? ' depense__part--payee' : ''}`}>
          <p className="depense__part-label">Votre part</p>
          <p className="depense__part-montant">{formatEuros(mienne.montantCentimes)}</p>
          <p className="depense__part-etat">
            {mienne.payee ? <><BadgeCheck size={18} aria-hidden="true" /> Payée</> : 'À payer'}
          </p>
        </div>
      )}

      <ProgressBar
        valeur={payees}
        max={total}
        ton={complete ? 'succes' : 'primaire'}
        label={`${payees} part${payees > 1 ? 's' : ''} payée${payees > 1 ? 's' : ''} sur ${total}`}
      />

      <ul className="depense__parts groupe-parts" aria-label="Parts des membres">
        {expense.parts.map((part) => {
          const member = users.find((user) => user.id === part.userId)
          const memberMasked = profilMasque(member)
          const displayedMember = memberMasked ? { ...member, prenom: 'Voyageur anonyme' } : member
          return (
            <li key={part.userId} className="depense__ligne">
              <Avatar user={displayedMember} taille={28} />
              <span className="depense__qui">{displayedMember?.prenom ?? 'Membre'}{part.userId === currentUser?.id ? ' (vous)' : ''}</span>
              <span className="depense__montant">{formatEuros(part.montantCentimes)}</span>
              {part.payee ? <Badge ton="succes">Payée</Badge> : <Badge ton="neutre">À payer</Badge>}
            </li>
          )
        })}
      </ul>

      <p className="depense__reservation">
        <CalendarClock size={16} aria-hidden="true" />
        {complete
          ? 'Toutes les parts sont payées : la réservation peut être lancée.'
          : `Réservation prévue le ${formatJourLong(expense.dateReservation)} si toutes les parts sont payées.`}
      </p>

      {mienne && !mienne.payee && (
        <Button
          taille="grand"
          icon={Wallet}
          className="ui-btn--plein"
          loading={paiement === expense.id}
          onClick={(event) => onPayer(expense, event.currentTarget)}
        >
          {paiement === expense.id ? 'Paiement en cours…' : `Payer ma part · ${formatEuros(mienne.montantCentimes)}`}
        </Button>
      )}
      {mienne && !mienne.payee && <p className="depense__note">Paiement simulé : aucune transaction réelle dans le prototype.</p>}
    </article>
  )
}

export default function Expenses({ group }) {
  const currentUser = useCurrentUser()
  const toast = useToast()
  const expenses = useDb((db) => db.expenses.filter((expense) => expense.groupId === group.id))
  const users = useDb((db) => db.users)
  const [libelle, setLibelle] = useState('')
  const [categorie, setCategorie] = useState('voiture')
  const [montant, setMontant] = useState('')
  const [dateReservation, setDateReservation] = useState('')
  const [error, setError] = useState('')
  const [paiement, setPaiement] = useState(null)

  const memberIds = [...new Set(group.membres)]
  const apercuCentimes = Math.round(Number(montant) * 100)
  const apercu = Number.isFinite(apercuCentimes) && apercuCentimes > 0 && memberIds.length
    ? repartir(apercuCentimes, memberIds)[0].montantCentimes
    : null

  // Paiement simulé : un court délai, puis la part passe à « payée » (une seule fois).
  function payPart(expense, bouton) {
    if (paiement) return
    setPaiement(expense.id)
    const derniere = expense.parts.filter((part) => !part.payee).length === 1
    setTimeout(() => {
      updateDb((db) => {
        const cible = db.expenses.find((candidate) => candidate.id === expense.id && candidate.groupId === group.id)
        const part = cible?.parts.find((candidate) => candidate.userId === currentUser?.id)
        if (part && !part.payee) part.payee = true
      })
      setPaiement(null)
      if (derniere) {
        const r = bouton.getBoundingClientRect()
        celebrer({ x: (r.left + r.width / 2) / window.innerWidth, y: r.top / window.innerHeight })
        toast(`« ${expense.libelle} » est complète : tout le monde a payé !`)
      } else {
        toast('Votre part est payée.')
      }
    }, 700)
  }

  function createExpense(event) {
    event.preventDefault()
    const cleanLabel = libelle.trim()
    const euros = Number(montant)
    if (!cleanLabel || !dateReservation || !Number.isFinite(euros)) {
      setError('Renseignez le libellé, un montant valide et la date de réservation.')
      return
    }
    const montantCentimes = Math.round(euros * 100)
    if (montantCentimes <= 0) {
      setError('Le montant doit être supérieur à 0 €.')
      return
    }
    if (!['voiture', 'activité', 'autre'].includes(categorie)) {
      setError('Choisissez une catégorie valide.')
      return
    }
    if (memberIds.length === 0 || memberIds.some((id) => !id)) {
      setError('Impossible de répartir cette dépense : le groupe n’a pas de membres valides.')
      return
    }
    const parts = repartir(montantCentimes, memberIds)

    updateDb((db) => {
      if (!db.groups.some((candidate) => candidate.id === group.id && candidate.membres.includes(currentUser?.id))) return
      db.expenses.push({
        id: newId('e'),
        groupId: group.id,
        createurId: currentUser.id,
        libelle: cleanLabel,
        categorie,
        montantCentimes,
        dateReservation,
        parts,
        creeLe: new Date().toISOString(),
      })
    })
    toast(`Dépense créée : ${formatEuros(parts[0].montantCentimes)} par personne.`)
    setLibelle('')
    setCategorie('voiture')
    setMontant('')
    setDateReservation('')
    setError('')
  }

  return (
    <section className="depenses" aria-labelledby="depenses-titre">
      <h2 id="depenses-titre" className="depenses__titre"><Wallet size={20} aria-hidden="true" /> Dépenses partagées</h2>

      {expenses.length === 0 ? (
        <div className="depenses__vide">
          <PartyPopper size={22} aria-hidden="true" />
          <p>Aucune dépense pour le moment. Ajoutez la location de voiture : chacun verra sa part.</p>
        </div>
      ) : (
        <div className="depenses__liste">
          {expenses.map((expense) => (
            <Depense key={expense.id} expense={expense} users={users} currentUser={currentUser} onPayer={payPart} paiement={paiement} />
          ))}
        </div>
      )}

      <Card as="form" className="depenses__form" onSubmit={createExpense} noValidate>
        <h3 className="depenses__form-titre"><Plus size={18} aria-hidden="true" /> Ajouter une dépense</h3>
        <Field label="Libellé">
          <Input value={libelle} onChange={(event) => { setLibelle(event.target.value); setError('') }} placeholder="Location de voiture" />
        </Field>
        <fieldset className="depenses__categories">
          <legend>Catégorie</legend>
          <div className="depenses__segments">
            {CATEGORIES.map(({ id, label, icon: Icone }) => (
              <label key={id} className="depenses__segment">
                <input type="radio" name={`categorie-${group.id}`} value={id} checked={categorie === id} onChange={() => setCategorie(id)} />
                <Icone size={18} aria-hidden="true" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="depenses__champs">
          <Field label="Montant total (€)">
            <Input type="number" inputMode="decimal" min="0.01" step="0.01" value={montant} onChange={(event) => { setMontant(event.target.value); setError('') }} placeholder="240" />
          </Field>
          <Field label="Date de réservation" aide="Date limite pour que chacun paie sa part.">
            <Input type="date" value={dateReservation} onChange={(event) => { setDateReservation(event.target.value); setError('') }} />
          </Field>
        </div>
        <p className="depenses__apercu" aria-live="polite">
          {apercu !== null
            ? <>Soit <strong>{formatEuros(apercu)}</strong> par personne</>
            : 'La part de chacun s’affichera ici.'}
        </p>
        <p className="groupe-aide">La dépense est répartie entre les {group.membres.length} membres du groupe.</p>
        {error && <p className="ui-field__erreur" role="alert">{error}</p>}
        <Button type="submit" icon={Plus}>Créer la dépense</Button>
      </Card>
    </section>
  )
}
