import { useState } from 'react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'

const devise = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })

export function formatEuros(centimes) {
  return devise.format((centimes || 0) / 100)
}

export default function Expenses({ group }) {
  const currentUser = useCurrentUser()
  const expenses = useDb((db) => db.expenses.filter((expense) => expense.groupId === group.id))
  const users = useDb((db) => db.users)
  const [libelle, setLibelle] = useState('')
  const [categorie, setCategorie] = useState('voiture')
  const [montant, setMontant] = useState('')
  const [dateReservation, setDateReservation] = useState('')
  const [error, setError] = useState('')

  function payPart(expenseId) {
    updateDb((db) => {
      const expense = db.expenses.find((candidate) => candidate.id === expenseId && candidate.groupId === group.id)
      const part = expense?.parts.find((candidate) => candidate.userId === currentUser?.id)
      if (part && !part.payee) part.payee = true
    })
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
    const memberIds = [...new Set(group.membres)]
    if (memberIds.length === 0 || memberIds.some((id) => !id)) {
      setError('Impossible de répartir cette dépense : le groupe n’a pas de membres valides.')
      return
    }
    const base = Math.floor(montantCentimes / memberIds.length)
    const remainder = montantCentimes % memberIds.length
    const parts = memberIds.map((userId, index) => ({
      userId,
      montantCentimes: base + (index < remainder ? 1 : 0),
      payee: false,
    }))

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
    setLibelle('')
    setCategorie('voiture')
    setMontant('')
    setDateReservation('')
    setError('')
  }

  return (
    <section className="groupe-page">
      <h2>Dépenses partagées</h2>
      {expenses.length === 0 ? <p className="vide">Aucune dépense pour le moment.</p> : (
        <div className="groupe-liste">
          {expenses.map((expense) => (
            <article className="carte" key={expense.id}>
              <h3>{expense.libelle}</h3>
              <p><strong>Catégorie :</strong> {expense.categorie} · <strong>Montant :</strong> {formatEuros(expense.montantCentimes)}</p>
              <p><strong>Date de réservation :</strong> {expense.dateReservation}</p>
              <ul className="groupe-parts">
                {expense.parts.map((part) => {
                  const member = users.find((user) => user.id === part.userId)
                  return <li key={part.userId}>{member?.prenom ?? 'Membre'} : {formatEuros(part.montantCentimes)} — {part.payee ? 'Payée' : 'À payer'}</li>
                })}
              </ul>
              {expense.parts.some((part) => part.userId === currentUser?.id && !part.payee) && (
                <button className="btn" type="button" onClick={() => payPart(expense.id)}>Payer ma part</button>
              )}
            </article>
          ))}
        </div>
      )}

      <h3>Ajouter une dépense</h3>
      <form className="groupe-formulaire" onSubmit={createExpense}>
        <label htmlFor="depense-libelle">Libellé</label>
        <input id="depense-libelle" value={libelle} onChange={(event) => { setLibelle(event.target.value); setError('') }} required />
        <label htmlFor="depense-categorie">Catégorie</label>
        <select id="depense-categorie" value={categorie} onChange={(event) => setCategorie(event.target.value)}>
          <option value="voiture">Voiture</option>
          <option value="activité">Activité</option>
          <option value="autre">Autre</option>
        </select>
        <label htmlFor="depense-montant">Montant total (€)</label>
        <input id="depense-montant" type="number" min="0.01" step="0.01" value={montant} onChange={(event) => { setMontant(event.target.value); setError('') }} required />
        <label htmlFor="depense-date">Date de réservation</label>
        <input id="depense-date" type="date" value={dateReservation} onChange={(event) => { setDateReservation(event.target.value); setError('') }} required />
        <p className="groupe-aide">La dépense est répartie entre les {group.membres.length} membres du groupe.</p>
        {error && <p className="erreur" role="alert">{error}</p>}
        <button className="btn" type="submit">Créer la dépense</button>
      </form>
    </section>
  )
}
