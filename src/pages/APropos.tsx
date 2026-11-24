import { motion, useScroll, useTransform } from 'framer-motion'
import { BookOpen, GraduationCap, Home, Rocket, Sparkles, Target, Users } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { CtaBanner, PageHero } from '../components/ui/Sections'
import { Counter, Img, Reveal, SectionHeading } from '../components/ui/primitives'
import { staggerChild, staggerParent } from '../lib/motion'
import { equipe } from '../data/content'
import { site } from '../data/site'
import { img, photos } from '../data/terrains'

const timeline = [
  { annee: '2022', titre: 'La naissance', texte: "Des étudiants partageant la même chambre à l'Université du Sine Saloum El Hadj Ibrahima Niass décident de créer Senegal Estates." },
  { annee: '2023', titre: 'Premières transactions', texte: 'Lancement des premiers lotissements et des facilités de paiement pour les classes moyennes.' },
  { annee: '2024', titre: 'Plans & construction', texte: 'Ouverture des pôles conception de plans et construction clé en main.' },
  { annee: '2025', titre: 'Gestion immobilière', texte: 'Lancement de la gestion locative et accompagnement de la diaspora.' },
  { annee: 'Demain', titre: 'Cap sur de nouvelles régions', texte: 'De nouveaux programmes pour rendre la propriété accessible partout au Sénégal.' },
]

const engagements = [
  { icon: Home, titre: 'Accès au logement', texte: 'Des offres abordables pour que chaque famille puisse devenir propriétaire.' },
  { icon: BookOpen, titre: 'Éducation à l’investissement', texte: 'Des séances d’information pour comprendre le foncier et investir sereinement.' },
  { icon: Rocket, titre: 'Entrepreneuriat des jeunes', texte: 'Le soutien aux jeunes porteurs de projets, comme nous l’avons été.' },
]

