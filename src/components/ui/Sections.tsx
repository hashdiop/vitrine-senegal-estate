import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ChevronRight, Plus } from 'lucide-react'
import { useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { whatsappLink } from '../../data/site'
import { cn } from '../../lib/utils'
import { ButtonLink, Img, Reveal, WhatsAppIcon } from './primitives'

/* ---------- Héros des pages internes avec parallaxe ---------- */
export function PageHero({ title, text, image, crumbs, children }: { title: ReactNode; text?: string; image: string; crumbs: { label: string; to?: string }[]; children?: ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="grain relative flex min-h-[26rem] items-end overflow-hidden bg-noir-900 pb-14 pt-36 sm:min-h-[30rem]">
      <motion.div style={{ y }} className="absolute inset-0">
        <Img src={image} alt="" className="size-full scale-110 object-cover opacity-60" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-noir-900 via-noir-900/60 to-noir-900/20" />
      <motion.div style={{ opacity }} className="container-x relative">
        <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1 text-sm text-white/60">
          {crumbs.map((c, i) => (
            <span key={c.label} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-4" />}
              {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span className="text-white">{c.label}</span>}
            </span>
          ))}
        </motion.nav>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-4xl text-5xl font-bold leading-[0.95] text-white sm:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        {text && (
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="mt-5 max-w-2xl text-lg text-white/75">
            {text}
          </motion.p>
        )}
        {children}
      </motion.div>
    </section>
  )
}

/* ---------- Accordéon FAQ ---------- */
export function Faq({ items }: { items: { q: string; r: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="divide-y divide-line rounded-3xl border border-line bg-surface">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <div key={it.q}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left font-semibold sm:px-8"
            >
              {it.q}
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={cn('grid size-8 shrink-0 place-items-center rounded-full transition-colors', isOpen ? 'bg-ocre-500 text-white' : 'bg-surface-2')}>
                <Plus className="size-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-6 leading-relaxed text-muted sm:px-8">{it.r}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ---------- Bandeau d'appel à l'action ---------- */
export function CtaBanner() {
  return (
    <section className="container-x py-20">
      <Reveal>
        <div className="grain relative overflow-hidden rounded-[2rem] bg-noir-700 px-6 py-14 text-center sm:px-12 sm:py-20">
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute -right-32 -top-32 size-96 rounded-full border-[40px] border-ocre-500/20"
          />
          <motion.div
            aria-hidden
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -bottom-24 -left-24 size-72 rounded-full bg-ocre-500/20 blur-2xl"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-semibold text-white sm:text-5xl">Prêt à concrétiser votre projet immobilier ?</h2>
            <p className="mt-5 text-lg text-white/75">
              Réservez une consultation gratuite. Nous vous aidons à trouver le terrain idéal et à bâtir votre avenir, en toute sérénité.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/contact">Prendre rendez-vous <ArrowRight className="size-4" /></ButtonLink>
              <ButtonLink href={whatsappLink()} target="_blank" rel="noreferrer" variant="light">
                <WhatsAppIcon className="size-4" /> WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
