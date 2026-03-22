import type { Page } from '../types/nav';

interface Props {
  activePage: Page;
  onNavigate: (page: Page) => void;
  installBarVisible?: boolean;
}

const navItems: { page: Page; icon: string; label: string }[] = [
  { page: 'dashboard', icon: '📊', label: 'Dashboard' },
  { page: 'map',       icon: '🗺️',  label: 'Map' },
  { page: 'chat',      icon: '💬', label: 'Chat' },
  { page: 'admin',     icon: '⚙️',  label: 'Admin' },
  { page: 'profile',   icon: '👤', label: 'Profile' },
];

export function NavBar({ activePage, onNavigate, installBarVisible }: Props) {
  return (
    <nav
      class={`fixed left-0 right-0 bg-slate-900 border-t border-slate-700 flex justify-around items-center h-16 z-50 transition-all duration-300 md:static md:flex-col md:h-full md:w-20 md:border-t-0 md:border-r md:justify-start md:pt-6 md:gap-2 md:bottom-auto`}
      style={installBarVisible ? { bottom: 'var(--install-bar-height, 140px)' } : { bottom: '0' }}
    >
      {navItems.map(({ page, icon, label }) => (
        <button
          key={page}
          onClick={() => onNavigate(page)}
          class={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-xs ${
            activePage === page
              ? 'text-emerald-400 bg-emerald-900/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <span class="text-xl">{icon}</span>
          <span class="hidden md:block">{label}</span>
        </button>
      ))}
    </nav>
  );
}
