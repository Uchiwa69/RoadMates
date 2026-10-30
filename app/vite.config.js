import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const bouchons = fileURLToPath(new URL('./src/shared/globe/bouchons.js', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Chemins relatifs : le site fonctionne sous https://<compte>.github.io/RoadMates/
  base: './',
  // lightningcss (fourni par Vite) transpile le CSS moderne pour les navigateurs plus anciens :
  // light-dark() n'existe qu'à partir de Safari 17.5 ; il génère un repli équivalent.
  // Cibles : Safari 15, Firefox 115, Chrome 111 (ENF-09, deux dernières versions et un peu plus).
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: { safari: 15 << 16, firefox: 115 << 16, chrome: 111 << 16 },
    },
  },
  build: {
    cssMinify: 'lightningcss',
    // Le chunk du globe (three.js) fait environ 1 Mo minifié, 280 Ko compressé. Il est chargé
    // en différé, seulement sur les pages qui affichent le globe : le seuil par défaut de 500 Ko
    // ne s'applique pas à lui. Tout autre chunk qui dépasserait 1 050 Ko déclencherait l'alerte.
    chunkSizeWarningLimit: 1050,
    // Les pages sont chargées à la demande ; sans regroupement, chaque icône partagée et chaque
    // petit module métier deviendrait un fichier de quelques centaines d'octets (une requête chacun).
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'icones', test: /[\\/]node_modules[\\/]lucide-react[\\/]/ },
            { name: 'decouverte', test: /[\\/]src[\\/]features[\\/]decouverte[\\/][a-z]+\.js$/ },
            { name: 'groupe', test: /[\\/]src[\\/]features[\\/]groupe[\\/](depenses|format)\.js$/ },
          ],
        },
      },
    },
  },
  resolve: {
    // Modules du globe jamais utilisés par RoadMates (voir src/shared/globe/bouchons.js).
    alias: [
      { find: /^three\/webgpu$/, replacement: bouchons },
      { find: /^three\/tsl$/, replacement: bouchons },
      { find: /^h3-js$/, replacement: bouchons },
      { find: /^polished$/, replacement: fileURLToPath(new URL('./src/shared/globe/couleurs-fond.js', import.meta.url)) },
    ],
  },
})
