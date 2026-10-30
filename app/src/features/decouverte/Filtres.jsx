// US-06 — barre de filtres. La logique est dans filtres.js.
import { AnimatePresence, m } from 'motion/react'
import { RotateCcw, SlidersHorizontal, Venus } from 'lucide-react'
import { Chip, Field, Input, Select } from '../../shared/ui/index.js'
import { FILTRES_VIDES } from './filtres.js'

export default function Filtres({ filtres, setFiltres, langues, total }) {
  const maj = (champ) => (e) => setFiltres((f) => ({ ...f, [champ]: e.target.value }))
  const actifs = Object.entries(filtres).filter(([k, v]) => v !== FILTRES_VIDES[k]).length

  return (
    <div className="filtres" role="search" aria-label="Filtrer les voyageurs">
      <div className="filtres__tete">
        <p className="filtres__titre"><SlidersHorizontal size={18} aria-hidden="true" /> Filtres</p>
        <p className="filtres__total" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.strong
              key={total}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
            >
              {total}
            </m.strong>
          </AnimatePresence>{' '}
          voyageur{total > 1 ? 's' : ''}
        </p>
      </div>
      <div className="filtres__champs">
        <Chip actif={filtres.femmes} icon={Venus} onClick={() => setFiltres((f) => ({ ...f, femmes: !f.femmes }))}>
          Femmes uniquement
        </Chip>
        <Field label="Langue" className="filtres__langue">
          <Select value={filtres.langue} onChange={maj('langue')}>
            <option value="">Toutes</option>
            {langues.map((l) => <option key={l} value={l}>{l}</option>)}
          </Select>
        </Field>
        <Field label="Âge min." className="filtres__age">
          <Input type="number" inputMode="numeric" min="18" max="99" value={filtres.ageMin} onChange={maj('ageMin')} />
        </Field>
        <Field label="Âge max." className="filtres__age">
          <Input type="number" inputMode="numeric" min="18" max="99" value={filtres.ageMax} onChange={maj('ageMax')} />
        </Field>
        <button type="button" className="filtres__reset" onClick={() => setFiltres(FILTRES_VIDES)} disabled={actifs === 0}>
          <RotateCcw size={16} aria-hidden="true" /> Réinitialiser
        </button>
      </div>
    </div>
  )
}
