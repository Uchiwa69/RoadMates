// Hero de l'accueil : la promesse, la recherche « Où partez-vous ? » et le globe vitrine.
// Le champ de recherche et la liste des villes suffisent seuls : le globe est un plus.
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Globe2, MapPin, Search, X } from 'lucide-react'
import { useDb } from '../../../shared/db.js'
import { useCurrentUser } from '../../../shared/session.js'
import { paths } from '../../../shared/paths.js'
import { filtrerEtClasser, normaliser } from '../../../shared/texte.js'
import { PAYS, nomPays } from '../../../shared/globe/pays.js'
import GlobeTerre from '../../../shared/globe/Globe.jsx'
import { Button, Combobox, Field } from '../../../shared/ui/index.js'
import { VILLES } from '../villes.js'
import { arcsVoyages, pointsVoyageurs, villesDuPays } from '../globe.js'
import { suggestionsContenus } from '../../partenaires/recherche.js'

const ISO_DE_VILLE = new Map(VILLES.map((v) => [v.ville, v.iso]))
const pluriel = (n, mot) => `${n} ${mot}${n > 1 ? 's' : ''}`

export default function Hero() {
  const db = useDb((d) => d)
  const user = useCurrentUser()
  const navigate = useNavigate()
  const [saisie, setSaisie] = useState('')
  const [pays, setPays] = useState(null)
  const [villeActive, setVilleActive] = useState(null)

  const points = useMemo(() => pointsVoyageurs(db), [db])
  const arcs = useMemo(() => arcsVoyages(db), [db])
  const voyageursParPays = useMemo(() => {
    const m = new Map()
    for (const t of db.trips) {
      for (const e of t.etapes) {
        const iso = ISO_DE_VILLE.get(e.ville)
        if (iso) m.set(iso, (m.get(iso) ?? new Set()).add(t.userId))
      }
    }
    return m
  }, [db])
  const mesVilles = new Set(db.trips.filter((t) => t.userId === user?.id).flatMap((t) => t.etapes.map((e) => e.ville)))
  // Nouveaux objets quand la ville active change : le globe redessine alors les étiquettes.
  const villes = useMemo(
    () => (pays ? villesDuPays(pays, points).map((v) => ({ ...v, actif: v.ville === villeActive })) : []),
    [pays, points, villeActive],
  )
  const nbVoyageurs = new Set(db.trips.map((t) => t.userId)).size
  const populaires = [...points].sort((a, b) => b.nb - a.nb).slice(0, 5)

  // Une ville où je vais déjà → ses voyageurs ; sinon → déclarer un voyage prérempli.
  const cible = (ville) => (mesVilles.has(ville) ? paths.destination(ville) : paths.nouveauVoyageVers(ville))

  const choisirPays = (iso2) => {
    setPays(iso2)
    setVilleActive(null)
    setSaisie(nomPays(iso2))
  }
  const choisirVille = (v) => {
    setPays(v.iso)
    setVilleActive(v.ville)
    setSaisie(v.ville)
  }
  const toutVoir = () => {
    setPays(null)
    setVilleActive(null)
    setSaisie('')
  }

  const q = normaliser(saisie)
  const suggestions = q ? [
    ...filtrerEtClasser(VILLES, q, 'ville').slice(0, 4).map((v) => {
      const nb = points.find((p) => p.ville === v.ville)?.nb ?? 0
      return { id: `v-${v.ville}`, groupe: 'Villes', label: v.ville, detail: nb ? `${v.pays} · ${pluriel(nb, 'voyageur')}` : v.pays, icon: MapPin, ville: v }
    }),
    ...filtrerEtClasser(PAYS, q, 'nom').slice(0, 4).map((p) => {
      const nb = voyageursParPays.get(p.iso2)?.size ?? 0
      return { id: `p-${p.iso2}`, groupe: 'Pays', label: p.nom, detail: nb ? pluriel(nb, 'voyageur') : 'Pays', icon: Globe2, iso2: p.iso2 }
    }),
    ...suggestionsContenus(db, saisie),
  ] : []

  const nbDansPays = pays ? voyageursParPays.get(pays)?.size ?? 0 : 0

  return (
    <section className={`hero${pays ? ' hero--zoome' : ''}`} aria-labelledby="hero-titre">
      <div className="hero__texte">
        <p className="hero__surtitre">Compagnons de route pour voyageurs solo</p>
        <h1 id="hero-titre" className="hero__titre">
          Ne voyagez plus seul <em>quand vous n'en avez pas envie.</em>
        </h1>
        <p className="hero__intro">
          Trouvez les voyageurs qui font le même trajet que vous, rencontrez-les en confiance
          et partagez la voiture : chacun paie sa part dans l'application.
        </p>

        <form className="hero__recherche" role="search" onSubmit={(e) => e.preventDefault()}>
          <Field label="Où partez-vous ?" aide="Un pays, une ville, une activité : le globe vous y emmène.">
            <Combobox
              valeur={saisie}
              onValeur={(v) => { setSaisie(v); if (!v) toutVoir() }}
              suggestions={suggestions}
              onChoix={(s) => (s.onglet ? navigate(paths.destinationOnglet(s.ville, s.onglet, s.carte)) : s.iso2 ? choisirPays(s.iso2) : choisirVille(s.ville))}
              placeholder="Portugal, Lisbonne, Croatie…"
              vide="Aucun pays ni aucune ville trouvés."
              icon={Search}
            />
          </Field>
        </form>

        {!pays && (
          <div className="hero__populaires">
            <span className="hero__populaires-label" id="populaires">En route cet été</span>
            <ul aria-labelledby="populaires">
              {populaires.map((p) => (
                <li key={p.ville}>
                  <button type="button" className="hero__ville-chip" onClick={() => choisirVille(p)}>
                    {p.ville} <span aria-hidden="true">·</span> <span className="sr-only">,</span> {pluriel(p.nb, 'voyageur')}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="hero__actions">
          <Button to={paths.nouveauVoyage} taille="grand" iconEnd={ArrowRight}>Déclarer mon voyage</Button>
          <Button to={paths.compagnons} variant="secondaire" taille="grand">Voir mes compagnons</Button>
        </div>
        <p className="hero__compte">
          Pas encore de compte ? <Link to={paths.inscription}>Créer un compte</Link>
          <span aria-hidden="true"> · </span>
          <Link to={paths.connexion}>Se connecter</Link>
        </p>
      </div>

      <div className="hero__globe">
        <GlobeTerre
          className="hero__globe-canvas"
          label={`Globe des voyageurs RoadMates : ${pluriel(nbVoyageurs, 'voyageur')} dans ${pluriel(points.length, 'ville')}. Le champ « Où partez-vous ? » donne accès aux mêmes informations.`}
          points={points}
          arcs={arcs}
          villes={villes}
          pays={pays}
          villeActive={villeActive}
          onPays={choisirPays}
          onVille={(v) => (pays === v.iso ? navigate(cible(v.ville)) : choisirVille(v))}
        />

        {pays && (
          <div className="hero__pays" aria-live="polite">
            <div className="hero__pays-tete">
              <div>
                <h2 className="hero__pays-nom">{nomPays(pays)}</h2>
                <p className="hero__pays-meta">
                  {nbDansPays ? `${pluriel(nbDansPays, 'voyageur')} y ${nbDansPays > 1 ? 'passent' : 'passe'} cet été` : 'Personne pour l’instant : soyez le premier.'}
                </p>
              </div>
              <button type="button" className="hero__fermer" onClick={toutVoir} aria-label="Revenir au globe entier">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            {villes.length > 0 ? (
              <ul className="hero__villes">
                {villes.map((v) => (
                  <li key={v.ville}>
                    <Link to={cible(v.ville)} className={`hero__ville${v.ville === villeActive ? ' hero__ville--active' : ''}`}>
                      <MapPin size={18} aria-hidden="true" />
                      <span className="hero__ville-nom">{v.ville}</span>
                      <span className="hero__ville-nb">{v.nb ? pluriel(v.nb, 'voyageur') : 'Personne encore'}</span>
                      <span className="hero__ville-action">
                        {mesVilles.has(v.ville) ? 'Voir qui est là' : 'Déclarer un voyage'}
                        <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="hero__pays-vide">
                Aucune ville proposée dans ce pays pour l'instant.{' '}
                <Link to={paths.nouveauVoyage}>Déclarer un voyage</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
