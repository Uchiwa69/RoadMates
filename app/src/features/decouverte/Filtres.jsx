// Barre de critères cumulables de découverte.
import { AnimatePresence, m } from 'motion/react'
import { BadgeCheck, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Chip, Field, Input, Select } from '../../shared/ui/index.js'
import { FILTRES_VIDES, nombreFiltresActifs } from './filtres.js'

const INVESTISSEMENTS = [
  { valeur: 'trajet', libelle: 'Juste un trajet' },
  { valeur: 'activites', libelle: 'Quelques activités' },
  { valeur: 'tout', libelle: 'Tout le voyage' },
]

export default function Filtres({ filtres, setFiltres, langues, centresInteret, total, preferenceGenre = 'tous' }) {
  const maj = (champ) => (event) => setFiltres((actuel) => ({ ...actuel, [champ]: event.target.value }))
  const minValide = filtres.ageMin === '' || (Number.isInteger(Number(filtres.ageMin)) && Number(filtres.ageMin) >= 18 && Number(filtres.ageMin) <= 99)
  const maxValide = filtres.ageMax === '' || (Number.isInteger(Number(filtres.ageMax)) && Number(filtres.ageMax) >= 18 && Number(filtres.ageMax) <= 99)
  const ageInvalide = !minValide || !maxValide || (filtres.ageMin !== '' && filtres.ageMax !== '' && Number(filtres.ageMin) > Number(filtres.ageMax))
  const budgetInvalide = filtres.budgetMax !== '' && (!Number.isFinite(Number(filtres.budgetMax)) || Number(filtres.budgetMax) < 0 || Number(filtres.budgetMax) > 10000)
  const actifs = nombreFiltresActifs(filtres)

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
        <Field label="Genre souhaité" className="filtres__preference">
          <Select value={filtres.genre} onChange={maj('genre')}>
            <option value="H">Hommes</option>
            <option value="F">Femmes</option>
            <option value="tous">Les deux</option>
          </Select>
        </Field>
        <Chip actif={filtres.verifie} icon={BadgeCheck} onClick={() => setFiltres((actuel) => ({ ...actuel, verifie: !actuel.verifie }))}>
          Profils vérifiés
        </Chip>
        <Field label="Langue" className="filtres__langue">
          <Select value={filtres.langue} onChange={maj('langue')}>
            <option value="">Toutes</option>
            {langues.map((langue) => <option key={langue} value={langue}>{langue}</option>)}
          </Select>
        </Field>
        <Field label="Centres d’intérêt" className="filtres__preference">
          <Select value={filtres.centreInteret} onChange={maj('centreInteret')}>
            <option value="">Tous</option>
            {centresInteret.map((interet) => <option key={interet} value={interet}>{interet}</option>)}
          </Select>
        </Field>
        <Field label="Style de voyage" className="filtres__preference">
          <Select value={filtres.styleVoyage} onChange={maj('styleVoyage')}>
            <option value="">Tous</option>
            {['routard', 'confort', 'aventure', 'culture', 'fête'].map((style) => <option key={style} value={style}>{style}</option>)}
          </Select>
        </Field>
        <Field label="Budget max. par jour (€)" className="filtres__budget" error={budgetInvalide ? 'Le budget doit être compris entre 0 et 10 000 euros.' : undefined}>
          <Input type="number" min="0" max="10000" step="0.01" inputMode="decimal" value={filtres.budgetMax} aria-invalid={budgetInvalide} onChange={maj('budgetMax')} />
        </Field>
        <Field label="Investissement" className="filtres__preference">
          <Select value={filtres.investissement} onChange={maj('investissement')}>
            <option value="">Tous</option>
            {INVESTISSEMENTS.map(({ valeur, libelle }) => <option key={valeur} value={valeur}>{libelle}</option>)}
          </Select>
        </Field>
        <Field label="Âge min." className="filtres__age" error={!minValide ? 'L’âge doit être compris entre 18 et 99 ans.' : ageInvalide ? 'L’âge minimum ne peut pas dépasser l’âge maximum.' : undefined}>
          <Input type="number" inputMode="numeric" min="18" max="99" value={filtres.ageMin} aria-invalid={ageInvalide} onChange={maj('ageMin')} />
        </Field>
        <Field label="Âge max." className="filtres__age" error={!maxValide ? 'L’âge doit être compris entre 18 et 99 ans.' : ageInvalide ? 'L’âge maximum doit être supérieur ou égal à l’âge minimum.' : undefined}>
          <Input type="number" inputMode="numeric" min="18" max="99" value={filtres.ageMax} aria-invalid={ageInvalide} onChange={maj('ageMax')} />
        </Field>
        <button type="button" className="filtres__reset" onClick={() => setFiltres({ ...FILTRES_VIDES, genre: ['H', 'F'].includes(preferenceGenre) ? preferenceGenre : 'tous' })} disabled={actifs === 0}>
          <RotateCcw size={16} aria-hidden="true" /> Réinitialiser
        </button>
      </div>
    </div>
  )
}
