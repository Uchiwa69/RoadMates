// « Modifier mon profil » : photo, présentation, langues, centres d'intérêt et façon de voyager,
// avec l'aperçu de la carte telle que les autres la voient.
import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { BadgeCheck, Camera, Check, Eye, ImagePlus, Save, Trash2 } from 'lucide-react'
import { updateDb, useDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { Avatar, Badge, Button, Card, EntetePage, Feuille, Field, Input, Textarea, useToast } from '../../shared/ui/index.js'
import { useMediaQuery } from '../../shared/useMediaQuery.js'
import RetourProfil from './RetourProfil.jsx'
import { ChoixUnique, PucesSaisie } from './ChampsChoix.jsx'
import { BUDGETS, PARTAGES, RYTHMES, STYLES, libellePartage, libelleStyle, niveauBudget } from './options.js'
import { reduirePhoto } from './photo.js'

const GENRES = [
  { valeur: 'tous', libelle: 'Tout le monde' },
  { valeur: 'F', libelle: 'Des femmes' },
  { valeur: 'H', libelle: 'Des hommes' },
]

function initialiser(user) {
  return {
    photoUrl: user.photoUrl ?? '',
    bio: user.bio ?? '',
    langues: user.langues ?? [],
    centresInteret: user.centresInteret ?? [],
    styleVoyage: user.styleVoyage ?? 'routard',
    budgetEuros: user.budgetJournalierCentimes == null ? '' : String(user.budgetJournalierCentimes / 100),
    rythme: user.rythme ?? 'modéré',
    investissement: user.investissement ?? 'activites',
    preferenceGenre: ['H', 'F', 'tous'].includes(user.preferenceGenre) ? user.preferenceGenre : 'tous',
  }
}

// Carte « Comment les autres vous voient », mise à jour pendant la saisie.
function Apercu({ user, form }) {
  const budget = form.budgetEuros === '' ? null : niveauBudget(Number(form.budgetEuros) * 100)
  return (
    <div className="apercu-profil">
      <div className="apercu-profil__qui">
        <Avatar user={{ ...user, photoUrl: form.photoUrl }} taille={64} photo />
        <div>
          <p className="apercu-profil__nom">{user.prenom}{user.age ? `, ${user.age} ans` : ''}</p>
          <p className="apercu-profil__style">Style {libelleStyle(form.styleVoyage).toLowerCase()} · rythme {form.rythme}</p>
        </div>
      </div>
      {user.verifie && <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>}
      <p className="apercu-profil__bio">{form.bio || 'Votre présentation apparaîtra ici.'}</p>
      {form.centresInteret.length > 0 && (
        <ul className="identite__tags" aria-label="Centres d’intérêt">
          {form.centresInteret.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      )}
      <dl className="apercu-profil__infos">
        <div><dt>Langues</dt><dd>{form.langues.length ? form.langues.join(', ') : 'Non renseignées'}</dd></div>
        <div><dt>Budget</dt><dd>{budget ? `${budget.libelle} (${budget.detail} par jour)` : 'Non renseigné'}</dd></div>
        <div><dt>Veut partager</dt><dd>{libellePartage(form.investissement)}</dd></div>
      </dl>
    </div>
  )
}

export default function EditionProfil() {
  const user = useCurrentUser()
  const users = useDb((db) => db.users)
  const toast = useToast()
  const [params] = useSearchParams()
  const mobile = useMediaQuery('(max-width: 767px)')
  const [initial, setInitial] = useState(() => initialiser(user ?? {}))
  const [form, setForm] = useState(initial)
  const [erreur, setErreur] = useState('')
  const [erreurPhoto, setErreurPhoto] = useState('')
  const [apercuOuvert, setApercuOuvert] = useState(false)
  const fichier = useRef(null)
  const boutonApercu = useRef(null)
  const modifie = JSON.stringify(form) !== JSON.stringify(initial)

  // Lien « Ajoutez une photo » depuis l'accueil du profil : on amène directement au bon champ.
  const champ = params.get('champ')
  useEffect(() => {
    if (!champ) return
    const minuteur = setTimeout(() => {
      const cible = document.getElementById(`champ-${champ}`)
      cible?.scrollIntoView({ block: 'center' })
      cible?.focus({ preventScroll: true })
    }, 350)
    return () => clearTimeout(minuteur)
  }, [champ])

  // Modifications non enregistrées : on prévient avant de quitter la page ou l'application.
  useEffect(() => {
    if (!modifie) return
    const avantDechargement = (e) => { e.preventDefault(); e.returnValue = '' }
    const clicLien = (e) => {
      const lien = e.target.closest?.('a[href]')
      if (!lien || e.defaultPrevented) return
      if (!window.confirm('Vous avez des modifications non enregistrées. Quitter sans enregistrer ?')) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    window.addEventListener('beforeunload', avantDechargement)
    document.addEventListener('click', clicLien, true)
    return () => {
      window.removeEventListener('beforeunload', avantDechargement)
      document.removeEventListener('click', clicLien, true)
    }
  }, [modifie])

  if (!user) {
    return <Card><h1>Profil indisponible</h1><p>Aucun voyageur n’est connecté.</p></Card>
  }

  const maj = (champModifie, valeur) => {
    setForm((actuel) => ({ ...actuel, [champModifie]: valeur }))
    setErreur('')
  }

  const suggestionsLangues = [...new Set(users.flatMap((u) => u.langues ?? []))].sort().slice(0, 10)
  const suggestionsInterets = [...new Set(users.flatMap((u) => u.centresInteret ?? []))].sort().slice(0, 14)
  const budgetChoisi = form.budgetEuros === '' ? null : niveauBudget(Number(form.budgetEuros) * 100)?.valeur

  async function choisirPhoto(e) {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setErreurPhoto('')
    try {
      maj('photoUrl', await reduirePhoto(f))
    } catch (err) {
      setErreurPhoto(err.message)
    }
  }

  function enregistrer(event) {
    event.preventDefault()
    const budget = form.budgetEuros.trim() === '' ? null : Number(form.budgetEuros)
    if (budget !== null && (!Number.isFinite(budget) || budget < 0 || budget > 10000)) {
      setErreur('Le budget doit être compris entre 0 et 10 000 € par jour.')
      return
    }
    updateDb((db) => {
      const voyageur = db.users.find((candidat) => candidat.id === user.id)
      if (!voyageur) return
      voyageur.photoUrl = form.photoUrl
      voyageur.bio = form.bio.trim()
      voyageur.langues = form.langues
      voyageur.centresInteret = form.centresInteret
      voyageur.styleVoyage = form.styleVoyage
      voyageur.budgetJournalierCentimes = budget === null ? null : Math.round(budget * 100)
      voyageur.rythme = form.rythme
      voyageur.investissement = form.investissement
      voyageur.preferenceGenre = form.preferenceGenre
    })
    setInitial(form)
    toast('Votre profil a été mis à jour.')
  }

  return (
    <section className="profil-enrichi">
      <EntetePage avant={<RetourProfil page="Modifier mon profil" />} surtitre="Mon profil" titre="Modifier mon profil">
        <p>Présentez votre façon de voyager pour trouver des compagnons qui vous correspondent.</p>
      </EntetePage>

      <div className="profil-enrichi__grille">
        <Card as="form" className="profil-enrichi__form" onSubmit={enregistrer} noValidate>
          <fieldset className="choix photo-champ" id="champ-photo" tabIndex={-1}>
            <legend className="choix__legende">Photo</legend>
            <div className="photo-champ__ligne">
              <Avatar user={{ ...user, photoUrl: form.photoUrl }} taille={88} photo />
              <div className="photo-champ__actions">
                <input ref={fichier} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={choisirPhoto} />
                <Button variant="secondaire" icon={ImagePlus} onClick={() => fichier.current?.click()}>
                  {form.photoUrl ? 'Changer la photo' : 'Choisir une photo'}
                </Button>
                {form.photoUrl && <Button variant="fantome" icon={Trash2} onClick={() => maj('photoUrl', '')}>Retirer la photo</Button>}
              </div>
            </div>
            <p className="choix__aide">La photo reste sur cet appareil : elle est recadrée et réduite avant d’être enregistrée.</p>
            {erreurPhoto && <p className="profil-enrichi__erreur" role="alert">{erreurPhoto}</p>}
          </fieldset>

          <Field id="champ-bio" label="Présentation" aide={`Quelques mots pour vous présenter aux autres voyageurs. ${form.bio.length}/500`}>
            <Textarea value={form.bio} onChange={(e) => maj('bio', e.target.value)} rows={4} maxLength={500} />
          </Field>

          <PucesSaisie
            id="langues" legende="Langues parlées" valeurs={form.langues} suggestions={suggestionsLangues}
            onChange={(v) => maj('langues', v)} placeholder="Autre langue"
          />
          <PucesSaisie
            id="interets" legende="Centres d’intérêt" aide="Ils s’affichent sur votre profil et servent à calculer la compatibilité."
            valeurs={form.centresInteret} suggestions={suggestionsInterets}
            onChange={(v) => maj('centresInteret', v)} placeholder="Autre centre d’intérêt"
          />

          <ChoixUnique id="style" nom="style" legende="Style de voyage" options={STYLES} valeur={form.styleVoyage} onChange={(v) => maj('styleVoyage', v)} />
          <ChoixUnique id="rythme" nom="rythme" legende="Rythme" options={RYTHMES} valeur={form.rythme} onChange={(v) => maj('rythme', v)} />

          <div className="budget-champ">
            <ChoixUnique
              id="budget" nom="budget" legende="Budget par jour"
              aide="Logement, repas et transports sur place."
              options={BUDGETS} valeur={budgetChoisi} onChange={(v) => maj('budgetEuros', String(v))}
            />
            <Field id="champ-budget-montant" label="Montant précis (facultatif)" aide="Par exemple 50 € par jour.">
              <Input type="number" min="0" max="10000" step="1" inputMode="numeric" value={form.budgetEuros} onChange={(e) => maj('budgetEuros', e.target.value)} placeholder="50" />
            </Field>
          </div>

          <ChoixUnique
            id="partage" nom="partage" legende="Ce que je veux partager" options={PARTAGES} cartes
            valeur={form.investissement} onChange={(v) => maj('investissement', v)}
          />
          <ChoixUnique
            id="genre" nom="genre" legende="Je préfère voyager avec"
            aide="Sert à vos filtres de découverte ; ce choix n’est pas affiché sur votre profil public."
            options={GENRES} valeur={form.preferenceGenre} onChange={(v) => maj('preferenceGenre', v)}
          />

          {erreur && <p className="profil-enrichi__erreur" role="alert">{erreur}</p>}
          <div className="profil-enrichi__envoi">
            {mobile && <Button ref={boutonApercu} variant="secondaire" icon={Eye} onClick={() => setApercuOuvert(true)}>Aperçu</Button>}
            <Button type="submit" icon={modifie ? Save : Check} disabled={!modifie}>
              {modifie ? 'Enregistrer mon profil' : 'Profil enregistré'}
            </Button>
          </div>
        </Card>

        {!mobile && (
          <Card as="aside" className="profil-enrichi__apercu" aria-labelledby="apercu-profil-titre">
            <div className="profil-enrichi__apercu-tete">
              <Camera size={18} aria-hidden="true" />
              <h2 id="apercu-profil-titre">Comment les autres vous voient</h2>
            </div>
            <Apercu user={user} form={form} />
          </Card>
        )}
      </div>

      {mobile && (
        <Feuille ouvert={apercuOuvert} onFermer={() => setApercuOuvert(false)} titre="Comment les autres vous voient" declencheur={boutonApercu}>
          <Apercu user={user} form={form} />
        </Feuille>
      )}
    </section>
  )
}
