import { useState, useEffect } from 'preact/hooks';
import { api } from '../services/api';
import type { PointOfInterest, RoutePoint } from '../types';

// Haversine distance in km
function haversine(a: RoutePoint, b: RoutePoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function useMap() {
  const [pois, setPois] = useState<PointOfInterest[]>([]);
  const [route, setRoute] = useState<RoutePoint[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.map.getPOIs()
      .then((data) => {
        setPois(data);
        // Build a default route from waypoints
        const waypoints = data.filter((p) => p.category === 'waypoint' || p.category === 'base');
        setRoute(waypoints.map(({ lat, lng }) => ({ lat, lng })));
      })
      .catch(() => setError('Failed to load map data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (route.length < 2) { setTotalDistance(0); return; }
    const dist = route.reduce((acc, pt, i) => i === 0 ? acc : acc + haversine(route[i - 1], pt), 0);
    setTotalDistance(Math.round(dist * 100) / 100);
  }, [route]);

  return { pois, route, totalDistance, loading, error };
}
