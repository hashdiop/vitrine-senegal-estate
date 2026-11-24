import { useEffect } from 'react'
import { PageHero } from '../components/ui/Sections'
import { site } from '../data/site'
import { img } from '../data/terrains'

export default function MentionsLegales() {
  useEffect(() => { document.title = 'Mentions légales — Senegal Estates' }, [])
  const blocs = [
    { t: 'Éditeur du site', p: `${site.legalName}, ${site.address}. E-mail : ${site.email}. Téléphone : ${site.phones[0].label}. (NINEA et RCCM à compléter.)` },
    { t: 'Hébergement', p: 'Informations sur l’hébergeur à compléter.' },
    { t: 'Propriété intellectuelle', p: 'L’ensemble des contenus de ce site (textes, images, logo) est la propriété de Senegal Estates SARL, sauf mention contraire. Toute reproduction sans autorisation est interdite.' },
    { t: 'Données personnelles', p: 'Les informations transmises via le formulaire de contact servent uniquement à répondre à votre demande. Conformément à la loi sénégalaise n° 2008-12 sur la protection des données personnelles, vous pouvez demander l’accès, la rectification ou la suppression de vos données en écrivant à notre adresse e-mail.' },
    { t: 'Informations sur les offres', p: 'Les prix, superficies et disponibilités sont donnés à titre indicatif et peuvent évoluer. Seuls les documents contractuels signés font foi.' },
  ]
  return (
    <>
      <PageHero title="Mentions légales" image={img.plans} crumbs={[{ label: 'Accueil', to: '/' }, { label: 'Mentions légales' }]} />
      <section className="container-x max-w-3xl space-y-10 py-20">
        {blocs.map((b) => (
          <div key={b.t}>
            <h2 className="text-2xl font-semibold">{b.t}</h2>
            <p className="mt-3 leading-relaxed text-muted">{b.p}</p>
          </div>
        ))}
      </section>
    </>
  )
}
