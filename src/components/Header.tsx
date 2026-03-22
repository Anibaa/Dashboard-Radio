import { useState, useEffect, useRef } from 'preact/hooks';
import { Avatar } from './Avatar';
import type { AuthUser } from '../types';
import type { Page } from '../types/nav';

interface Props {
  user: AuthUser;
  onNavigate: (page: Page) => void;
  onSignOut: () => void;
}

export function Header({ user, onNavigate, onSignOut }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleMenuClick = (page: Page) => {
    setDropdownOpen(false);
    onNavigate(page);
  };

  const handleSignOut = () => {
    setDropdownOpen(false);
    onSignOut();
  };

  return (
    <header class="bg-slate-900 border-b border-slate-700 px-4 h-16 flex items-center justify-between shrink-0">
      {/* Logo + Platform Name */}
      <div class="flex items-center gap-3">
        <img src="/icon-192.svg" alt="TacComm" class="w-9 h-9 rounded-lg" />
        <div class="hidden sm:block">
          <h1 class="text-white font-bold text-base leading-tight">TacComm</h1>
          <p class="text-slate-500 text-xs leading-tight">Tactical Comms</p>
        </div>
      </div>

      {/* User Menu */}
      <div class="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          class="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Avatar name={user.name} size="sm" online />
          <div class="hidden md:block text-left">
            <p class="text-white text-sm font-medium leading-tight">{user.name}</p>
            <p class="text-slate-400 text-xs leading-tight">{user.callsign}</p>
          </div>
          <svg
            class={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div class="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
            {/* User Info in dropdown (mobile) */}
            <div class="md:hidden px-4 py-3 border-b border-slate-700">
              <p class="text-white text-sm font-semibold">{user.name}</p>
              <p class="text-slate-400 text-xs">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div class="py-2">
              <MenuItem
                icon="👤"
                label="Profile"
                onClick={() => handleMenuClick('profile')}
              />
              <MenuItem
                icon="⚙️"
                label="Settings"
                onClick={() => handleMenuClick('admin')}
              />
            </div>

            <div class="border-t border-slate-700 py-2">
              <MenuItem
                icon="🚪"
                label="Sign Out"
                onClick={handleSignOut}
                danger
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

interface MenuItemProps {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onClick, danger }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      class={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
        danger
          ? 'text-red-400 hover:bg-red-900/20'
          : 'text-slate-300 hover:bg-slate-700'
      }`}
    >
      <span class="text-lg">{icon}</span>
      <span class="text-sm font-medium">{label}</span>
    </button>
  );
}
