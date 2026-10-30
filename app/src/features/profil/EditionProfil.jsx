import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BadgeCheck, Camera, Check, Save, Shield } from 'lucide-react'
import { updateDb, useDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { Badge, Button, Card, EntetePage, Field, Input, Select, Textarea, useToast } from '../../shared/ui/index.js'
import { paths } from '../../shared/paths.js'
import { profilMasque, itineraireMasque } from '../../shared/confidentialite.js'
import { aujourdhui } from '../decouverte/dates.js'

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
    preferenceGenre: ['H', 'F', 'tous'].includes(user.preferenceGenre) ? user.preferenceGenre : 'tous',
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
  const db = useDb((base) => base)
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
      voyageur.preferenceGenre = form.preferenceGenre
    })
    setEnregistre(true)
    toast('Votre profil a été mis à jour.')
  }

  const investissement = INVESTISSEMENTS.find((option) => option.valeur === form.investissement)?.libelle
  const aujourdHui = aujourdhui()
  const amis = new Set(user.amisRoute ?? [])
  const amisVisibles = db.users.filter((candidat) => amis.has(candidat.id) && !profilMasque(candidat) && !(db.blocages ?? []).some((blocage) => (blocage.bloqueurId === user.id && blocage.bloqueId === candidat.id) || (blocage.bloqueurId === candidat.id && blocage.bloqueId === user.id)))
  const prochainesDestinations = (user.amisRoute ?? []).flatMap((amiId) => {
    const ami = db.users.find((candidat) => candidat.id === amiId)
    if (!ami || profilMasque(ami) || itineraireMasque(ami) || (db.blocages ?? []).some((blocage) => (blocage.bloqueurId === user.id && blocage.bloqueId === ami.id) || (blocage.bloqueurId === ami.id && blocage.bloqueId === user.id))) return []
    const voyagesMoi = db.trips.filter((trip) => trip.userId === user.id)
    const voyagesAmi = db.trips.filter((trip) => trip.userId === amiId)
    const communes = []
    for (const voyageMoi of voyagesMoi) for (const voyageAmi of voyagesAmi) for (const etapeMoi of voyageMoi.etapes) for (const etapeAmi of voyageAmi.etapes) {
      const debut = etapeMoi.debut > etapeAmi.debut ? etapeMoi.debut : etapeAmi.debut
      const fin = etapeMoi.fin < etapeAmi.fin ? etapeMoi.fin : etapeAmi.fin
      if (etapeMoi.ville === etapeAmi.ville && debut <= fin && fin >= aujourdHui) communes.push({ amiId, ami: ami.prenom, ville: etapeMoi.ville, debut, fin })
    }
    return communes
  }).sort((a, b) => a.debut.localeCompare(b.debut))

  return (
    <section className="profil-enrichi">
      <EntetePage surtitre="Votre espace" titre="Mon profil">
        <p>Présentez votre façon de voyager pour trouver des compagnons qui vous correspondent.</p>
        <Button to={paths.confidentialite} variant="secondaire" icon={Shield}>Confidentialité</Button>
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
          <Field label="Genre des voyageurs souhaités">
            <Select value={form.preferenceGenre} onChange={modifier('preferenceGenre')}>
              <option value="H">Hommes</option>
              <option value="F">Femmes</option>
              <option value="tous">Les deux</option>
            </Select>
          </Field>
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

        <p className="sr-only" role="note">La préférence de genre est enregistrée pour vos filtres de découverte et n’est pas affichée sur votre profil public.</p>

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

      <Card as="section" className="profil-enrichi__amis" aria-labelledby="amis-route-titre">
        <h2 id="amis-route-titre">Amis de route</h2>
        <p>Les voyageurs ajoutés après un parcours partagé et leurs prochaines destinations en commun.</p>
        {amisVisibles.length === 0
          ? <p>Vous n’avez pas encore d’ami de route.</p>
          : <ul>{amisVisibles.map((ami) => <li key={ami.id}><Link to={paths.profil(ami.id)}>{ami.prenom}</Link></li>)}</ul>}
        <h3>Destinations communes à venir</h3>
        {prochainesDestinations.length === 0
          ? <p>Aucun voyage commun à venir pour le moment.</p>
          : <ul>{prochainesDestinations.map((destination) => <li key={`${destination.amiId}-${destination.ville}-${destination.debut}`}><Link to={paths.destination(destination.ville)}>{destination.ville}</Link> avec {destination.ami} · {destination.debut} – {destination.fin}</li>)}</ul>}
        <Button to={paths.avis} variant="secondaire">Laisser ou consulter des avis</Button>
      </Card>
    </section>
  )
}
