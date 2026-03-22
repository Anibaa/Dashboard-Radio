import type { TelemetrySample } from '../types';

type Field = 'temperature' | 'humidity' | 'pressure' | 'altitude';

interface Props {
  data: TelemetrySample[];
  field: Field;
  label: string;
  unit: string;
  color?: string;
}

export function TelemetryChart({ data, field, label, unit, color = '#10b981' }: Props) {
  if (data.length === 0) return null;

  const values = data.map((d) => d[field]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 300;
  const H = 80;
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * W},${H - ((v - min) / range) * H}`)
    .join(' ');

  const latest = values[values.length - 1];

  return (
    <div class="space-y-1">
      <div class="flex justify-between items-baseline">
        <span class="text-xs text-slate-400">{label}</span>
        <span class="text-lg font-mono font-bold" style={{ color }}>
          {latest.toFixed(1)}<span class="text-xs text-slate-400 ml-1">{unit}</span>
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} class="w-full h-16" preserveAspectRatio="none">
        <polyline fill="none" stroke={color} stroke-width="2" points={points} />
      </svg>
    </div>
  );
}
