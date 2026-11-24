import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { PageHero } from '../components/ui/Sections'
import { Button, Img, Reveal, WhatsAppIcon } from '../components/ui/primitives'
import { site, whatsappLink } from '../data/site'
import { img, photos, type Terrain } from '../data/terrains'
import { cn } from '../lib/utils'

const TerrainsMap = lazy(() => import('../components/ui/TerrainsMap'))

const sujets = ['Achat de terrain', 'Conception de plans', 'Devis construction', 'Gestion immobilière', 'Autre'] as const

const schema = z.object({
  prenom: z.string().trim().min(2, 'Indiquez votre prénom'),
  nom: z.string().trim().min(2, 'Indiquez votre nom'),
  email: z.string().trim().email('E-mail invalide'),
  telephone: z.string().trim().regex(/^\+?[0-9\s-]{8,16}$/, 'Numéro invalide'),
  sujet: z.enum(sujets),
  message: z.string().trim().min(10, 'Votre message est un peu court (10 caractères minimum)'),
})
type FormData = z.infer<typeof schema>

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1.5">{children}</div>
      <AnimatePresence>
        {error && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1 block text-xs text-red-600">{error}</motion.span>}
      </AnimatePresence>
    </label>
  )
}

const input = (err?: boolean) =>
  cn('w-full rounded-xl border bg-bg px-4 py-3 text-sm outline-none transition-colors focus:border-ocre-500 focus:ring-4 focus:ring-ocre-500/10', err ? 'border-red-400' : 'border-line')

