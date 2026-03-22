import { useState } from 'preact/hooks';
import { Key, Shield, Smartphone, Trash2, Bell, Globe, Palette, ChevronRight } from 'lucide-preact';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { authService } from '../services/auth';
import type { AuthUser } from '../types';

interface Props {
  user: AuthUser;
  onSignOut: () => void;
  onUpdate: () => void;
}

export function ProfilePage({ user, onSignOut, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [callsign, setCallsign] = useState(user.callsign);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      await authService.updateProfile(user.id, { name, callsign });
      setEditing(false);
      onUpdate();
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user.name);
    setCallsign(user.callsign);
    setEditing(false);
    setError('');
  };

  return (
    <div class="p-4 md:p-6 pb-20 md:pb-6">
      <div class="max-w-6xl mx-auto space-y-6">
        {/* Page Title */}
        <div>
          <h1 class="text-white text-2xl md:text-3xl font-bold">Profile</h1>
          <p class="text-slate-400 text-sm mt-1">Manage your account settings and preferences</p>
        </div>

        {/* Desktop: 2-column layout, Mobile: stacked */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div class="lg:col-span-2 space-y-6">
            {/* User Card */}
            <Card>
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-700">
                <Avatar name={user.name} size="lg" online />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <h2 class="text-white font-bold text-xl">{user.name}</h2>
                    <Badge label={user.role} color={user.role === 'admin' ? 'green' : 'blue'} />
                  </div>
                  <p class="text-slate-400 text-sm">{user.email}</p>
                  <p class="text-emerald-400 text-sm font-mono mt-1">{user.callsign}</p>
                </div>
                {!editing && (
                  <Button onClick={() => setEditing(true)} variant="secondary" size="sm">
                    Edit Profile
                  </Button>
                )}
              </div>

              {editing ? (
                <div class="space-y-4">
                  <h3 class="text-white font-semibold text-sm uppercase tracking-wider">Edit Information</h3>
                  
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-slate-400 text-xs font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onInput={(e) => setName((e.target as HTMLInputElement).value)}
                        class="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>

                    <div>
                      <label class="block text-slate-400 text-xs font-medium mb-2">Callsign</label>
                      <input
                        type="text"
                        value={callsign}
                        onInput={(e) => setCallsign((e.target as HTMLInputElement).value)}
                        class="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  {error && (
                    <div class="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-xs">
                      {error}
                    </div>
                  )}

                  <div class="flex gap-3 pt-2">
                    <Button onClick={handleSave} disabled={saving} class="flex-1 sm:flex-initial">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button onClick={handleCancel} variant="ghost" disabled={saving}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div class="space-y-4">
                  <h3 class="text-white font-semibold text-sm uppercase tracking-wider">Account Details</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoField label="User ID" value={user.id} mono />
                    <InfoField label="Role" value={user.role} />
                    <InfoField label="Email" value={user.email} />
                    <InfoField label="Callsign" value={user.callsign} mono />
                  </div>
                </div>
              )}
            </Card>

            {/* Security Card */}
            <Card title="Security & Privacy">
              <div class="space-y-2">
                <ActionButton icon={Key} label="Change Password" description="Update your password" />
                <ActionButton icon={Shield} label="Two-Factor Authentication" description="Add an extra layer of security" />
                <ActionButton icon={Smartphone} label="Connected Devices" description="Manage your active sessions" />
                <ActionButton icon={Trash2} label="Delete Account" description="Permanently delete your account" danger />
              </div>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div class="space-y-6">
            {/* Account Actions */}
            <Card title="Quick Actions">
              <div class="space-y-2">
                <ActionButton icon={Bell} label="Notifications" description="Manage alerts" compact />
                <ActionButton icon={Globe} label="Language" description="English" compact />
                <ActionButton icon={Palette} label="Appearance" description="Dark theme" compact />
              </div>
            </Card>

            {/* Stats Card */}
            <Card title="Activity">
              <div class="space-y-3">
                <StatItem label="Messages Sent" value="1,247" />
                <StatItem label="Missions" value="23" />
                <StatItem label="Uptime" value="99.8%" />
                <StatItem label="Last Active" value="Just now" />
              </div>
            </Card>

            {/* Sign Out */}
            <Button onClick={onSignOut} variant="danger" class="w-full">
              Sign Out
            </Button>

            {/* App Info */}
            <div class="text-center text-slate-500 text-xs space-y-1 pt-4">
              <p class="font-semibold">TacComm v2.4.1</p>
              <p>© 2024 Tactical Communications</p>
              <div class="flex justify-center gap-3 pt-2">
                <a href="#" class="hover:text-slate-400 transition-colors">Privacy</a>
                <span>•</span>
                <a href="#" class="hover:text-slate-400 transition-colors">Terms</a>
                <span>•</span>
                <a href="#" class="hover:text-slate-400 transition-colors">Help</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div class="bg-slate-900 rounded-lg p-3">
      <p class="text-slate-500 text-xs mb-1">{label}</p>
      <p class={`text-slate-200 text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, description, danger, compact }: { icon: any; label: string; description?: string; danger?: boolean; compact?: boolean }) {
  return (
    <button
      class={`w-full flex items-center gap-3 text-left rounded-lg transition-colors ${
        compact ? 'p-2' : 'p-3'
      } ${
        danger
          ? 'hover:bg-red-900/20 text-red-400'
          : 'hover:bg-slate-700 text-slate-300'
      }`}
    >
      <Icon size={compact ? 16 : 18} />
      <div class="flex-1 min-w-0">
        <p class={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{label}</p>
        {description && <p class="text-slate-500 text-xs">{description}</p>}
      </div>
      <ChevronRight size={16} class="text-slate-600 shrink-0" />
    </button>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div class="flex items-center justify-between py-2">
      <span class="text-slate-400 text-xs">{label}</span>
      <span class="text-emerald-400 text-sm font-semibold font-mono">{value}</span>
    </div>
  );
}
