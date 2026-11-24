import { motion } from 'framer-motion'
import { ArrowUp, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { services } from '../../data/content'
import { nav, site, whatsappLink } from '../../data/site'
import { ANNEE } from '../../lib/motion'
import { Logo, WhatsAppIcon } from '../ui/primitives'

export default function Footer() {
  return (
    <footer className="grain relative overflow-hidden bg-noir-900 text-white/80">
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 size-[30rem] rounded-full bg-ocre-500/10 blur-3xl" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
            {site.tagline}. Terrains sécurisés, plans, construction et gestion immobilière au Sénégal depuis {site.founded}.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((s) => (
              <a key={s.name} href={s.href} className="rounded-full border border-white/15 px-3 py-1.5 text-xs transition-colors hover:border-ocre-400 hover:text-ocre-300">
                {s.name}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">Navigation</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.to}><Link to={n.to} className="transition-colors hover:text-ocre-300">{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">Services</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}><Link to={`/services#${s.slug}`} className="transition-colors hover:text-ocre-300">{s.titre}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-white">Contact</h3>
          <ul className="mt-5 space-y-3.5 text-sm">
            <li className="flex gap-3"><MapPin className="mt-0.5 size-4 shrink-0 text-ocre-400" />{site.address}</li>
            {site.phones.slice(0, 2).map((p) => (
              <li key={p.tel} className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-ocre-400" />
                <a href={`tel:${p.tel}`} className="hover:text-ocre-300">{p.label}</a>
              </li>
            ))}
            <li className="flex gap-3"><Mail className="mt-0.5 size-4 shrink-0 text-ocre-400" /><a href={`mailto:${site.email}`} className="hover:text-ocre-300">{site.email}</a></li>
            <li className="flex gap-3"><Clock className="mt-0.5 size-4 shrink-0 text-ocre-400" />Lun–Ven 08h30–18h · Sam 09h–14h</li>
          </ul>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            <WhatsAppIcon className="size-4" /> Écrire sur WhatsApp
          </a>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-white/50 sm:flex-row">
          <p>© {ANNEE} {site.legalName}. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <Link to="/mentions-legales" className="hover:text-white">Mentions légales</Link>
            <motion.button
              whileHover={{ y: -3 }}
              onClick={() => window.scrollTo({ top: 0 })}
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              Haut de page <ArrowUp className="size-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
