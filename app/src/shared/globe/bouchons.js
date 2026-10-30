// Bouchons pour le build (voir vite.config.js) : three-globe importe le moteur WebGPU de three
// et h3-js pour ses calques heatmap, hexagones et particules, que RoadMates n'utilise pas.
// Les remplacer allège le chunk du globe de plusieurs centaines de Ko (RSE-05).
// Si l'un de ces calques venait à être utilisé, l'erreur ci-dessous le signalerait aussitôt.
function absent() {
  throw new Error('Calque du globe non disponible dans RoadMates (module remplacé au build).')
}

export class WebGPURenderer { constructor() { absent() } }
export class StorageInstancedBufferAttribute { constructor() { absent() } }

export const latLngToCell = absent
export const cellToLatLng = absent
export const cellToBoundary = absent
export const polygonToCells = absent
