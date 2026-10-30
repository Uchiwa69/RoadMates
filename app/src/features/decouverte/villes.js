// Villes proposées à l'autocomplétion. La localisation est déclarative, à la ville (RSE-01).
// lat/lng : centre-ville, pour le globe. iso : code ISO 3166-1 alpha-2 du pays.
export const VILLES = [
  ['Lisbonne', 'Portugal', 'PT', 38.72, -9.14], ['Porto', 'Portugal', 'PT', 41.15, -8.61],
  ['Lagos', 'Portugal', 'PT', 37.10, -8.67], ['Faro', 'Portugal', 'PT', 37.02, -7.93],
  ['Sintra', 'Portugal', 'PT', 38.80, -9.38], ['Coimbra', 'Portugal', 'PT', 40.21, -8.43],
  ['Madrid', 'Espagne', 'ES', 40.42, -3.70], ['Barcelone', 'Espagne', 'ES', 41.39, 2.17],
  ['Séville', 'Espagne', 'ES', 37.39, -5.98], ['Grenade', 'Espagne', 'ES', 37.18, -3.60],
  ['Valence', 'Espagne', 'ES', 39.47, -0.38],
  ['Paris', 'France', 'FR', 48.86, 2.35], ['Lyon', 'France', 'FR', 45.76, 4.84],
  ['Marseille', 'France', 'FR', 43.30, 5.37], ['Bordeaux', 'France', 'FR', 44.84, -0.58],
  ['Nice', 'France', 'FR', 43.70, 7.27],
  ['Rome', 'Italie', 'IT', 41.90, 12.50], ['Florence', 'Italie', 'IT', 43.77, 11.26],
  ['Naples', 'Italie', 'IT', 40.85, 14.27], ['Venise', 'Italie', 'IT', 45.44, 12.32],
  ['Milan', 'Italie', 'IT', 45.46, 9.19],
  ['Berlin', 'Allemagne', 'DE', 52.52, 13.40], ['Munich', 'Allemagne', 'DE', 48.14, 11.58],
  ['Amsterdam', 'Pays-Bas', 'NL', 52.37, 4.90], ['Bruxelles', 'Belgique', 'BE', 50.85, 4.35],
  ['Prague', 'Tchéquie', 'CZ', 50.08, 14.44], ['Vienne', 'Autriche', 'AT', 48.21, 16.37],
  ['Budapest', 'Hongrie', 'HU', 47.50, 19.04], ['Cracovie', 'Pologne', 'PL', 50.06, 19.94],
  ['Athènes', 'Grèce', 'GR', 37.98, 23.73], ['Santorin', 'Grèce', 'GR', 36.39, 25.46],
  ['Dublin', 'Irlande', 'IE', 53.35, -6.26],
  ['Londres', 'Royaume-Uni', 'GB', 51.51, -0.13], ['Édimbourg', 'Royaume-Uni', 'GB', 55.95, -3.19],
  ['Copenhague', 'Danemark', 'DK', 55.68, 12.57], ['Stockholm', 'Suède', 'SE', 59.33, 18.07],
  ['Split', 'Croatie', 'HR', 43.51, 16.44], ['Dubrovnik', 'Croatie', 'HR', 42.65, 18.09],
  ['Zagreb', 'Croatie', 'HR', 45.81, 15.98],
  ['Istanbul', 'Turquie', 'TR', 41.01, 28.98], ['Marrakech', 'Maroc', 'MA', 31.63, -8.01],
  ['Pristina', 'Kosovo', 'XK', 42.66, 21.17], ['Prizren', 'Kosovo', 'XK', 42.21, 20.74],
  ['Peja', 'Kosovo', 'XK', 42.66, 20.29], ['Gjakova', 'Kosovo', 'XK', 42.38, 20.43],
].map(([ville, pays, iso, lat, lng]) => ({ ville, pays, iso, lat, lng }))

const norm = (s) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function trouverVille(saisie) {
  return VILLES.find((v) => norm(v.ville) === norm(saisie)) ?? null
}
