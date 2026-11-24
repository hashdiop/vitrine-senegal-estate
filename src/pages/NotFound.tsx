import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { ButtonLink } from '../components/ui/primitives'

export default function NotFound() {
  useEffect(() => { document.title = 'Page introuvable — Senegal Estates' }, [])
  return (
    <section className="grain relative grid min-h-screen place-items-center overflow-hidden bg-noir-900 px-4 text-center text-white">
      <div>
        <motion.p
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="font-display text-[8rem] font-semibold leading-none text-ocre-500 sm:text-[12rem]"
        >
          404
        </motion.p>
        <h1 className="mt-4 text-3xl font-semibold">Cette parcelle n’existe pas (encore)</h1>
        <p className="mx-auto mt-3 max-w-md text-white/70">La page demandée est introuvable. Revenez à l’accueil ou explorez nos terrains disponibles.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/"><ArrowLeft className="size-4" /> Accueil</ButtonLink>
          <ButtonLink to="/terrains" variant="light">Voir les terrains</ButtonLink>
        </div>
      </div>
    </section>
  )
}
