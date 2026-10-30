// données de démo, reprises du parcours de Léa (vision produit §4.2).
// Elles permettent à chaque partie de travailler sans attendre l'autre.

const profil = (centresInteret, styleVoyage, budgetJournalierCentimes, rythme, investissement) => ({
  photoUrl: '',
  centresInteret,
  styleVoyage,
  budgetJournalierCentimes,
  rythme,
  investissement,
  preferenceGenre: 'tous',
  filtresDecouverte: null,
  amisRoute: [],
})

export const seed = {
  // À incrémenter quand on ajoute des données : les navigateurs qui ont déjà joué la démo
  // les reçoivent sans perdre les leurs (voir completerAvecSeed dans db.js).
  version: 5,
  session: { userId: 'u-lea', partenaireId: null },

  users: [
    { id: 'u-lea', ...profil(['surf', 'randonnée', 'gastronomie'], 'aventure', 5500, 'modéré', 'activites'), prenom: 'Léa', email: 'lea@roadmates.demo', age: 23, genre: 'F', langues: ['français', 'anglais', 'portugais'], bio: 'Erasmus à Lisbonne, road trip dans l’Algarve cet été.', verifie: true },
    { id: 'u-ines', ...profil(['surf', 'nature', 'culture'], 'aventure', 4500, 'actif', 'activites'), prenom: 'Inès', email: 'ines@roadmates.demo', age: 24, genre: 'F', langues: ['français', 'espagnol'], bio: 'Étudiante en archi, fan de surf.', verifie: true },
    { id: 'u-karim', ...profil(['randonnée', 'gastronomie', 'culture'], 'confort', 8000, 'modéré', 'tout'), prenom: 'Karim', email: 'karim@roadmates.demo', age: 34, genre: 'H', langues: ['français', 'anglais', 'arabe'], bio: 'En télétravail, je cherche des randos et des dîners à plusieurs.', verifie: true },
    { id: 'u-sofia', ...profil(['photographie', 'culture', 'nature'], 'culture', 6500, 'tranquille', 'trajet'), prenom: 'Sofia', email: 'sofia@roadmates.demo', age: 27, genre: 'F', langues: ['espagnol', 'anglais'], bio: 'Photographe, je voyage léger.', verifie: true },
    { id: 'u-tom', ...profil(['randonnée', 'rencontres', 'nature'], 'routard', 3000, 'actif', 'activites'), prenom: 'Tom', email: 'tom@roadmates.demo', age: 22, genre: 'H', langues: ['anglais', 'français'], bio: 'Backpacker, budget serré.', verifie: false },
    { id: 'u-maya', ...profil(['culture', 'gastronomie', 'plage'], 'confort', 7000, 'modéré', 'tout'), prenom: 'Maya', email: 'maya@roadmates.demo', age: 29, genre: 'F', langues: ['allemand', 'anglais'], bio: 'Je découvre le Portugal du nord au sud.', verifie: true },
    // Voyageurs de la vitrine (globe de l'accueil). Aucun ne passe par le Portugal :
    // ils ne changent pas les résultats du parcours de démo.
    { id: 'u-lucas', ...profil(['train', 'randonnée', 'photographie'], 'routard', 3500, 'actif', 'trajet'), prenom: 'Lucas', email: 'lucas@roadmates.demo', age: 26, genre: 'H', langues: ['français', 'anglais'], bio: 'La côte espagnole en train et en stop.', verifie: true },
    { id: 'u-chiara', ...profil(['gastronomie', 'culture', 'plage'], 'confort', 9000, 'tranquille', 'activites'), prenom: 'Chiara', email: 'chiara@roadmates.demo', age: 25, genre: 'F', langues: ['italien', 'anglais', 'français'], bio: 'Je rentre au pays, envie de faire découvrir le sud.', verifie: true },
    { id: 'u-jonas', ...profil(['musées', 'train', 'histoire'], 'culture', 6000, 'modéré', 'tout'), prenom: 'Jonas', email: 'jonas@roadmates.demo', age: 28, genre: 'H', langues: ['allemand', 'anglais'], bio: 'Interrail entre les capitales d’Europe centrale.', verifie: true },
    { id: 'u-emma', ...profil(['kayak', 'plage', 'nature'], 'aventure', 5000, 'actif', 'activites'), prenom: 'Emma', email: 'emma@roadmates.demo', age: 22, genre: 'F', langues: ['français', 'anglais'], bio: 'Kayak et criques en Croatie.', verifie: false },
    { id: 'u-nora', ...profil(['vélo', 'musées', 'gastronomie'], 'culture', 7500, 'modéré', 'tout'), prenom: 'Nora', email: 'nora@roadmates.demo', age: 24, genre: 'F', langues: ['allemand', 'anglais'], bio: 'Vélo, musées et cafés.', verifie: true },
    { id: 'u-mateo', ...profil(['danse', 'randonnée', 'culture'], 'aventure', 5500, 'actif', 'activites'), prenom: 'Mateo', email: 'mateo@roadmates.demo', age: 30, genre: 'H', langues: ['espagnol', 'anglais'], bio: 'Flamenco et randonnée en Andalousie.', verifie: true },
    { id: 'u-zoe', ...profil(['plage', 'ferry', 'nature'], 'routard', 4000, 'tranquille', 'trajet'), prenom: 'Zoé', email: 'zoe@roadmates.demo', age: 27, genre: 'F', langues: ['français', 'italien'], bio: 'Les îles grecques, sac à dos et ferry.', verifie: true },
    { id: 'u-yasmine', ...profil(['culture', 'randonnée', 'gastronomie'], 'aventure', 5000, 'modéré', 'tout'), prenom: 'Yasmine', email: 'yasmine@roadmates.demo', age: 26, genre: 'F', langues: ['français', 'arabe'], bio: 'Marrakech puis le désert, à plusieurs c’est mieux.', verifie: true },
    { id: 'u-anouk', ...profil(['plage', 'randonnée', 'rencontres'], 'routard', 3500, 'actif', 'activites'), prenom: 'Anouk', email: 'anouk@roadmates.demo', age: 21, genre: 'F', langues: ['français', 'anglais'], bio: 'Étudiante à Lyon, cap sur la Méditerranée.', verifie: true },
    // Vitrine des destinations partenaires (Paris, Kosovo), version 5. Toujours hors Portugal.
    { id: 'u-camille', ...profil(['musées', 'photographie', 'gastronomie'], 'culture', 6500, 'modéré', 'activites'), prenom: 'Camille', email: 'camille@roadmates.demo', age: 25, genre: 'F', langues: ['français', 'anglais', 'espagnol'], bio: 'Une semaine à Paris : expos, marchés et soirées au bord du canal.', verifie: true },
    { id: 'u-arben', ...profil(['randonnée', 'histoire', 'rencontres'], 'aventure', 3500, 'actif', 'tout'), prenom: 'Arben', email: 'arben@roadmates.demo', age: 27, genre: 'H', langues: ['albanais', 'anglais', 'allemand'], bio: 'Je fais découvrir le Kosovo à qui veut : Pristina, Prizren et les monts Sharr.', verifie: true },
    { id: 'u-lina', ...profil(['street art', 'randonnée', 'culture'], 'routard', 4000, 'modéré', 'trajet'), prenom: 'Lina', email: 'lina@roadmates.demo', age: 23, genre: 'F', langues: ['français', 'anglais'], bio: 'Paris puis les Balkans en bus, je cherche des compagnons pour les trajets.', verifie: true },  ],

  trips: [
    { id: 't-lea', userId: 'u-lea', destination: 'Algarve', etapes: [
      { ville: 'Lagos', pays: 'Portugal', debut: '2027-07-10', fin: '2027-07-13' },
      { ville: 'Faro', pays: 'Portugal', debut: '2027-07-14', fin: '2027-07-17' },
    ] },
    { id: 't-ines', userId: 'u-ines', destination: 'Algarve', etapes: [
      { ville: 'Lagos', pays: 'Portugal', debut: '2027-07-11', fin: '2027-07-14' },
      { ville: 'Faro', pays: 'Portugal', debut: '2027-07-15', fin: '2027-07-18' },
    ] },
    { id: 't-karim', userId: 'u-karim', destination: 'Faro', etapes: [
      { ville: 'Faro', pays: 'Portugal', debut: '2027-07-15', fin: '2027-07-20' },
    ] },
    { id: 't-sofia', userId: 'u-sofia', destination: 'Portugal', etapes: [
      { ville: 'Lisbonne', pays: 'Portugal', debut: '2027-07-07', fin: '2027-07-10' },
      { ville: 'Lagos', pays: 'Portugal', debut: '2027-07-12', fin: '2027-07-15' },
    ] },
    { id: 't-tom', userId: 'u-tom', destination: 'Lagos', etapes: [
      { ville: 'Lagos', pays: 'Portugal', debut: '2027-07-09', fin: '2027-07-12' },
    ] },
    { id: 't-maya', userId: 'u-maya', destination: 'Porto', etapes: [
      { ville: 'Porto', pays: 'Portugal', debut: '2027-07-10', fin: '2027-07-17' },
    ] },
    { id: 't-lucas', userId: 'u-lucas', destination: 'Côte espagnole', etapes: [
      { ville: 'Barcelone', pays: 'Espagne', debut: '2027-07-05', fin: '2027-07-08' },
      { ville: 'Valence', pays: 'Espagne', debut: '2027-07-09', fin: '2027-07-11' },
    ] },
    { id: 't-chiara', userId: 'u-chiara', destination: 'Italie du Sud', etapes: [
      { ville: 'Rome', pays: 'Italie', debut: '2027-07-12', fin: '2027-07-15' },
      { ville: 'Naples', pays: 'Italie', debut: '2027-07-16', fin: '2027-07-19' },
    ] },
    { id: 't-jonas', userId: 'u-jonas', destination: 'Europe centrale', etapes: [
      { ville: 'Prague', pays: 'Tchéquie', debut: '2027-07-03', fin: '2027-07-06' },
      { ville: 'Vienne', pays: 'Autriche', debut: '2027-07-07', fin: '2027-07-09' },
      { ville: 'Budapest', pays: 'Hongrie', debut: '2027-07-10', fin: '2027-07-13' },
    ] },
    { id: 't-emma', userId: 'u-emma', destination: 'Croatie', etapes: [
      { ville: 'Split', pays: 'Croatie', debut: '2027-07-18', fin: '2027-07-21' },
      { ville: 'Dubrovnik', pays: 'Croatie', debut: '2027-07-22', fin: '2027-07-25' },
    ] },
    { id: 't-nora', userId: 'u-nora', destination: 'Amsterdam – Berlin', etapes: [
      { ville: 'Amsterdam', pays: 'Pays-Bas', debut: '2027-07-08', fin: '2027-07-10' },
      { ville: 'Berlin', pays: 'Allemagne', debut: '2027-07-11', fin: '2027-07-14' },
    ] },
    { id: 't-mateo', userId: 'u-mateo', destination: 'Andalousie', etapes: [
      { ville: 'Séville', pays: 'Espagne', debut: '2027-07-14', fin: '2027-07-16' },
      { ville: 'Grenade', pays: 'Espagne', debut: '2027-07-17', fin: '2027-07-19' },
    ] },
    { id: 't-zoe', userId: 'u-zoe', destination: 'Grèce', etapes: [
      { ville: 'Athènes', pays: 'Grèce', debut: '2027-07-20', fin: '2027-07-22' },
      { ville: 'Santorin', pays: 'Grèce', debut: '2027-07-23', fin: '2027-07-27' },
    ] },
    { id: 't-yasmine', userId: 'u-yasmine', destination: 'Maroc', etapes: [
      { ville: 'Marrakech', pays: 'Maroc', debut: '2027-07-06', fin: '2027-07-10' },
    ] },
    { id: 't-anouk', userId: 'u-anouk', destination: 'Méditerranée', etapes: [
      { ville: 'Lyon', pays: 'France', debut: '2027-07-01', fin: '2027-07-04' },
      { ville: 'Marseille', pays: 'France', debut: '2027-07-05', fin: '2027-07-07' },
      { ville: 'Nice', pays: 'France', debut: '2027-07-08', fin: '2027-07-10' },
    ] },
    { id: 't-camille', userId: 'u-camille', destination: 'Paris', etapes: [
      { ville: 'Paris', pays: 'France', debut: '2027-07-14', fin: '2027-07-20' },
    ] },
    { id: 't-arben', userId: 'u-arben', destination: 'Kosovo', etapes: [
      { ville: 'Pristina', pays: 'Kosovo', debut: '2027-07-16', fin: '2027-07-19' },
      { ville: 'Prizren', pays: 'Kosovo', debut: '2027-07-20', fin: '2027-07-24' },
    ] },
    { id: 't-lina', userId: 'u-lina', destination: 'Paris – Balkans', etapes: [
      { ville: 'Paris', pays: 'France', debut: '2027-07-12', fin: '2027-07-15' },
      { ville: 'Pristina', pays: 'Kosovo', debut: '2027-07-18', fin: '2027-07-20' },
      { ville: 'Prizren', pays: 'Kosovo', debut: '2027-07-21', fin: '2027-07-23' },
    ] },
  ],

  requests: [    { id: 'r-tom-lea', fromId: 'u-tom', toId: 'u-lea', message: 'Salut ! Je suis à Lagos le 10, partante pour un resto ?', statut: 'en_attente', creeLe: '2026-10-29T10:00:00Z' },
    { id: 'r-lea-ines', fromId: 'u-lea', toId: 'u-ines', message: 'On a 2 étapes en commun, ça te dit de louer une voiture à plusieurs ?', statut: 'acceptee', creeLe: '2026-10-29T09:00:00Z' },
    { id: 'r-lea-sofia', fromId: 'u-lea', toId: 'u-sofia', message: 'On est à Lagos en même temps, road trip ensemble ?', statut: 'acceptee', creeLe: '2026-10-29T09:05:00Z' },
  ],

  groups: [
    { id: 'g-algarve', nom: 'Road trip Algarve', destination: 'Algarve', membres: ['u-lea', 'u-ines', 'u-sofia'], creeLe: '2026-10-29T09:30:00Z' },
  ],

  messages: [
    { id: 'm-1', groupId: 'g-algarve', auteurId: 'u-lea', texte: 'Hello ! On loue une voiture à Lagos le 12 ?', envoyeLe: '2026-10-29T09:31:00Z' },
    { id: 'm-2', groupId: 'g-algarve', auteurId: 'u-ines', texte: 'Carrément, je regarde les prix.', envoyeLe: '2026-10-29T09:33:00Z' },
  ],

  expenses: [],
  avis: [],
  blocages: [],

  // Partie « partenaires » (US-18, US-20). Établissements FICTIFS, données de démonstration :
  // aucune vraie entreprise n'est présentée comme partenaire. Aucun partenaire au Portugal
  // (Faro montre l'état vide « Pas encore d'offre partenaire »).
  partenaires: [
    { id: 'p-traboules', nom: 'Auberge des Traboules', ville: 'Lyon', categorie: 'hebergement', description: 'Auberge de jeunesse dans une maison du Vieux Lyon, dortoirs et chambres partagées.', valide: true },
    { id: 'p-velorhone', nom: 'Vélo’Rhône', ville: 'Lyon', categorie: 'location', description: 'Location de vélos et de vélos électriques le long des quais.', valide: true },
    { id: 'p-pentes', nom: 'Le Bouchon des Pentes', ville: 'Lyon', categorie: 'restaurant', description: 'Cuisine lyonnaise de tradition, grandes tablées.', valide: true },
    { id: 'p-saone', nom: 'Saône Canoë Club', ville: 'Lyon', categorie: 'activite', description: 'Balades encadrées en canoë sur la Saône.', valide: true },
    { id: 'p-gones', nom: 'Les Gones Voyageurs', ville: 'Lyon', categorie: 'hebergement', description: 'Nouvelle auberge à la Croix-Rousse.', valide: false },
    { id: 'p-canal', nom: 'Auberge du Canal', ville: 'Paris', categorie: 'hebergement', description: 'Auberge au bord du canal Saint-Martin.', valide: true },
    { id: 'p-cycloseine', nom: 'Cyclo Seine', ville: 'Paris', categorie: 'location', description: 'Location de vélos pour les berges de Seine.', valide: true },
    { id: 'p-croissant', nom: 'Atelier Croissant', ville: 'Paris', categorie: 'activite', description: 'Cours de viennoiserie en petit groupe.', valide: true },
    { id: 'p-zellige', nom: 'Riad Zellige', ville: 'Marrakech', categorie: 'hebergement', description: 'Riad de six chambres au cœur de la médina.', valide: true },
    { id: 'p-atlasroute', nom: 'Atlas Route', ville: 'Marrakech', categorie: 'location', description: 'Location de voitures avec ou sans chauffeur pour l’Atlas.', valide: true },
    { id: 'p-dartajine', nom: 'Dar Tajine', ville: 'Marrakech', categorie: 'restaurant', description: 'Cours de cuisine marocaine suivis du repas.', valide: true },
    { id: 'p-bulevardi', nom: 'Hostel Bulevardi', ville: 'Pristina', categorie: 'hebergement', description: 'Auberge près du boulevard Mère-Teresa.', valide: true },
    { id: 'p-sharrtrek', nom: 'Sharr Trek', ville: 'Prizren', categorie: 'activite', description: 'Randonnées guidées dans les monts Sharr.', valide: true },
  ],

  // reductionPct : pourcentage entier ; minVoyageurs : taille minimale du groupe ; debut/fin : validité.
  offres: [
    { id: 'o-traboules', partenaireId: 'p-traboules', titre: 'Dortoir privatisé pour votre groupe', description: 'Un dortoir rien que pour vous dès 3 voyageurs, petit-déjeuner compris.', reductionPct: 15, minVoyageurs: 3, debut: '2026-09-01', fin: '2027-09-30', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-velorhone', partenaireId: 'p-velorhone', titre: 'Vélos pour la journée', description: 'Vélos et cadenas pour toute la journée, carte des quais offerte.', reductionPct: 20, minVoyageurs: 2, debut: '2026-09-01', fin: '2027-10-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-velorhone-ete', partenaireId: 'p-velorhone', titre: 'Spécial été 2026', description: 'Offre terminée : elle ne doit plus apparaître.', reductionPct: 30, minVoyageurs: 2, debut: '2026-06-01', fin: '2026-08-31', active: true, creeLe: '2026-06-01T08:00:00Z' },
    { id: 'o-pentes', partenaireId: 'p-pentes', titre: 'Menu bouchon pour les tablées', description: 'Menu complet entrée, plat, dessert pour les groupes RoadMates.', reductionPct: 10, minVoyageurs: 4, debut: '2026-09-01', fin: '2027-12-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-saone', partenaireId: 'p-saone', titre: 'Balade en canoë au coucher du soleil', description: 'Deux heures sur la Saône avec un moniteur.', reductionPct: 15, minVoyageurs: 3, debut: '2027-04-01', fin: '2027-09-30', active: true, creeLe: '2026-10-01T08:00:00Z' },
    { id: 'o-gones', partenaireId: 'p-gones', titre: 'Ouverture : nuit offerte', description: 'Brouillon d’un partenaire pas encore validé.', reductionPct: 25, minVoyageurs: 3, debut: '2026-10-01', fin: '2027-06-30', active: true, creeLe: '2026-10-15T08:00:00Z' },
    { id: 'o-canal', partenaireId: 'p-canal', titre: 'Chambre de 4 au bord du canal', description: 'Chambre privative pour 4, draps fournis.', reductionPct: 12, minVoyageurs: 3, debut: '2026-09-01', fin: '2027-09-30', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-cycloseine', partenaireId: 'p-cycloseine', titre: 'Vélos pour les berges', description: 'Location à la demi-journée ou à la journée.', reductionPct: 20, minVoyageurs: 2, debut: '2026-09-01', fin: '2027-10-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-croissant', partenaireId: 'p-croissant', titre: 'Cours de croissants entre voyageurs', description: 'Deux heures de cours, vous repartez avec votre fournée.', reductionPct: 15, minVoyageurs: 4, debut: '2026-09-01', fin: '2027-12-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-zellige', partenaireId: 'p-zellige', titre: 'Le riad pour votre groupe', description: 'Trois chambres et la terrasse, thé d’accueil offert.', reductionPct: 15, minVoyageurs: 3, debut: '2026-09-01', fin: '2027-12-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-atlasroute', partenaireId: 'p-atlasroute', titre: '4×4 pour l’Atlas', description: 'Véhicule 7 places, à partager entre compagnons.', reductionPct: 20, minVoyageurs: 4, debut: '2026-09-01', fin: '2027-12-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-dartajine', partenaireId: 'p-dartajine', titre: 'Cours de tajine et dîner', description: 'Marché, cours et repas sur la terrasse.', reductionPct: 10, minVoyageurs: 3, debut: '2026-09-01', fin: '2027-12-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-bulevardi', partenaireId: 'p-bulevardi', titre: 'Dortoir de groupe à Pristina', description: 'Lits côte à côte et casiers, à deux pas du boulevard.', reductionPct: 15, minVoyageurs: 3, debut: '2026-09-01', fin: '2027-12-31', active: true, creeLe: '2026-09-01T08:00:00Z' },
    { id: 'o-sharrtrek', partenaireId: 'p-sharrtrek', titre: 'Journée dans les monts Sharr', description: 'Randonnée guidée et pique-nique, transport depuis Prizren.', reductionPct: 20, minVoyageurs: 4, debut: '2027-05-01', fin: '2027-10-15', active: true, creeLe: '2026-10-01T08:00:00Z' },
  ],}
