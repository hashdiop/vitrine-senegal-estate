import type { z } from 'zod'
import { unsplash } from '../lib/utils'
import terrainsJson from './json/terrains.json'
import { terrainSchema, terrainsSchema, valider } from './schemas'

// ⚠️ Les terrains se modifient dans src/data/json/terrains.json (pas ici).

export type Terrain = z.infer<typeof terrainSchema>
export type Statut = Terrain['statut']
export type DocumentFoncier = Terrain['document']
export type TypeTerrain = Terrain['type']

export const terrains: Terrain[] = valider(terrainsSchema, terrainsJson, 'terrains.json')

export const zones = [...new Set(terrains.map((t) => t.zone))].sort()

export const statutTone = { Disponible: 'green', Réservé: 'amber', Vendu: 'red' } as const

// Photos d'ambiance (Unsplash) utilisées en fond des en-têtes de pages
export const img = {
  champ: unsplash('1500382017468-9049fed747ef'),
  plaine: unsplash('1500076656116-558758c991c1'),
  route: unsplash('1472214103451-9374bd1c798e'),
  lac: unsplash('1507525428034-b723cf961d3e'),
  paysage: unsplash('1506744038136-46273834b3fb'),
  villa: unsplash('1512917774080-9991f1c4c750'),
  maison: unsplash('1600585154340-be6161a56a0c'),
  maison2: unsplash('1564013799919-ab600027ffc6'),
  maison3: unsplash('1570129477492-45c003edd2be'),
  interieur: unsplash('1600607687939-ce8a6c25118c'),
  plans: unsplash('1503387762-592deb58ef4e'),
  chantier: unsplash('1541888946425-d81bb19240f5'),
  cles: unsplash('1560518883-ce09059eeffa'),
  immeuble: unsplash('1545324418-cc1a3fa10c00'),
}

// Photos réelles de Senegal Estates (récupérées sur senegalestates.com)
export const photos = {
  fondateurs: '/images/site/wa0042.jpg', // 553×362
  conseiller: '/images/site/wa0041.jpg', // 295×300
  plans: '/images/site/wa0043.jpg', // 387×246
  terrain: '/images/site/wa0044.jpg', // 387×246
  gestion: '/images/site/wa0045.jpg', // 387×246
  construction: '/images/site/wa0046.jpg', // 1600×1018
  investissement: '/images/site/why-choose-us.jpg', // 720×1280
}
