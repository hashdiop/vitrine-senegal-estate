import clsx, { type ClassValue } from 'clsx'

export const cn = (...c: ClassValue[]) => clsx(c)

export const formatFCFA = (n: number) =>
  new Intl.NumberFormat('fr-FR').format(Math.round(n)).replace(/ | /g, ' ') + ' FCFA'

export const formatCompact = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M FCFA`
  return formatFCFA(n)
}

export const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`
