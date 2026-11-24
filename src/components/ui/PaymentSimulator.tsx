import { animate, motion } from 'framer-motion'
import { Calculator } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { whatsappLink } from '../../data/site'
import { cn, formatFCFA } from '../../lib/utils'
import { ButtonLink, WhatsAppIcon } from './primitives'

function AnimatedAmount({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(value)
  useEffect(() => {
    const c = animate(prev.current, value, {
      duration: 0.6,
      ease: 'easeOut',
      onUpdate: (v) => { if (ref.current) ref.current.textContent = formatFCFA(v) },
    })
    prev.current = value
    return () => c.stop()
  }, [value])
  return <span ref={ref} className={className}>{formatFCFA(value)}</span>
}

function Slider({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; display: string }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className="block">
      <span className="flex items-center justify-between text-sm">
        <span className="text-muted">{label}</span>
        <span className="font-semibold">{display}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full accent-ocre-500"
        style={{ background: `linear-gradient(to right, var(--color-ocre-500) ${pct}%, var(--color-line) ${pct}%)` }}
      />
    </label>
  )
}

export default function PaymentSimulator({ prixInitial = 6_500_000, titre, compact }: { prixInitial?: number; titre?: string; compact?: boolean }) {
  const [prix, setPrix] = useState(prixInitial)
  const [apportPct, setApportPct] = useState(30)
  const [mois, setMois] = useState(12)

  const apport = (prix * apportPct) / 100
  const mensualite = (prix - apport) / mois
  const durees = [6, 12, 18, 24]

  const msg = `Bonjour, je suis intéressé(e) ${titre ? `par « ${titre} »` : 'par un terrain'} : prix ${formatFCFA(prix)}, apport ${apportPct} %, paiement sur ${mois} mois (≈ ${formatFCFA(mensualite)}/mois).`

  return (
    <div className={cn('rounded-3xl border border-line bg-surface p-6 shadow-sm', !compact && 'sm:p-8')}>
      <div className="flex items-center gap-3">
        <span className="grid size-11 place-items-center rounded-2xl bg-ocre-100 text-ocre-700 dark:bg-ocre-700 dark:text-ocre-100">
          <Calculator className="size-5" />
        </span>
        <div>
          <h3 className="text-xl font-semibold">Simulateur de paiement</h3>
          <p className="text-sm text-muted">Paiement échelonné sans intérêts*</p>
        </div>
      </div>

      <div className="mt-7 space-y-6">
        {!titre && (
          <Slider label="Prix du terrain" value={prix} min={2_000_000} max={30_000_000} step={250_000} onChange={setPrix} display={formatFCFA(prix)} />
        )}
        <Slider label="Apport initial" value={apportPct} min={20} max={80} step={5} onChange={setApportPct} display={`${apportPct} % · ${formatFCFA(apport)}`} />
        <div>
          <span className="text-sm text-muted">Durée de paiement</span>
          <div className="mt-3 grid grid-cols-4 gap-2 rounded-full bg-surface-2 p-1">
            {durees.map((d) => (
              <button key={d} onClick={() => setMois(d)} className="relative rounded-full py-2 text-sm font-semibold">
                {mois === d && <motion.span layoutId={`duree-${titre ?? 'g'}`} className="absolute inset-0 rounded-full bg-noir-700 dark:bg-noir-500" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                <span className={cn('relative', mois === d ? 'text-white' : 'text-muted')}>{d} mois</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 rounded-2xl bg-noir-700 p-5 text-white dark:bg-noir-900">
        <p className="text-sm text-white/70">Votre mensualité estimée</p>
        <AnimatedAmount value={mensualite} className="mt-1 block font-display text-3xl font-semibold sm:text-4xl" />
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/15 pt-4 text-sm">
          <div><p className="text-white/60">Apport</p><p className="font-semibold">{formatFCFA(apport)}</p></div>
          <div><p className="text-white/60">Reste à payer</p><p className="font-semibold">{formatFCFA(prix - apport)}</p></div>
        </div>
      </div>

      <ButtonLink href={whatsappLink(msg)} target="_blank" rel="noreferrer" className="mt-5 w-full">
        <WhatsAppIcon className="size-4" /> Recevoir cette offre sur WhatsApp
      </ButtonLink>
      <p className="mt-3 text-xs text-muted">*Simulation indicative. Les conditions exactes dépendent du programme.</p>
    </div>
  )
}