export default function Contact() {
  const [sent, setSent] = useState<FormData | null>(null)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { sujet: 'Achat de terrain' },
  })
  useEffect(() => { document.title = 'Contact — Senegal Estates' }, [])

  const agence = useMemo<Terrain[]>(() => [{
    slug: 'agence', titre: 'Agence Senegal Estates', zone: 'Keur Massar', region: 'Dakar', superficie: 0, prix: 0,
    statut: 'Disponible', document: 'Bail', type: 'Commercial', viabilise: true, lots: 0, images: [], description: '', atouts: [], coords: site.coords,
  }], [])

  const onSubmit = async (d: FormData) => {
    // Pas de backend pour l'instant : on prépare le message WhatsApp.
    // À brancher plus tard sur une API (Express/MongoDB) ou un service e-mail.
    await new Promise((r) => setTimeout(r, 600))
    setSent(d)
    reset()
  }

  const waMsg = sent
    ? `Bonjour, je suis ${sent.prenom} ${sent.nom} (${sent.telephone}, ${sent.email}).\nSujet : ${sent.sujet}\n\n${sent.message}`
    : ''

  const infos = [
    { icon: MapPin, titre: 'Notre agence', lignes: [site.address] },
    { icon: Phone, titre: 'Téléphone', lignes: site.phones.map((p) => p.label), hrefs: site.phones.map((p) => `tel:${p.tel}`) },
    { icon: Mail, titre: 'E-mail', lignes: [site.email], hrefs: [`mailto:${site.email}`] },
    { icon: Clock, titre: 'Horaires', lignes: site.hours.map((h) => `${h.days} : ${h.time}`) },
  ]

  return (
    <>
      <PageHero
        title="Parlons de votre projet"
        text="Une question, un devis, une visite ? Notre équipe vous répond rapidement par téléphone, e-mail ou WhatsApp."
        image={img.interieur}
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Contact' }]}
      />

      <section className="container-x grid gap-10 py-20 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <Reveal x={-30} y={0}>
            <div className="flex items-center gap-4 rounded-3xl bg-noir-700 p-4 text-white dark:bg-noir-900">
              <Img src={photos.conseiller} alt="Conseiller Senegal Estates" className="size-20 shrink-0 rounded-2xl object-cover object-top" />
              <div>
                <p className="font-semibold">Un conseiller dédié</p>
                <p className="text-sm text-white/75">Avant, pendant et après l’ouverture de votre dossier.</p>
              </div>
            </div>
          </Reveal>
          {infos.map((b, i) => (
            <Reveal key={b.titre} delay={i * 0.08} x={-30} y={0}>
              <motion.div whileHover={{ x: 6 }} className="flex gap-4 rounded-3xl border border-line bg-surface p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ocre-100 text-ocre-700 dark:bg-ocre-700 dark:text-ocre-100"><b.icon className="size-5" /></span>
                <div>
                  <p className="font-semibold">{b.titre}</p>
                  {b.lignes.map((l, j) => (
                    b.hrefs ? <a key={l} href={b.hrefs[j]} className="block text-sm text-muted hover:text-ocre-600">{l}</a> : <p key={l} className="text-sm text-muted">{l}</p>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
          <Reveal delay={0.35}>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-3xl bg-[#25D366] p-5 text-white transition hover:brightness-105">
              <span className="flex items-center gap-4"><WhatsAppIcon className="size-8" /><span><span className="block font-semibold">Discuter sur WhatsApp</span><span className="text-sm text-white/85">Réponse rapide, 7j/7</span></span></span>
              <Send className="size-5" />
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[2rem] border border-line bg-surface p-6 shadow-xl sm:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="py-10 text-center">
                  <motion.span initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 12 }} className="mx-auto grid size-20 place-items-center rounded-full bg-noir-100 text-noir-700">
                    <CheckCircle2 className="size-10" />
                  </motion.span>
                  <h2 className="mt-6 text-3xl font-semibold">Merci {sent.prenom} !</h2>
                  <p className="mx-auto mt-3 max-w-md text-muted">Votre demande est prête. Envoyez-la sur WhatsApp pour une réponse immédiate, ou par e-mail.</p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white"><WhatsAppIcon className="size-4" /> Envoyer sur WhatsApp</a>
                    <a href={`mailto:${site.email}?subject=${encodeURIComponent(sent.sujet)}&body=${encodeURIComponent(waMsg)}`} className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold hover:border-ocre-500"><Mail className="size-4" /> Envoyer par e-mail</a>
                  </div>
                  <button onClick={() => setSent(null)} className="mt-6 text-sm text-muted underline hover:text-ink">Nouveau message</button>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }} onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  <div>
                    <h2 className="text-3xl font-semibold">Envoyez-nous un message</h2>
                    <p className="mt-2 text-muted">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Prénom *" error={errors.prenom?.message}><input {...register('prenom')} autoComplete="given-name" className={input(!!errors.prenom)} /></Field>
                    <Field label="Nom *" error={errors.nom?.message}><input {...register('nom')} autoComplete="family-name" className={input(!!errors.nom)} /></Field>
                    <Field label="E-mail *" error={errors.email?.message}><input type="email" {...register('email')} autoComplete="email" className={input(!!errors.email)} /></Field>
                    <Field label="Téléphone / WhatsApp *" error={errors.telephone?.message}><input type="tel" {...register('telephone')} autoComplete="tel" placeholder="+221 77 000 00 00" className={input(!!errors.telephone)} /></Field>
                  </div>
                  <Field label="Sujet">
                    <select {...register('sujet')} className={input()}>
                      {sujets.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                  <Field label="Votre message *" error={errors.message?.message}>
                    <textarea rows={5} {...register('message')} className={cn(input(!!errors.message), 'resize-none')} />
                  </Field>
                  <Button type="submit" disabled={isSubmitting} className="w-full py-4">
                    {isSubmitting ? <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <><Send className="size-4" /> Envoyer ma demande</>}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </section>

      <section className="container-x pb-24">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] border border-line">
            <Suspense fallback={<div className="h-96 animate-pulse bg-surface-2" />}>
              <TerrainsMap terrains={agence} className="h-96" />
            </Suspense>
          </div>
        </Reveal>
      </section>
    </>
  )
}
