import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck } from 'lucide-react'
import { useEffect } from 'react'
import { CtaBanner, Faq, PageHero } from '../components/ui/Sections'
import { ButtonLink, Img, Reveal, SectionHeading } from '../components/ui/primitives'
import { faq, services } from '../data/content'
import { whatsappLink } from '../data/site'
import { photos } from '../data/terrains'
import { cn } from '../lib/utils'

export default function Services() {
  useEffect(() => { document.title = 'Nos services — Senegal Estates' }, [])
  return (
    <>
      <PageHero
        title={<>De l’idée <em className="text-ocre-400">à la clé</em></>}
        text="Terrain, plans, construction, gestion : un accompagnement complet et transparent pour réussir votre projet immobilier au Sénégal."
        image={photos.construction}
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Services' }]}
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex flex-wrap gap-2">
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur transition-colors hover:bg-white hover:text-noir-900">
              <s.icon className="size-4" /> {s.titre}
            </a>
          ))}
        </motion.div>
      </PageHero>

      <div className="container-x space-y-28 py-24">
        {services.map((s, i) => (
          <section key={s.slug} id={s.slug} className="grid scroll-mt-28 items-center gap-12 lg:grid-cols-2">
            <Reveal x={i % 2 ? 40 : -40} y={0} className={cn(i % 2 && 'lg:order-2')}>
              <div className="group relative">
                <div className="absolute -inset-3 rotate-2 rounded-[2.2rem] bg-ocre-500/15 transition-transform duration-500 group-hover:rotate-0" />
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                  <Img src={s.image} alt={s.titre} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', delay: 0.3 }}
                  className="absolute -bottom-6 left-6 grid size-20 place-items-center rounded-3xl bg-noir-700 text-white shadow-xl"
                >
                  <s.icon className="size-9" />
                </motion.span>
              </div>
            </Reveal>
            <div>
              <SectionHeading eyebrow={`Service 0${i + 1}`} title={s.titre} text={s.description} />
              <Reveal delay={0.15}>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-sm">
                      <BadgeCheck className="size-5 shrink-0 text-ocre-500" />{p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={whatsappLink(`Bonjour, je souhaite un devis pour : ${s.titre}.`)} target="_blank" rel="noreferrer">Demander un devis gratuit <ArrowRight className="size-4" /></ButtonLink>
                  {s.slug === 'vente-de-terrains' && <ButtonLink to="/terrains" variant="ghost">Voir les terrains</ButtonLink>}
                </div>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section className="bg-surface-2 py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeading eyebrow="Questions fréquentes" title="Tout savoir avant de vous lancer" text="Vous ne trouvez pas la réponse ? Écrivez-nous sur WhatsApp, nous répondons rapidement." />
          <Reveal delay={0.1}><Faq items={faq} /></Reveal>
        </div>
      </section>
      <CtaBanner />
    </>
  )
}
