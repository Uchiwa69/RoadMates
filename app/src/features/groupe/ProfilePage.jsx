// US-08 — profil d'un voyageur et demande de contact.
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, Check, Clock, Inbox, Languages, Send, ShieldCheck, UserRoundX, Users } from 'lucide-react'
import { useDb, updateDb, newId } from '../../shared/db.js'
import { itineraireMasque, profilMasque } from '../../shared/confidentialite.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { Avatar, Badge, Button, Card, EmptyState, Field, Textarea, Timeline, useToast } from '../../shared/ui/index.js'
import { formatPeriode } from './format.js'
import { avisPublics, moyenneAvis, ontVoyageCommunTermine } from '../avis/avis.js'

const MAX = 300

export default function ProfilePage() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const user = useDb((db) => db.users.find((candidate) => candidate.id === userId) ?? null)
  const database = useDb((db) => db)
  const trips = database.trips
  const requests = database.requests
  const currentUser = useCurrentUser()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const formulaire = useRef(null)
  const zone = useRef(null)
  const [formulaireVisible, setFormulaireVisible] = useState(true)

  const connected = !!user && requests.some((request) =>
    request.statut === 'acceptee' &&
    ((request.fromId === currentUser?.id && request.toId === user.id) ||
      (request.fromId === user.id && request.toId === currentUser?.id)),
  )
  const outgoing = !!user && requests.some((request) =>
    request.fromId === currentUser?.id && request.toId === user.id && request.statut === 'en_attente',
  )
  const incoming = !!user && requests.some((request) =>
    request.fromId === user.id && request.toId === currentUser?.id && request.statut === 'en_attente',
  )
  const bloque = !!user && (database.blocages ?? []).some((blocage) =>
    (blocage.bloqueurId === currentUser?.id && blocage.bloqueId === user.id) ||
    (blocage.bloqueurId === user.id && blocage.bloqueId === currentUser?.id),
  )
  const peutDemander = !!user && !!currentUser && currentUser.id !== user.id && currentUser.verifie === true && !connected && !outgoing && !incoming && !bloque

  // Mobile : le bouton « Demander le contact » reste visible tant que le formulaire est hors écran.
  useEffect(() => {
    if (!peutDemander || !formulaire.current) return
    const io = new IntersectionObserver(([e]) => setFormulaireVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(formulaire.current)
    return () => io.disconnect()
  }, [peutDemander])

  if (!user) {
    return (
      <EmptyState icon={UserRoundX} titre="Profil introuvable" action={<Button to={paths.compagnons}>Voir mes compagnons</Button>}>
        <p>Ce voyageur n’existe pas.</p>
      </EmptyState>
    )
  }

  const estMonProfil = currentUser?.id === user.id
  if (bloque) {
    return <EmptyState icon={ShieldCheck} titre="Profil indisponible"><p>Ce profil n’est pas disponible.</p></EmptyState>
  }
  if (!estMonProfil && profilMasque(user)) {
    return (
      <EmptyState icon={ShieldCheck} titre="Profil masqué temporairement">
        <p>Ce voyageur a choisi de masquer son profil pour le moment.</p>
      </EmptyState>
    )
  }

  const itineraireCache = !estMonProfil && itineraireMasque(user)
  const sesVoyages = itineraireCache ? [] : trips.filter((trip) => trip.userId === userId)
  const mesVoyages = trips.filter((trip) => trip.userId === currentUser?.id)
  const mesEtapes = mesVoyages.flatMap((trip) => trip.etapes)
  const enCommun = (etape) => mesEtapes.some((e) => e.ville === etape.ville && e.debut <= etape.fin && etape.debut <= e.fin)
  const amisRoute = currentUser?.amisRoute ?? []
  const peutAjouterAmiRoute = !!connected && currentUser?.id !== user.id && !amisRoute.includes(user.id) && ontVoyageCommunTermine(mesVoyages, trips.filter((trip) => trip.userId === user.id))
  const avisVisibles = avisPublics(database, user.id)

  function ajouterAmiRoute() {
    if (!peutAjouterAmiRoute) return
    updateDb((db) => {
      const moi = db.users.find((candidat) => candidat.id === currentUser.id)
      if (!moi) return
      moi.amisRoute ??= []
      if (!moi.amisRoute.includes(user.id)) moi.amisRoute.push(user.id)
    })
    toast(`${user.prenom} a été ajouté à vos amis de route.`)
  }

  function sendRequest(event) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) {
      setError('Ajoutez un message de présentation avant d’envoyer la demande.')
      return
    }
    if (trimmedMessage.length > MAX) {
      setError('Le message ne peut pas dépasser 300 caractères.')
      return
    }
    if (!peutDemander) return

    updateDb((db) => {
      db.requests.push({
        id: newId('r'),
        fromId: currentUser.id,
        toId: user.id,
        message: trimmedMessage,
        statut: 'en_attente',
        creeLe: new Date().toISOString(),
      })
    })
    setMessage('')
    setError('')
    toast(`Demande envoyée à ${user.prenom}.`)
  }

  const allerAuFormulaire = () => {
    formulaire.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    zone.current?.focus({ preventScroll: true })
  }

  return (
    <section className="profil">
      <button type="button" className="ui-retour" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate(paths.compagnons))}>
        <ArrowLeft size={18} aria-hidden="true" /> Retour
      </button>

      <div className="profil__grille">
        <div className="profil__principal">
          <Card className="profil__tete">
            <div className="profil__fond" aria-hidden="true" />
            {user.photoUrl
              ? <img src={user.photoUrl} alt={`Photo de ${user.prenom}`} className="profil__photo profil__photo--avatar" referrerPolicy="no-referrer" />
              : <Avatar user={user} taille={96} />}
            <div className="profil__identite">
              <h1 className="profil__nom">{user.prenom}</h1>
              <p className="profil__age">{user.age} ans</p>
              <div className="profil__badges">
                {user.verifie
                  ? <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>
                  : <Badge ton="neutre">Identité non vérifiée</Badge>}
                {connected && <Badge ton="primaire" icon={Users}>En contact</Badge>}
              </div>
            </div>
            <p className="profil__langues">
              <Languages size={18} aria-hidden="true" />
              {user.langues?.length ? `Parle ${user.langues.join(', ')}` : 'Langues non renseignées'}
            </p>
            <blockquote className="profil__bio">{user.bio || 'Aucune présentation.'}</blockquote>
            {user.centresInteret?.length > 0 && (
              <section aria-label="Centres d’intérêt">
                <h2>Centres d’intérêt</h2>
                <ul className="profil__interets">
                  {user.centresInteret.map((interet) => <li key={interet}>{interet}</li>)}
                </ul>
              </section>
            )}
            <dl className="profil__preferences">
              {user.styleVoyage && <div><dt>Style de voyage</dt><dd>{user.styleVoyage}</dd></div>}
              {user.budgetJournalierCentimes != null && <div><dt>Budget par jour</dt><dd>{(user.budgetJournalierCentimes / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</dd></div>}
              {user.rythme && <div><dt>Rythme</dt><dd>{user.rythme}</dd></div>}
              {user.investissement && <div><dt>Investissement souhaité</dt><dd>{({ trajet: 'Juste un trajet', activites: 'Quelques activités', tout: 'Tout le voyage' })[user.investissement] ?? user.investissement}</dd></div>}
            </dl>
          </Card>

          <section className="profil__section" aria-labelledby="avis-titre">
            <h2 id="avis-titre">Avis mutuels</h2>
            {avisVisibles.length === 0
              ? <p className="profil__vide">Aucun avis mutuel publié.</p>
              : <>
                <p>Note moyenne : <strong>{moyenneAvis(avisVisibles).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}/5</strong> ({avisVisibles.length} avis)</p>
                <ul>{avisVisibles.map((avis) => <li key={avis.id}><strong>{avis.auteur} · {avis.note}/5</strong><p>{avis.commentaire || 'Aucun commentaire.'}</p></li>)}</ul>
              </>}
          </section>

          <section aria-labelledby="etapes-titre" className="profil__section">
            <h2 id="etapes-titre">Étapes de voyage</h2>
            {itineraireCache ? <p className="profil__vide">Itinéraire masqué temporairement.</p> : sesVoyages.length === 0 ? <p className="profil__vide">Aucun voyage déclaré pour le moment.</p> : (
              <div className="profil__voyages">
                {sesVoyages.map((trip) => (
                  <Card key={trip.id} as="article" className="profil__voyage">
                    <h3>{trip.destination}</h3>
                    <Timeline
                      items={[...trip.etapes].sort((a, b) => a.debut.localeCompare(b.debut)).map((etape, index) => ({
                        key: `${trip.id}-${etape.ville}-${index}`,
                        titre: `${etape.ville}${etape.pays ? `, ${etape.pays}` : ''}`,
                        sousTitre: formatPeriode(etape.debut, etape.fin),
                        extra: enCommun(etape) && currentUser?.id !== user.id
                          ? <Badge ton="primaire" className="profil__commun">Vous y êtes aussi</Badge>
                          : null,
                      }))}
                    />
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="profil__contact" aria-labelledby="contact-titre">
          <Card className="profil__contact-carte">
            <h2 id="contact-titre">Contact</h2>
            {connected ? (
              <>
                <Badge ton="succes" icon={Check}>En contact</Badge>
                {peutAjouterAmiRoute && <Button variant="secondaire" onClick={ajouterAmiRoute}>Ajouter à mes amis de route</Button>}
                <p className="profil__aide">Vous pouvez l’ajouter à un groupe pour discuter et partager les frais.</p>
                <Button to={paths.groupes} variant="secondaire">Voir mes groupes</Button>
              </>
            ) : outgoing ? (
              <>
                <Badge ton="alerte" icon={Clock}>Demande envoyée</Badge>
                <p className="profil__aide">{user.prenom} peut accepter ou refuser. Vous pourrez discuter après acceptation.</p>
              </>
            ) : incoming ? (
              <>
                <p className="profil__aide">Cette personne vous a écrit.</p>
                <Button to={paths.demandes} icon={Inbox}>Voir la demande</Button>
              </>
            ) : currentUser?.id === user.id ? (
              <p className="profil__aide">C’est votre profil.</p>
            ) : !currentUser?.verifie ? (
              <p className="profil__aide">Vérifiez votre identité pour envoyer une demande de contact.</p>
            ) : (
              <form ref={formulaire} className="profil__form" onSubmit={sendRequest} noValidate>
                <Field
                  label="Message de présentation (300 caractères maximum)"
                  aide={`${message.length}/${MAX} caractères`}
                  error={error}
                >
                  <Textarea
                    ref={zone}
                    value={message}
                    maxLength={MAX}
                    rows={5}
                    placeholder={`Bonjour ${user.prenom}, on a des étapes en commun…`}
                    onChange={(event) => { setMessage(event.target.value); setError('') }}
                  />
                </Field>
                <p className="profil__rassurance">
                  <ShieldCheck size={16} aria-hidden="true" />
                  Aucun message ne peut être échangé avant que {user.prenom} accepte.
                </p>
                <Button type="submit" icon={Send} className="ui-btn--plein">Demander le contact</Button>
              </form>
            )}
          </Card>
        </aside>
      </div>

      {peutDemander && !formulaireVisible && (
        <div className="profil__cta-mobile">
          <Button onClick={allerAuFormulaire} icon={Send} className="ui-btn--plein">Demander le contact</Button>
        </div>
      )}
    </section>
  )
}
