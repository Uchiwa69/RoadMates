// Pastille « Mode démo » : choisir qui l'on incarne et réinitialiser les données.
// Visible pour le jury, mais hors du chemin de l'utilisateur.
import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, RotateCcw, X } from 'lucide-react'
import { useDb, resetDb } from './db.js'
import { paths } from './paths.js'
import { setCurrentPartenaire, setCurrentUser, usePartenaire } from './session.js'
import { Avatar, useToast } from './ui/index.js'

// Les personnages du parcours de démo (PLAN-PROTOTYPE.md §6), affichés en premier.
const PERSONNAGES = ['u-lea', 'u-ines', 'u-karim', 'u-sofia', 'u-tom', 'u-maya']

export default function DemoPanel() {
  const users = useDb((db) => db.users)
  const userId = useDb((db) => db.session.userId)
  const partenaires = useDb((db) => db.partenaires ?? [])
  const partenaire = usePartenaire()
  const navigate = useNavigate()
  const moi = users.find((u) => u.id === userId)
  // Le personnage affiché : le partenaire incarné, sinon le voyageur.
  const qui = partenaire ? { id: partenaire.id, prenom: partenaire.nom } : moi
  const [ouvert, setOuvert] = useState(false)
  const toast = useToast()
  const racine = useRef(null)
  const bouton = useRef(null)
  const panneauId = useId()
  const selectId = useId()

  useEffect(() => {
    if (!ouvert) return
    const clicDehors = (e) => { if (!racine.current?.contains(e.target)) setOuvert(false) }
    const echap = (e) => {
      if (e.key === 'Escape') {
        setOuvert(false)
        bouton.current?.focus()
      }
    }
    document.addEventListener('pointerdown', clicDehors)
    document.addEventListener('keydown', echap)
    return () => {
      document.removeEventListener('pointerdown', clicDehors)
      document.removeEventListener('keydown', echap)
    }
  }, [ouvert])

  const principaux = PERSONNAGES.map((id) => users.find((u) => u.id === id)).filter(Boolean)
  const autres = users.filter((u) => !PERSONNAGES.includes(u.id))

  const changer = (valeur) => {
    // Valeur « p:… » : un partenaire ; sinon l'id d'un voyageur.
    if (valeur.startsWith('p:')) {
      const p = partenaires.find((x) => x.id === valeur.slice(2))
      setCurrentPartenaire(p.id)
      toast(`Vous êtes maintenant ${p.nom}, partenaire à ${p.ville}.`)
      navigate(paths.partenaire)
      return
    }
    const depuisPartenaire = Boolean(partenaire)
    setCurrentUser(valeur)
    toast(`Vous êtes maintenant ${users.find((u) => u.id === valeur)?.prenom}.`)
    if (depuisPartenaire) navigate(paths.accueil)
  }

  const reinitialiser = () => {
    resetDb()
    setOuvert(false)
    bouton.current?.focus()
    toast('Les données de démo ont été réinitialisées.')
  }

  return (
    <div className="demo" ref={racine}>
      <button
        ref={bouton}
        type="button"
        className="demo__pastille"
        aria-expanded={ouvert}
        aria-controls={panneauId}
        onClick={() => setOuvert((o) => !o)}
      >
        <FlaskConical size={16} aria-hidden="true" />
        <span className="demo__libelle">Mode démo</span>
        {qui && <><span className="demo__sep" aria-hidden="true">·</span><span className="demo__qui">{qui.prenom}</span></>}
      </button>

      {ouvert && (
        <div className="demo__panneau" id={panneauId} role="group" aria-label="Réglages de la démo">
          <div className="demo__tete">
            <p className="demo__titre">Mode démo</p>
            <button type="button" className="demo__fermer" onClick={() => { setOuvert(false); bouton.current?.focus() }} aria-label="Fermer le panneau de démo">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <p className="demo__aide">Prototype : incarnez un voyageur ou un partenaire pour jouer le parcours.</p>

          <label htmlFor={selectId} className="demo__label">Je suis</label>
          <div className="demo__choix">
            {qui && <Avatar user={qui} taille={36} />}
            <select id={selectId} value={partenaire ? `p:${partenaire.id}` : userId ?? ''} onChange={(e) => changer(e.target.value)}>
              <optgroup label="Parcours de démo">
                {principaux.map((u) => <option key={u.id} value={u.id}>{u.prenom}</option>)}
              </optgroup>
              {autres.length > 0 && (
                <optgroup label="Autres voyageurs">
                  {autres.map((u) => <option key={u.id} value={u.id}>{u.prenom}</option>)}
                </optgroup>
              )}
              {partenaires.length > 0 && (
                <optgroup label="Partenaires (fictifs)">
                  {partenaires.map((p) => <option key={p.id} value={`p:${p.id}`}>{p.nom} ({p.ville}){p.valide ? '' : ' — en validation'}</option>)}
                </optgroup>
              )}
            </select>
          </div>

          <button type="button" className="demo__reset" onClick={reinitialiser}>
            <RotateCcw size={16} aria-hidden="true" />
            Réinitialiser la démo
          </button>
        </div>
      )}
    </div>
  )
}
