import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Heart, LayoutGrid, Map as MapIcon, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHero } from '../components/ui/Sections'
import TerrainCard from '../components/ui/TerrainCard'
import { useApp } from '../context/AppContext'
import { img, terrains, zones } from '../data/terrains'
import { cn } from '../lib/utils'

const TerrainsMap = lazy(() => import('../components/ui/TerrainsMap'))

const tris = {
  pertinence: 'Pertinence',
  'prix-asc': 'Prix croissant',
  'prix-desc': 'Prix décroissant',
  'surface-desc': 'Superficie',
} as const
type Tri = keyof typeof tris

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5 w-full cursor-pointer rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-ocre-500">
        <option value="">Tous</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </label>
  )
}

export default function Terrains() {
  const [params, setParams] = useSearchParams()
  const { favoris } = useApp()
  const [vue, setVue] = useState<'grille' | 'carte'>('grille')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { document.title = 'Terrains à vendre — Senegal Estates' }, [])

  const get = (k: string) => params.get(k) ?? ''
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }

  const zone = get('zone'), type = get('type'), budget = get('budget'), statut = get('statut'), doc = get('document'), onlyFav = get('favoris') === '1'
  const tri = (get('tri') || 'pertinence') as Tri

  const list = useMemo(() => {
    const r = terrains.filter(
      (t) =>
        (!zone || t.zone === zone) &&
        (!type || t.type === type) &&
        (!budget || t.prix <= Number(budget)) &&
        (!statut || t.statut === statut) &&
        (!doc || t.document === doc) &&
        (!onlyFav || favoris.includes(t.slug)),
    )
    if (tri === 'prix-asc') r.sort((a, b) => a.prix - b.prix)
    if (tri === 'prix-desc') r.sort((a, b) => b.prix - a.prix)
    if (tri === 'surface-desc') r.sort((a, b) => b.superficie - a.superficie)
    return r
  }, [zone, type, budget, statut, doc, onlyFav, favoris, tri])

  const activeCount = [zone, type, budget, statut, doc].filter(Boolean).length + (onlyFav ? 1 : 0)

  const filters = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Select label="Zone" value={zone} onChange={(v) => set('zone', v)} options={zones.map((z) => [z, z])} />
      <Select label="Type" value={type} onChange={(v) => set('type', v)} options={[['Résidentiel', 'Résidentiel'], ['Commercial', 'Commercial'], ['Agricole', 'Agricole']]} />
      <Select label="Budget max" value={budget} onChange={(v) => set('budget', v)} options={[['5000000', '5 M FCFA'], ['8000000', '8 M FCFA'], ['12000000', '12 M FCFA'], ['20000000', '20 M FCFA']]} />
      <Select label="Statut" value={statut} onChange={(v) => set('statut', v)} options={[['Disponible', 'Disponible'], ['Réservé', 'Réservé'], ['Vendu', 'Vendu']]} />
      <Select label="Document" value={doc} onChange={(v) => set('document', v)} options={[['Titre foncier', 'Titre foncier'], ['Bail', 'Bail'], ['Délibération', 'Délibération']]} />
    </div>
  )

  return (
    <>
      <PageHero
        title="Terrains à vendre"
        text="Des parcelles vérifiées à Dakar et Thiès, avec titre foncier, bail ou délibération. Filtrez, comparez et réservez votre visite."
        image={img.champ}
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Terrains' }]}
      />

      <section className="container-x relative z-10 -mt-10">
        <div className="rounded-3xl border border-line bg-surface p-5 shadow-xl sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => setShowFilters((s) => !s)} className="flex items-center gap-2 font-semibold lg:pointer-events-none" aria-expanded={showFilters}>
              <SlidersHorizontal className="size-5 text-ocre-500" /> Filtres
              {activeCount > 0 && <span className="grid size-6 place-items-center rounded-full bg-ocre-500 text-xs text-white">{activeCount}</span>}
            </button>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => set('favoris', onlyFav ? '' : '1')}
                aria-pressed={onlyFav}
                className={cn('flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors', onlyFav ? 'border-ocre-500 bg-ocre-500 text-white' : 'border-line hover:border-ocre-500')}
              >
                <Heart className={cn('size-4', onlyFav && 'fill-white')} /> Favoris ({favoris.length})
              </button>
              {activeCount > 0 && (
                <button onClick={() => setParams({}, { replace: true })} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-muted hover:text-ink">
                  <RotateCcw className="size-4" /> Réinitialiser
                </button>
              )}
            </div>
          </div>
          <div className="mt-5 hidden lg:block">{filters}</div>
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden lg:hidden">
                <div className="pt-5">{filters}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-muted">
            <motion.span key={list.length} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="inline-block font-semibold text-ink">{list.length}</motion.span>{' '}
            terrain{list.length > 1 ? 's' : ''} trouvé{list.length > 1 ? 's' : ''}
          </p>
          <div className="flex items-center gap-3">
            <select value={tri} onChange={(e) => set('tri', e.target.value === 'pertinence' ? '' : e.target.value)} aria-label="Trier" className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-sm outline-none">
              {Object.entries(tris).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <div className="flex rounded-full bg-surface-2 p-1">
              {([['grille', LayoutGrid, 'Grille'], ['carte', MapIcon, 'Carte']] as const).map(([v, Icon, l]) => (
                <button key={v} onClick={() => setVue(v)} className="relative flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium" aria-pressed={vue === v}>
                  {vue === v && <motion.span layoutId="vue-pill" className="absolute inset-0 rounded-full bg-surface shadow" />}
                  <Icon className="relative size-4" /><span className="relative">{l}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {vue === 'grille' ? (
            <motion.div key="grille" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {list.length === 0 ? (
                <div className="mt-10 rounded-3xl border border-dashed border-line p-16 text-center">
                  <p className="font-display text-2xl">Aucun terrain ne correspond à vos critères.</p>
                  <p className="mt-2 text-muted">Élargissez votre recherche ou contactez-nous : de nouveaux lots arrivent régulièrement.</p>
                </div>
              ) : (
                <LayoutGroup>
                  <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                      {list.map((t) => <TerrainCard key={t.slug} t={t} />)}
                    </AnimatePresence>
                  </motion.div>
                </LayoutGroup>
              )}
            </motion.div>
          ) : (
            <motion.div key="carte" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8 overflow-hidden rounded-3xl border border-line">
              <Suspense fallback={<div className="h-[32rem] animate-pulse bg-surface-2" />}>
                <TerrainsMap terrains={list} className="h-[36rem]" />
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  )
}
