import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, FileCheck2, Heart, MapPin, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { statutTone, type Terrain } from '../../data/terrains'
import { cn, formatFCFA } from '../../lib/utils'
import { Badge, Img } from './primitives'


export default function TerrainCard({ t }: { t: Terrain }) {
  const { isFavori, toggleFavori } = useApp()
  const fav = isFavori(t.slug)

  // Effet d'inclinaison 3D au survol
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 })

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.45 }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => { mx.set(0); my.set(0) }}
      className="group relative overflow-hidden rounded-3xl border border-line bg-surface shadow-sm transition-shadow hover:shadow-2xl hover:shadow-noir-900/10"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Img src={t.images[0]} alt={t.titre} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <Badge tone={statutTone[t.statut]}>{t.statut}</Badge>
          <Badge tone="dark">{t.type}</Badge>
        </div>
        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={() => toggleFavori(t.slug)}
          aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={fav}
          className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-white/90 text-noir-900 backdrop-blur transition-colors hover:bg-white"
        >
          <motion.span key={String(fav)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 15 }}>
            <Heart className={cn('size-5', fav && 'fill-ocre-500 text-ocre-500')} />
          </motion.span>
        </motion.button>
        <p className="absolute bottom-4 left-4 font-display text-2xl font-semibold text-white">{formatFCFA(t.prix)}</p>
      </div>

      <Link to={`/terrains/${t.slug}`} className="block p-5">
        <span className="absolute inset-0" aria-hidden />
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ocre-600">
          <MapPin className="size-3.5" /> {t.zone} · {t.region}
        </p>
        <h3 className="mt-2 flex items-start justify-between gap-3 text-xl font-semibold leading-snug">
          {t.titre}
          <ArrowUpRight className="size-5 shrink-0 text-muted transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-ocre-500" />
        </h3>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-4 text-sm text-muted">
          <span className="flex items-center gap-1.5"><Maximize2 className="size-4" /> {t.superficie.toLocaleString('fr-FR')} m²</span>
          <span className="flex items-center gap-1.5"><FileCheck2 className="size-4" /> {t.document}</span>
          {t.lots > 0 && <span>{t.lots} lots restants</span>}
        </div>
      </Link>
    </motion.article>
  )
}
