import { useState, useEffect } from 'preact/hooks';
import { api } from '../services/api';
import type { DeviceStatus } from '../types';

export function useDevice() {
  const [device, setDevice] = useState<DeviceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.device.getStatus()
      .then(setDevice)
      .catch(() => setError('Failed to load device status'))
      .finally(() => setLoading(false));

    // Simulate live battery drain
    const interval = setInterval(() => {
      setDevice((prev) =>
        prev ? { ...prev, batteryLevel: Math.max(0, prev.batteryLevel - 0.1) } : prev
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return { device, loading, error };
}
