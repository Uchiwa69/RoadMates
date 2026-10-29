// Choix des étapes : on tape une ville ou un pays, ou on clique sur le globe.
// Le champ et les listes suffisent seuls (clavier, lecteur d'écran, sans WebGL) :
// le globe est un plus, qui dessine l'itinéraire au fur et à mesure.
import { useMemo, useState } from 'react'
import { Globe2, MapPin, Plus, Search, X } from 'lucide-react'
import { filtrerEtClasser } from '../../../shared/texte.js'
import { PAYS, nomPays } from '../../../shared/globe/pays.js'
import GlobeTerre from '../../../shared/globe/Globe.jsx'
import { Combobox, Field } from '../../../shared/ui/index.js'
import { VILLES, trouverVille } from '../villes.js'

export default function DestinationPicker({ etapes, onAjouter, onRetirer, max, erreur, saisieInitiale = '', children }) {
  const [saisie, setSaisie] = useState(saisieInitiale)
  const infos = useMemo(() => etapes.map((e) => trouverVille(e.ville)).filter(Boolean), [etapes])
  const [pays, setPays] = useState(infos.at(-1)?.iso ?? null)
  const complet = etapes.length >= max

  const voirPays = (iso2) => {
    setPays(iso2)
    setSaisie('')
  }
  const ajouter = (v) => {
    if (complet) return
    onAjouter(v)
    setPays(v.iso)
    setSaisie('')
  }

  const suggestions = [
    ...filtrerEtClasser(VILLES, saisie, 'ville').slice(0, 6).map((v) => ({
      id: `v-${v.ville}`, label: v.ville, detail: v.pays, icon: MapPin, ville: v,
    })),
    ...filtrerEtClasser(PAYS, saisie, 'nom').slice(0, 3).map((p) => ({
      id: `p-${p.iso2}`, label: p.nom, detail: 'Voir ses villes', icon: Globe2, iso2: p.iso2,
    })),
  ]

  const villesDuPays = useMemo(() => VILLES.filter((v) => v.iso === pays), [pays])
  const choisies = useMemo(() => new Set(etapes.map((e) => e.ville)), [etapes])

  // Les étapes déjà choisies : des points reliés par des arcs, dans l'ordre de saisie.
  const points = useMemo(() => infos.map((v, i) => ({
    ...v, nb: 1, etape: true, texte: `Étape ${i + 1} : ${v.ville}`,
  })), [infos])
  const arcs = useMemo(() => infos.slice(1).map((v, i) => ({
    startLat: infos[i].lat, startLng: infos[i].lng, endLat: v.lat, endLng: v.lng,
  })), [infos])
  const labels = useMemo(
    () => villesDuPays.map((v) => ({ ...v, nb: 0, actif: choisies.has(v.ville) })),
    [villesDuPays, choisies],
  )

  return (
    <div className="picker">
      <div className="picker__controles">
        {complet ? (
          <p className="picker__info">Vous avez atteint {max} étapes, le maximum pour un voyage.</p>
        ) : (
          <Field
            label={etapes.length ? 'Ajouter une étape' : 'Où allez-vous ?'}
            aide="Tapez une ville, ou un pays pour voir ses villes. Vous pouvez aussi cliquer sur le globe."
            error={erreur}
          >
            <Combobox
              valeur={saisie}
              onValeur={setSaisie}
              suggestions={suggestions}
              onChoix={(s) => (s.iso2 ? voirPays(s.iso2) : ajouter(s.ville))}
              placeholder="Lagos, Croatie, Rome…"
              vide="Aucune ville trouvée."
              icon={Search}
            />
          </Field>
        )}

        {pays && !complet && (
          <div className="picker__pays">
            <p className="picker__pays-titre" id="picker-pays">
              Villes proposées · <strong>{nomPays(pays)}</strong>
            </p>
            {villesDuPays.length ? (
              <ul className="picker__villes" aria-labelledby="picker-pays">
                {villesDuPays.map((v) => (
                  <li key={v.ville}>
                    <button type="button" className="ui-chip" aria-pressed={choisies.has(v.ville)} onClick={() => ajouter(v)}>
                      <Plus size={16} aria-hidden="true" />
                      {v.ville}
                      {choisies.has(v.ville) && <span className="sr-only"> (déjà dans votre itinéraire, ajouter à nouveau)</span>}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="picker__info">Aucune ville proposée dans ce pays pour l'instant.</p>
            )}
          </div>
        )}

        <div className="picker__itineraire">
          <p className="picker__itineraire-titre" id="itineraire">
            Votre itinéraire <span className="picker__compte">{etapes.length}/{max}</span>
          </p>
          {etapes.length === 0 ? (
            <p className="picker__info">Aucune étape pour l'instant. Commencez par la première ville de votre voyage.</p>
          ) : (
            <ol className="picker__etapes" aria-labelledby="itineraire">
              {etapes.map((e, i) => (
                <li key={e.cle} className="picker__etape">
                  <span className="picker__num" aria-hidden="true">{i + 1}</span>
                  <span className="picker__ville">
                    {e.ville}
                    <span className="picker__ville-pays">{trouverVille(e.ville)?.pays}</span>
                  </span>
                  <button type="button" className="picker__retirer" onClick={() => onRetirer(e.cle)} aria-label={`Retirer l'étape ${i + 1} : ${e.ville}`}>
                    <X size={18} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
        {children}
      </div>

      <div className="picker__globe">
        <GlobeTerre
          label={`Globe : ${etapes.length ? `itinéraire ${etapes.map((e) => e.ville).join(', ')}` : 'aucune étape choisie'}. Le champ de recherche et la liste des villes donnent accès aux mêmes choix.`}
          points={points}
          arcs={arcs}
          villes={labels}
          pays={pays}
          etiquettes="toutes"
          rotation={false}
          onPays={setPays}
          onVille={(v) => !v.etape && ajouter(v)}
        />
      </div>
    </div>
  )
}
