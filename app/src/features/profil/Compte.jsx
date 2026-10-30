// Compte et données : e-mail, vérification d'identité, export des données (RGPD) et suppression.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BadgeCheck, Download, Mail, ShieldAlert, Trash2 } from 'lucide-react'
import { getDb, newId, updateDb, useDb } from '../../shared/db.js'
import { useCurrentUser } from '../../shared/session.js'
import { paths } from '../../shared/paths.js'
import { Badge, Button, Card, EntetePage, useToast } from '../../shared/ui/index.js'
import RetourProfil from './RetourProfil.jsx'
import { exporterDonnees, supprimerCompte } from './compte.js'

export default function Compte() {
  const user = useCurrentUser()
  const nbComptes = useDb((db) => db.users.length)
  const navigate = useNavigate()
  const toast = useToast()
  const [confirmer, setConfirmer] = useState(false)

  if (!user) return null

  function telecharger() {
    const donnees = exporterDonnees(getDb(), user.id)
    const url = URL.createObjectURL(new Blob([JSON.stringify(donnees, null, 2)], { type: 'application/json' }))
    const lien = document.createElement('a')
    lien.href = url
    lien.download = `roadmates-mes-donnees-${new Date().toISOString().slice(0, 10)}.json`
    lien.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast('Vos données ont été téléchargées (fichier JSON).')
  }

  function supprimer() {
    if (nbComptes <= 1) {
      toast('Suppression impossible : aucun autre compte de démonstration ne permet de poursuivre la navigation.')
      return
    }
    updateDb((db) => supprimerCompte(db, user.id, newId('anonyme')))
    setConfirmer(false)
    toast('Compte et données directement identifiantes supprimés de ce navigateur. Les références de dépenses et de groupe sont anonymisées.')
    navigate(paths.accueil, { replace: true })
  }

  return (
    <section className="espace-profil espace-profil--etroit">
      <EntetePage avant={<RetourProfil page="Compte et données" />} surtitre="Mon profil" titre="Compte et données">
        <p>Vos informations de connexion, et vos droits sur vos données.</p>
      </EntetePage>

      <Card className="compte__bloc">
        <h2>Compte</h2>
        <dl className="compte__infos">
          <div>
            <dt><Mail size={18} aria-hidden="true" /> Adresse e-mail</dt>
            <dd>{user.email ?? 'Non renseignée'}</dd>
          </div>
          <div>
            <dt><BadgeCheck size={18} aria-hidden="true" /> Vérification d’identité</dt>
            <dd>
              {user.verifie
                ? <Badge ton="succes" icon={BadgeCheck}>Identité vérifiée</Badge>
                : <Badge ton="alerte" icon={ShieldAlert}>Non vérifiée</Badge>}
            </dd>
          </div>
        </dl>
        <p className="compte__note">
          Dans ce prototype, la vérification d’identité est simulée : aucun document n’est demandé ni transmis.
        </p>
      </Card>

      <Card className="compte__bloc">
        <h2>Télécharger mes données</h2>
        <p>
          Profil, voyages, demandes, groupes, messages envoyés (toujours chiffrés), dépenses et avis : tout ce qui vous
          concerne, dans un fichier JSON réutilisable ailleurs (droit à la portabilité).
        </p>
        <Button variant="secondaire" icon={Download} onClick={telecharger}>Télécharger mes données</Button>
      </Card>

      <Card className="compte__bloc compte__bloc--danger">
        <h2>Supprimer mon compte</h2>
        <p>
          Cette action supprime les données du compte de ce navigateur et anonymise les références nécessaires aux
          dépenses et groupes. Dans ce prototype local, cela n’efface aucune donnée sur un serveur et ne déclenche aucune
          procédure réglementaire.
        </p>
        {!confirmer ? (
          <Button variant="secondaire" icon={Trash2} onClick={() => setConfirmer(true)}>Demander la suppression locale</Button>
        ) : (
          <div className="compte__confirmation" role="group" aria-label="Confirmer la suppression locale du compte">
            <p>Cette action est irréversible dans les données de démonstration de ce navigateur.</p>
            <Button icon={Trash2} onClick={supprimer}>Confirmer la suppression locale</Button>
            <Button variant="fantome" onClick={() => setConfirmer(false)}>Annuler</Button>
          </div>
        )}
      </Card>
    </section>
  )
}
