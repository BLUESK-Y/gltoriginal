import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { Move } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';

function pinIcon(status, selected) {
  const isVerified = status === 'verified';
  const size = selected ? 30 : 22;
  const fill = isVerified ? '#000' : '#fcf8fa';
  const stroke = isVerified ? 'none' : '#000';
  const strokeWidth = isVerified ? 0 : 1.6;
  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C7.58 2 4 5.58 4 10c0 5.7 6.16 11.54 7.02 12.34a1.4 1.4 0 0 0 1.96 0C13.84 21.54 20 15.7 20 10c0-4.42-3.58-8-8-8z" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>
    <circle cx="12" cy="10" r="3" fill="${isVerified ? '#fcf8fa' : '#000'}"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function DragToggle({ enabled }) {
  const map = useMap();
  useEffect(() => {
    if (enabled) map.dragging.enable();
    else map.dragging.disable();
  }, [enabled, map]);
  return null;
}

function FitToHubs({ hubs }) {
  const map = useMap();
  useEffect(() => {
    if (!hubs.length) return;
    map.fitBounds(
      hubs.map((h) => [h.lat, h.lng]),
      { padding: [30, 30] },
    );
  }, [hubs, map]);
  return null;
}

export default function MapView({ hubs, selectedHubId, onSelect }) {
  const [panEnabled, setPanEnabled] = useState(false);

  return (
    <div className="mapwrap">
      <MapContainer
        center={[8.48, 76.95]}
        zoom={12}
        zoomControl={true}
        dragging={false}
        scrollWheelZoom={false}
        className="img-mono"
        style={{ height: 470, width: '100%' }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToHubs hubs={hubs} />
        <DragToggle enabled={panEnabled} />
        {hubs.map((h) => (
          <Marker
            key={h.hubId}
            position={[h.lat, h.lng]}
            icon={pinIcon(h.status, h.hubId === selectedHubId)}
            eventHandlers={{ click: () => onSelect(h.hubId) }}
          />
        ))}
      </MapContainer>

      <button
        type="button"
        onClick={() => setPanEnabled((v) => !v)}
        aria-pressed={panEnabled}
        aria-label={panEnabled ? 'Turn off map panning' : 'Turn on map panning to reposition it'}
        title={panEnabled ? 'Panning on' : 'Pan the map'}
        className={`absolute left-[12px] z-[450] grid size-[30px] place-items-center rounded-[2px] border-2 shadow-md transition-colors ${
          panEnabled ? 'border-black bg-black text-white' : 'border-black/60 bg-white text-ink hover:bg-black/10'
        }`}
        style={{ top: 82 }}
      >
        <Move size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}
