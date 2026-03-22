interface Props {
  level: number; // 0-100
}

export function BatteryIndicator({ level }: Props) {
  const color = level > 50 ? 'bg-emerald-500' : level > 20 ? 'bg-yellow-500' : 'bg-red-500';
  const label = level > 50 ? 'green' : level > 20 ? 'yellow' : 'red';

  return (
    <div class="flex items-center gap-2">
      <div class="relative w-10 h-5 border-2 border-slate-400 rounded-sm flex items-center px-0.5">
        <div class={`h-3 rounded-sm transition-all duration-500 ${color}`} style={{ width: `${level}%` }} />
        <div class="absolute -right-1.5 top-1/2 -translate-y-1/2 w-1 h-2.5 bg-slate-400 rounded-r-sm" />
      </div>
      <span class={`text-sm font-mono font-semibold text-${label === 'green' ? 'emerald' : label === 'yellow' ? 'yellow' : 'red'}-400`}>
        {Math.round(level)}%
      </span>
    </div>
  );
}
