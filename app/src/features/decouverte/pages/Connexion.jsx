// Se connecter (prototype) — complète US-01.4 : « Un compte existe déjà » mène ici.
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, BadgeCheck, Lock, LogIn, MessageCircleHeart } from 'lucide-react'
import { useDb } from '../../../shared/db.js'
import { paths } from '../../../shared/paths.js'
import { Button, Field, Input, useToast } from '../../../shared/ui/index.js'
import { connecter, validerConnexion } from '../connexion.js'

const COMPTES_DEMO = ['u-lea', 'u-ines', 'u-karim']

export default function Connexion() {
  const users = useDb((db) => db.users)
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ email: params.get('email') ?? '', motDePasse: '' })
  const [erreurs, setErreurs] = useState({})

  const maj = (champ) => (e) => {
    setForm((f) => ({ ...f, [champ]: e.target.value }))
    setErreurs((x) => ({ ...x, [champ]: undefined }))
  }

  const soumettre = (ev) => {
    ev.preventDefault()
    const e = validerConnexion(form, users)
    setErreurs(e)
    if (Object.keys(e).length) return
    const user = connecter(form, users)
    toast(`Bon retour, ${user.prenom} !`)
    navigate(paths.mesVoyages)
  }

  const demo = COMPTES_DEMO.map((id) => users.find((u) => u.id === id)).filter((u) => u?.email)

  return (
    <section className="inscription">
      <aside className="inscription__promesse" aria-label="Pourquoi RoadMates">
        <p className="inscription__surtitre"><LogIn size={16} aria-hidden="true" /> Bon retour</p>
        <p className="inscription__accroche">Vos compagnons de route vous attendent.</p>
        <ul>
          <li><BadgeCheck size={20} aria-hidden="true" /> Identité vérifiée au premier contact</li>
          <li><MessageCircleHeart size={20} aria-hidden="true" /> Personne ne vous écrit sans votre accord</li>
          <li><Lock size={20} aria-hidden="true" /> Aucune position GPS, aucun traceur publicitaire</li>
        </ul>
      </aside>

      <div className="inscription__carte">
        <h1 className="inscription__h1">Se connecter</h1>
        <form onSubmit={soumettre} noValidate className="inscription__form">
          <Field label="E-mail" error={erreurs.email}>
            <Input type="email" value={form.email} onChange={maj('email')} autoComplete="email" />
          </Field>
          {erreurs.email === 'Aucun compte avec cette adresse.' && (
            <p className="inscription__note">Pas encore inscrit ? <Link to={paths.inscription}>Créer un compte</Link></p>
          )}
          <Field label="Mot de passe" aide="Prototype : le mot de passe n’est pas vérifié." error={erreurs.motDePasse}>
            <Input type="password" value={form.motDePasse} onChange={maj('motDePasse')} autoComplete="current-password" />
          </Field>
          <div className="inscription__actions">
            <Button type="submit" taille="grand" iconEnd={ArrowRight}>Se connecter</Button>
          </div>
        </form>

        {demo.length > 0 && (
          <div className="connexion__demo">
            <p className="inscription__note">Comptes de démo :</p>
            <ul>
              {demo.map((u) => (
                <li key={u.id}>
                  <button type="button" className="ui-chip" onClick={() => setForm({ email: u.email, motDePasse: 'demo-roadmates' })}>
                    {u.prenom} · {u.email}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="inscription__note">Pas encore de compte ? <Link to={paths.inscription}>Créer un compte</Link></p>
      </div>
    </section>
  )
}