export default function APropos() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 50%'] })
  const lineW = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  useEffect(() => { document.title = 'À propos — Senegal Estates' }, [])

  return (
    <>
      <PageHero
        title={<>Bâtissez <em className="text-ocre-400">votre avenir</em> avec nous</>}
        text="Une jeune entreprise sénégalaise portée par une conviction : la propriété foncière doit être accessible, sûre et transparente."
        image={img.maison2}
        crumbs={[{ label: 'Accueil', to: '/' }, { label: 'À propos' }]}
      />

      <section className="container-x grid items-center gap-16 py-24 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Notre histoire" title="Née sur les bancs de l’université" />
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Fondée en {site.founded}, Senegal Estates est née de l’ambition d’étudiants de l’Université du Sine Saloum El Hadj Ibrahima Niass. Leur constat : trop de familles renoncent à devenir propriétaires, faute d’offres accessibles et de garanties sur les documents.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              Aujourd’hui, notre équipe dynamique accompagne particuliers, entreprises et investisseurs avant, pendant et après l’ouverture de leur dossier — avec expertise, intégrité et réactivité.
            </p>
          </Reveal>
          <motion.div variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-10 grid grid-cols-3 gap-4">
            {site.stats.slice(0, 3).map((s) => (
              <motion.div key={s.label} variants={staggerChild} className="rounded-2xl bg-surface-2 p-4 text-center">
                <Counter value={s.value} suffix={s.suffix} className="font-display text-3xl font-semibold text-ocre-600" />
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <Reveal x={40} y={0}>
          <div className="relative">
            <div className="mx-auto aspect-[4/5] max-w-md overflow-hidden rounded-[2rem]"><Img src={photos.investissement} alt="Investir dans la pierre avec Senegal Estates" className="size-full object-cover" /></div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -left-6 bottom-10 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4 shadow-xl">
              <span className="grid size-12 place-items-center rounded-xl bg-noir-700 text-white"><GraduationCap /></span>
              <span><span className="block font-semibold">Fondée en {site.founded}</span><span className="text-sm text-muted">par des étudiants ambitieux</span></span>
            </motion.div>
          </div>
        </Reveal>
      </section>

      <section className="grain relative overflow-hidden bg-noir-900 py-24 text-white">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, titre: 'Notre mission', texte: 'Rendre la propriété foncière accessible aux classes moyennes grâce à des offres abordables et des paiements flexibles.' },
            { icon: Sparkles, titre: 'Notre vision', texte: 'Devenir la référence de confiance de l’immobilier au Sénégal, de la parcelle à la clé.' },
            { icon: Users, titre: 'Nos valeurs', texte: 'Dynamisme, expertise, intégrité et réactivité, au service de chaque client.' },
          ].map((b, i) => (
            <Reveal key={b.titre} delay={i * 0.12}>
              <motion.div whileHover={{ y: -8 }} className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <b.icon className="size-9 text-ocre-400" />
                <h3 className="mt-5 text-2xl font-semibold">{b.titre}</h3>
                <p className="mt-3 leading-relaxed text-white/70">{b.texte}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <SectionHeading center eyebrow="Notre parcours" title="Une croissance pas à pas" />
          <div ref={ref} className="relative mt-16">
            <div className="absolute left-0 right-0 top-6 hidden h-0.5 bg-line lg:block" />
            <motion.div style={{ width: lineW }} className="absolute left-0 top-6 hidden h-0.5 bg-ocre-500 lg:block" />
            <div className="grid gap-10 lg:grid-cols-5 lg:gap-6">
              {timeline.map((t, i) => (
                <Reveal key={t.annee} delay={i * 0.1}>
                  <div className="relative">
                    <span className="relative z-10 grid size-12 place-items-center rounded-full border-4 border-bg bg-noir-700 text-xs font-bold text-white">{i + 1}</span>
                    <p className="mt-5 font-display text-3xl font-semibold text-ocre-600">{t.annee}</p>
                    <h3 className="mt-1 text-lg font-semibold">{t.titre}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{t.texte}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-2 py-24">
        <div className="container-x">
          <SectionHeading center eyebrow="L’équipe" title="Les visages de Senegal Estates" />
          <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
            <Reveal x={-40} y={0}>
              <div className="group relative mx-auto max-w-2xl">
                <div className="absolute -inset-3 -rotate-2 rounded-[2.2rem] bg-ocre-500/15 transition-transform duration-500 group-hover:rotate-0" />
                <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem]">
                  <Img src={photos.fondateurs} alt="L’équipe fondatrice de Senegal Estates" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              </div>
            </Reveal>
            <div>
              <Reveal>
                <h3 className="text-3xl font-semibold">L’équipe fondatrice</h3>
                <p className="mt-4 leading-relaxed text-muted">
                  Trois amis, une même chambre d’étudiants et une ambition commune : rendre la propriété accessible à tous. Aujourd’hui, cette équipe dynamique accompagne chaque client avec expertise, intégrité et réactivité.
                </p>
              </Reveal>
              {equipe.length > 0 && (
                <motion.ul variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-8 space-y-3">
                  {equipe.map((m) => (
                    <motion.li key={m.nom} variants={staggerChild} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
                      <span className="font-semibold">{m.nom}</span>
                      <span className="text-sm text-ocre-600">{m.role}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
              <motion.ul variants={staggerParent} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-8 grid grid-cols-2 gap-3">
                {['Équipe dynamique', 'Expertise', 'Intégrité', 'Réactivité'].map((v) => (
                  <motion.li key={v} variants={staggerChild} className="rounded-2xl bg-surface px-4 py-3 text-sm font-semibold">{v}</motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Engagement communautaire" title="Redonner à la communauté" text="Au-delà des transactions, nous investissons dans l’avenir de notre pays." />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {engagements.map((e, i) => (
              <Reveal key={e.titre} delay={i * 0.1}>
                <div className="h-full rounded-3xl border border-line bg-surface p-7">
                  <span className="grid size-12 place-items-center rounded-2xl bg-ocre-100 text-ocre-700 dark:bg-ocre-700 dark:text-ocre-100"><e.icon /></span>
                  <h3 className="mt-5 text-xl font-semibold">{e.titre}</h3>
                  <p className="mt-2 text-muted">{e.texte}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  )
}
