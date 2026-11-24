import contactJson from './json/contact.json'
import { contactSchema, valider } from './schemas'

// ⚠️ Les coordonnées (téléphones, WhatsApp, e-mail, adresse, horaires, réseaux sociaux, chiffres clés)
// se modifient dans src/data/json/contact.json (pas ici). Tous les boutons du site les utilisent.

const c = valider(contactSchema, contactJson, 'contact.json')

export const site = {
  name: c.nom,
  legalName: c.raisonSociale,
  tagline: c.slogan,
  founded: c.anneeCreation,
  email: c.email,
  phones: c.telephones.map((t) => ({ label: t.affichage, tel: t.numero, whatsapp: t.whatsapp })),
  whatsapp: c.whatsapp,
  address: c.adresse,
  coords: c.coordonneesGps,
  hours: c.horaires.map((h) => ({ days: h.jours, time: h.heures })),
  socials: c.reseauxSociaux.map((s) => ({ name: s.nom, href: s.lien })),
  stats: c.chiffres.map((s) => ({ value: s.valeur, suffix: s.suffixe, label: s.libelle })),
}

export const whatsappLink = (message = 'Bonjour Senegal Estates, je souhaite avoir des informations.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`

export const nav = [
  { to: '/', label: 'Accueil' },
  { to: '/terrains', label: 'Terrains' },
  { to: '/services', label: 'Services' },
  { to: '/projets', label: 'Projets' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]
