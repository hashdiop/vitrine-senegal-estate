import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, BadgeCheck, CalendarCheck, ChevronLeft, ChevronRight, Droplets, FileCheck2, Heart, Layers, MapPin, Maximize2, Share2, X } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PaymentSimulator from '../components/ui/PaymentSimulator'
import { Badge, ButtonLink, Img, Reveal, WhatsAppIcon } from '../components/ui/primitives'
import TerrainCard from '../components/ui/TerrainCard'
import { useApp } from '../context/AppContext'
import { site, whatsappLink } from '../data/site'
import { statutTone, terrains } from '../data/terrains'
import { cn, formatFCFA } from '../lib/utils'
import NotFound from './NotFound'

const TerrainsMap = lazy(() => import('../components/ui/TerrainsMap'))

export default function TerrainDetail() {
  const { slug } = useParams()
  const t = terrains.find((x) => x.slug === slug)
  const { isFavori, toggleFavori } = useApp()
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => { if (t) document.title = `${t.titre} — Senegal Estates` }, [t])
  useEffect(() => {
    if (lightbox === null || !t) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox((i) => ((i ?? 0) + 1) % t.images.length)
      if (e.key === 'ArrowLeft') setLightbox((i) => ((i ?? 0) - 1 + t.images.length) % t.images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, t])

  if (!t) return <NotFound />

  const fav = isFavori(t.slug)
  const similaires = terrains.filter((x) => x.slug !== t.slug && (x.region === t.region || x.type === t.type)).slice(0, 3)
  const prixM2 = t.prix / t.superficie

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) await navigator.share({ title: t.titre, url })
      else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000) }
    } catch { /* partage annulé */ }
  }

  const specs = [
    { icon: Maximize2, label: 'Superficie', value: `${t.superficie.toLocaleString('fr-FR')} m²` },
    { icon: FileCheck2, label: 'Document', value: t.document },
    { icon: Layers, label: 'Type', value: t.type },
    { icon: Droplets, label: 'Viabilisé', value: t.viabilise ? 'Oui' : 'Non' },
  ]

  return (
    <>
      <section className="bg-noir-900 pb-10 pt-28">
        <div className="container-x">
          <Link to="/terrains" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"><ArrowLeft className="size-4" /> Retour aux terrains</Link>
          <div className="mt-6 grid gap-3 lg:grid-cols-[2fr_1fr]">
            <button onClick={() => setLightbox(active)} className="group relative aspect-[16/10] overflow-hidden rounded-3xl" aria-label="Agrandir la photo">
              <AnimatePresence mode="popLayout">
                <motion.div key={active} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                  <Img src={t.images[active]} alt={t.titre} className="size-full object-cover" />
                </motion.div>
              </AnimatePresence>
              <span className="absolute bottom-4 right-4 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur opacity-0 transition-opacity group-hover:opacity-100">Cliquer pour agrandir</span>
            </button>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {t.images.map((src, i) => (
                <button key={src + i} onClick={() => setActive(i)} className={cn('relative aspect-[16/10] overflow-hidden rounded-2xl ring-offset-2 ring-offset-noir-900 transition', active === i ? 'ring-2 ring-ocre-500' : 'opacity-60 hover:opacity-100')}>
                  <Img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x grid gap-12 py-14 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={statutTone[t.statut]}>{t.statut}</Badge>
              {t.lots > 0 && <Badge tone="neutral">{t.lots} lots restants</Badge>}
            </div>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">{t.titre}</h1>
            <p className="mt-3 flex items-center gap-2 text-muted"><MapPin className="size-4 text-ocre-500" />{t.zone}, région de {t.region}</p>
            <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-2">
              <p className="font-display text-4xl font-semibold text-noir-700 dark:text-noir-300">{formatFCFA(t.prix)}</p>
              <p className="pb-1 text-sm text-muted">soit {formatFCFA(prixM2)} / m²</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <motion.button whileTap={{ scale: 0.92 }} onClick={() => toggleFavori(t.slug)} aria-pressed={fav} className={cn('flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors', fav ? 'border-ocre-500 bg-ocre-500 text-white' : 'border-line hover:border-ocre-500')}>
                <Heart className={cn('size-4', fav && 'fill-white')} /> {fav ? 'Dans vos favoris' : 'Ajouter aux favoris'}
              </motion.button>
              <button onClick={share} className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-semibold hover:border-ocre-500">
                <Share2 className="size-4" /> {copied ? 'Lien copié !' : 'Partager'}
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {specs.map((s) => (
                <motion.div key={s.label} whileHover={{ y: -4 }} className="rounded-2xl border border-line bg-surface p-4">
                  <s.icon className="size-5 text-ocre-500" />
                  <p className="mt-3 text-xs text-muted">{s.label}</p>
                  <p className="font-semibold">{s.value}</p>
                </motion.div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="mt-12 text-2xl font-semibold">Description</h2>
            <p className="mt-3 leading-relaxed text-muted">{t.description}</p>
            <h2 className="mt-10 text-2xl font-semibold">Les atouts</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {t.atouts.map((a) => <li key={a} className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3"><BadgeCheck className="size-5 text-ocre-500" />{a}</li>)}
            </ul>
            <h2 className="mt-10 text-2xl font-semibold">Localisation</h2>
            <div className="mt-4 overflow-hidden rounded-3xl border border-line">
              <Suspense fallback={<div className="h-80 animate-pulse bg-surface-2" />}>
                <TerrainsMap terrains={[t]} className="h-80" />
              </Suspense>
            </div>
          </Reveal>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <Reveal x={30} y={0}>
            <div className="rounded-3xl border border-line bg-surface p-6">
              <h3 className="text-xl font-semibold">Intéressé(e) par ce terrain ?</h3>
              <p className="mt-1 text-sm text-muted">Un conseiller vous répond en moins d’une heure.</p>
              <div className="mt-5 space-y-3">
                <ButtonLink href={whatsappLink(`Bonjour, je souhaite visiter « ${t.titre} » (${t.zone}).`)} target="_blank" rel="noreferrer" className="w-full">
                  <CalendarCheck className="size-4" /> Réserver une visite
                </ButtonLink>
                <ButtonLink href={`tel:${site.phones[0].tel}`} variant="ghost" className="w-full">Appeler le {site.phones[0].label}</ButtonLink>
                <ButtonLink href={whatsappLink(`Bonjour, pouvez-vous m'envoyer les documents de « ${t.titre} » ?`)} target="_blank" rel="noreferrer" variant="secondary" className="w-full">
                  <WhatsAppIcon className="size-4" /> Recevoir les documents
                </ButtonLink>
              </div>
            </div>
          </Reveal>
          {t.statut !== 'Vendu' && <Reveal x={30} y={0} delay={0.1}><PaymentSimulator prixInitial={t.prix} titre={t.titre} compact /></Reveal>}
        </aside>
      </section>

      {similaires.length > 0 && (
        <section className="bg-surface-2 py-16">
          <div className="container-x">
            <h2 className="text-3xl font-semibold">Terrains similaires</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similaires.map((s) => <TerrainCard key={s.slug} t={s} />)}
            </div>
          </div>
        </section>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4" onClick={() => setLightbox(null)} role="dialog" aria-modal="true">
            <button aria-label="Fermer" className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X /></button>
            <button aria-label="Précédente" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + t.images.length) % t.images.length) }} className="absolute left-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft /></button>
            <motion.div key={lightbox} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 25 }} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl">
              <Img src={t.images[lightbox]} alt={t.titre} className="max-h-[85vh] w-full object-contain" />
            </motion.div>
            <button aria-label="Suivante" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % t.images.length) }} className="absolute right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight /></button>
            <p className="absolute bottom-6 text-sm text-white/70">{lightbox + 1} / {t.images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
