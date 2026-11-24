import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, MapPin, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CtaBanner, PageHero } from '../components/ui/Sections'
import { Badge, Img } from '../components/ui/primitives'
import { projets, type CategorieProjet, type Projet } from '../data/content'
import { img } from '../data/terrains'
import { cn } from '../lib/utils'

const cats: ('Tous' | CategorieProjet)[] = ['Tous', 'Lotissement', 'Construction', 'Rénovation']
const tone = (s: Projet['statut']) => (s === 'Livré' ? 'green' : s === 'En cours' ? 'amber' : 'neutral')

export default function Projets() {
  const [cat, setCat] = useState<(typeof cats)[number]>('Tous')
  const [open, setOpen] = useState<Projet | null>(null)
  useEffect(() => { document.title = 'Nos projets — Senegal Estates' }, [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const list = projets.filter((p) => cat === 'Tous' || p.categorie === cat)

  return (
    <>
      <PageHero
        title="Nos projets d’avenir"
        text="Lotissements, villas, immeubles : découvrez les réalisations livrées et les programmes en cours de Senegal Estates."
        image={img.immeuble}
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Projets' }]}
      />

      <section className="container-x py-16">
        <div className="flex flex-wrap justify-center gap-2">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className="relative rounded-full px-5 py-2.5 text-sm font-semibold">
              {cat === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-noir-700 dark:bg-noir-500" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className={cn('relative', cat === c ? 'text-white' : 'text-muted hover:text-ink')}>{c}</span>
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid auto-rows-[18rem] gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.button
                layout
                key={p.id}
                layoutId={`projet-${p.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                onClick={() => setOpen(p)}
                className={cn('group relative overflow-hidden rounded-[2rem] text-left', i % 4 === 0 && 'lg:row-span-2', i % 5 === 3 && 'sm:col-span-2 lg:col-span-1')}
              >
                <Img src={p.image} alt={p.titre} className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute left-5 top-5"><Badge tone={tone(p.statut)}>{p.statut}</Badge></div>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-semibold uppercase tracking-widest text-ocre-300">{p.categorie}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{p.titre}</h3>
                  <p className="mt-1 flex items-center gap-3 text-sm text-white/70">
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" />{p.lieu}</span>
                    <span className="flex items-center gap-1"><Calendar className="size-3.5" />{p.annee}</span>
                  </p>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={open.titre}>
            <motion.div layoutId={`projet-${open.id}`} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] bg-surface">
              <div className="relative aspect-[16/9]">
                <Img src={open.image} alt={open.titre} className="size-full object-cover" />
                <button onClick={() => setOpen(null)} aria-label="Fermer" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/50 text-white backdrop-blur hover:bg-black/70"><X className="size-5" /></button>
              </div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }} className="p-7">
                <div className="flex flex-wrap gap-2"><Badge tone={tone(open.statut)}>{open.statut}</Badge><Badge>{open.categorie}</Badge></div>
                <h2 className="mt-3 text-3xl font-semibold">{open.titre}</h2>
                <p className="mt-1 text-sm text-muted">{open.lieu} · {open.annee}</p>
                <p className="mt-4 leading-relaxed text-muted">{open.description}</p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <CtaBanner />
    </>
  )
}
