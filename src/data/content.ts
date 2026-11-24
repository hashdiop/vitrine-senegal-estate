import { Building2, ClipboardList, KeyRound, LandPlot, type LucideIcon } from 'lucide-react'
import type { z } from 'zod'
import contenusJson from './json/contenus.json'
import projetsJson from './json/projets.json'
import { contenusSchema, projetsSchema, valider } from './schemas'

// ⚠️ Les textes se modifient dans src/data/json/ (pas ici) :
//   - projets.json  : projets réalisés / en cours
//   - contenus.json : services, valeurs, étapes, témoignages, équipe, FAQ

const contenus = valider(contenusSchema, contenusJson, 'contenus.json')

const icones: Record<z.infer<typeof contenusSchema>['services'][number]['icone'], LucideIcon> = {
  terrain: LandPlot,
  plans: ClipboardList,
  construction: Building2,
  gestion: KeyRound,
}

export type Service = Omit<z.infer<typeof contenusSchema>['services'][number], 'icone'> & { icon: LucideIcon }
export const services: Service[] = contenus.services.map(({ icone, ...s }) => ({ ...s, icon: icones[icone] }))

export const valeurs = contenus.valeurs
export const etapes = contenus.etapes
export const temoignages = contenus.temoignages
export const equipe = contenus.equipe
export const faq = contenus.faq

export type Projet = z.infer<typeof projetsSchema>[number]
export type CategorieProjet = Projet['categorie']
export const projets: Projet[] = valider(projetsSchema, projetsJson, 'projets.json')
