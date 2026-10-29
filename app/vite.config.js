import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const bouchons = fileURLToPath(new URL('./src/shared/globe/bouchons.js', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Chemins relatifs : le site fonctionne sous https://<compte>.github.io/RoadMates/
  base: './',
  build: {
    // Le chunk du globe (three.js) fait environ 1 Mo minifié, 280 Ko compressé. Il est chargé
    // en différé, seulement sur les pages qui affichent le globe : le seuil par défaut de 500 Ko
    // ne s'applique pas à lui. Tout autre chunk qui dépasserait 1 050 Ko déclencherait l'alerte.
    chunkSizeWarningLimit: 1050,
  },
  resolve: {
    // Modules du globe jamais utilisés par RoadMates (voir src/shared/globe/bouchons.js).
    alias: [
      { find: /^three\/webgpu$/, replacement: bouchons },
      { find: /^three\/tsl$/, replacement: bouchons },
      { find: /^h3-js$/, replacement: bouchons },
    ],
  },
})
