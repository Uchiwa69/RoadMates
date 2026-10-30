// données de démo, reprises du parcours de Léa (vision produit §4.2).
// Elles permettent à chaque partie de travailler sans attendre l'autre.

export const seed = {
  // À incrémenter quand on ajoute des données : les navigateurs qui ont déjà joué la démo
  // les reçoivent sans perdre les leurs (voir completerAvecSeed dans db.js).
  version: 2,
  session: { userId: 'u-lea' },

  users: [
    { id: 'u-lea', prenom: 'Léa', email: 'lea@roadmates.demo', age: 23, genre: 'F', langues: ['français', 'anglais', 'portugais'], bio: 'Erasmus à Lisbonne, road trip dans l’Algarve cet été.', verifie: true },
    { id: 'u-ines', prenom: 'Inès', email: 'ines@roadmates.demo', age: 24, genre: 'F', langues: ['français', 'espagnol'], bio: 'Étudiante en archi, fan de surf.', verifie: true },
    { id: 'u-karim', prenom: 'Karim', email: 'karim@roadmates.demo', age: 34, genre: 'H', langues: ['français', 'anglais', 'arabe'], bio: 'En télétravail, je cherche des randos et des dîners à plusieurs.', verifie: true },
    { id: 'u-sofia', prenom: 'Sofia', email: 'sofia@roadmates.demo', age: 27, genre: 'F', langues: ['espagnol', 'anglais'], bio: 'Photographe, je voyage léger.', verifie: true },
    { id: 'u-tom', prenom: 'Tom', email: 'tom@roadmates.demo', age: 22, genre: 'H', langues: ['anglais', 'français'], bio: 'Backpacker, budget serré.', verifie: false },
    { id: 'u-maya', prenom: 'Maya', email: 'maya@roadmates.demo', age: 29, genre: 'F', langues: ['allemand', 'anglais'], bio: 'Je découvre le Portugal du nord au sud.', verifie: true },
    // Voyageurs de la vitrine (globe de l'accueil). Aucun ne passe par le Portugal :
    // ils ne changent pas les résultats du parcours de démo.
    { id: 'u-lucas', prenom: 'Lucas', email: 'lucas@roadmates.demo', age: 26, genre: 'H', langues: ['français', 'anglais'], bio: 'La côte espagnole en train et en stop.', verifie: true },
    { id: 'u-chiara', prenom: 'Chiara', email: 'chiara@roadmates.demo', age: 25, genre: 'F', langues: ['italien', 'anglais', 'français'], bio: 'Je rentre au pays, envie de faire découvrir le sud.', verifie: true },
    { id: 'u-jonas', prenom: 'Jonas', email: 'jonas@roadmates.demo', age: 28, genre: 'H', langues: ['allemand', 'anglais'], bio: 'Interrail entre les capitales d’Europe centrale.', verifie: true },
    { id: 'u-emma', prenom: 'Emma', email: 'emma@roadmates.demo', age: 22, genre: 'F', langues: ['français', 'anglais'], bio: 'Kayak et criques en Croatie.', verifie: false },
    { id: 'u-nora', prenom: 'Nora', email: 'nora@roadmates.demo', age: 24, genre: 'F', langues: ['allemand', 'anglais'], bio: 'Vélo, musées et cafés.', verifie: true },
    { id: 'u-mateo', prenom: 'Mateo', email: 'mateo@roadmates.demo', age: 30, genre: 'H', langues: ['espagnol', 'anglais'], bio: 'Flamenco et randonnée en Andalousie.', verifie: true },
    { id: 'u-zoe', prenom: 'Zoé', email: 'zoe@roadmates.demo', age: 27, genre: 'F', langues: ['français', 'italien'], bio: 'Les îles grecques, sac à dos et ferry.', verifie: true },
    { id: 'u-yasmine', prenom: 'Yasmine', email: 'yasmine@roadmates.demo', age: 26, genre: 'F', langues: ['français', 'arabe'], bio: 'Marrakech puis le désert, à plusieurs c’est mieux.', verifie: true },
    { id: 'u-anouk', prenom: 'Anouk', email: 'anouk@roadmates.demo', age: 21, genre: 'F', langues: ['français', 'anglais'], bio: 'Étudiante à Lyon, cap sur la Méditerranée.', verifie: true },
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
  ],

  requests: [
    { id: 'r-tom-lea', fromId: 'u-tom', toId: 'u-lea', message: 'Salut ! Je suis à Lagos le 10, partante pour un resto ?', statut: 'en_attente', creeLe: '2026-10-29T10:00:00Z' },
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
}
