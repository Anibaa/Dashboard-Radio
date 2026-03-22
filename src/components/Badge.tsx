type Color = 'green' | 'red' | 'yellow' | 'blue' | 'slate';

interface Props {
  label: string;
  color?: Color;
}

const colorClasses: Record<Color, string> = {
  green:  'bg-emerald-900 text-emerald-300',
  red:    'bg-red-900 text-red-300',
  yellow: 'bg-yellow-900 text-yellow-300',
  blue:   'bg-blue-900 text-blue-300',
  slate:  'bg-slate-700 text-slate-300',
};

export function Badge({ label, color = 'slate' }: Props) {
  return (
    <span class={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {label}
    </span>
  );
}
