// US-06 — barre de filtres. La logique est dans filtres.js.
import { FILTRES_VIDES } from './filtres.js'

export default function Filtres({ filtres, setFiltres, langues, total }) {
  const maj = (champ) => (e) =>
    setFiltres((f) => ({ ...f, [champ]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  return (
    <div className="filtres" role="search" aria-label="Filtrer les voyageurs">
      <label className="champ">Âge min.<input type="number" min="18" max="99" value={filtres.ageMin} onChange={maj('ageMin')} style={{ width: 80 }} /></label>
      <label className="champ">Âge max.<input type="number" min="18" max="99" value={filtres.ageMax} onChange={maj('ageMax')} style={{ width: 80 }} /></label>
      <label className="champ">
        Langue
        <select value={filtres.langue} onChange={maj('langue')}>
          <option value="">Toutes</option>
          {langues.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </label>
      <label><input type="checkbox" checked={filtres.femmes} onChange={maj('femmes')} /> Femmes uniquement</label>
      <button type="button" className="btn-lien" onClick={() => setFiltres(FILTRES_VIDES)}>Réinitialiser</button>
      <span className="meta" aria-live="polite">{total} voyageur{total > 1 ? 's' : ''}</span>
    </div>
  )
}
