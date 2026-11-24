// Schémas de validation des fichiers JSON de src/data/json/.
// Utilisés par le site (au chargement) ET par `npm run check:data` (avant chaque build) :
// une faute dans un JSON (statut mal orthographié, prix manquant…) bloque le build avec un message clair.
import { z } from 'zod'

z.config(z.locales.fr()) // messages d'erreur en français

const texte = z.string().trim().min(1, 'ne doit pas être vide')
const image = texte.describe('URL complète (https://…) ou chemin dans public/ (ex. /images/terrains/photo.jpg)')
const gps = z.tuple([z.number().min(-90).max(90), z.number().min(-180).max(180)])

export const terrainSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'minuscules, chiffres et tirets uniquement (ex. terrain-diamniadio-lot-3)'),
  titre: texte,
  zone: texte,
  region: z.enum(['Dakar', 'Thiès']),
  superficie: z.number().positive('en m², supérieur à 0'),
  prix: z.number().int().positive('en FCFA, sans espaces'),
  statut: z.enum(['Disponible', 'Réservé', 'Vendu']),
  document: z.enum(['Titre foncier', 'Bail', 'Délibération']),
  type: z.enum(['Résidentiel', 'Commercial', 'Agricole']),
  viabilise: z.boolean(),
  lots: z.number().int().min(0),
  images: z.array(image).min(1, 'au moins une photo'),
  description: texte,
  atouts: z.array(texte),
  coords: gps,
  featured: z.boolean().optional(),
})

export const terrainsSchema = z.array(terrainSchema).superRefine((list, ctx) => {
  const vus = new Set<string>()
  list.forEach((t, i) => {
    if (vus.has(t.slug)) ctx.addIssue({ code: 'custom', path: [i, 'slug'], message: `slug « ${t.slug} » déjà utilisé` })
    vus.add(t.slug)
  })
})

export const projetsSchema = z.array(
  z.object({
    id: z.number().int(),
    titre: texte,
    lieu: texte,
    annee: z.number().int().min(2000).max(2100),
    categorie: z.enum(['Lotissement', 'Construction', 'Rénovation']),
    statut: z.enum(['Livré', 'En cours', 'À venir']),
    image,
    description: texte,
  }),
)

const telephone = z.string().regex(/^\+\d{8,15}$/, 'format international sans espaces, ex. +221771588896')

export const contactSchema = z.object({
  nom: texte,
  raisonSociale: texte,
  slogan: texte,
  anneeCreation: z.number().int(),
  email: z.email('adresse e-mail invalide'),
  whatsapp: z.string().regex(/^\d{8,15}$/, 'chiffres uniquement, indicatif inclus, sans + (ex. 221771588896)'),
  telephones: z.array(z.object({ affichage: texte, numero: telephone, whatsapp: z.boolean() })).min(1),
  adresse: texte,
  coordonneesGps: gps,
  horaires: z.array(z.object({ jours: texte, heures: texte })),
  reseauxSociaux: z.array(z.object({ nom: texte, lien: texte })),
  chiffres: z.array(z.object({ valeur: z.number(), suffixe: z.string(), libelle: texte })),
})

export const contenusSchema = z.object({
  services: z.array(
    z.object({
      slug: texte,
      icone: z.enum(['terrain', 'plans', 'construction', 'gestion']),
      titre: texte,
      accroche: texte,
      description: texte,
      image,
      points: z.array(texte),
    }),
  ),
  valeurs: z.array(z.object({ titre: texte, texte })).length(4, 'exactement 4 valeurs (une icône par valeur)'),
  etapes: z.array(z.object({ titre: texte, texte })),
  temoignages: z.array(z.object({ nom: texte, role: texte, texte, note: z.number().int().min(1).max(5) })),
  equipe: z.array(z.object({ nom: texte, role: texte })),
  faq: z.array(z.object({ q: texte, r: texte })),
})

/** Valide un JSON et lève une erreur lisible indiquant le fichier et le champ fautif. */
export function valider<T>(schema: z.ZodType<T>, data: unknown, fichier: string): T {
  const r = schema.safeParse(data)
  if (!r.success) throw new Error(`Données invalides dans src/data/json/${fichier} :\n${z.prettifyError(r.error)}`)
  return r.data
}
