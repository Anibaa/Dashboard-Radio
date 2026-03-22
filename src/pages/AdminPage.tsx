import { useState, useEffect } from 'preact/hooks';
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
    <div class="p-4 space-y-4 pb-20 md:pb-4 max-w-lg">
      <div class="flex items-center justify-between">
        <h1 class="text-white text-xl font-bold">Admin</h1>
        {saved && <Badge label="Saved" color="green" />}
      </div>

      {loading || !settings ? (
        <Skeleton lines={6} class="h-10 w-full" />
      ) : (
        <>
          <Card title="Device">
            <div class="space-y-4">
              <Field label="Device Name">
                <input
                  type="text"
                  value={settings.deviceName}
                  onInput={(e) => update('deviceName', (e.target as HTMLInputElement).value)}
                  class={inputCls}
                />
              </Field>
              <Field label="Channel">
                <input
                  type="number"
                  min={1} max={16}
                  value={settings.channel}
                  onInput={(e) => update('channel', Number((e.target as HTMLInputElement).value))}
                  class={inputCls}
                />
              </Field>
              <Field label="TX Power (dBm)">
                <input
                  type="number"
                  min={0} max={30}
                  value={settings.txPower}
                  onInput={(e) => update('txPower', Number((e.target as HTMLInputElement).value))}
                  class={inputCls}
                />
              </Field>
            </div>
          </Card>

          <Card title="Security & GPS">
            <div class="space-y-4">
              <Field label="Encryption">
                <button
                  onClick={() => update('encryptionEnabled', !settings.encryptionEnabled)}
                  class={`w-12 h-6 rounded-full transition-colors ${settings.encryptionEnabled ? 'bg-emerald-600' : 'bg-slate-600'} relative`}
                >
                  <span class={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.encryptionEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </Field>
              <Field label="GPS Update Interval (s)">
                <input
                  type="number"
                  min={1} max={60}
                  value={settings.gpsUpdateInterval}
                  onInput={(e) => update('gpsUpdateInterval', Number((e.target as HTMLInputElement).value))}
                  class={inputCls}
                />
              </Field>
            </div>
          </Card>

          <Button onClick={handleSave} disabled={saving} class="w-full">
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </>
      )}
    </div>
  );
}

const inputCls = 'bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm w-full focus:outline-none focus:border-emerald-500 transition-colors';

function Field({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <div class="flex items-center justify-between gap-4">
      <label class="text-slate-400 text-sm shrink-0">{label}</label>
      {children}
    </div>
  );
}
