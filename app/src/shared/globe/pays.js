// Noms des pays en français (i18n-iso-countries, locale fr seule) pour l'autocomplétion.
import countries from 'i18n-iso-countries'
import fr from 'i18n-iso-countries/langs/fr.json'

countries.registerLocale(fr)

// Noms d'usage plutôt que noms officiels longs.
const USAGE = {
  CZ: 'Tchéquie', US: 'États-Unis', RU: 'Russie', KR: 'Corée du Sud', KP: 'Corée du Nord',
  IR: 'Iran', SY: 'Syrie', VN: 'Viêt Nam', LA: 'Laos', BO: 'Bolivie', VE: 'Venezuela',
  TZ: 'Tanzanie', MD: 'Moldavie', MK: 'Macédoine du Nord', CD: 'RD Congo', CG: 'Congo',
  TW: 'Taïwan', BN: 'Brunei', FM: 'Micronésie', PS: 'Palestine', VA: 'Vatican',
}

export function nomPays(iso2) {
  return USAGE[iso2] ?? countries.getName(iso2, 'fr') ?? iso2
}

export function alpha2DepuisNumerique(code) {
  return countries.numericToAlpha2(code) ?? null
}

export const PAYS = Object.keys(countries.getNames('fr'))
  .map((iso2) => ({ iso2, nom: nomPays(iso2) }))
  .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
