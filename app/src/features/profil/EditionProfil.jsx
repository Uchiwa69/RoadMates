import { useState } from 'react'
import { BadgeCheck, Camera, Check, Save } from 'lucide-react'
import { updateDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { Badge, Button, Card, EntetePage, Field, Input, Select, Textarea, useToast } from '../../shared/ui/index.js'

const STYLES = ['routard', 'confort', 'aventure', 'culture', 'fête']
const RYTHMES = ['tranquille', 'modéré', 'actif']
const INVESTISSEMENTS = [
  { valeur: 'trajet', libelle: 'Juste un trajet' },
  { valeur: 'activites', libelle: 'Quelques activités' },
  { valeur: 'tout', libelle: 'Tout le voyage' },
]

function initialiser(user) {
  return {
    photoUrl: user.photoUrl ?? '',
    bio: user.bio ?? '',
    langues: (user.langues ?? []).join(', '),
    centresInteret: (user.centresInteret ?? []).join(', '),
    styleVoyage: user.styleVoyage ?? 'routard',
    budgetEuros: user.budgetJournalierCentimes == null ? '' : String(user.budgetJournalierCentimes / 100),
    rythme: user.rythme ?? 'modéré',
    investissement: user.investissement ?? 'activites',
  }
}

function AvatarProfil({ user, taille = 88 }) {
  return user.photoUrl ? (
    <img className="profil-enrichi__photo" src={user.photoUrl} alt="" referrerPolicy="no-referrer" style={{ width: taille, height: taille }} />
  ) : (
    <span className="profil-enrichi__initiale" aria-hidden="true" style={{ width: taille, height: taille }}>
      {(user.prenom ?? '?').trim().charAt(0).toUpperCase()}
    </span>
  )
}

export default function EditionProfil() {
  const user = useCurrentUser()
  const toast = useToast()
  const [form, setForm] = useState(() => initialiser(user ?? {}))
  const [erreur, setErreur] = useState('')
  const [enregistre, setEnregistre] = useState(false)

  if (!user) {
    return <Card><h1>Profil indisponible</h1><p>Aucun voyageur n’est connecté.</p></Card>
  }

  const modifier = (champ) => (event) => {
    setForm((actuel) => ({ ...actuel, [champ]: event.target.value }))
    setErreur('')
    setEnregistre(false)
  }

  function enregistrer(event) {
    event.preventDefault()
    const photoUrl = form.photoUrl.trim()
    if (photoUrl) {
      try {
        const url = new URL(photoUrl)
        if (!['https:', 'http:'].includes(url.protocol)) throw new Error('URL invalide')
      } catch {
        setErreur('Saisissez une adresse de photo valide commençant par http:// ou https://.')
        return
      }
    }
    const budget = form.budgetEuros.trim() === '' ? null : Number(form.budgetEuros)
    if (budget !== null && (!Number.isFinite(budget) || budget < 0 || budget > 10000)) {
      setErreur('Le budget doit être compris entre 0 et 10 000 euros par jour.')
      return
    }

    updateDb((db) => {
      const voyageur = db.users.find((candidat) => candidat.id === user.id)
      if (!voyageur) return
      voyageur.photoUrl = photoUrl
      voyageur.bio = form.bio.trim()
      voyageur.langues = [...new Set(form.langues.split(',').map((valeur) => valeur.trim()).filter(Boolean))]
      voyageur.centresInteret = [...new Set(form.centresInteret.split(',').map((valeur) => valeur.trim()).filter(Boolean))]
      voyageur.styleVoyage = form.styleVoyage
      voyageur.budgetJournalierCentimes = budget === null ? null : Math.round(budget * 100)
      voyageur.rythme = form.rythme
      voyageur.investissement = form.investissement
    })
    setEnregistre(true)
    toast('Votre profil a été mis à jour.')
  }

  const investissement = INVESTISSEMENTS.find((option) => option.valeur === form.investissement)?.libelle

  return (
    <section className="profil-enrichi">
      <EntetePage surtitre="Votre espace" titre="Mon profil">
        <p>Présentez votre façon de voyager pour trouver des compagnons qui vous correspondent.</p>
      </EntetePage>

      <div className="profil-enrichi__grille">
        <Card as="form" className="profil-enrichi__form" onSubmit={enregistrer}>
          <div className="profil-enrichi__identite">
            <AvatarProfil user={{ ...user, photoUrl: form.photoUrl.trim() }} />
            <div>
              <h2>{user.prenom}</h2>
              <p>{user.age} ans</p>
              {user.verifie
                ? <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>
                : <Badge ton="neutre">Identité non vérifiée</Badge>}
            </div>
          </div>

          <Field label="Adresse de la photo" aide="Laissez vide pour afficher votre initiale.">
            <Input type="url" value={form.photoUrl} onChange={modifier('photoUrl')} placeholder="https://exemple.fr/photo.jpg" autoComplete="url" />
          </Field>
          <Field label="Présentation" aide="Quelques mots pour vous présenter aux autres voyageurs.">
            <Textarea value={form.bio} onChange={modifier('bio')} rows={4} maxLength={500} />
          </Field>
          <Field label="Langues parlées" aide="Séparez les langues par des virgules.">
            <Input value={form.langues} onChange={modifier('langues')} placeholder="français, anglais" />
          </Field>
          <Field label="Centres d’intérêt" aide="Saisissez des mots-clés séparés par des virgules; ils seront affichés comme des tags.">
            <Input value={form.centresInteret} onChange={modifier('centresInteret')} placeholder="randonnée, cuisine, photographie" />
          </Field>
          <div className="profil-enrichi__ligne">
            <Field label="Style de voyage">
              <Select value={form.styleVoyage} onChange={modifier('styleVoyage')}>
                {STYLES.map((style) => <option key={style} value={style}>{style[0].toUpperCase() + style.slice(1)}</option>)}
              </Select>
            </Field>
            <Field label="Rythme">
              <Select value={form.rythme} onChange={modifier('rythme')}>
                {RYTHMES.map((rythme) => <option key={rythme} value={rythme}>{rythme[0].toUpperCase() + rythme.slice(1)}</option>)}
              </Select>
            </Field>
          </div>
          <div className="profil-enrichi__ligne">
            <Field label="Budget par jour (€)" aide="Montant enregistré en centimes.">
              <Input type="number" min="0" max="10000" step="0.01" inputMode="decimal" value={form.budgetEuros} onChange={modifier('budgetEuros')} placeholder="50" />
            </Field>
            <Field label="Investissement souhaité">
              <Select value={form.investissement} onChange={modifier('investissement')}>
                {INVESTISSEMENTS.map(({ valeur, libelle }) => <option key={valeur} value={valeur}>{libelle}</option>)}
              </Select>
            </Field>
          </div>
          {erreur && <p className="profil-enrichi__erreur" role="alert">{erreur}</p>}
          <Button type="submit" icon={enregistre ? Check : Save}>Enregistrer mon profil</Button>
          {enregistre && <p className="sr-only" role="status">Profil enregistré.</p>}
        </Card>

        <Card as="aside" className="profil-enrichi__apercu" aria-label="Aperçu du profil">
          <div className="profil-enrichi__apercu-tete">
            <Camera size={18} aria-hidden="true" />
            <h2>Aperçu</h2>
          </div>
          <div className="profil-enrichi__identite">
            <AvatarProfil user={{ ...user, photoUrl: form.photoUrl.trim() }} taille={64} />
            <div><h3>{user.prenom}, {user.age} ans</h3><p>{form.styleVoyage}</p></div>
          </div>
          <p>{form.bio || 'Votre présentation apparaîtra ici.'}</p>
          <ul className="profil-enrichi__tags" aria-label="Centres d’intérêt">
            {form.centresInteret.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => <li key={tag}>{tag}</li>)}
          </ul>
          <p>{form.langues ? `Langues : ${form.langues}` : 'Langues non renseignées'}</p>
          <p>{form.budgetEuros ? `${Number(form.budgetEuros).toLocaleString('fr-FR')} € par jour` : 'Budget non renseigné'}</p>
          <p>Rythme {form.rythme}; {investissement?.toLowerCase()}.</p>
          {user.verifie && <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>}
        </Card>
      </div>
    </section>
  )
}
