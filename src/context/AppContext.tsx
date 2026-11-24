import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

interface AppState {
  dark: boolean
  toggleTheme: () => void
  favoris: string[]
  toggleFavori: (slug: string) => void
  isFavori: (slug: string) => boolean
}

const Ctx = createContext<AppState | null>(null)

const read = (k: string) => {
  try { return localStorage.getItem(k) } catch { return null }
}
const write = (k: string, v: string) => {
  try { localStorage.setItem(k, v) } catch { /* stockage indisponible */ }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const [favoris, setFavoris] = useState<string[]>(() => {
    try { return JSON.parse(read('se-favoris') ?? '[]') } catch { return [] }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => write('se-favoris', JSON.stringify(favoris)), [favoris])

  // Le choix n'est enregistré que lorsque le visiteur clique sur le bouton
  const toggleTheme = useCallback(() => {
    setDark((d) => {
      write('se-mode', d ? 'light' : 'dark')
      return !d
    })
  }, [])
  const toggleFavori = useCallback(
    (slug: string) => setFavoris((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug])),
    [],
  )
  const isFavori = useCallback((slug: string) => favoris.includes(slug), [favoris])

  return <Ctx.Provider value={{ dark, toggleTheme, favoris, toggleFavori, isFavori }}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useApp doit être utilisé dans AppProvider')
  return c
}
