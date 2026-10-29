// US-02 + US-03 — déclarer un voyage et ses étapes.
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { VILLES } from '../villes.js'
import { validerVoyage, creerVoyage, MAX_ETAPES } from '../voyages.js'

const etapeVide = () => ({ ville: '', debut: '', fin: '' })

export default function NouveauVoyage() {
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [destination, setDestination] = useState('')
  const [etapes, setEtapes] = useState([etapeVide()])
  const [erreurs, setErreurs] = useState({})

  if (!user) return <p>Connectez-vous pour déclarer un voyage. <Link to={paths.inscription}>Créer un compte</Link></p>

  const modifier = (i, champ, valeur) =>
    setEtapes((es) => es.map((e, k) => (k === i ? { ...e, [champ]: valeur } : e)))

  const soumettre = (ev) => {
    ev.preventDefault()
    const res = validerVoyage({ destination, etapes })
    setErreurs(res.erreurs)
    if (Object.keys(res.erreurs).length) return
    creerVoyage(user.id, destination, res.etapes)
    navigate(paths.mesVoyages)
  }

  return (
    <section>
      <h1>Déclarer un voyage</h1>
      <form className="carte form-voyage" onSubmit={soumettre} noValidate>
        <label className="champ">
          Nom du voyage
          <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Algarve" aria-invalid={!!erreurs.destination} />
          {erreurs.destination && <span className="erreur">{erreurs.destination}</span>}
        </label>

        <datalist id="villes">
          {VILLES.map((v) => <option key={v.ville} value={v.ville}>{v.pays}</option>)}
        </datalist>

        <fieldset className="etapes">
          <legend>Étapes</legend>
          {etapes.map((e, i) => (
            <div key={i} className="etape">
              <label className="champ">
                Ville
                <input list="villes" value={e.ville} onChange={(ev) => modifier(i, 'ville', ev.target.value)} placeholder="Lagos" aria-invalid={!!erreurs[i]} />
              </label>
              <label className="champ">
                Du
                <input type="date" value={e.debut} onChange={(ev) => modifier(i, 'debut', ev.target.value)} />
              </label>
              <label className="champ">
                Au
                <input type="date" value={e.fin} onChange={(ev) => modifier(i, 'fin', ev.target.value)} />
              </label>
              {etapes.length > 1 && (
                <button type="button" className="btn-lien" onClick={() => setEtapes((es) => es.filter((_, k) => k !== i))}>
                  Retirer
                </button>
              )}
              {erreurs[i] && <span className="erreur etape-erreur">{erreurs[i]}</span>}
            </div>
          ))}
          {etapes.length < MAX_ETAPES && (
            <button type="button" className="btn btn-secondaire" onClick={() => setEtapes((es) => [...es, etapeVide()])}>
              + Ajouter une étape
            </button>
          )}
        </fieldset>

        {erreurs.general && <p className="erreur">{erreurs.general}</p>}
        <button type="submit" className="btn">Enregistrer mon voyage</button>
      </form>
    </section>
  )
}
