// données de démo, reprises du parcours de Léa (vision produit §4.2).
// Elles permettent à chaque partie de travailler sans attendre l'autre.

export const seed = {
  session: { userId: 'u-lea' },

  users: [
    { id: 'u-lea', prenom: 'Léa', age: 23, genre: 'F', langues: ['français', 'anglais', 'portugais'], bio: 'Erasmus à Lisbonne, road trip dans l’Algarve cet été.', verifie: true },
    { id: 'u-ines', prenom: 'Inès', age: 24, genre: 'F', langues: ['français', 'espagnol'], bio: 'Étudiante en archi, fan de surf.', verifie: true },
    { id: 'u-karim', prenom: 'Karim', age: 34, genre: 'H', langues: ['français', 'anglais', 'arabe'], bio: 'En télétravail, je cherche des randos et des dîners à plusieurs.', verifie: true },
    { id: 'u-sofia', prenom: 'Sofia', age: 27, genre: 'F', langues: ['espagnol', 'anglais'], bio: 'Photographe, je voyage léger.', verifie: true },
    { id: 'u-tom', prenom: 'Tom', age: 22, genre: 'H', langues: ['anglais', 'français'], bio: 'Backpacker, budget serré.', verifie: false },
    { id: 'u-maya', prenom: 'Maya', age: 29, genre: 'F', langues: ['allemand', 'anglais'], bio: 'Je découvre le Portugal du nord au sud.', verifie: true },
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
