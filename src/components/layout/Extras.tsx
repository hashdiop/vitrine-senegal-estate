import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { whatsappLink } from '../../data/site'
import { WhatsAppIcon } from '../ui/primitives'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 })
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-ocre-500 to-noir-500" />
}

export function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 450)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])
  return null
}

export function WhatsAppFloat() {
  const [bubble, setBubble] = useState(false)
  useEffect(() => {
    const show = setTimeout(() => setBubble(true), 6000)
    const hide = setTimeout(() => setBubble(false), 16000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [])
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="relative max-w-60 rounded-2xl rounded-br-sm border border-line bg-surface p-4 pr-8 text-sm shadow-xl"
          >
            <button onClick={() => setBubble(false)} aria-label="Fermer" className="absolute right-2 top-2 text-muted hover:text-ink">
              <X className="size-4" />
            </button>
            <p className="font-semibold">Une question ? 👋</p>
            <p className="mt-1 text-muted">Nos conseillers vous répondent sur WhatsApp.</p>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.a
        href={whatsappLink()}
        target="_blank"
        rel="noreferrer"
        aria-label="Discuter sur WhatsApp"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 18 }}
        whileHover={{ scale: 1.1, rotate: 8 }}
        whileTap={{ scale: 0.9 }}
        className="relative grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <WhatsAppIcon className="relative size-7" />
      </motion.a>
    </div>
  )
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.main>
  )
}
