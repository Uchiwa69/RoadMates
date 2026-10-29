// US-01 — créer un compte, en trois étapes courtes. L'envoi de l'e-mail de confirmation est simulé.
// validerInscription (inscription.js) reste la seule source de vérité : chaque étape n'affiche
// que les erreurs de ses champs, une fois le champ quitté ou l'étape validée.
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, BadgeCheck, Eye, EyeOff, Lock, Mail, MessageCircleHeart, Sparkles } from 'lucide-react'
import { useDb } from '../../../shared/db.js'
import { paths } from '../../../shared/paths.js'
import { Button, Chip, Field, Input, ProgressBar, useToast } from '../../../shared/ui/index.js'
import { LANGUES, validerInscription, creerCompte } from '../inscription.js'

const VIDE = { email: '', motDePasse: '', prenom: '', naissance: '', genre: '', langues: [] }
const ETAPES = [
  { titre: 'Faisons connaissance', champs: ['prenom', 'naissance', 'genre'] },
  { titre: 'Quelles langues parlez-vous ?', champs: ['langues'] },
  { titre: 'Votre compte', champs: ['email', 'motDePasse'] },
]
const GENRES = [['F', 'Femme'], ['H', 'Homme'], ['autre', 'Autre / ne souhaite pas préciser']]

