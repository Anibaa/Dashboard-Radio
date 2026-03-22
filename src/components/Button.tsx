import type { ComponentChildren } from 'preact';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props {
  children: ComponentChildren;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  class?: string;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-emerald-600 hover:bg-emerald-500 text-white',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
  danger:    'bg-red-600 hover:bg-red-500 text-white',
  ghost:     'bg-transparent hover:bg-slate-700 text-slate-300 border border-slate-600',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', class: cls = '' }: Props) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      class={`rounded-md font-medium transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${cls}`}
    >
      {children}
    </button>
  );
}
