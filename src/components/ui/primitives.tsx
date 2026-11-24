import { animate, motion, useInView, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { ImageOff } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '../../lib/utils'

/* ---------- Image avec repli élégant ---------- */
export function Img({ src, alt, className, ...rest }: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (failed)
    return (
      <div role="img" aria-label={alt} className={cn('flex items-center justify-center bg-gradient-to-br from-noir-500 to-ocre-500 text-white/70', className)}>
        <ImageOff className="size-8" />
      </div>
    )
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={() => setLoaded(true)}
      className={cn('transition-opacity duration-700', loaded ? 'opacity-100' : 'opacity-0', className)}
      {...rest}
    />
  )
}

/* ---------- Boutons ---------- */
type Variant = 'primary' | 'secondary' | 'ghost' | 'light'
const variants: Record<Variant, string> = {
  primary: 'bg-ocre-500 text-white hover:bg-ocre-600 shadow-lg shadow-ocre-500/25',
  secondary: 'bg-noir-700 text-white hover:bg-noir-500 dark:bg-noir-500 dark:hover:bg-noir-300 dark:hover:text-noir-900',
  ghost: 'border border-line text-ink hover:border-ocre-500 hover:text-ocre-600',
  light: 'bg-white/10 text-white border border-white/30 backdrop-blur hover:bg-white hover:text-noir-900',
}
const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ocre-500 disabled:opacity-60'

interface BtnProps { variant?: Variant; className?: string; children: ReactNode }

export function ButtonLink({ to, href, variant = 'primary', className, children, ...rest }: BtnProps & { to?: string; href?: string; target?: string; rel?: string }) {
  const cls = cn(base, variants[variant], className)
  const inner = (
    <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className={cn('inline-flex', className?.includes('w-full') && 'w-full')}>
      {to ? (
        <Link to={to} className={cls}>{children}</Link>
      ) : (
        <a href={href} className={cls} {...rest}>{children}</a>
      )}
    </motion.span>
  )
  return inner
}

export function Button({ variant = 'primary', className, children, ...rest }: BtnProps & HTMLMotionProps<'button'>) {
  return (
    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </motion.button>
  )
}

/* ---------- Apparition au scroll ---------- */
export function Reveal({ children, delay = 0, y = 32, x = 0, className }: { children: ReactNode; delay?: number; y?: number; x?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Titre de section ---------- */
export function SectionHeading({ eyebrow, title, text, center, light }: { eyebrow: string; title: ReactNode; text?: string; center?: boolean; light?: boolean }) {
  return (
    <Reveal className={cn('max-w-2xl', center && 'mx-auto text-center')}>
      <span className={cn('inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]', light ? 'text-ocre-300' : 'text-ocre-600')}>
        <span className="h-px w-8 bg-current" />
        {eyebrow}
      </span>
      <h2 className={cn('mt-4 text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl', light ? 'text-white' : 'text-ink')}>{title}</h2>
      {text && <p className={cn('mt-4 text-base leading-relaxed sm:text-lg', light ? 'text-white/75' : 'text-muted')}>{text}</p>}
    </Reveal>
  )
}

/* ---------- Compteur animé ---------- */
export function Counter({ value, suffix = '', className }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    const fmt = (v: number) => (v >= 1000 ? `${(v / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })}K` : Math.round(v).toString()) + suffix
    if (reduce) { el.textContent = fmt(value); return }
    const c = animate(0, value, { duration: 2, ease: 'easeOut', onUpdate: (v) => (el.textContent = fmt(v)) })
    return () => c.stop()
  }, [inView, value, suffix, reduce])
  return <span ref={ref} className={className}>0{suffix}</span>
}

/* ---------- Badges ---------- */
export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'green' | 'amber' | 'red' | 'dark'; className?: string }) {
  const tones = {
    neutral: 'bg-surface-2 text-ink',
    green: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
    amber: 'bg-ocre-100 text-ocre-700 dark:bg-ocre-700 dark:text-ocre-100',
    red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100',
    dark: 'bg-black/55 text-white backdrop-blur',
  }
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold', tones[tone], className)}>{children}</span>
}

/* ---------- Icône WhatsApp (les icônes de marque ne sont plus dans lucide) ---------- */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.44-9.44a9.4 9.4 0 0 1 9.43 9.45c0 5.2-4.24 9.43-9.44 9.43Zm8.03-17.47A11.28 11.28 0 0 0 12.04.7C5.78.7.69 5.79.69 12.05c0 2 .52 3.95 1.52 5.67L.6 23.6l6.02-1.58a11.33 11.33 0 0 0 5.42 1.38h.01c6.25 0 11.35-5.09 11.35-11.35 0-3.03-1.18-5.88-3.33-8.02Z" />
    </svg>
  )
}

/* ---------- Logo ---------- */
/* Pictogramme redessiné en vectoriel d'après « Logo SE.png » (maison, porte, fenêtre, sol).
   Il hérite de la couleur du texte (currentColor) : noir sur fond clair, blanc sur fond sombre. */
const draw = (delay: number) => ({
  initial: { pathLength: 0 },
  animate: { pathLength: 1 },
  transition: { duration: 1.2, delay, ease: 'easeInOut' as const },
})

export function LogoMark({ className, animated = true }: { className?: string; animated?: boolean }) {
  const a = (d: number) => (animated ? draw(d) : {})
  return (
    <svg viewBox="90 270 1510 1095" fill="none" stroke="currentColor" strokeWidth="27" strokeLinejoin="miter" className={className} aria-hidden>
      {/* Contour principal : sol gauche, mur, toit, mur droit, sol droit */}
      <motion.path {...a(0)} d="M193 1283 H342 V634 L962 298 L1295 634 L1290 1283 H1451" />
      {/* Poteau central */}
      <motion.path {...a(0.2)} d="M950 326 L960 1283 H1290" />
      {/* Second pignon + porte */}
      <motion.path {...a(0.35)} d="M937 474 L465 731 V1281 H709 V606" />
      {/* Ligne de sol */}
      <motion.path {...a(0.5)} d="M97 1343 H1590" strokeWidth="22" />
      {/* Poignée et fenêtre */}
      <motion.circle initial={animated ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ delay: 1.1, type: 'spring' }} cx="652" cy="1011" r="29" fill="currentColor" stroke="none" />
      <motion.path
        initial={animated ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        d="M1046 469 L1197 633 V1218 H1046 Z"
        stroke="none"
        className="fill-current transition-colors duration-300 group-hover:fill-ocre-500"
      />
    </svg>
  )
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex shrink-0 items-center gap-2.5 sm:gap-3" aria-label="Sénégal Estates — accueil">
      <motion.span whileHover={{ scale: 1.06 }} className={cn('block', light ? 'text-white' : 'text-ink')}>
        <LogoMark className="h-8 w-auto sm:h-10" />
      </motion.span>
      <span className="whitespace-nowrap border-l border-current/20 pl-3 leading-none">
        <span className={cn('block font-logo text-lg font-bold uppercase tracking-wide sm:text-[1.35rem]', light ? 'text-white' : 'text-ink')}>Sénégal Estates</span>
        <span className={cn('mt-0.5 hidden font-logo text-[11px] font-semibold uppercase tracking-[0.22em] sm:block', light ? 'text-white/65' : 'text-muted')}>Agence immobilière · SARL</span>
      </span>
    </Link>
  )
}
