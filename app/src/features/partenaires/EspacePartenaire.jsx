// Espace partenaire (US-20) : publier, modifier, suspendre ou réactiver une offre réservée aux groupes
// RoadMates, avec l'aperçu tel que le verront les voyageurs. Seul un partenaire validé peut publier.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Eye, Pause, PenLine, Play, Plus, Send, Store } from 'lucide-react'
import { newId, updateDb, useDb } from '../../shared/db.js'
import { usePartenaire } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { Badge, Button, Card, EmptyState, EntetePage, Field, Input, Textarea, useToast } from '../../shared/ui/index.js'
import { aujourdhui } from '../decouverte/dates.js'
import { CarteOffre } from './OngletBonsPlans.jsx'
import { CATEGORIES_PARTENAIRE, statutOffre, validerOffre } from './partenaires.js'

const VIDE = { titre: '', description: '', reductionPct: '15', minVoyageurs: '3', debut: '', fin: '' }

export default function EspacePartenaire() {
  const partenaire = usePartenaire()
  const offres = useDb((db) => (db.offres ?? []).filter((o) => o.partenaireId === partenaire?.id))
  const toast = useToast()
  const today = aujourdhui()
  const [form, setForm] = useState(null)
  const [erreurs, setErreurs] = useState({})

  if (!partenaire) {
    return (
      <section>
        <h1 className="sr-only">Espace partenaire</h1>
        <EmptyState icon={Store} titre="Espace réservé aux partenaires">
          <p>Dans cette démo, choisissez un partenaire dans « Mode démo » → « Je suis… ».</p>
        </EmptyState>
      </section>
    )
  }

  const edition = form ?? (partenaire.valide && offres.length === 0 ? { ...VIDE, debut: today } : null)
  const maj = (champ) => (e) => {
    setForm({ ...edition, [champ]: e.target.value })
    setErreurs((actuelles) => ({ ...actuelles, [champ]: undefined }))
  }

  function publier(e) {
    e.preventDefault()
    if (!partenaire.valide) return
    const trouvees = validerOffre(edition, today)
    setErreurs(trouvees)
    if (Object.keys(trouvees).length) return
    const donnees = {
      titre: edition.titre.trim(),
      description: edition.description.trim(),
      reductionPct: Number(edition.reductionPct),
      minVoyageurs: Number(edition.minVoyageurs),
      debut: edition.debut,
      fin: edition.fin,
    }
    updateDb((db) => {
      const existante = edition.id && db.offres.find((o) => o.id === edition.id && o.partenaireId === partenaire.id)
      if (existante) Object.assign(existante, donnees)
      else db.offres.push({ id: newId('o'), partenaireId: partenaire.id, ...donnees, active: true, creeLe: new Date().toISOString() })
    })
    setForm(null)
    toast(edition.id
      ? 'Offre mise à jour.'
      : `Offre publiée : elle apparaît dès maintenant dans les bons plans de ${partenaire.ville}.`)
  }

  function basculer(offre) {
    updateDb((db) => {
      const o = db.offres.find((x) => x.id === offre.id && x.partenaireId === partenaire.id)
      if (o) o.active = !o.active
    })
    toast(offre.active ? 'Offre suspendue : elle n’est plus visible des voyageurs.' : 'Offre réactivée.')
  }

  const apercu = edition && {
    id: 'apercu',
    titre: edition.titre || 'Titre de votre offre',
    description: edition.description,
    reductionPct: Number(edition.reductionPct) || 0,
    minVoyageurs: Number(edition.minVoyageurs) || 2,
    fin: edition.fin || today,
  }

  return (
    <section className="espace-partenaire">
      <EntetePage
        surtitre={`Espace partenaire · ${partenaire.ville}`}
        titre="Mon offre"
        actions={<Button to={paths.destinationOnglet(partenaire.ville, 'bons-plans')} variant="secondaire" icon={Eye}>Voir comme un voyageur</Button>}
      >
        <p>{partenaire.nom} · {CATEGORIES_PARTENAIRE[partenaire.categorie]}. Vos offres sont réservées aux groupes RoadMates.</p>
      </EntetePage>

      {!partenaire.valide && (
        <div className="espace-partenaire__validation" role="status">
          <Clock size={22} aria-hidden="true" />
          <div>
            <p><strong>Compte en cours de validation.</strong></p>
            <p>Vous pourrez publier une offre dès que l’équipe RoadMates aura vérifié votre établissement. Vos brouillons restent invisibles des voyageurs.</p>
          </div>
        </div>
      )}

      {offres.length > 0 && (
        <section aria-labelledby="mes-offres" className="espace-partenaire__bloc">
          <h2 id="mes-offres">Mes offres</h2>
          <ul className="ui-grille">
            {offres.map((offre) => {
              const statut = statutOffre(offre, partenaire, today)
              return (
                <li key={offre.id} className="espace-partenaire__offre">
                  <Badge ton={statut.ton}>{statut.libelle}</Badge>
                  <CarteOffre offre={offre} partenaire={partenaire} apercu />
                  {partenaire.valide && statut.cle !== 'expiree' && (
                    <div className="espace-partenaire__actions">
                      <Button variant="secondaire" icon={PenLine} onClick={() => { setForm({ ...offre, reductionPct: String(offre.reductionPct), minVoyageurs: String(offre.minVoyageurs) }); setErreurs({}) }}>
                        Modifier<span className="sr-only"> « {offre.titre} »</span>
                      </Button>
                      <Button variant="fantome" icon={offre.active ? Pause : Play} onClick={() => basculer(offre)}>
                        {offre.active ? 'Suspendre' : 'Réactiver'}<span className="sr-only"> « {offre.titre} »</span>
                      </Button>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
          {partenaire.valide && !edition && (
            <Button icon={Plus} onClick={() => { setForm({ ...VIDE, debut: today }); setErreurs({}) }}>Nouvelle offre</Button>
          )}
        </section>
      )}

      {partenaire.valide && edition && (
        <div className="espace-partenaire__edition">
          <Card as="form" className="espace-partenaire__form" onSubmit={publier} noValidate aria-labelledby="form-offre">
            <h2 id="form-offre">{edition.id ? 'Modifier l’offre' : 'Publier une offre'}</h2>
            <Field label="Titre" requis error={erreurs.titre} aide="Ce que gagne le groupe, en quelques mots.">
              <Input value={edition.titre} onChange={maj('titre')} maxLength={80} placeholder="Dortoir privatisé pour votre groupe" />
            </Field>
            <Field label="Description" error={erreurs.description} aide={`${edition.description.length}/300`}>
              <Textarea value={edition.description} onChange={maj('description')} rows={3} maxLength={300} />
            </Field>
            <div className="espace-partenaire__ligne">
              <Field label="Réduction (%)" requis error={erreurs.reductionPct}>
                <Input type="number" inputMode="numeric" min="1" max="90" value={edition.reductionPct} onChange={maj('reductionPct')} />
              </Field>
              <Field label="À partir de (voyageurs)" requis error={erreurs.minVoyageurs}>
                <Input type="number" inputMode="numeric" min="2" max="20" value={edition.minVoyageurs} onChange={maj('minVoyageurs')} />
              </Field>
            </div>
            <div className="espace-partenaire__ligne">
              <Field label="Valable du" requis error={erreurs.debut}>
                <Input type="date" value={edition.debut} onChange={maj('debut')} />
              </Field>
              <Field label="Au" requis error={erreurs.fin}>
                <Input type="date" min={edition.debut || today} value={edition.fin} onChange={maj('fin')} />
              </Field>
            </div>
            <div className="espace-partenaire__actions">
              <Button type="submit" icon={Send}>{edition.id ? 'Enregistrer les modifications' : 'Publier l’offre'}</Button>
              {(form || offres.length > 0) && <Button variant="fantome" onClick={() => { setForm(null); setErreurs({}) }}>Annuler</Button>}
            </div>
          </Card>
          <section aria-labelledby="apercu-offre" className="espace-partenaire__apercu">
            <h2 id="apercu-offre">Aperçu pour les voyageurs</h2>
            <CarteOffre offre={apercu} partenaire={partenaire} apercu />
            <p className="espace-partenaire__note">
              L’offre apparaît aussitôt dans <Link to={paths.destinationOnglet(partenaire.ville, 'bons-plans')}>les bons plans de {partenaire.ville}</Link>, pendant sa période de validité.
            </p>
          </section>
        </div>
      )}
    </section>
  )
}
