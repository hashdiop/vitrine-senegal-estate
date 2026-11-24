// Vérifie les fichiers JSON de src/data/json/ avant le build (npm run check:data).
// Lancé directement par Node (qui sait exécuter le TypeScript simple).
import { readFileSync } from 'node:fs'
import { contactSchema, contenusSchema, projetsSchema, terrainsSchema, valider } from '../src/data/schemas.ts'

const fichiers = [
  ['terrains.json', terrainsSchema],
  ['projets.json', projetsSchema],
  ['contact.json', contactSchema],
  ['contenus.json', contenusSchema],
] as const

let erreurs = 0
for (const [nom, schema] of fichiers) {
  const chemin = new URL(`../src/data/json/${nom}`, import.meta.url)
  try {
    const data = JSON.parse(readFileSync(chemin, 'utf8'))
    valider(schema as never, data, nom)
    console.log(`✔ ${nom}`)
  } catch (e) {
    erreurs++
    const msg = e instanceof SyntaxError ? `JSON mal formé dans src/data/json/${nom} (virgule ou guillemet manquant ?) :\n${e.message}` : (e as Error).message
    console.error(`✖ ${msg}\n`)
  }
}

if (erreurs) {
  console.error(`${erreurs} fichier(s) à corriger avant de construire le site.`)
  process.exit(1)
}
console.log('Toutes les données sont valides.')
