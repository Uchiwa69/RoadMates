// Accueil — la promesse de RoadMates, le globe vitrine et l'entrée dans le parcours de Léa.
import { m } from 'motion/react'
import {
  ArrowRight, BadgeCheck, BadgePercent, Flag, MessageCircleHeart, PiggyBank, Route, Search,
  ShieldCheck, Users, Wallet, Venus,
} from 'lucide-react'
import { useDb } from '../../../shared/db.js'
import { paths } from '../../../shared/paths.js'
import { Avatar, Badge, Button, MatchRing } from '../../../shared/ui/index.js'
import Hero from '../accueil/Hero.jsx'
import PartageVoiture from '../accueil/PartageVoiture.jsx'
import '../accueil/accueil.css'

const PROMESSES = [
  { icon: Search, titre: 'Trouver', texte: 'Voyez avant le départ qui partage votre itinéraire, et sur place qui est dans la même ville aux mêmes dates.' },
  { icon: ShieldCheck, titre: 'Faire confiance', texte: 'Identité vérifiée, filtres par âge, langue et genre, avis après le voyage.' },
  { icon: Wallet, titre: 'Partager', texte: 'Une dépense commune pour la voiture ou l’activité : chacun paie sa part dans l’application.' },
  { icon: BadgePercent, titre: 'Économiser', texte: 'Des réductions de groupe chez les auberges et les activités partenaires.' },
]

const ETAPES = [
  { icon: Route, titre: 'Je déclare mon voyage', texte: 'Algarve, du 10 au 17 juillet : Lagos puis Faro. Moins d’une minute.' },
  { icon: Users, titre: 'Je trouve mes compagnons', texte: 'RoadMates montre qui partage au moins une étape, avec les dates en commun.' },
  { icon: PiggyBank, titre: 'On partage la voiture', texte: 'Une dépense, des parts égales. La réservation part quand tout le monde a payé.' },
]

const CONFIANCE = [
  { icon: BadgeCheck, titre: 'Identité vérifiée', texte: 'Pièce officielle et selfie au premier contact ; la copie est supprimée sous 30 jours.' },
  { icon: MessageCircleHeart, titre: 'Messagerie après acceptation', texte: 'Personne ne peut vous écrire tant que vous n’avez pas accepté sa demande.' },
  { icon: Venus, titre: 'Préférence de genre', texte: 'Choisissez Hommes, Femmes ou Les deux, puis affinez par âge, langue et profil.' },
  { icon: Flag, titre: 'Signalement', texte: 'Un profil inadapté se signale en deux clics ; la modération répond sous 24 h.' },
]

// Apparition douce au défilement ; désactivée si l'utilisateur réduit les animations.
const apparition = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, ease: [0.22, 0.8, 0.36, 1] },
}
const cascade = (i) => ({ ...apparition, transition: { ...apparition.transition, delay: i * 0.08 } })

export default function Accueil() {
  const ines = useDb((db) => db.users.find((u) => u.id === 'u-ines'))

  return (
    <div className="accueil">
      <Hero />

      <section className="accueil__section" aria-labelledby="promesses">
        <m.div className="accueil__entete" {...apparition}>
          <p className="accueil__surtitre">Quatre promesses</p>
          <h2 id="promesses">Partir seul, sans être seul</h2>
        </m.div>
        <ul className="promesses">
          {PROMESSES.map(({ icon: Icon, titre, texte }, i) => (
            <m.li key={titre} className="promesse" {...cascade(i)}>
              <span className="promesse__icone" aria-hidden="true"><Icon size={24} /></span>
              <h3>{titre}</h3>
              <p>{texte}</p>
            </m.li>
          ))}
        </ul>
      </section>

      <section className="accueil__section" aria-labelledby="comment">
        <m.div className="accueil__entete" {...apparition}>
          <p className="accueil__surtitre">Comment ça marche</p>
          <h2 id="comment">Trois étapes jusqu'à la route</h2>
        </m.div>
        <ol className="etapes-accueil">
          {ETAPES.map(({ icon: Icon, titre, texte }, i) => (
            <m.li key={titre} className="etape-accueil" {...cascade(i)}>
              <span className="etape-accueil__num" aria-hidden="true">{i + 1}</span>
              <span className="etape-accueil__icone" aria-hidden="true"><Icon size={22} /></span>
              <h3>{titre}</h3>
              <p>{texte}</p>
            </m.li>
          ))}
        </ol>
      </section>

      <section className="accueil__section exemple" aria-labelledby="exemple">
        <m.div className="exemple__texte" {...apparition}>
          <p className="accueil__surtitre">Le calcul de Léa</p>
          <h2 id="exemple">Voiture 240 € → 60 € chacun à 4</h2>
          <p>
            Léa ne pouvait pas louer seule une voiture pour son road trip dans l'Algarve.
            Avec trois voyageurs rencontrés sur RoadMates, la part de chacun s'affiche en premier,
            et personne n'est engagé tant que toutes les parts ne sont pas payées.
          </p>
        </m.div>
        <m.div {...cascade(1)}>
          <PartageVoiture />
        </m.div>
      </section>

      <section className="accueil__section confiance" aria-labelledby="confiance">
        <div>
          <m.div className="accueil__entete accueil__entete--gauche" {...apparition}>
            <p className="accueil__surtitre">La confiance d'abord</p>
            <h2 id="confiance">Rencontrer des inconnus, en sécurité</h2>
          </m.div>
          <ul className="confiance__liste">
            {CONFIANCE.map(({ icon: Icon, titre, texte }, i) => (
              <m.li key={titre} className="confiance__item" {...cascade(i)}>
                <span className="confiance__icone" aria-hidden="true"><Icon size={22} /></span>
                <div>
                  <h3>{titre}</h3>
                  <p>{texte}</p>
                </div>
              </m.li>
            ))}
          </ul>
        </div>

        {ines && (
          <m.figure className="confiance__exemple" {...cascade(2)} aria-label="Exemple de profil : Inès, identité vérifiée, 2 étapes sur 2 en commun">
            <div className="profil-mini" aria-hidden="true">
              <div className="profil-mini__tete">
                <Avatar user={ines} taille={56} />
                <div>
                  <p className="profil-mini__nom">{ines.prenom}, {ines.age} ans</p>
                  <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>
                </div>
                <MatchRing valeur={2} total={2} />
              </div>
              <p className="profil-mini__commun"><strong>2 étapes sur 2</strong> en commun · Lagos, Faro</p>
              <p className="profil-mini__langues">Parle français, espagnol</p>
              <div className="profil-mini__action">Demander le contact</div>
            </div>
            <figcaption>Chaque profil montre ce qui compte : l'identité vérifiée et ce que vous avez en commun.</figcaption>
          </m.figure>
        )}
      </section>

      <m.section className="cta-final" aria-labelledby="cta" {...apparition}>
        <h2 id="cta">Votre prochain road trip commence ici</h2>
        <p>Déclarez votre voyage en moins d'une minute et voyez qui part avec vous.</p>
        <div className="cta-final__actions">
          <Button to={paths.nouveauVoyage} taille="grand" iconEnd={ArrowRight}>Déclarer mon voyage</Button>
          <Button to={paths.compagnons} variant="fantome" taille="grand" className="cta-final__secondaire">Voir mes compagnons</Button>
        </div>
      </m.section>
    </div>
  )
}
