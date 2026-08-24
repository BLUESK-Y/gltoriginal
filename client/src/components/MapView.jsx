import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useEffect } from 'react';
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
  return (
    <div className="mapwrap">
      <MapContainer
        center={[8.48, 76.95]}
        zoom={12}
        zoomControl={false}
        scrollWheelZoom={false}
        className="img-mono"
        style={{ height: 470, width: '100%' }}
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToHubs hubs={hubs} />
        {hubs.map((h) => (
          <Marker
            key={h.hubId}
            position={[h.lat, h.lng]}
            icon={pinIcon(h.status, h.hubId === selectedHubId)}
            eventHandlers={{ click: () => onSelect(h.hubId) }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
