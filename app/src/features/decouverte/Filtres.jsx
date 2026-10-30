// Barre de critères cumulables de découverte.
// Toujours visibles : genre, profils vérifiés, langue. Les autres critères sont dans « Plus de filtres » :
// un panneau dépliant sur ordinateur, une feuille modale sur mobile.
import { useId, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { BadgeCheck, ChevronDown, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Button, Chip, Feuille, Field, Input, Select } from '../../shared/ui/index.js'
import { useMediaQuery } from '../../shared/useMediaQuery.js'
import { PARTAGES, STYLES } from '../profil/options.js'
import { FILTRES_VIDES, nombreFiltresActifs } from './filtres.js'

const AVANCES = ['centreInteret', 'styleVoyage', 'budgetMax', 'investissement', 'ageMin', 'ageMax']

function ChampsAvances({ filtres, maj, centresInteret }) {
  const minValide = filtres.ageMin === '' || (Number.isInteger(Number(filtres.ageMin)) && Number(filtres.ageMin) >= 18 && Number(filtres.ageMin) <= 99)
  const maxValide = filtres.ageMax === '' || (Number.isInteger(Number(filtres.ageMax)) && Number(filtres.ageMax) >= 18 && Number(filtres.ageMax) <= 99)
  const ageInvalide = !minValide || !maxValide || (filtres.ageMin !== '' && filtres.ageMax !== '' && Number(filtres.ageMin) > Number(filtres.ageMax))
  const budgetInvalide = filtres.budgetMax !== '' && (!Number.isFinite(Number(filtres.budgetMax)) || Number(filtres.budgetMax) < 0 || Number(filtres.budgetMax) > 10000)
  return (
    <div className="filtres__champs filtres__champs--avances">
      <Field label="Centres d’intérêt" className="filtres__preference">
        <Select value={filtres.centreInteret} onChange={maj('centreInteret')}>
          <option value="">Tous</option>
          {centresInteret.map((interet) => <option key={interet} value={interet}>{interet}</option>)}
        </Select>
      </Field>
      <Field label="Style de voyage" className="filtres__preference">
        <Select value={filtres.styleVoyage} onChange={maj('styleVoyage')}>
          <option value="">Tous</option>
          {STYLES.map(({ valeur, libelle }) => <option key={valeur} value={valeur}>{libelle}</option>)}
        </Select>
      </Field>
      <Field label="Ce qu’ils veulent partager" className="filtres__preference">
        <Select value={filtres.investissement} onChange={maj('investissement')}>
          <option value="">Peu importe</option>
          {PARTAGES.map(({ valeur, libelle }) => <option key={valeur} value={valeur}>{libelle}</option>)}
        </Select>
      </Field>
      <Field label="Budget max. par jour (€)" className="filtres__budget" error={budgetInvalide ? 'Le budget doit être compris entre 0 et 10 000 euros.' : undefined}>
        <Input type="number" min="0" max="10000" step="1" inputMode="numeric" value={filtres.budgetMax} aria-invalid={budgetInvalide} onChange={maj('budgetMax')} />
      </Field>
      <Field label="Âge min." className="filtres__age" error={!minValide ? 'L’âge doit être compris entre 18 et 99 ans.' : ageInvalide ? 'L’âge minimum ne peut pas dépasser l’âge maximum.' : undefined}>
        <Input type="number" inputMode="numeric" min="18" max="99" value={filtres.ageMin} aria-invalid={ageInvalide} onChange={maj('ageMin')} />
      </Field>
      <Field label="Âge max." className="filtres__age" error={!maxValide ? 'L’âge doit être compris entre 18 et 99 ans.' : ageInvalide ? 'L’âge maximum doit être supérieur ou égal à l’âge minimum.' : undefined}>
        <Input type="number" inputMode="numeric" min="18" max="99" value={filtres.ageMax} aria-invalid={ageInvalide} onChange={maj('ageMax')} />
      </Field>
    </div>
  )
}

export default function Filtres({ filtres, setFiltres, langues, centresInteret, total, preferenceGenre = 'tous' }) {
  const maj = (champ) => (event) => setFiltres((actuel) => ({ ...actuel, [champ]: event.target.value }))
  const actifs = nombreFiltresActifs(filtres)
  const avancesActifs = AVANCES.filter((cle) => filtres[cle] !== FILTRES_VIDES[cle]).length
  const mobile = useMediaQuery('(max-width: 767px)')
  const [ouvert, setOuvert] = useState(false)
  const panneauId = useId()
  const libellePlus = `Plus de filtres${avancesActifs ? ` (${avancesActifs})` : ''}`
  const voyageurs = `${total} voyageur${total > 1 ? 's' : ''}`

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
        <Field label="Langue" className="filtres__langue">
          <Select value={filtres.langue} onChange={maj('langue')}>
            <option value="">Toutes</option>
            {langues.map((langue) => <option key={langue} value={langue}>{langue}</option>)}
          </Select>
        </Field>
        <Chip actif={filtres.verifie} icon={BadgeCheck} onClick={() => setFiltres((actuel) => ({ ...actuel, verifie: !actuel.verifie }))}>
          Profils vérifiés
        </Chip>
        <button
          type="button"
          className={`filtres__plus${avancesActifs ? ' filtres__plus--actif' : ''}`}
          aria-expanded={ouvert}
          aria-controls={mobile ? undefined : panneauId}
          aria-haspopup={mobile ? 'dialog' : undefined}
          onClick={() => setOuvert((o) => !o)}
        >
          {libellePlus}
          {!mobile && <ChevronDown size={16} aria-hidden="true" className="filtres__chevron" />}
        </button>
        <button type="button" className="filtres__reset" onClick={() => setFiltres({ ...FILTRES_VIDES, genre: ['H', 'F'].includes(preferenceGenre) ? preferenceGenre : 'tous' })} disabled={actifs === 0}>
          <RotateCcw size={16} aria-hidden="true" /> Réinitialiser
        </button>
      </div>

      {!mobile && (
        <div id={panneauId} className="filtres__panneau" hidden={!ouvert}>
          {ouvert && <ChampsAvances filtres={filtres} maj={maj} centresInteret={centresInteret} />}
        </div>
      )}
      {mobile && (
        <Feuille
          ouvert={ouvert}
          onFermer={() => setOuvert(false)}
          titre="Plus de filtres"
          pied={<Button onClick={() => setOuvert(false)}>Afficher {voyageurs}</Button>}
        >
          <ChampsAvances filtres={filtres} maj={maj} centresInteret={centresInteret} />
        </Feuille>
      )}
    </div>
  )
}
