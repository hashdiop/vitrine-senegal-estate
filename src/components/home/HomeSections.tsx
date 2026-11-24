import { AnimatePresence, motion, useScroll, useTransform, type PanInfo } from 'framer-motion'
import { ArrowRight, BadgeCheck, ChevronLeft, ChevronRight, Handshake, HeartHandshake, Quote, Scale, Star, Wallet } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { etapes, projets, services, temoignages, valeurs } from '../../data/content'
import { site } from '../../data/site'
import { photos, terrains, zones } from '../../data/terrains'
import { cn } from '../../lib/utils'
import PaymentSimulator from '../ui/PaymentSimulator'
import { Badge, ButtonLink, Counter, Img, Reveal, SectionHeading } from '../ui/primitives'
import { ANNEE, staggerChild, staggerParent } from '../../lib/motion'
import TerrainCard from '../ui/TerrainCard'

/* ---------- Bandeau défilant + chiffres ---------- */
export function Stats() {
  const items = [...zones, 'Paiement échelonné', 'Titre foncier', 'Diaspora bienvenue']
  return (
    <section id="chiffres" className="relative bg-bg">
      <div className="overflow-hidden border-b border-line bg-ocre-500 py-4 text-white">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-xl">
          {[...items, ...items].map((z, i) => (
            <span key={i} className="flex items-center gap-10">{z}<span className="text-white/50">✦</span></span>
          ))}
        </div>
      </div>
      <motion.div
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="container-x grid grid-cols-2 gap-px overflow-hidden py-16 lg:grid-cols-4"
      >
        {site.stats.map((s) => (
          <motion.div key={s.label} variants={staggerChild} className="px-4 py-6 text-center">
            <Counter value={s.value} suffix={s.suffix} className="font-display text-5xl font-semibold text-noir-700 sm:text-6xl dark:text-noir-300" />
            <p className="mt-2 text-sm font-medium text-muted">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

/* ---------- Services interactifs ---------- */
export function ServicesSection() {
  const [active, setActive] = useState(0)
  const s = services[active]
  return (
    <section className="bg-surface-2 py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Nos services" title={<>De l’idée à la clé, <em className="text-ocre-600">un seul partenaire</em></>} text="Nous vous accompagnons à chaque étape : trouver le bon terrain, concevoir vos plans, construire et faire fructifier votre bien." />
          <ButtonLink to="/services" variant="ghost">Tous nos services <ArrowRight className="size-4" /></ButtonLink>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            {services.map((sv, i) => (
              <motion.button
                key={sv.slug}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className={cn('relative flex w-full items-start gap-5 overflow-hidden rounded-3xl p-6 text-left transition-colors', active === i ? 'text-white' : 'bg-surface hover:bg-surface')}
              >
                {active === i && <motion.span layoutId="service-bg" className="absolute inset-0 bg-noir-700 dark:bg-noir-500" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span className={cn('relative grid size-14 shrink-0 place-items-center rounded-2xl transition-colors', active === i ? 'bg-ocre-500' : 'bg-ocre-100 text-ocre-700 dark:bg-ocre-700 dark:text-ocre-100')}>
                  <sv.icon className="size-6" />
                </span>
                <span className="relative">
                  <span className="flex items-center gap-3 font-display text-2xl font-semibold">
                    <span className={cn('text-sm font-sans', active === i ? 'text-white/50' : 'text-muted')}>0{i + 1}</span>
                    {sv.titre}
                  </span>
                  <span className={cn('mt-1 block text-sm', active === i ? 'text-white/75' : 'text-muted')}>{sv.accroche}</span>
                </span>
              </motion.button>
            ))}
          </div>

          <div className="relative min-h-[24rem] overflow-hidden rounded-[2rem]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, scale: 1.1, clipPath: 'inset(0 0 100% 0)' }}
                animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0 0% 0)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Img src={s.image} alt={s.titre} className="size-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <ul className="flex flex-wrap gap-2">
                    {s.points.map((p, i) => (
                      <motion.li key={p} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                        <Badge tone="dark"><BadgeCheck className="size-3.5 text-ocre-300" />{p}</Badge>
                      </motion.li>
                    ))}
                  </ul>
                  <Link to={`/services#${s.slug}`} className="mt-5 inline-flex items-center gap-2 font-semibold text-white hover:text-ocre-300">
                    En savoir plus <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Terrains à la une ---------- */
export function FeaturedTerrains() {
  const list = terrains.filter((t) => t.featured)
  return (
    <section className="py-24">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Terrains à la une" title="Trouvez la parcelle de vos rêves" text="Une sélection de terrains vérifiés, prêts à accueillir votre projet. Paiement échelonné disponible." />
          <ButtonLink to="/terrains" variant="ghost">Voir tous les terrains <ArrowRight className="size-4" /></ButtonLink>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.1}><TerrainCard t={t} /></Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Pourquoi nous ---------- */
const valeurIcons = [Wallet, Scale, BadgeCheck, HeartHandshake]

export function WhyUs() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [-40, 80])

  return (
    <section ref={ref} className="overflow-hidden py-24">
      <div className="container-x grid items-center gap-16 lg:grid-cols-2">
        <div className="relative h-[34rem]">
          <motion.div style={{ y: y1 }} className="absolute left-0 top-0 h-[78%] w-[70%] overflow-hidden rounded-[2rem] shadow-2xl">
            <Img src={photos.investissement} alt="Investir dans l’immobilier avec Senegal Estates" className="size-full object-cover" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 right-0 h-[55%] w-[55%] overflow-hidden rounded-[2rem] border-8 border-bg shadow-2xl">
            <Img src={photos.terrain} alt="Terrain borné par Senegal Estates" className="size-full object-cover" />
          </motion.div>
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.3 }}
            className="absolute left-[58%] top-[8%] grid size-32 place-items-center rounded-full bg-ocre-500 text-center text-white shadow-xl"
          >
            <span>
              <span className="block font-display text-4xl font-semibold">{ANNEE - site.founded}+</span>
              <span className="block text-xs font-medium">ans d’expertise</span>
            </span>
          </motion.div>
        </div>

        <div>
          <SectionHeading eyebrow="Pourquoi nous choisir" title="Notre engagement envers l’excellence" text="Née d’une ambition partagée sur les bancs de l’université, Senegal Estates rend la propriété foncière accessible aux classes moyennes, avec rigueur et transparence." />
          <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10 grid gap-4 sm:grid-cols-2">
            {valeurs.map((v, i) => {
              const Icon = valeurIcons[i]
              return (
                <motion.div key={v.titre} variants={staggerChild} whileHover={{ y: -6 }} className="rounded-3xl border border-line bg-surface p-6 transition-shadow hover:shadow-xl">
                  <Icon className="size-8 text-ocre-500" />
                  <h3 className="mt-4 text-lg font-semibold">{v.titre}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{v.texte}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Processus avec ligne animée ---------- */
export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  return (
    <section className="grain relative overflow-hidden bg-noir-900 py-24 text-white">
      <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading light eyebrow="Comment ça marche" title="Devenir propriétaire en 4 étapes" text="Un parcours simple et encadré, que vous soyez à Dakar ou à l’étranger." />
          <div className="mt-8"><ButtonLink to="/contact">Démarrer mon projet <Handshake className="size-4" /></ButtonLink></div>
        </div>
        <div ref={ref} className="relative pl-14">
          <div className="absolute bottom-2 left-[1.15rem] top-2 w-0.5 bg-white/10" />
          <motion.div style={{ scaleY: scrollYProgress }} className="absolute bottom-2 left-[1.15rem] top-2 w-0.5 origin-top bg-ocre-500" />
          <div className="space-y-14">
            {etapes.map((e, i) => (
              <Reveal key={e.titre} x={40} y={0} delay={0.05}>
                <div className="relative">
                  <motion.span
                    initial={{ scale: 0.5, backgroundColor: '#1a1a19' }}
                    whileInView={{ scale: 1, backgroundColor: '#d98a3d' }}
                    viewport={{ margin: '-45% 0px -45% 0px' }}
                    className="absolute -left-14 top-0 grid size-10 place-items-center rounded-full border-4 border-noir-900 font-semibold"
                  >
                    {i + 1}
                  </motion.span>
                  <h3 className="text-2xl font-semibold">{e.titre}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-white/70">{e.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Simulateur ---------- */
export function SimulatorSection() {
  return (
    <section className="py-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Paiement flexible" title={<>Votre terrain, <em className="text-ocre-600">à votre rythme</em></>} text="Apport à partir de 20 % et paiement étalé jusqu’à 24 mois. Simulez vos mensualités en quelques secondes et recevez l’offre directement sur WhatsApp." />
          <Reveal delay={0.2}>
            <ul className="mt-8 space-y-3">
              {['Aucun frais de dossier caché', 'Échéancier signé et transparent', 'Remise des documents dès le solde'].map((t) => (
                <li key={t} className="flex items-center gap-3"><BadgeCheck className="size-5 text-ocre-500" />{t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.1}><PaymentSimulator /></Reveal>
      </div>
    </section>
  )
}

/* ---------- Projets : défilement horizontal piloté par le scroll ---------- */
export function ProjectsScroller() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const x = useTransform(scrollYProgress, [0, 1], ['2%', '-68%'])
  const list = projets.slice(0, 6)

  return (
    <section ref={ref} className="relative h-[300vh] bg-surface-2">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Nos réalisations" title="Des projets ambitieux, livrés" />
          <ButtonLink to="/projets" variant="ghost">Tous les projets <ArrowRight className="size-4" /></ButtonLink>
        </div>
        <motion.div style={{ x }} className="mt-12 flex gap-6 pl-4 sm:pl-8">
          {list.map((p) => (
            <Link to="/projets" key={p.id} className="group relative h-[52vh] w-[78vw] shrink-0 overflow-hidden rounded-[2rem] sm:w-[46vw] lg:w-[32vw]">
              <Img src={p.image} alt={p.titre} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute left-5 top-5"><Badge tone={p.statut === 'Livré' ? 'green' : p.statut === 'En cours' ? 'amber' : 'neutral'}>{p.statut}</Badge></div>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-widest text-ocre-300">{p.categorie} · {p.lieu} · {p.annee}</p>
                <h3 className="mt-2 text-3xl font-semibold">{p.titre}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm text-white/75 transition-all duration-500 group-hover:max-h-20">{p.description}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ---------- Témoignages (glisser ou auto) ---------- */
export function Testimonials() {
  const [[index, dir], setIndex] = useState<[number, number]>([0, 1])
  const n = temoignages.length
  const go = (d: number) => setIndex(([i]) => [(i + d + n) % n, d])

  useEffect(() => {
    const t = setInterval(() => go(1), 7000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index])

  const t = temoignages[index]
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -80) go(1)
    else if (info.offset.x > 80) go(-1)
  }

  return (
    <section className="py-24">
      <div className="container-x">
        <SectionHeading center eyebrow="Témoignages" title="Ils nous ont fait confiance" />
        <div className="relative mx-auto mt-14 max-w-3xl">
          <Quote className="absolute -top-6 left-0 size-20 text-ocre-500/15" />
          <div className="relative min-h-[16rem] overflow-hidden">
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <motion.figure
                key={index}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: d * 120, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: d * -120, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={onDragEnd}
                className="cursor-grab text-center active:cursor-grabbing"
              >
                <div className="flex justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={cn('size-5', i < t.note ? 'fill-ocre-500 text-ocre-500' : 'text-line')} />
                  ))}
                </div>
                <blockquote className="mt-6 text-xl font-medium italic leading-relaxed sm:text-2xl">« {t.texte} »</blockquote>
                <figcaption className="mt-8">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-noir-700 font-semibold text-white">{t.nom.split(' ').map((x) => x[0]).join('')}</span>
                  <p className="mt-3 font-semibold">{t.nom}</p>
                  <p className="text-sm text-muted">{t.role}</p>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="mt-10 flex items-center justify-center gap-4">
            <button onClick={() => go(-1)} aria-label="Témoignage précédent" className="grid size-11 place-items-center rounded-full border border-line hover:border-ocre-500 hover:text-ocre-600"><ChevronLeft className="size-5" /></button>
            <div className="flex gap-2">
              {temoignages.map((_, i) => (
                <button key={i} onClick={() => setIndex([i, i > index ? 1 : -1])} aria-label={`Témoignage ${i + 1}`} className={cn('h-2 rounded-full transition-all', i === index ? 'w-8 bg-ocre-500' : 'w-2 bg-line')} />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Témoignage suivant" className="grid size-11 place-items-center rounded-full border border-line hover:border-ocre-500 hover:text-ocre-600"><ChevronRight className="size-5" /></button>
          </div>
        </div>
      </div>
    </section>
  )
}
