import { useDevice } from '../hooks/useDevice';
import { useTelemetry } from '../hooks/useTelemetry';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { BatteryIndicator } from '../components/BatteryIndicator';
import { TelemetryChart } from '../components/TelemetryChart';
import { Skeleton } from '../components/Skeleton';

export function DashboardPage() {
  const { device, loading: devLoading } = useDevice();
  const { history, latest, loading: telLoading } = useTelemetry();

  return (
    <div class="p-4 space-y-4 pb-20 md:pb-4">
      <h1 class="text-white text-xl font-bold">Dashboard</h1>

      {/* Device Status */}
      <Card title="Device Status">
        {devLoading || !device ? (
          <Skeleton lines={3} class="h-4 w-full" />
        ) : (
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-slate-300 text-sm">{device.name}</span>
              <Badge label={device.connected ? 'Connected' : 'Disconnected'} color={device.connected ? 'green' : 'red'} />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-xs">Battery</span>
              <BatteryIndicator level={device.batteryLevel} />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-xs">Signal</span>
              <span class="text-slate-300 text-sm font-mono">{device.signalStrength} dBm</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-400 text-xs">Firmware</span>
              <span class="text-slate-300 text-sm font-mono">v{device.firmwareVersion}</span>
            </div>
          </div>
        )}
      </Card>

      {/* Latest Readings */}
      <Card title="Live Readings">
        {telLoading || !latest ? (
          <Skeleton lines={4} class="h-4 w-full" />
        ) : (
          <div class="grid grid-cols-2 gap-3">
            {[
              { label: 'Temp', value: `${latest.temperature.toFixed(1)} °C`, color: 'text-orange-400' },
              { label: 'Humidity', value: `${latest.humidity.toFixed(1)} %`, color: 'text-blue-400' },
              { label: 'Pressure', value: `${latest.pressure.toFixed(0)} hPa`, color: 'text-purple-400' },
              { label: 'Altitude', value: `${latest.altitude.toFixed(0)} m`, color: 'text-emerald-400' },
            ].map(({ label, value, color }) => (
              <div key={label} class="bg-slate-900 rounded-lg p-3">
                <p class="text-slate-500 text-xs">{label}</p>
                <p class={`font-mono font-bold text-lg ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Charts */}
      {!telLoading && history.length > 0 && (
        <Card title="Telemetry History">
          <div class="space-y-4">
            <TelemetryChart data={history} field="temperature" label="Temperature" unit="°C" color="#f97316" />
            <TelemetryChart data={history} field="humidity"    label="Humidity"    unit="%" color="#60a5fa" />
            <TelemetryChart data={history} field="altitude"    label="Altitude"    unit="m" color="#10b981" />
          </div>
        </Card>
      )}
    </div>
  );
}
