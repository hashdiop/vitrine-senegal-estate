// Variantes Framer Motion partagées (apparition en cascade)
export const staggerParent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

export const staggerChild = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export const ANNEE = new Date().getFullYear()
