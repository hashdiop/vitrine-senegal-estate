import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import type { Terrain } from '../../data/terrains'
import { formatFCFA } from '../../lib/utils'

const pin = (color: string) =>
  L.divIcon({
    className: '',
    iconSize: [34, 42],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38],
    html: `<svg viewBox="0 0 34 42" width="34" height="42"><path d="M17 41s15-13.5 15-24A15 15 0 0 0 2 17c0 10.5 15 24 15 24Z" fill="${color}" stroke="#fff" stroke-width="2.5"/><circle cx="17" cy="17" r="5.5" fill="#fff"/></svg>`,
  })

const icons = { Disponible: pin('#047857'), Réservé: pin('#d98a3d'), Vendu: pin('#9ca3af') }

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 13)
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [40, 40] })
  }, [map, points])
  return null
}

export default function TerrainsMap({ terrains, className = 'h-[32rem]' }: { terrains: Terrain[]; className?: string }) {
  const key = terrains.map((t) => t.slug).join('|')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const points = useMemo(() => terrains.map((t) => t.coords), [key])
  return (
    <div className={className}>
      <MapContainer center={[14.75, -17.2]} zoom={10} scrollWheelZoom={false} className="size-full">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitBounds points={points} />
        {terrains.map((t) => (
          <Marker key={t.slug} position={t.coords} icon={icons[t.statut]}>
            <Popup>
              <div className="min-w-44 font-sans">
                <p className="text-xs font-semibold uppercase text-[#b96f28]">{t.zone}</p>
                <p className="mt-0.5 font-semibold text-[#1b1d1a]">{t.titre}</p>
                <p className="mt-1 text-sm text-[#5f625b]">{t.superficie} m² · {formatFCFA(t.prix)}</p>
                <Link to={`/terrains/${t.slug}`} className="mt-2 inline-block text-sm font-semibold text-[#1a1a19]">Voir le terrain →</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
