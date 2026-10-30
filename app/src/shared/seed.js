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

// Photo de démonstration générée en SVG (aucune image distante, aucun visage réel).
const photoDemo = (lettre, c1, c2) => `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="96" height="96" fill="url(#g)"/><circle cx="48" cy="38" r="17" fill="#fff" fill-opacity=".9"/><path d="M16 92c4-20 18-30 32-30s28 10 32 30z" fill="#fff" fill-opacity=".9"/><text x="48" y="45" font-family="Georgia,serif" font-size="20" font-weight="700" text-anchor="middle" fill="${c2}">${lettre}</text></svg>`,
)}`

export const seed = {
  // À incrémenter quand on ajoute des données : les navigateurs qui ont déjà joué la démo
  // les reçoivent sans perdre les leurs (voir completerAvecSeed dans db.js).
  version: 7,
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
    { id: 'u-emma', ...profil(['kayak', 'plage', 'nature'], 'aventure', 5000, 'actif', 'activites'), prenom: 'Emma', email: 'emma@roadmates.demo', age: 22, genre: 'F', langues: ['français', 'anglais'], bio: 'Kayak et criques en Croatie.', verifie: true },
    { id: 'u-nora', ...profil(['vélo', 'musées', 'gastronomie'], 'culture', 7500, 'modéré', 'tout'), prenom: 'Nora', email: 'nora@roadmates.demo', age: 24, genre: 'F', langues: ['allemand', 'anglais'], bio: 'Vélo, musées et cafés.', verifie: true },
    { id: 'u-mateo', ...profil(['danse', 'randonnée', 'culture'], 'aventure', 5500, 'actif', 'activites'), prenom: 'Mateo', email: 'mateo@roadmates.demo', age: 30, genre: 'H', langues: ['espagnol', 'anglais'], bio: 'Flamenco et randonnée en Andalousie.', verifie: true },
    { id: 'u-zoe', ...profil(['plage', 'ferry', 'nature'], 'routard', 4000, 'tranquille', 'trajet'), prenom: 'Zoé', email: 'zoe@roadmates.demo', age: 27, genre: 'F', langues: ['français', 'italien'], bio: 'Les îles grecques, sac à dos et ferry.', verifie: true },
    { id: 'u-yasmine', ...profil(['culture', 'randonnée', 'gastronomie'], 'aventure', 5000, 'modéré', 'tout'), prenom: 'Yasmine', email: 'yasmine@roadmates.demo', age: 26, genre: 'F', langues: ['français', 'arabe'], bio: 'Marrakech puis le désert, à plusieurs c’est mieux.', verifie: true },
    { id: 'u-anouk', ...profil(['plage', 'randonnée', 'rencontres'], 'routard', 3500, 'actif', 'activites'), prenom: 'Anouk', email: 'anouk@roadmates.demo', age: 21, genre: 'F', langues: ['français', 'anglais'], bio: 'Étudiante à Lyon, cap sur la Méditerranée.', verifie: true },
    // Vitrine des destinations partenaires (Paris, Kosovo), version 5. Toujours hors Portugal.
    { id: 'u-camille', ...profil(['musées', 'photographie', 'gastronomie'], 'culture', 6500, 'modéré', 'activites'), prenom: 'Camille', email: 'camille@roadmates.demo', age: 25, genre: 'F', langues: ['français', 'anglais', 'espagnol'], bio: 'Une semaine à Paris : expos, marchés et soirées au bord du canal.', verifie: true },
    { id: 'u-arben', ...profil(['randonnée', 'histoire', 'rencontres'], 'aventure', 3500, 'actif', 'tout'), prenom: 'Arben', email: 'arben@roadmates.demo', age: 27, genre: 'H', langues: ['albanais', 'anglais', 'allemand'], bio: 'Je fais découvrir le Kosovo à qui veut : Pristina, Prizren et les monts Sharr.', verifie: true },
    { id: 'u-lina', ...profil(['street art', 'randonnée', 'culture'], 'routard', 4000, 'modéré', 'trajet'), prenom: 'Lina', email: 'lina@roadmates.demo', age: 23, genre: 'F', langues: ['français', 'anglais'], bio: 'Paris puis les Balkans en bus, je cherche des compagnons pour les trajets.', verifie: true },

    // Version 6 : plus de profils variés pour la vitrine (toujours hors Portugal).
    { id: 'u-hugo', ...profil(['gastronomie', 'plage', 'vélo'], 'confort', 7000, 'tranquille', 'activites'), prenom: 'Hugo', email: 'hugo@roadmates.demo', age: 29, genre: 'H', langues: ['français', 'espagnol', 'anglais'], bio: 'Tapas, vélo le long de la mer et longues soirées : Barcelone puis Valence.', verifie: true },
    { id: 'u-sara', ...profil(['musées', 'histoire', 'gastronomie'], 'culture', 6000, 'modéré', 'tout'), prenom: 'Sara', email: 'sara@roadmates.demo', age: 24, genre: 'F', langues: ['italien', 'anglais', 'français'], bio: 'Rome et Florence pour mon mémoire en histoire de l’art, et beaucoup de glaces.', verifie: true },
    { id: 'u-malik', ...profil(['randonnée', 'photographie', 'culture'], 'aventure', 4500, 'actif', 'activites'), prenom: 'Malik', email: 'malik@roadmates.demo', age: 27, genre: 'H', langues: ['français', 'arabe', 'anglais'], bio: 'Photographe amateur, je pars vers l’Atlas au lever du jour.', verifie: true },
    { id: 'u-clara', ...profil(['street art', 'musées', 'rencontres'], 'routard', 3500, 'actif', 'trajet'), prenom: 'Clara', email: 'clara@roadmates.demo', age: 22, genre: 'F', langues: ['français', 'anglais'], bio: 'Étudiante en design : fresques à Lyon, puis Paris en covoiturage.', verifie: true },
    { id: 'u-dren', ...profil(['randonnée', 'histoire', 'rencontres'], 'routard', 3000, 'actif', 'tout'), prenom: 'Dren', email: 'dren@roadmates.demo', age: 25, genre: 'H', langues: ['albanais', 'anglais', 'italien'], bio: 'Né à Prizren, je guide volontiers vers les monts Sharr.', verifie: true },
    { id: 'u-julie', ...profil(['musées', 'train', 'photographie'], 'culture', 5500, 'tranquille', 'trajet'), prenom: 'Julie', email: 'julie@roadmates.demo', age: 30, genre: 'F', langues: ['français', 'allemand', 'anglais'], bio: 'Prague et Vienne en train de nuit, appareil photo argentique en bandoulière.', verifie: true },

    // Version 7 : le Kosovo s'anime (Pristina, Prizren, Peja, Gjakova), voyageurs vérifiés.
    { id: 'u-elira', ...profil(['randonnée', 'culture', 'gastronomie'], 'aventure', 4000, 'modéré', 'activites'), prenom: 'Elira', email: 'elira@roadmates.demo', age: 24, genre: 'F', langues: ['albanais', 'anglais', 'français'], bio: 'Je rentre voir ma famille à Pristina et je file randonner dans la Rugova.', verifie: true },
    { id: 'u-luan', ...profil(['histoire', 'photographie', 'rencontres'], 'culture', 4500, 'tranquille', 'activites'), prenom: 'Luan', email: 'luan@roadmates.demo', age: 28, genre: 'H', langues: ['albanais', 'anglais', 'italien'], bio: 'Bazars, ponts ottomans et cafés : Prizren puis Gjakova, appareil photo à la main.', verifie: true },
    { id: 'u-nina', ...profil(['randonnée', 'musées', 'street art'], 'routard', 3500, 'actif', 'tout'), prenom: 'Nina', email: 'nina@roadmates.demo', age: 26, genre: 'F', langues: ['français', 'allemand', 'anglais'], bio: 'Trois semaines dans les Balkans en bus, je cherche des compagnons pour tout le voyage.', verifie: true },
    { id: 'u-blerim', ...profil(['escalade', 'randonnée', 'nature'], 'aventure', 4000, 'actif', 'activites'), prenom: 'Blerim', email: 'blerim@roadmates.demo', age: 31, genre: 'H', langues: ['albanais', 'anglais', 'allemand'], bio: 'Grimpeur, je passe l’été dans la Rugova : via ferrata et bivouacs.', verifie: true },
    { id: 'u-marie', ...profil(['culture', 'rencontres', 'gastronomie'], 'confort', 6000, 'modéré', 'activites'), prenom: 'Marie', email: 'marie@roadmates.demo', age: 23, genre: 'F', langues: ['français', 'anglais'], bio: 'Premier voyage solo : Pristina, ses cafés et ses musées.', verifie: true },

    // « Full » : le personnage qui peut tout montrer (profil complet, voyages passés et à venir,
    // contacts, groupes, dépenses, avis, amis de route). Aucune interaction avec le parcours de Léa.
    {
      id: 'u-full',
      ...profil(['randonnée', 'gastronomie', 'culture', 'photographie', 'musées', 'street art', 'plage', 'rencontres'], 'aventure', 6000, 'modéré', 'tout'),
      photoUrl: photoDemo('F', '#FF9F45', '#7A4BDB'),
      amisRoute: ['u-camille', 'u-arben'],
      prenom: 'Full',
      email: 'full@roadmates.demo',
      age: 26,
      genre: 'autre',
      langues: ['français', 'anglais', 'espagnol', 'italien', 'albanais', 'arabe'],
      bio: 'Profil de démonstration complet : je voyage partout, je parle six langues et j’ai déjà partagé un bateau à Split. Cet été : Lyon, Paris puis les Balkans.',
      verifie: true,
    },
  ],

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
    // Version 6
    { id: 't-hugo', userId: 'u-hugo', destination: 'Côte espagnole', etapes: [
      { ville: 'Barcelone', pays: 'Espagne', debut: '2027-07-05', fin: '2027-07-09' },
      { ville: 'Valence', pays: 'Espagne', debut: '2027-07-10', fin: '2027-07-12' },
    ] },
    { id: 't-sara', userId: 'u-sara', destination: 'Italie', etapes: [
      { ville: 'Rome', pays: 'Italie', debut: '2027-07-10', fin: '2027-07-14' },
      { ville: 'Florence', pays: 'Italie', debut: '2027-07-15', fin: '2027-07-18' },
    ] },
    { id: 't-malik', userId: 'u-malik', destination: 'Marrakech et l’Atlas', etapes: [
      { ville: 'Marrakech', pays: 'Maroc', debut: '2027-07-07', fin: '2027-07-12' },
    ] },
    { id: 't-clara', userId: 'u-clara', destination: 'Lyon – Paris', etapes: [
      { ville: 'Lyon', pays: 'France', debut: '2027-07-02', fin: '2027-07-05' },
      { ville: 'Paris', pays: 'France', debut: '2027-07-15', fin: '2027-07-18' },
    ] },
    { id: 't-dren', userId: 'u-dren', destination: 'Prizren', etapes: [
      { ville: 'Prizren', pays: 'Kosovo', debut: '2027-07-20', fin: '2027-07-24' },
    ] },
    { id: 't-julie', userId: 'u-julie', destination: 'Europe centrale en train', etapes: [
      { ville: 'Prague', pays: 'Tchéquie', debut: '2027-07-08', fin: '2027-07-11' },
      { ville: 'Vienne', pays: 'Autriche', debut: '2027-07-12', fin: '2027-07-15' },
    ] },
    // Version 7 : Kosovo
    { id: 't-elira', userId: 'u-elira', destination: 'Kosovo en famille', etapes: [
      { ville: 'Pristina', pays: 'Kosovo', debut: '2027-07-15', fin: '2027-07-18' },
      { ville: 'Peja', pays: 'Kosovo', debut: '2027-07-19', fin: '2027-07-22' },
    ] },
    { id: 't-luan', userId: 'u-luan', destination: 'Bazars du Kosovo', etapes: [
      { ville: 'Prizren', pays: 'Kosovo', debut: '2027-07-19', fin: '2027-07-23' },
      { ville: 'Gjakova', pays: 'Kosovo', debut: '2027-07-24', fin: '2027-07-26' },
    ] },
    { id: 't-nina', userId: 'u-nina', destination: 'Balkans en bus', etapes: [
      { ville: 'Pristina', pays: 'Kosovo', debut: '2027-07-17', fin: '2027-07-20' },
      { ville: 'Prizren', pays: 'Kosovo', debut: '2027-07-21', fin: '2027-07-24' },
      { ville: 'Peja', pays: 'Kosovo', debut: '2027-07-25', fin: '2027-07-27' },
    ] },
    { id: 't-blerim', userId: 'u-blerim', destination: 'Rugova', etapes: [
      { ville: 'Peja', pays: 'Kosovo', debut: '2027-07-20', fin: '2027-07-26' },
    ] },
    { id: 't-marie', userId: 'u-marie', destination: 'Pristina', etapes: [
      { ville: 'Pristina', pays: 'Kosovo', debut: '2027-07-18', fin: '2027-07-21' },
    ] },
    // Full : un voyage terminé (Split, été 2026, partagé avec Camille et Arben) et un voyage à venir.
    { id: 't-full-ete', userId: 'u-full', destination: 'Croatie (été 2026)', etapes: [
      { ville: 'Split', pays: 'Croatie', debut: '2026-08-10', fin: '2026-08-14' },
    ] },
    { id: 't-camille-ete', userId: 'u-camille', destination: 'Croatie (été 2026)', etapes: [
      { ville: 'Split', pays: 'Croatie', debut: '2026-08-10', fin: '2026-08-13' },
    ] },
    { id: 't-arben-ete', userId: 'u-arben', destination: 'Croatie (été 2026)', etapes: [
      { ville: 'Split', pays: 'Croatie', debut: '2026-08-11', fin: '2026-08-14' },
    ] },
    { id: 't-full', userId: 'u-full', destination: 'Lyon → Balkans', etapes: [
      { ville: 'Lyon', pays: 'France', debut: '2027-07-02', fin: '2027-07-04' },
      { ville: 'Paris', pays: 'France', debut: '2027-07-14', fin: '2027-07-17' },
      { ville: 'Pristina', pays: 'Kosovo', debut: '2027-07-18', fin: '2027-07-20' },
      { ville: 'Prizren', pays: 'Kosovo', debut: '2027-07-21', fin: '2027-07-23' },
    ] },
  ],

  requests: [
    { id: 'r-tom-lea', fromId: 'u-tom', toId: 'u-lea', message: 'Salut ! Je suis à Lagos le 10, partante pour un resto ?', statut: 'en_attente', creeLe: '2026-10-29T10:00:00Z' },
    { id: 'r-lea-ines', fromId: 'u-lea', toId: 'u-ines', message: 'On a 2 étapes en commun, ça te dit de louer une voiture à plusieurs ?', statut: 'acceptee', creeLe: '2026-10-29T09:00:00Z' },
    { id: 'r-lea-sofia', fromId: 'u-lea', toId: 'u-sofia', message: 'On est à Lagos en même temps, road trip ensemble ?', statut: 'acceptee', creeLe: '2026-10-29T09:05:00Z' },
    // Full : contacts acceptés, une demande reçue à traiter, une demande envoyée en attente.
    { id: 'r-full-camille', fromId: 'u-full', toId: 'u-camille', message: 'On est à Split en même temps, on partage un bateau pour les îles ?', statut: 'acceptee', creeLe: '2026-07-20T18:00:00Z' },
    { id: 'r-arben-full', fromId: 'u-arben', toId: 'u-full', message: 'Je serai aussi à Split, et je te montre le Kosovo l’été prochain !', statut: 'acceptee', creeLe: '2026-07-22T09:00:00Z' },
    { id: 'r-lina-full', fromId: 'u-lina', toId: 'u-full', message: 'On a Pristina et Prizren en commun, le bus ensemble ?', statut: 'acceptee', creeLe: '2026-10-20T11:00:00Z' },
    { id: 'r-anouk-full', fromId: 'u-anouk', toId: 'u-full', message: 'Salut ! On est à Lyon les mêmes jours, une balade sur les quais ?', statut: 'en_attente', creeLe: '2026-10-29T16:00:00Z' },
    { id: 'r-full-malik', fromId: 'u-full', toId: 'u-malik', message: 'Je prépare un passage à Marrakech, partant pour l’Atlas ?', statut: 'en_attente', creeLe: '2026-10-28T10:00:00Z' },
  ],

  groups: [
    { id: 'g-algarve', nom: 'Road trip Algarve', destination: 'Algarve', membres: ['u-lea', 'u-ines', 'u-sofia'], creeLe: '2026-10-29T09:30:00Z' },
    { id: 'g-full-split', nom: 'Split entre amis', destination: 'Split', membres: ['u-full', 'u-camille', 'u-arben'], creeLe: '2026-07-25T10:00:00Z' },
    { id: 'g-full-balkans', nom: 'Balkans en bus', destination: 'Kosovo', membres: ['u-full', 'u-arben', 'u-lina'], creeLe: '2026-10-21T08:00:00Z' },
  ],

  messages: [
    { id: 'm-1', groupId: 'g-algarve', auteurId: 'u-lea', texte: 'Hello ! On loue une voiture à Lagos le 12 ?', envoyeLe: '2026-10-29T09:31:00Z' },
    { id: 'm-2', groupId: 'g-algarve', auteurId: 'u-ines', texte: 'Carrément, je regarde les prix.', envoyeLe: '2026-10-29T09:33:00Z' },
    { id: 'm-full-1', groupId: 'g-full-split', auteurId: 'u-full', texte: 'Le bateau pour Hvar est réservé, 50 € chacun !', envoyeLe: '2026-08-09T19:00:00Z' },
    { id: 'm-full-2', groupId: 'g-full-split', auteurId: 'u-camille', texte: 'Parfait, j’ai payé ma part.', envoyeLe: '2026-08-09T19:12:00Z' },
    { id: 'm-full-3', groupId: 'g-full-split', auteurId: 'u-arben', texte: 'Merci pour ce voyage, à l’été prochain au Kosovo !', envoyeLe: '2026-08-15T08:30:00Z' },
    { id: 'm-full-4', groupId: 'g-full-balkans', auteurId: 'u-arben', texte: 'J’ai trouvé une voiture à Pristina pour aller à Prizren le 21.', envoyeLe: '2026-10-22T10:00:00Z' },
    { id: 'm-full-5', groupId: 'g-full-balkans', auteurId: 'u-full', texte: 'Top, je paie ma part tout de suite.', envoyeLe: '2026-10-22T10:05:00Z' },
    { id: 'm-full-6', groupId: 'g-full-balkans', auteurId: 'u-lina', texte: 'Je règle la mienne ce week-end !', envoyeLe: '2026-10-22T10:20:00Z' },
  ],

  expenses: [
    // Split (terminé) : réglée par tous, réservation lancée → Full peut noter ses compagnons.
    { id: 'e-full-bateau', statut: 'reservee', groupId: 'g-full-split', createurId: 'u-full', libelle: 'Bateau pour Hvar', categorie: 'activité', montantCentimes: 15000, dateReservation: '2026-08-12',
      parts: [{ userId: 'u-full', montantCentimes: 5000, payee: true }, { userId: 'u-camille', montantCentimes: 5000, payee: true }, { userId: 'u-arben', montantCentimes: 5000, payee: true }], creeLe: '2026-08-09T18:55:00Z' },
    // Balkans (à venir) : une part reste à payer.
    { id: 'e-full-voiture', statut: 'ouverte', groupId: 'g-full-balkans', createurId: 'u-arben', libelle: 'Location voiture Pristina → Prizren', categorie: 'voiture', montantCentimes: 18000, dateReservation: '2027-07-21',
      parts: [{ userId: 'u-full', montantCentimes: 6000, payee: true }, { userId: 'u-arben', montantCentimes: 6000, payee: true }, { userId: 'u-lina', montantCentimes: 6000, payee: false }], creeLe: '2026-10-22T09:58:00Z' },
  ],
  // Avis du voyage à Split : Full et Arben se sont notés (avis publiés) ; Camille a noté Full,
  // et Full a encore à la noter (« 1 avis à laisser »).
  avis: [
    { id: 'a-arben-full', groupId: 'g-full-split', auteurId: 'u-arben', cibleId: 'u-full', note: 5, commentaire: 'Organisation au top, et toujours partant pour une baignade.', creeLe: '2026-08-16T10:00:00Z' },
    { id: 'a-full-arben', groupId: 'g-full-split', auteurId: 'u-full', cibleId: 'u-arben', note: 5, commentaire: 'Guide génial, il connaît chaque crique.', creeLe: '2026-08-16T12:00:00Z' },
    { id: 'a-camille-full', groupId: 'g-full-split', auteurId: 'u-camille', cibleId: 'u-full', note: 4, commentaire: 'Super compagnon de route, un peu trop matinal !', creeLe: '2026-08-17T09:00:00Z' },
  ],
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
    { id: 'p-pejaride', nom: 'Peja Ride', ville: 'Peja', categorie: 'location', description: 'Location de VTT et de vélos électriques pour la vallée de la Rugova.', valide: true },
    { id: 'p-bazari', nom: 'Maison du Bazar', ville: 'Gjakova', categorie: 'hebergement', description: 'Maison d’hôtes dans une ancienne demeure du grand bazar.', valide: true },
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
    { id: 'o-pejaride', partenaireId: 'p-pejaride', titre: 'VTT pour la journée dans la Rugova', description: 'Casques et carte des sentiers fournis.', reductionPct: 20, minVoyageurs: 2, debut: '2026-09-01', fin: '2027-10-31', active: true, creeLe: '2026-10-30T08:00:00Z' },
    { id: 'o-bazari', partenaireId: 'p-bazari', titre: 'La maison d’hôtes pour votre groupe', description: 'Quatre chambres autour de la cour, petit-déjeuner compris.', reductionPct: 15, minVoyageurs: 3, debut: '2026-09-01', fin: '2027-12-31', active: true, creeLe: '2026-10-30T08:00:00Z' },
  ],
}
