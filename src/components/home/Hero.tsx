import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, MapPin, Search, ShieldCheck, Wallet } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { img, zones } from '../../data/terrains'
import { Img } from '../ui/primitives'

const slides = [img.maison, img.villa, img.champ]
const mots = ['terrain', 'maison', 'avenir']

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const [mot, setMot] = useState(0)
  const [zone, setZone] = useState('')
  const [type, setType] = useState('')
  const [budget, setBudget] = useState('')

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  useEffect(() => {
    const a = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000)
    const b = setInterval(() => setMot((m) => (m + 1) % mots.length), 2600)
    return () => { clearInterval(a); clearInterval(b) }
  }, [])

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (zone) p.set('zone', zone)
    if (type) p.set('type', type)
    if (budget) p.set('budget', budget)
    navigate(`/terrains?${p}`)
  }

  const titre = ['Bâtissez', 'votre']

  return (
    <section ref={ref} className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-noir-900">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={slide}
            initial={{ opacity: 0, scale: 1.15 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: 'linear' } }}
            className="absolute inset-0"
          >
            <Img src={slides[slide]} alt="" className="size-full object-cover" />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-noir-900/95 via-noir-900/70 to-noir-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-noir-900/80 via-transparent to-transparent" />

      <motion.div style={{ y: contentY, opacity: fade }} className="container-x relative pb-24 pt-32">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-ocre-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-ocre-500" />
          </span>
          Nouveaux lots disponibles à Diamniadio & Lac Rose
        </motion.span>

        <h1 className="mt-6 max-w-5xl text-6xl font-bold leading-[0.95] text-white sm:text-7xl lg:text-8xl xl:text-[8.5rem]">
          {titre.map((w, i) => (
            <Fragment key={w}>
              <span className="inline-block overflow-hidden align-bottom">
                <motion.span
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {w}
                </motion.span>
              </span>{' '}
            </Fragment>
          ))}
          <span className="relative inline-block overflow-hidden align-bottom">
            <AnimatePresence mode="wait">
              <motion.span
                key={mots[mot]}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block italic text-ocre-400"
              >
                {mots[mot]}.
              </motion.span>
            </AnimatePresence>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl"
        >
          Terrains 100 % sécurisés, plans sur-mesure, construction et gestion immobilière. Devenez propriétaire au Sénégal avec un paiement adapté à votre budget.
        </motion.p>

        <motion.form
          onSubmit={search}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.7 }}
          className="mt-10 grid max-w-4xl gap-2 rounded-3xl border border-white/15 bg-white/10 p-2 backdrop-blur-xl sm:grid-cols-[1fr_1fr_1fr_auto]"
          role="search"
        >
          {[
            { label: 'Zone', icon: MapPin, value: zone, set: setZone, options: zones.map((z) => [z, z]) },
            { label: 'Type', icon: ShieldCheck, value: type, set: setType, options: [['Résidentiel', 'Résidentiel'], ['Commercial', 'Commercial'], ['Agricole', 'Agricole']] },
            { label: 'Budget max', icon: Wallet, value: budget, set: setBudget, options: [['5000000', '5 M FCFA'], ['8000000', '8 M FCFA'], ['12000000', '12 M FCFA'], ['20000000', '20 M FCFA']] },
          ].map((f) => (
            <label key={f.label} className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 dark:bg-surface">
              <f.icon className="size-5 shrink-0 text-ocre-500" />
              <span className="flex-1">
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted">{f.label}</span>
                <select value={f.value} onChange={(e) => f.set(e.target.value)} className="w-full cursor-pointer bg-transparent text-sm font-medium text-ink outline-none">
                  <option value="">Tous</option>
                  {f.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </span>
            </label>
          ))}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="flex items-center justify-center gap-2 rounded-2xl bg-ocre-500 px-7 py-4 font-semibold text-white hover:bg-ocre-600">
            <Search className="size-5" /> Rechercher
          </motion.button>
        </motion.form>

        <div className="mt-8 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} aria-label={`Image ${i + 1}`} className="h-1 w-10 overflow-hidden rounded-full bg-white/25">
              {i === slide && <motion.span key={slide} className="block h-full bg-ocre-400" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 6, ease: 'linear' }} />}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Carte flottante */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute right-8 top-1/3 hidden xl:block"
      >
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="w-64 rounded-3xl border border-white/15 bg-white/10 p-5 text-white backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-ocre-500"><ShieldCheck className="size-6" /></span>
            <div>
              <p className="font-display text-2xl font-semibold">1,3K+</p>
              <p className="text-xs text-white/70">propriétaires accompagnés</p>
            </div>
          </div>
          <div className="mt-4 flex -space-x-2">
            {['AS', 'MD', 'FK', 'IN'].map((n, i) => (
              <span key={n} className="grid size-8 place-items-center rounded-full border-2 border-noir-900 text-[10px] font-bold" style={{ background: ['#d98a3d', '#3a3936', '#e8b47e', '#a8a6a1'][i] }}>{n}</span>
            ))}
            <span className="grid size-8 place-items-center rounded-full border-2 border-noir-900 bg-white text-[10px] font-bold text-noir-900">+</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#chiffres"
        aria-label="Défiler vers le bas"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70"
      >
        <ChevronDown className="size-7" />
      </motion.a>
    </section>
  )
}
