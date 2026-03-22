import { useEffect, useRef } from 'preact/hooks';
import { useMap } from '../hooks/useMap';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import type { POICategory } from '../types';

const categoryColor: Record<POICategory, string> = {
  base:     '#10b981',
  waypoint: '#60a5fa',
  threat:   '#ef4444',
  friendly: '#a78bfa',
};

const categoryBadge: Record<POICategory, 'green' | 'blue' | 'red' | 'blue'> = {
  base:     'green',
  waypoint: 'blue',
  threat:   'red',
  friendly: 'blue',
};

export function MapPage() {
  const { pois, route, totalDistance, loading, error } = useMap();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (loading || !mapRef.current || mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      const map = L.map(mapRef.current!).setView([48.8566, 2.3522], 13);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Add POI markers
      pois.forEach((poi) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${categoryColor[poi.category]};border:2px solid white;box-shadow:0 0 6px rgba(0,0,0,0.5)"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker([poi.lat, poi.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${poi.label}</b><br/>${poi.category}`);
      });

      // Draw route
      if (route.length > 1) {
        L.polyline(route.map(({ lat, lng }) => [lat, lng] as [number, number]), {
          color: '#10b981',
          weight: 3,
          dashArray: '6 4',
        }).addTo(map);
      }
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [loading, pois, route]);

  return (
    <div class="flex flex-col h-full pb-16 md:pb-0">
      <div class="p-4 flex items-center justify-between shrink-0">
        <h1 class="text-white text-xl font-bold">Map</h1>
        {!loading && (
          <span class="text-slate-400 text-sm">Route: <span class="text-emerald-400 font-mono">{totalDistance} km</span></span>
        )}
      </div>

      {error && <p class="text-red-400 text-sm px-4">{error}</p>}

      {loading ? (
        <div class="flex-1 px-4"><Skeleton class="h-full w-full rounded-xl" /></div>
      ) : (
        <div ref={mapRef} class="flex-1 mx-4 rounded-xl overflow-hidden" style={{ minHeight: '300px' }} />
      )}

      {/* POI Legend */}
      {!loading && (
        <div class="p-4">
          <Card title="Points of Interest">
            <div class="space-y-2">
              {pois.map((poi) => (
                <div key={poi.id} class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" style={{ background: categoryColor[poi.category] }} />
                    <span class="text-slate-300 text-sm">{poi.label}</span>
                  </div>
                  <Badge label={poi.category} color={categoryBadge[poi.category]} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
