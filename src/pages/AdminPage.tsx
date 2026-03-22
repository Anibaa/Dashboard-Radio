import { useState, useEffect } from 'preact/hooks';
import { RotateCcw, Download, Upload, Trash2, ChevronRight } from 'lucide-preact';
import { api } from '../services/api';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Skeleton } from '../components/Skeleton';
import type { AppSettings } from '../types';

export function AdminPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.settings.get().then(setSettings).finally(() => setLoading(false));
  }, []);

  const update = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings((prev) => prev ? { ...prev, [key]: value } : prev);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    await api.settings.save(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div class="p-4 md:p-6 pb-20 md:pb-6">
      <div class="max-w-6xl mx-auto space-y-6">
        {/* Page Title */}
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-white text-2xl md:text-3xl font-bold">Settings</h1>
            <p class="text-slate-400 text-sm mt-1">Configure device and application preferences</p>
          </div>
          {saved && <Badge label="✓ Saved" color="green" />}
        </div>

        {loading || !settings ? (
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton lines={6} class="h-10 w-full" />
            <Skeleton lines={6} class="h-10 w-full" />
          </div>
        ) : (
          <>
            {/* Desktop: 2-column layout */}
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Device Settings */}
              <Card title="Device Configuration">
                <div class="space-y-5">
                  <SettingField label="Device Name" description="Identifier for this tactical device">
                    <input
                      type="text"
                      value={settings.deviceName}
                      onInput={(e) => update('deviceName', (e.target as HTMLInputElement).value)}
                      class={inputCls}
                    />
                  </SettingField>

                  <SettingField label="Channel" description="Communication channel (1-16)">
                    <div class="flex items-center gap-3">
                      <input
                        type="range"
                        min={1}
                        max={16}
                        value={settings.channel}
                        onInput={(e) => update('channel', Number((e.target as HTMLInputElement).value))}
                        class="flex-1"
                      />
                      <span class="text-emerald-400 font-mono font-bold text-sm w-8 text-right">{settings.channel}</span>
                    </div>
                  </SettingField>

                  <SettingField label="TX Power" description="Transmission power in dBm (0-30)">
                    <div class="flex items-center gap-3">
                      <input
                        type="range"
                        min={0}
                        max={30}
                        value={settings.txPower}
                        onInput={(e) => update('txPower', Number((e.target as HTMLInputElement).value))}
                        class="flex-1"
                      />
                      <span class="text-emerald-400 font-mono font-bold text-sm w-12 text-right">{settings.txPower} dBm</span>
                    </div>
                  </SettingField>
                </div>
              </Card>

              {/* Security & GPS */}
              <Card title="Security & Location">
                <div class="space-y-5">
                  <SettingField label="Encryption" description="Enable end-to-end encryption">
                    <ToggleSwitch
                      checked={settings.encryptionEnabled}
                      onChange={(val) => update('encryptionEnabled', val)}
                    />
                  </SettingField>

                  <SettingField label="GPS Update Interval" description="Location update frequency in seconds">
                    <div class="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        max={60}
                        value={settings.gpsUpdateInterval}
                        onInput={(e) => update('gpsUpdateInterval', Number((e.target as HTMLInputElement).value))}
                        class={`${inputCls} w-20`}
                      />
                      <span class="text-slate-400 text-sm">seconds</span>
                    </div>
                  </SettingField>

                  <SettingField label="Theme" description="Application color scheme">
                    <select
                      value={settings.theme}
                      onChange={(e) => update('theme', (e.target as HTMLSelectElement).value as 'dark' | 'light')}
                      class={inputCls}
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                    </select>
                  </SettingField>
                </div>
              </Card>

              {/* Network Settings */}
              <Card title="Network & Connectivity">
                <div class="space-y-5">
                  <SettingField label="Auto-Reconnect" description="Automatically reconnect on disconnect">
                    <ToggleSwitch checked={true} onChange={() => {}} />
                  </SettingField>

                  <SettingField label="Connection Timeout" description="Timeout in seconds">
                    <input type="number" value={30} class={`${inputCls} w-20`} />
                  </SettingField>

                  <SettingField label="Data Sync" description="Sync frequency">
                    <select class={inputCls}>
                      <option>Real-time</option>
                      <option>Every 5 minutes</option>
                      <option>Manual</option>
                    </select>
                  </SettingField>
                </div>
              </Card>

              {/* Notifications */}
              <Card title="Notifications & Alerts">
                <div class="space-y-5">
                  <SettingField label="Push Notifications" description="Receive push notifications">
                    <ToggleSwitch checked={true} onChange={() => {}} />
                  </SettingField>

                  <SettingField label="Sound Alerts" description="Play sound for new messages">
                    <ToggleSwitch checked={true} onChange={() => {}} />
                  </SettingField>

                  <SettingField label="Vibration" description="Vibrate on alerts">
                    <ToggleSwitch checked={false} onChange={() => {}} />
                  </SettingField>

                  <SettingField label="Alert Priority" description="Minimum priority level">
                    <select class={inputCls}>
                      <option>All</option>
                      <option>High</option>
                      <option>Critical</option>
                    </select>
                  </SettingField>
                </div>
              </Card>
            </div>

            {/* Save Button - Full Width */}
            <div class="flex justify-end gap-3">
              <Button onClick={() => api.settings.get().then(setSettings)} variant="ghost">
                Reset
              </Button>
              <Button onClick={handleSave} disabled={saving} class="min-w-32">
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Settings'}
              </Button>
            </div>

            {/* Advanced Section */}
            <Card title="Advanced">
              <div class="space-y-3">
                <ActionButton icon={RotateCcw} label="Reset to Defaults" description="Restore factory settings" />
                <ActionButton icon={Download} label="Export Configuration" description="Download settings as JSON" />
                <ActionButton icon={Upload} label="Import Configuration" description="Upload settings file" />
                <ActionButton icon={Trash2} label="Clear Cache" description="Remove cached data" danger />
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

const inputCls = 'bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-emerald-500 transition-colors';

function SettingField({ label, description, children }: { label: string; description?: string; children: preact.ComponentChildren }) {
  return (
    <div class="space-y-2">
      <div>
        <label class="block text-slate-200 text-sm font-semibold">{label}</label>
        {description && <p class="text-slate-500 text-xs mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (val: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      class={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-emerald-600' : 'bg-slate-600'}`}
    >
      <span
        class={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-7' : 'translate-x-1'}`}
      />
    </button>
  );
}

function ActionButton({ icon: Icon, label, description, danger }: { icon: any; label: string; description?: string; danger?: boolean }) {
  return (
    <button
      class={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
        danger
          ? 'hover:bg-red-900/20 text-red-400'
          : 'hover:bg-slate-700 text-slate-300'
      }`}
    >
      <Icon size={18} />
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium">{label}</p>
        {description && <p class="text-slate-500 text-xs">{description}</p>}
      </div>
      <ChevronRight size={16} class="text-slate-600 shrink-0" />
    </button>
  );
}
