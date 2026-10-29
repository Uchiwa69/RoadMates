// US-01 — créer un compte. L'envoi de l'e-mail de confirmation est simulé.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDb } from '../../../shared/db.js'
import { paths } from '../../../shared/paths.js'
import { LANGUES, validerInscription, creerCompte } from '../inscription.js'

const VIDE = { email: '', motDePasse: '', prenom: '', naissance: '', genre: '', langues: [] }

export default function Inscription() {
  const users = useDb((db) => db.users)
  const navigate = useNavigate()
  const [form, setForm] = useState(VIDE)
  const [erreurs, setErreurs] = useState({})
  const [envoye, setEnvoye] = useState(false)

  const maj = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }))
  const basculerLangue = (l) =>
    setForm((f) => ({ ...f, langues: f.langues.includes(l) ? f.langues.filter((x) => x !== l) : [...f.langues, l] }))

  const soumettre = (ev) => {
    ev.preventDefault()
    const e = validerInscription(form, users)
    setErreurs(e)
    if (Object.keys(e).length === 0) setEnvoye(true)
  }

  const confirmer = () => {
    creerCompte(form)
    navigate(paths.nouveauVoyage)
  }

  if (envoye) {
    return (
      <section className="carte form-voyage">
        <h1>Vérifiez votre boîte mail</h1>
        <p>Un lien de confirmation a été envoyé à <strong>{form.email}</strong>.</p>
        <p className="meta">Prototype : aucun e-mail n'est réellement envoyé.</p>
        <button type="button" className="btn" onClick={confirmer}>J'ai cliqué sur le lien (simulation)</button>
      </section>
    )
  }

  const champ = (nom, label, props = {}) => (
    <label className="champ">
      {label}
      <input value={form[nom]} onChange={maj(nom)} aria-invalid={!!erreurs[nom]} {...props} />
      {erreurs[nom] && <span className="erreur">{erreurs[nom]}</span>}
    </label>
  )

  return (
    <section>
      <h1>Créer un compte</h1>
      <form className="carte form-voyage" onSubmit={soumettre} noValidate>
        {champ('email', 'E-mail', { type: 'email', autoComplete: 'email' })}
        {champ('motDePasse', 'Mot de passe (8 caractères minimum)', { type: 'password', autoComplete: 'new-password' })}
        {champ('prenom', 'Prénom', { autoComplete: 'given-name' })}
        {champ('naissance', 'Date de naissance', { type: 'date' })}

        <label className="champ">
          Genre
          <select value={form.genre} onChange={maj('genre')} aria-invalid={!!erreurs.genre}>
            <option value="">Choisir…</option>
            <option value="F">Femme</option>
            <option value="H">Homme</option>
            <option value="autre">Autre / ne souhaite pas préciser</option>
          </select>
          {erreurs.genre && <span className="erreur">{erreurs.genre}</span>}
        </label>

        <fieldset className="etapes">
          <legend>Langues parlées</legend>
          <div className="actions">
            {LANGUES.map((l) => (
              <label key={l}><input type="checkbox" checked={form.langues.includes(l)} onChange={() => basculerLangue(l)} /> {l}</label>
            ))}
          </div>
          {erreurs.langues && <span className="erreur">{erreurs.langues}</span>}
        </fieldset>

        <button type="submit" className="btn">Créer mon compte</button>
      </form>
    </section>
  )
}
