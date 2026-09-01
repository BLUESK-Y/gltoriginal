import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Marker, MapContainer, TileLayer, useMap } from 'react-leaflet';

import { useHubs } from '../hooks/useHubs';

const CENTER = [8.48, 76.975];

// A solid black map-pin, matching the site's monochrome ink palette —
// swapped in for the plain circle markers previously used for hubs.
const PIN_PATH = 'M12 2C7.58 2 4 5.58 4 10c0 5.7 6.16 11.54 7.02 12.34a1.4 1.4 0 0 0 1.96 0C13.84 21.54 20 15.7 20 10c0-4.42-3.58-8-8-8z';

const pinIconLive = L.divIcon({
  className: '',
  html: `<svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="${PIN_PATH}" fill="#000"/>
    <circle cx="12" cy="10" r="3" fill="#fcf8fa"/>
  </svg>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
});

// Waitlisted hubs keep a hollow outline instead of a solid fill, same
// distinction the plain circle markers used to make.
const pinIconWaitlist = L.divIcon({
  className: '',
  html: `<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="${PIN_PATH}" fill="#fcf8fa" stroke="#000" stroke-width="1.6"/>
  </svg>`,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
});

function PanelLabel({ children }) {
  return (
    <span className="absolute top-4 left-4 z-[400] bg-ink/80 px-3 py-1.5 text-[11px] font-semibold tracking-[0.15em] text-white uppercase">
      {children}
    </span>
  );
}

function HubCard({ hub, variant = 'info', onExplore }) {
  return (
    <div className="w-[240px] border border-rule bg-paper shadow-[0_16px_32px_-8px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-paper-dark">
        <img
          src={hub.thumb ?? hub.image}
          alt={
            hub.status === 'live'
              ? `The GLT hub installed at ${hub.storeName}, ${hub.locality}.`
              : 'A GLT dual-A3 backlit hub at a supermarket billing counter.'
          }
          className="img-mono h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-3.5">
        <div>
          <p className="text-[14px] font-bold text-ink">{hub.storeName}</p>
          <p className="mt-0.5 text-[12px] text-muted">
            {hub.locality} · Trivandrum
          </p>
        </div>
        {variant === 'preview' && (
          <button
            type="button"
            onClick={onExplore}
            className="mt-3 w-full bg-ink py-2 text-center text-[11px] font-semibold tracking-[0.12em] text-paper uppercase transition-opacity hover:opacity-80"
          >
            Explore
          </button>
        )}
      </div>
    </div>
  );
}

function PositionTracker({ hubs, onPositions }) {
  const map = useMap();
  useEffect(() => {
    if (!hubs.length) return undefined;
    const compute = () => {
      const size = map.getSize();
      const next = {};
      hubs.forEach((hub) => {
        const point = map.latLngToContainerPoint([hub.lat, hub.lng]);
        next[hub.hubId] = { x: point.x, y: point.y, w: size.x, h: size.y };
      });
      onPositions(next);
    };
    compute();
    map.on('moveend', compute);
    return () => map.off('moveend', compute);
  }, [hubs, map, onPositions]);
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

function HubMarker({ hub, onEnter, onLeave }) {
  const isLive = hub.status === 'live';
  return (
    <Marker
      position={[hub.lat, hub.lng]}
      icon={isLive ? pinIconLive : pinIconWaitlist}
      eventHandlers={{
        mouseover: () => onEnter(hub.hubId),
        mouseout: onLeave,
        click: () => onEnter(hub.hubId),
      }}
    />
  );
}

function NetworkPanel() {
  const { hubs, loading } = useHubs();
  const [activated, setActivated] = useState(false);
  const [visibleHubId, setVisibleHubId] = useState(null);
  const [positions, setPositions] = useState({});
  const hideTimer = useRef(null);
  const containerRef = useRef(null);

  const previewHub = useMemo(() => hubs.find((h) => h.status === 'live') ?? hubs[0] ?? null, [hubs]);
  const visibleHub = hubs.find((h) => h.hubId === visibleHubId) ?? null;
  const pos = visibleHubId ? positions[visibleHubId] : null;

  useEffect(() => {
    if (!activated && previewHub) setVisibleHubId(previewHub.hubId);
  }, [activated, previewHub]);

  const clearHideTimer = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const handleEnter = useCallback(
    (hubId) => {
      if (!activated) return;
      clearHideTimer();
      setVisibleHubId(hubId);
    },
    [activated],
  );

  const handleLeave = useCallback(() => {
    if (!activated) return;
    clearHideTimer();
    hideTimer.current = setTimeout(() => setVisibleHubId(null), 200);
  }, [activated]);

  const handleExplore = useCallback(() => setActivated(true), []);
  useEffect(() => clearHideTimer, []);

  // Clicking anywhere outside the panel collapses it back to the initial
  // preview state, rather than leaving it stuck open forever.
  useEffect(() => {
    if (!activated) return undefined;
    const handlePointerDownOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        clearHideTimer();
        setActivated(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDownOutside);
    return () => document.removeEventListener('pointerdown', handlePointerDownOutside);
  }, [activated]);

  const cardStyle = useMemo(() => {
    if (!pos) return null;
    const leftSide = pos.x > pos.w * 0.55;
    const above = pos.y > pos.h * 0.6;
    return {
      left: pos.x,
      top: pos.y,
      transform: `translate(${leftSide ? 'calc(-100% - 14px)' : '14px'}, ${above ? 'calc(-100% - 8px)' : '-50%'})`,
    };
  }, [pos]);

  return (
    <div ref={containerRef} className="relative aspect-[16/10] overflow-hidden bg-paper-dark" onPointerLeave={handleLeave}>
      <MapContainer
        center={CENTER}
        zoom={12}
        zoomControl={true}
        dragging={false}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={false}
        keyboard={false}
        className="img-mono h-full w-full"
      >
        <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToHubs hubs={hubs} />
        <PositionTracker hubs={hubs} onPositions={setPositions} />
        {hubs.map((hub) => (
          <HubMarker key={hub.hubId} hub={hub} onEnter={handleEnter} onLeave={handleLeave} />
        ))}
      </MapContainer>

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[500] grid place-items-center bg-paper-dark">
          <p className="animate-pulse text-[11px] tracking-[1.2px] text-muted uppercase">Loading network…</p>
        </div>
      )}

      <PanelLabel>Our network</PanelLabel>

      {visibleHub && cardStyle && (
        <div
          className="pointer-events-auto absolute z-[600] hidden sm:block"
          style={cardStyle}
          onPointerEnter={clearHideTimer}
          onPointerLeave={handleLeave}
        >
          <HubCard hub={visibleHub} variant={activated ? 'info' : 'preview'} onExplore={handleExplore} />
        </div>
      )}

      {!activated && visibleHub && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[400] -translate-x-1/2 sm:hidden">
          <button
            type="button"
            onClick={handleExplore}
            className="pointer-events-auto bg-ink px-6 py-2.5 text-[11px] font-semibold tracking-[0.12em] text-paper uppercase"
          >
            Explore
          </button>
        </div>
      )}
    </div>
  );
}

export function Showcase() {
  return (
    <section id="network" className="bg-paper px-10 py-16 md:px-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2">
        <div className="relative aspect-[16/10] overflow-hidden bg-paper-dark">
          <img
            src="/assets/hub-counter-color.png"
            alt="Shoppers at a supermarket billing counter beside a GLT hub, running two brand posters."
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <PanelLabel>Retail store ad</PanelLabel>
        </div>
        <NetworkPanel />
      </div>
    </section>
  );
}
