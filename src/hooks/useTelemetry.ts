import { useState, useEffect } from 'preact/hooks';
import { api } from '../services/api';
import type { TelemetrySample } from '../types';

export function useTelemetry() {
  const [history, setHistory] = useState<TelemetrySample[]>([]);
  const [latest, setLatest] = useState<TelemetrySample | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.telemetry.getHistory(), api.telemetry.getLatest()])
      .then(([hist, lat]) => { setHistory(hist); setLatest(lat); })
      .catch(() => setError('Failed to load telemetry'))
      .finally(() => setLoading(false));

    // Simulate live updates
    const interval = setInterval(async () => {
      const sample = await api.telemetry.getLatest();
      setLatest(sample);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { history, latest, loading, error };
}
