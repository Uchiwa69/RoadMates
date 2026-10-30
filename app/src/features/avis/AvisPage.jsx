// Avis mutuels (US-21) : contenu de la page « Avis et amis de route » de l'espace profil.
import { useState } from 'react'
import { MessageSquareText, Star } from 'lucide-react'
import { newId, updateDb, useDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { Button, Card, EmptyState, Field, Select, Textarea, useToast } from '../../shared/ui/index.js'
import { avisPublics, moyenneAvis, pairesAvisEligibles } from './avis.js'

export default function AvisPage() {
  const user = useCurrentUser()
  const db = useDb((base) => base)
  const toast = useToast()
  const [formulaires, setFormulaires] = useState({})
  const [erreurs, setErreurs] = useState({})
  const eligibles = user ? pairesAvisEligibles(db, user.id) : []
  const publics = user ? avisPublics(db, user.id) : []

  function envoyer(event, pair) {
    event.preventDefault()
    if (!user || user.id === pair.cibleId || !eligibles.some((candidat) => candidat.groupId === pair.groupId && candidat.cibleId === pair.cibleId)) return
    const form = formulaires[pair.cibleId] ?? { note: '', commentaire: '' }
    const note = Number(form.note)
    // Le commentaire est facultatif : il peut ne jamais avoir été saisi.
    const commentaire = (form.commentaire ?? '').trim()
    if (!Number.isInteger(note) || note < 1 || note > 5) {
      setErreurs((actuelles) => ({ ...actuelles, [pair.cibleId]: 'Choisissez une note de 1 à 5.' }))
      return
    }
    if (commentaire.length > 500) {
      setErreurs((actuelles) => ({ ...actuelles, [pair.cibleId]: 'Le commentaire ne peut pas dépasser 500 caractères.' }))
      return
    }
    updateDb((base) => {
      base.avis ??= []
      const existe = base.avis.some((avis) => avis.groupId === pair.groupId && avis.auteurId === user.id && avis.cibleId === pair.cibleId)
      if (!existe) base.avis.push({ id: newId('a'), groupId: pair.groupId, auteurId: user.id, cibleId: pair.cibleId, note, commentaire, creeLe: new Date().toISOString() })
    })
    setErreurs((actuelles) => ({ ...actuelles, [pair.cibleId]: '' }))
    toast('Votre avis est enregistré. Il sera publié quand l’autre voyageur aura aussi noté.')
  }

  const dejaNotes = new Set((db.avis ?? []).filter((avis) => avis.auteurId === user?.id).map((avis) => `${avis.groupId}:${avis.cibleId}`))

  return (
    <section className="avis-page">
      <section aria-labelledby="avis-a-faire">
        <h2 id="avis-a-faire">Avis à laisser</h2>
        {eligibles.filter((pair) => !dejaNotes.has(`${pair.groupId}:${pair.cibleId}`)).length === 0
          ? <EmptyState icon={MessageSquareText} titre="Aucun avis à laisser pour le moment." />
          : eligibles.filter((pair) => !dejaNotes.has(`${pair.groupId}:${pair.cibleId}`)).map((pair) => (
            <Card key={`${pair.groupId}:${pair.cibleId}`} as="form" className="avis-page__form" onSubmit={(event) => envoyer(event, pair)} noValidate>
              <h3>{pair.groupName} · {db.users.find((candidat) => candidat.id === pair.cibleId)?.prenom ?? 'Voyageur'}</h3>
              <Field label="Votre note" error={erreurs[pair.cibleId]}>
                <Select value={formulaires[pair.cibleId]?.note ?? ''} onChange={(event) => setFormulaires((actuels) => ({ ...actuels, [pair.cibleId]: { ...actuels[pair.cibleId], note: event.target.value } }))}>
                  <option value="">Choisir une note</option>
                  {[5, 4, 3, 2, 1].map((note) => <option key={note} value={note}>{note} sur 5</option>)}
                </Select>
              </Field>
              <Field label="Commentaire (facultatif, 500 caractères maximum)" aide={`${(formulaires[pair.cibleId]?.commentaire ?? '').length}/500`}>
                <Textarea rows={3} maxLength={500} value={formulaires[pair.cibleId]?.commentaire ?? ''} onChange={(event) => setFormulaires((actuels) => ({ ...actuels, [pair.cibleId]: { ...actuels[pair.cibleId], commentaire: event.target.value } }))} />
              </Field>
              <Button type="submit" icon={Star}>Enregistrer mon avis</Button>
            </Card>
          ))}
      </section>

      <section aria-labelledby="avis-publies">
        <h2 id="avis-publies">Avis publiés</h2>
        {publics.length === 0
          ? <p>Aucun avis mutuel publié.</p>
          : <>
            <p><strong>{moyenneAvis(publics).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}/5</strong> · {publics.length} avis publiés</p>
            <ul className="avis-page__liste">
              {publics.map((avis) => <li key={avis.id}><Card as="article"><h3>{avis.auteur} · {avis.note}/5</h3><p>{avis.commentaire || 'Aucun commentaire.'}</p></Card></li>)}
            </ul>
          </>}
      </section>
    </section>
  )
}
