import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Heart, Menu, Moon, Phone, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { nav, site } from '../../data/site'
import { cn } from '../../lib/utils'
import { ButtonLink, Logo } from '../ui/primitives'

export default function Header() {
  const { pathname } = useLocation()
  const { dark, toggleTheme, favoris } = useApp()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 40)
    setHidden(y > 400 && y > prev && !open)
  })

  // Ferme le menu mobile à chaque changement de page
  const [lastPath, setLastPath] = useState(pathname)
  if (lastPath !== pathname) {
    setLastPath(pathname)
    setOpen(false)
  }
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  const overHero = !scrolled && !open
  const light = overHero // texte blanc au-dessus des héros sombres

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300',
          scrolled ? 'border-b border-line bg-bg/80 shadow-sm backdrop-blur-xl' : 'bg-transparent',
        )}
      >
        <div className="container-x flex h-20 items-center justify-between gap-4">
          <Logo light={light} />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className="relative whitespace-nowrap px-3 py-2 text-sm font-medium xl:px-4">
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className={cn('absolute inset-0 rounded-full', light ? 'bg-white/15' : 'bg-surface-2')}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={cn('relative transition-colors', light ? 'text-white/90 hover:text-white' : isActive ? 'text-ink' : 'text-muted hover:text-ink')}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link
              to="/terrains?favoris=1"
              aria-label={`Mes favoris (${favoris.length})`}
              className={cn('relative grid size-10 place-items-center rounded-full transition-colors', light ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-surface-2')}
            >
              <Heart className="size-5" />
              <AnimatePresence>
                {favoris.length > 0 && (
                  <motion.span
                    key={favoris.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-ocre-500 text-[10px] font-bold text-white"
                  >
                    {favoris.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              onClick={toggleTheme}
              aria-label={dark ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className={cn('grid size-10 place-items-center overflow-hidden rounded-full transition-colors', light ? 'text-white hover:bg-white/15' : 'text-ink hover:bg-surface-2')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={dark ? 'sun' : 'moon'} initial={{ y: -20, rotate: -90, opacity: 0 }} animate={{ y: 0, rotate: 0, opacity: 1 }} exit={{ y: 20, rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <div className="ml-2 hidden sm:block lg:hidden xl:block">
              <ButtonLink to="/contact" className="py-2.5">Prendre rendez-vous</ButtonLink>
            </div>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={open}
              className={cn('grid size-10 place-items-center rounded-full lg:hidden', light ? 'text-white' : 'text-ink')}
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 95% 2.5rem)' }}
            animate={{ clipPath: 'circle(150% at 95% 2.5rem)' }}
            exit={{ clipPath: 'circle(0% at 95% 2.5rem)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-bg px-6 pb-10 pt-28 lg:hidden"
          >
            <motion.ul initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }} className="space-y-1">
              {nav.map((item) => (
                <motion.li key={item.to} variants={{ hidden: { opacity: 0, x: -30 }, show: { opacity: 1, x: 0 } }}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => cn('block py-3 font-display text-4xl font-semibold', isActive ? 'text-ocre-500' : 'text-ink')}
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }} className="mt-auto space-y-3">
              <a href={`tel:${site.phones[0].tel}`} className="flex items-center gap-3 text-muted">
                <Phone className="size-5 text-ocre-500" /> {site.phones[0].label}
              </a>
              <ButtonLink to="/contact" className="w-full">Prendre rendez-vous</ButtonLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
