import type { ComponentChildren } from 'preact';

interface Props {
  children: ComponentChildren;
  class?: string;
  title?: string;
}

export function Card({ children, class: cls = '', title }: Props) {
  return (
    <div class={`bg-slate-800 border border-slate-700 rounded-xl p-4 ${cls}`}>
      {title && <h3 class="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-3">{title}</h3>}
      {children}
    </div>
  );
}
