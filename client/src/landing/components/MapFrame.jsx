import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

function hubPinIcon(status) {
  const isLive = status === 'live';
  const fill = isLive ? '#000' : '#fcf8fa';
  const stroke = isLive ? 'none' : '#000';
  const strokeWidth = isLive ? 0 : 1.4;
  const dot = isLive ? '#fcf8fa' : '#000';
  const svg = `<svg width="18" height="26" viewBox="0 0 18 26" xmlns="http://www.w3.org/2000/svg"><path d="M9 0C4.03 0 0 4.03 0 9c0 6.75 9 17 9 17s9-10.25 9-17c0-4.97-4.03-9-9-9z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/><circle cx="9" cy="9" r="3.4" fill="${dot}"/></svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [18, 26],
    iconAnchor: [9, 26],
  });
}

function FitToHubs({ hubs, fallbackCenter, fallbackZoom }) {
  const map = useMap();
  useEffect(() => {
    if (hubs.length) {
      map.fitBounds(
        hubs.map((h) => [h.lat, h.lng]),
        { padding: [24, 24], maxZoom: 14 },
      );
    } else {
      map.setView(fallbackCenter, fallbackZoom);
    }
  }, [hubs, map, fallbackCenter, fallbackZoom]);
  return null;
}

/**
 * A static (no pan/zoom) map inside a black frame. The map area opens a
 * store list modal on click; when `selectable` is on, the footer bar also
 * carries its own tick control (independent click target) for including or
 * excluding that city from the campaign — used in place of a separate
 * checkbox list above the maps.
 */
export function MapFrame({
  label,
  center,
  zoom,
  hubs,
  onClick,
  compact = false,
  selectable = false,
  selected = false,
  onToggleSelect,
}) {
  return (
    <div className="w-full border-2 border-ink bg-paper-dark text-left">
      <button
        type="button"
        onClick={onClick}
        className={`group relative block w-full overflow-hidden ${compact ? 'aspect-[5/2]' : 'aspect-[16/10]'}`}
      >
        <MapContainer
          center={center}
          zoom={zoom}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          touchZoom={false}
          boxZoom={false}
          keyboard={false}
          attributionControl={false}
          className="img-mono pointer-events-none h-full w-full"
        >
          <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <FitToHubs hubs={hubs} fallbackCenter={center} fallbackZoom={zoom} />
          {hubs.map((hub) => (
            <Marker key={hub.hubId} position={[hub.lat, hub.lng]} icon={hubPinIcon(hub.status)} />
          ))}
        </MapContainer>
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/10" />
      </button>

      <div className={`flex items-center justify-between gap-2 border-t-2 border-ink bg-white px-4 ${compact ? 'py-1.5' : 'py-3'}`}>
        <div className="flex min-w-0 items-center gap-2">
          {selectable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.();
              }}
              aria-pressed={selected}
              aria-label={selected ? `Remove ${label} from campaign` : `Add ${label} to campaign`}
              className="grid size-4 shrink-0 place-items-center rounded border border-ink text-[10px] font-bold text-paper"
              style={{ background: selected ? 'var(--color-ink)' : 'transparent' }}
            >
              {selected ? '✓' : ''}
            </button>
          )}
          <span className="truncate text-[13px] font-bold tracking-[0.04em] text-ink uppercase">{label}</span>
        </div>
      </div>
    </div>
  );
}
