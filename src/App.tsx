import { AnimatePresence, MotionConfig } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/layout/Footer'
import Header from './components/layout/Header'
import { PageTransition, ScrollProgress, ScrollToTop, WhatsAppFloat } from './components/layout/Extras'
import { AppProvider } from './context/AppContext'
import Home from './pages/Home'

const Terrains = lazy(() => import('./pages/Terrains'))
const TerrainDetail = lazy(() => import('./pages/TerrainDetail'))
const Services = lazy(() => import('./pages/Services'))
const Projets = lazy(() => import('./pages/Projets'))
const APropos = lazy(() => import('./pages/APropos'))
const Contact = lazy(() => import('./pages/Contact'))
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'))
const NotFound = lazy(() => import('./pages/NotFound'))

function Loader() {
  return (
    <div className="grid min-h-screen place-items-center bg-noir-900">
      <span className="size-10 animate-spin rounded-full border-4 border-white/20 border-t-ocre-500" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<Loader />}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/terrains" element={<Terrains />} />
            <Route path="/terrains/:slug" element={<TerrainDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projets" element={<Projets />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <ScrollToTop />
          <ScrollProgress />
          <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ocre-500 focus:px-4 focus:py-2 focus:text-white">
            Aller au contenu
          </a>
          <Header />
          <div id="contenu" className="overflow-x-clip">
            <AnimatedRoutes />
          </div>
          <Footer />
          <WhatsAppFloat />
        </BrowserRouter>
      </MotionConfig>
    </AppProvider>
  )
}
