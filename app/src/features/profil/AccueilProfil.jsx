// Accueil de l'espace « Mon profil » : carte d'identité, complétude, réglages et apparence.
import { Link } from 'react-router-dom'
import {
  BadgeCheck, ChevronRight, Eye, EyeOff, Monitor, Moon, PenLine, Shield, ShieldAlert, Star, Sun, UserCog,
} from 'lucide-react'
import { updateDb, useDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { formatJusqua, itineraireMasque, profilMasque } from '../../shared/confidentialite.js'
import { choisirTheme, useChoixTheme } from '../../shared/theme.js'
import { Avatar, Badge, Button, Card, EmptyState, EntetePage, ProgressBar, useToast } from '../../shared/ui/index.js'
import { avisPublics, moyenneAvis } from '../avis/avis.js'
import { avisALaisser, completude } from './completude.js'
import { libelleStyle } from './options.js'

const THEMES = [
  { valeur: 'light', libelle: 'Clair', icon: Sun },
  { valeur: 'dark', libelle: 'Sombre', icon: Moon },
  { valeur: 'auto', libelle: 'Automatique', icon: Monitor },
]

function Reglage({ to, icon: Icon, titre, etat, ton }) {
  return (
    <li>
      <Link to={to} className="reglage">
        <span className="reglage__icone" aria-hidden="true"><Icon size={20} /></span>
        <span className="reglage__titre">{titre}</span>
        {etat && <span className={`reglage__etat${ton ? ` reglage__etat--${ton}` : ''}`}>{etat}</span>}
        <ChevronRight size={18} aria-hidden="true" className="reglage__chevron" />
      </Link>
    </li>
  )
}

// Résumé de la confidentialité, du plus restrictif au plus ouvert.
function etatConfidentialite(user) {
  const profil = profilMasque(user)
  const itineraire = itineraireMasque(user)
  if (profil) return { texte: `Profil masqué jusqu’au ${formatJusqua(user.anonymat.profilJusqua, true)}`, ton: 'alerte' }
  if (itineraire) return { texte: `Itinéraire masqué jusqu’au ${formatJusqua(user.anonymat.itineraireJusqua, true)}`, ton: 'alerte' }
  return { texte: 'Profil visible' }
}

export default function AccueilProfil() {
  const user = useCurrentUser()
  const db = useDb((d) => d)
  const choixTheme = useChoixTheme()
  const toast = useToast()

  if (!user) {
    return (
      <section>
        <h1 className="sr-only">Mon profil</h1>
        <EmptyState icon={UserCog} titre="Aucun voyageur n’est connecté." action={<Button to={paths.connexion}>Se connecter</Button>} />
      </section>
    )
  }

  const { pourcentage, manquants } = completude(user)
  const publics = avisPublics(db, user.id)
  const moyenne = moyenneAvis(publics)
  const aLaisser = avisALaisser(db, user.id).length
  const confidentialite = etatConfidentialite(user)
  const anonyme = profilMasque(user) || itineraireMasque(user)
  const etatAvis = aLaisser > 0
    ? { texte: `${aLaisser} avis à laisser`, ton: 'action' }
    : { texte: moyenne == null ? 'Aucun avis publié' : `${moyenne.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} ★ (${publics.length})` }

  function redevenirVisible() {
    updateDb((base) => {
      const moi = base.users.find((u) => u.id === user.id)
      if (moi) moi.anonymat = { ...moi.anonymat, profilJusqua: null, itineraireJusqua: null }
    })
    toast('Votre profil et votre itinéraire sont de nouveau visibles.')
  }

  return (
    <section className="espace-profil">
      <EntetePage surtitre="Votre espace" titre="Mon profil" />

      {anonyme && (
        <div className="espace-profil__bandeau" role="status">
          <EyeOff size={20} aria-hidden="true" />
          <p>
            <strong>Mode anonyme actif.</strong>{' '}
            {profilMasque(user)
              ? `Votre profil est masqué jusqu’au ${formatJusqua(user.anonymat.profilJusqua)}.`
              : `Votre itinéraire est masqué jusqu’au ${formatJusqua(user.anonymat.itineraireJusqua)}.`}
          </p>
          <Button variant="secondaire" icon={Eye} onClick={redevenirVisible}>Redevenir visible</Button>
        </div>
      )}

      <div className="espace-profil__grille">
        <Card className="identite">
          <Avatar user={user} taille={96} photo className="identite__avatar" />
          <div className="identite__texte">
            <h2 className="identite__nom">{user.prenom}{user.age ? <span>, {user.age} ans</span> : null}</h2>
            {user.verifie
              ? <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>
              : <Badge ton="alerte" icon={ShieldAlert}>Identité à vérifier</Badge>}
            {user.styleVoyage && <p className="identite__style">Style de voyage : {libelleStyle(user.styleVoyage).toLowerCase()}</p>}
            {(user.centresInteret ?? []).length > 0 && (
              <ul className="identite__tags" aria-label="Centres d’intérêt">
                {user.centresInteret.slice(0, 3).map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </div>
          <div className="identite__actions">
            <Button to={paths.profil(user.id)} variant="secondaire" icon={Eye}>Voir mon profil public</Button>
            <Button to={paths.profilModifier} icon={PenLine}>Modifier</Button>
          </div>
        </Card>

        <Card className="completude">
          <h2 className="completude__titre">{pourcentage === 100 ? 'Profil complet' : 'Complétez votre profil'}</h2>
          <ProgressBar valeur={pourcentage} max={100} label={`Profil complété à ${pourcentage} %`} ton={pourcentage === 100 ? 'succes' : 'primaire'} />
          {manquants.length > 0 ? (
            <ul className="completude__liste">
              {manquants.slice(0, 2).map((m) => (
                <li key={m.champ}><Link to={paths.profilModifierChamp(m.champ)}>{m.libelle}</Link></li>
              ))}
            </ul>
          ) : (
            <p className="completude__ok">Les autres voyageurs ont tout ce qu’il faut pour vous choisir.</p>
          )}
        </Card>
      </div>

      <section aria-labelledby="reglages-titre" className="espace-profil__bloc">
        <h2 id="reglages-titre" className="espace-profil__sous-titre">Réglages</h2>
        <ul className="reglages">
          <Reglage to={paths.profilModifier} icon={PenLine} titre="Modifier mon profil" etat={`${pourcentage} % complété`} />
          <Reglage to={paths.profilConfidentialite} icon={Shield} titre="Confidentialité" etat={confidentialite.texte} ton={confidentialite.ton} />
          <Reglage to={paths.profilAvis} icon={Star} titre="Avis et amis de route" etat={etatAvis.texte} ton={etatAvis.ton} />
          <Reglage to={paths.profilCompte} icon={UserCog} titre="Compte et données" etat={user.email} />
        </ul>
      </section>

      <section aria-labelledby="apparence-titre" className="espace-profil__bloc">
        <h2 id="apparence-titre" className="espace-profil__sous-titre">Apparence</h2>
        <div className="apparence" role="radiogroup" aria-labelledby="apparence-titre">
          {THEMES.map(({ valeur, libelle, icon: Icon }) => (
            <label key={valeur} className="apparence__choix">
              <input type="radio" name="theme" value={valeur} checked={choixTheme === valeur} onChange={() => choisirTheme(valeur)} />
              <Icon size={18} aria-hidden="true" />
              {libelle}
            </label>
          ))}
        </div>
      </section>
    </section>
  )
}