export default function Inscription() {
  const users = useDb((db) => db.users)
  const navigate = useNavigate()
  const toast = useToast()
  const titre = useRef(null)
  const [form, setForm] = useState(VIDE)
  const [pas, setPas] = useState(0)
  const [vus, setVus] = useState({})
  const [envoye, setEnvoye] = useState(false)
  const [voirMdp, setVoirMdp] = useState(false)

  const premierRendu = useRef(true)
  useEffect(() => {
    if (premierRendu.current) { premierRendu.current = false; return }
    titre.current?.focus()
  }, [pas, envoye])

  const erreurs = validerInscription(form, users)
  const erreur = (champ) => (vus[champ] ? erreurs[champ] : undefined)
  const quitter = (champ) => () => setVus((v) => ({ ...v, [champ]: true }))
  const maj = (champ) => (e) => setForm((f) => ({ ...f, [champ]: e.target.value }))
  const basculerLangue = (l) => {
    setForm((f) => ({ ...f, langues: f.langues.includes(l) ? f.langues.filter((x) => x !== l) : [...f.langues, l] }))
    setVus((v) => ({ ...v, langues: true }))
  }

  const suivant = (ev) => {
    ev.preventDefault()
    const { champs } = ETAPES[pas]
    setVus((v) => ({ ...v, ...Object.fromEntries(champs.map((c) => [c, true])) }))
    if (champs.some((c) => erreurs[c])) return
    if (pas < ETAPES.length - 1) return setPas(pas + 1)
    // Dernière étape : on revérifie tout, et on revient à la première étape fautive.
    const fautive = ETAPES.findIndex((e) => e.champs.some((c) => erreurs[c]))
    if (fautive >= 0) return setPas(fautive)
    setEnvoye(true)
  }

  const confirmer = () => {
    const user = creerCompte(form)
    toast(`Bienvenue ${user.prenom} ! Déclarez votre premier voyage.`)
    navigate(paths.nouveauVoyage)
  }

  if (envoye) {
    return (
      <section className="inscription inscription--mail">
        <div className="inscription__mail">
          <span className="inscription__mail-icone" aria-hidden="true"><Mail size={32} /></span>
          <h1 ref={titre} tabIndex={-1}>Vérifiez votre boîte mail</h1>
          <p>Un lien de confirmation a été envoyé à <strong>{form.email}</strong>. Il est valable 24 heures.</p>
          <p className="inscription__note">Prototype : aucun e-mail n'est réellement envoyé.</p>
          <Button onClick={confirmer} taille="grand">J'ai cliqué sur le lien (simulation)</Button>
        </div>
      </section>
    )
  }

  const { titre: titreEtape } = ETAPES[pas]

  return (
    <section className="inscription">
      <aside className="inscription__promesse" aria-label="Pourquoi RoadMates">
        <p className="inscription__surtitre"><Sparkles size={16} aria-hidden="true" /> Moins de 2 minutes</p>
        <p className="inscription__accroche">Rejoignez les voyageurs qui partent ensemble.</p>
        <ul>
          <li><BadgeCheck size={20} aria-hidden="true" /> Identité vérifiée seulement au premier contact</li>
          <li><MessageCircleHeart size={20} aria-hidden="true" /> Personne ne vous écrit sans votre accord</li>
          <li><Lock size={20} aria-hidden="true" /> Aucune position GPS, aucun traceur publicitaire</li>
        </ul>
      </aside>

      <div className="inscription__carte">
        <h1 className="inscription__h1">Créer un compte</h1>
        <ProgressBar valeur={pas + 1} max={ETAPES.length} label={`Étape ${pas + 1} sur ${ETAPES.length}`} />
        <form onSubmit={suivant} noValidate className="inscription__form">
          <h2 ref={titre} tabIndex={-1} className="inscription__titre">{titreEtape}</h2>

          {pas === 0 && (
            <>
              <Field label="Prénom" error={erreur('prenom')}>
                <Input value={form.prenom} onChange={maj('prenom')} onBlur={quitter('prenom')} autoComplete="given-name" />
              </Field>
              <Field label="Date de naissance" aide="RoadMates est réservé aux plus de 18 ans." error={erreur('naissance')}>
                <Input type="date" value={form.naissance} onChange={maj('naissance')} onBlur={quitter('naissance')} autoComplete="bday" />
              </Field>
              <fieldset className="inscription__genres" aria-describedby={erreur('genre') ? 'genre-err' : undefined}>
                <legend>Genre</legend>
                <p className="ui-field__aide">Il permet aux voyageuses de filtrer « femmes uniquement ».</p>
                <div className="inscription__radios">
                  {GENRES.map(([v, l]) => (
                    <label key={v} className="inscription__radio">
                      <input type="radio" name="genre" value={v} checked={form.genre === v} onChange={maj('genre')} onBlur={quitter('genre')} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
                {erreur('genre') && <p id="genre-err" className="ui-field__erreur">{erreur('genre')}</p>}
              </fieldset>
            </>
          )}

          {pas === 1 && (
            <fieldset className="inscription__langues" aria-describedby={erreur('langues') ? 'langues-err' : undefined}>
              <legend className="sr-only">Langues parlées</legend>
              <p className="ui-field__aide">Choisissez toutes celles dans lesquelles vous pouvez discuter.</p>
              <div className="inscription__chips">
                {LANGUES.map((l) => (
                  <Chip key={l} actif={form.langues.includes(l)} onClick={() => basculerLangue(l)}>{l}</Chip>
                ))}
              </div>
              {erreur('langues') && <p id="langues-err" className="ui-field__erreur">{erreur('langues')}</p>}
            </fieldset>
          )}

          {pas === 2 && (
            <>
              <Field label="E-mail" error={erreur('email')}>
                <Input type="email" value={form.email} onChange={maj('email')} onBlur={quitter('email')} autoComplete="email" />
              </Field>
              <Field label="Mot de passe" aide="8 caractères minimum." error={erreur('motDePasse')}>
                <div className="inscription__mdp">
                  <Input type={voirMdp ? 'text' : 'password'} value={form.motDePasse} onChange={maj('motDePasse')} onBlur={quitter('motDePasse')} autoComplete="new-password" />
                  <button type="button" className="inscription__oeil" onClick={() => setVoirMdp((v) => !v)} aria-pressed={voirMdp}>
                    {voirMdp ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    <span className="sr-only">Afficher le mot de passe</span>
                  </button>
                </div>
              </Field>
              {erreurs.email === 'Un compte existe déjà avec cette adresse.' && vus.email && (
                <p className="inscription__note">Déjà inscrit ? Dans ce prototype, la connexion se fait par la pastille « Mode démo ».</p>
              )}
            </>
          )}

          <div className="inscription__actions">
            {pas > 0 && <Button variant="fantome" icon={ArrowLeft} onClick={() => setPas(pas - 1)}>Retour</Button>}
            <Button type="submit" taille="grand" iconEnd={ArrowRight}>
              {pas < ETAPES.length - 1 ? 'Continuer' : 'Créer mon compte'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
