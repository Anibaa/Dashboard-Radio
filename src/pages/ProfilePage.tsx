import { useState } from 'preact/hooks';
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
    <div class="p-4 space-y-4 pb-20 md:pb-4 max-w-lg">
      <h1 class="text-white text-xl font-bold">Profile</h1>

      {/* User Info Card */}
      <Card>
        <div class="flex items-center gap-4 mb-6">
          <Avatar name={user.name} size="lg" online />
          <div class="flex-1 min-w-0">
            <p class="text-white font-bold text-lg">{user.name}</p>
            <p class="text-slate-400 text-sm">{user.email}</p>
          </div>
          <Badge label={user.role} color={user.role === 'admin' ? 'green' : 'blue'} />
        </div>

        {editing ? (
          <div class="space-y-4">
            <div>
              <label class="block text-slate-400 text-xs font-medium mb-2">Name</label>
              <input
                type="text"
                value={name}
                onInput={(e) => setName((e.target as HTMLInputElement).value)}
                class="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label class="block text-slate-400 text-xs font-medium mb-2">Callsign</label>
              <input
                type="text"
                value={callsign}
                onInput={(e) => setCallsign((e.target as HTMLInputElement).value)}
                class="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {error && (
              <div class="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-xs">
                {error}
              </div>
            )}

            <div class="flex gap-2">
              <Button onClick={handleSave} disabled={saving} class="flex-1">
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button onClick={handleCancel} variant="ghost" disabled={saving} class="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div class="space-y-3">
            <Field label="Callsign" value={user.callsign} />
            <Field label="Role" value={user.role} />
            <Field label="User ID" value={user.id} />
            <Button onClick={() => setEditing(true)} variant="secondary" class="w-full mt-4">
              Edit Profile
            </Button>
          </div>
        )}
      </Card>

      {/* Account Actions */}
      <Card title="Account">
        <div class="space-y-3">
          <button class="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors text-sm">
            Change Password
          </button>
          <button class="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors text-sm">
            Notification Settings
          </button>
          <button class="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors text-sm">
            Privacy & Security
          </button>
        </div>
      </Card>

      {/* Sign Out */}
      <Button onClick={onSignOut} variant="danger" class="w-full">
        Sign Out
      </Button>

      {/* App Info */}
      <div class="text-center text-slate-500 text-xs space-y-1">
        <p>TacComm v2.4.1</p>
        <p>© 2024 Tactical Communications</p>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div class="flex items-center justify-between py-2">
      <span class="text-slate-400 text-xs">{label}</span>
      <span class="text-slate-200 text-sm font-medium">{value}</span>
    </div>
  );
}
