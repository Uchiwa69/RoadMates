// Boutons de zoom posés sur le globe (3D ou carte de repli), et rappel du geste molette.
// Le globe est un complément visuel masqué aux technologies d'assistance (le champ de recherche
// donne accès aux mêmes choix) : ces boutons restent donc hors tabulation.
import { LocateFixed, Minus, Plus } from 'lucide-react'

const touche = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

export default function CommandesZoom({ onPlus, onMoins, onRecentrer, astuce }) {
  return (
    <>
      <div className="globe-zoom">
        <button type="button" tabIndex={-1} className="globe-zoom__btn" onClick={onPlus} title="Zoomer" aria-label="Zoomer">
          <Plus size={18} />
        </button>
        <button type="button" tabIndex={-1} className="globe-zoom__btn" onClick={onMoins} title="Dézoomer" aria-label="Dézoomer">
          <Minus size={18} />
        </button>
        <button type="button" tabIndex={-1} className="globe-zoom__btn" onClick={onRecentrer} title="Recentrer" aria-label="Recentrer">
          <LocateFixed size={18} />
        </button>
      </div>
      {astuce && <p className="globe-zoom__astuce">{touche} + molette pour zoomer sur le globe</p>}
    </>
  )
}
