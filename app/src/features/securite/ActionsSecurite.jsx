import { useState } from 'react'
import { Ban, Flag } from 'lucide-react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { Button, useToast } from '../../shared/ui/index.js'
import { estBloque } from './securite.js'
import './securite.css'

export default function ActionsSecurite({ cible, groupId = null }) {
  const user = useCurrentUser()
  const toast = useToast()
  const dejaSignale = useDb((db) => (db.signalements ?? []).some((signalement) =>
    signalement.auteurId === user?.id && signalement.cibleId === cible?.id && signalement.groupId === groupId,
  ))
  const bloque = useDb((db) => (db.blocages ?? []).some(({ bloqueurId, bloqueId }) =>
    bloqueurId === user?.id && bloqueId === cible?.id,
  ))
  const [motif, setMotif] = useState('comportement_inapproprie')
  const [details, setDetails] = useState('')
  const [formulaireOuvert, setFormulaireOuvert] = useState(false)
  const [confirmationBlocage, setConfirmationBlocage] = useState(false)

  if (!user || !cible || user.id === cible.id) return null

  function signaler(event) {
    event.preventDefault()
    updateDb((db) => {
      db.signalements ??= []
      const dejaFait = db.signalements.some((signalement) =>
        signalement.auteurId === user.id && signalement.cibleId === cible.id && signalement.groupId === groupId,
      )
      if (!dejaFait) {
        db.signalements.push({
          id: newId('s'),
          auteurId: user.id,
          cibleId: cible.id,
          groupId,
          motif,
          details: details.trim(),
          statut: 'a_traiter',
          creeLe: new Date().toISOString(),
        })
      }
    })
    setFormulaireOuvert(false)
    toast('Signalement enregistré localement. Il ne sera pas transmis à une équipe de modération dans cette démo.')
  }

  function bloquer() {
    updateDb((db) => {
      db.blocages ??= []
      if (!estBloque(db, user.id, cible.id)) {
        db.blocages.push({
          id: newId('b'),
          bloqueurId: user.id,
          bloqueId: cible.id,
          creeLe: new Date().toISOString(),
        })
      }
    })
    setConfirmationBlocage(false)
    toast('Profil bloqué dans cette démonstration.')
  }

  return (
    <div className="securite-actions" aria-label={`Actions de sécurité pour ${cible.prenom ?? 'ce voyageur'}`}>
      {dejaSignale ? <p className="securite-actions__etat">Signalement enregistré</p> : (
        <Button type="button" variant="fantome" taille="petit" icon={Flag} onClick={() => setFormulaireOuvert((open) => !open)}>
          Signaler
        </Button>
      )}
      {bloque ? <p className="securite-actions__etat">Profil bloqué — interactions désactivées</p> : confirmationBlocage ? (
        <div className="securite-actions__confirmation" role="group" aria-label="Confirmer le blocage">
          <span>Bloquer ce voyageur ?</span>
          <Button type="button" taille="petit" icon={Ban} onClick={bloquer}>Confirmer</Button>
          <Button type="button" variant="fantome" taille="petit" onClick={() => setConfirmationBlocage(false)}>Annuler</Button>
        </div>
      ) : (
        <Button type="button" variant="fantome" taille="petit" icon={Ban} onClick={() => setConfirmationBlocage(true)}>
          Bloquer
        </Button>
      )}
      {formulaireOuvert && !dejaSignale && (
        <form className="securite-actions__form" onSubmit={signaler}>
          <label>
            Motif du signalement
            <select value={motif} onChange={(event) => setMotif(event.target.value)}>
              <option value="comportement_inapproprie">Comportement inapproprié</option>
              <option value="harcelement">Harcèlement ou menace</option>
              <option value="faux_profil">Faux profil</option>
              <option value="autre">Autre</option>
            </select>
          </label>
          <label>
            Détails (facultatif)
            <textarea value={details} maxLength={500} rows={3} onChange={(event) => setDetails(event.target.value)} />
          </label>
          <p>Le signalement sera conservé uniquement dans les données locales de cette démo ; aucune modération réelle n’est assurée.</p>
          <Button type="submit" taille="petit" icon={Flag}>Enregistrer le signalement</Button>
        </form>
      )}
    </div>
  )
}
