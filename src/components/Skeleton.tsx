interface Props {
  class?: string;
  lines?: number;
}

export function Skeleton({ class: cls = '', lines = 1 }: Props) {
  return (
    <div class="animate-pulse space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} class={`bg-slate-700 rounded ${cls || 'h-4 w-full'}`} />
      ))}
    </div>
  );
}
