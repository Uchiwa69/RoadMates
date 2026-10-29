// Villes proposées à l'autocomplétion. La localisation est déclarative, à la ville (RSE-01).
export const VILLES = [
  ['Lisbonne', 'Portugal'], ['Porto', 'Portugal'], ['Lagos', 'Portugal'], ['Faro', 'Portugal'],
  ['Sintra', 'Portugal'], ['Coimbra', 'Portugal'],
  ['Madrid', 'Espagne'], ['Barcelone', 'Espagne'], ['Séville', 'Espagne'], ['Grenade', 'Espagne'],
  ['Valence', 'Espagne'],
  ['Paris', 'France'], ['Lyon', 'France'], ['Marseille', 'France'], ['Bordeaux', 'France'],
  ['Nice', 'France'],
  ['Rome', 'Italie'], ['Florence', 'Italie'], ['Naples', 'Italie'], ['Venise', 'Italie'],
  ['Milan', 'Italie'],
  ['Berlin', 'Allemagne'], ['Munich', 'Allemagne'], ['Amsterdam', 'Pays-Bas'],
  ['Bruxelles', 'Belgique'], ['Prague', 'Tchéquie'], ['Vienne', 'Autriche'],
  ['Budapest', 'Hongrie'], ['Cracovie', 'Pologne'], ['Athènes', 'Grèce'], ['Dublin', 'Irlande'],
  ['Londres', 'Royaume-Uni'], ['Édimbourg', 'Royaume-Uni'], ['Copenhague', 'Danemark'],
].map(([ville, pays]) => ({ ville, pays }))

const norm = (s) => s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

export function trouverVille(saisie) {
  return VILLES.find((v) => norm(v.ville) === norm(saisie)) ?? null
}
