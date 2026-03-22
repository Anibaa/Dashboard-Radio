import type {
  DeviceStatus,
  User,
  Chat,
  Message,
  PointOfInterest,
  TelemetrySample,
  AppSettings,
  AuthUser,
} from '../types';

// ─── Auth Users ──────────────────────────────────────────────────────────────
export const mockAuthUsers: AuthUser[] = [
  { id: 'u1', email: 'alice@taccomm.io', password: 'alpha123', name: 'Alice Mercer',  callsign: 'ALPHA-1', role: 'admin' },
  { id: 'u2', email: 'bob@taccomm.io',   password: 'bravo123', name: 'Bob Tanner',    callsign: 'BRAVO-2', role: 'operator' },
  { id: 'u3', email: 'carol@taccomm.io', password: 'charlie123', name: 'Carol Vance', callsign: 'CHARLIE-3', role: 'operator' },
  { id: 'u4', email: 'dan@taccomm.io',   password: 'delta123', name: 'Dan Ortiz',     callsign: 'DELTA-4', role: 'observer' },
];

// ─── Device ──────────────────────────────────────────────────────────────────
export const mockDevice: DeviceStatus = {
  id: 'ble-001',
  name: 'TacComm Alpha',
  connected: true,
  batteryLevel: 72,
  signalStrength: -58,
  firmwareVersion: '2.4.1',
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Alice Mercer',  callsign: 'ALPHA-1', online: true,  role: 'admin' },
  { id: 'u2', name: 'Bob Tanner',    callsign: 'BRAVO-2', online: true,  role: 'operator' },
  { id: 'u3', name: 'Carol Vance',   callsign: 'CHARLIE-3', online: false, role: 'operator' },
  { id: 'u4', name: 'Dan Ortiz',     callsign: 'DELTA-4', online: true,  role: 'observer' },
];

// ─── Messages ─────────────────────────────────────────────────────────────────
export const mockMessages: Message[] = [
  { id: 'm1', senderId: 'u2', chatId: 'chat-group', type: 'text',  content: 'All units check in.',           timestamp: Date.now() - 300000, read: true },
  { id: 'm2', senderId: 'u1', chatId: 'chat-group', type: 'text',  content: 'ALPHA-1 online, standing by.',  timestamp: Date.now() - 240000, read: true },
  { id: 'm3', senderId: 'u3', chatId: 'chat-group', type: 'text',  content: 'CHARLIE-3 delayed, ETA 10min.', timestamp: Date.now() - 180000, read: true },
  { id: 'm4', senderId: 'u2', chatId: 'chat-group', type: 'image', content: 'https://picsum.photos/seed/tac/400/300', timestamp: Date.now() - 60000, read: false },
  { id: 'm5', senderId: 'u1', chatId: 'chat-private-u2', type: 'text', content: 'Confirm your position.', timestamp: Date.now() - 30000, read: false },
];

// ─── Chats ───────────────────────────────────────────────────────────────────
export const mockChats: Chat[] = [
  {
    id: 'chat-group',
    type: 'group',
    name: 'Tactical Net',
    participantIds: ['u1', 'u2', 'u3', 'u4'],
    lastMessage: mockMessages[3],
  },
  {
    id: 'chat-private-u2',
    type: 'private',
    name: 'BRAVO-2',
    participantIds: ['u1', 'u2'],
    lastMessage: mockMessages[4],
  },
];

// ─── Map POIs ─────────────────────────────────────────────────────────────────
export const mockPOIs: PointOfInterest[] = [
  { id: 'poi1', label: 'Base Camp',    lat: 48.8566, lng: 2.3522,  category: 'base' },
  { id: 'poi2', label: 'Waypoint A',   lat: 48.8620, lng: 2.3600,  category: 'waypoint' },
  { id: 'poi3', label: 'Waypoint B',   lat: 48.8700, lng: 2.3450,  category: 'waypoint' },
  { id: 'poi4', label: 'Threat Zone',  lat: 48.8480, lng: 2.3700,  category: 'threat' },
  { id: 'poi5', label: 'Friendly Unit',lat: 48.8650, lng: 2.3350,  category: 'friendly' },
];

// ─── Telemetry ────────────────────────────────────────────────────────────────
const now = Date.now();
export const mockTelemetry: TelemetrySample[] = Array.from({ length: 20 }, (_, i) => ({
  timestamp: now - (19 - i) * 30000,
  temperature: 22 + Math.sin(i * 0.5) * 4,
  humidity:    55 + Math.cos(i * 0.4) * 10,
  pressure:    1013 + Math.sin(i * 0.3) * 5,
  altitude:    120 + Math.cos(i * 0.6) * 15,
}));

// ─── Settings ─────────────────────────────────────────────────────────────────
export const mockSettings: AppSettings = {
  deviceName: 'TacComm Alpha',
  channel: 7,
  txPower: 20,
  encryptionEnabled: true,
  gpsUpdateInterval: 5,
  theme: 'dark',
};
