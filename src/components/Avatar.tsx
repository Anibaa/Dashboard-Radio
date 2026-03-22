interface Props {
  name: string;
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
  avatarUrl?: string;
}

const sizeClasses = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };

function initials(name: string) {
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export function Avatar({ name, online, size = 'md', avatarUrl }: Props) {
  return (
    <div class="relative inline-block flex-shrink-0">
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} class={`${sizeClasses[size]} rounded-full object-cover`} />
      ) : (
        <div class={`${sizeClasses[size]} rounded-full bg-emerald-700 flex items-center justify-center font-semibold text-white`}>
          {initials(name)}
        </div>
      )}
      {online !== undefined && (
        <span class={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-800 ${online ? 'bg-emerald-400' : 'bg-slate-500'}`} />
      )}
    </div>
  );
}
