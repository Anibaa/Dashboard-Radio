// ─── Device ──────────────────────────────────────────────────────────────────
export interface DeviceStatus {
  id: string;
  name: string;
  connected: boolean;
  batteryLevel: number; // 0-100
  signalStrength: number; // dBm
  firmwareVersion: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  callsign: string;
  avatarUrl?: string;
  online: boolean;
  role: 'admin' | 'operator' | 'observer';
}

// ─── Chat ────────────────────────────────────────────────────────────────────
export type MessageType = 'text' | 'image' | 'voice' | 'video';
export type ChatType = 'group' | 'private';

export interface Message {
  id: string;
  senderId: string;
  chatId: string;
  type: MessageType;
  content: string; // text or media URL
  timestamp: number;
  read: boolean;
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  participantIds: string[];
  lastMessage?: Message;
}

// ─── Map ─────────────────────────────────────────────────────────────────────
export type POICategory = 'base' | 'waypoint' | 'threat' | 'friendly';

export interface PointOfInterest {
  id: string;
  label: string;
  lat: number;
  lng: number;
  category: POICategory;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}

// ─── Telemetry ───────────────────────────────────────────────────────────────
export interface TelemetrySample {
  timestamp: number;
  temperature: number; // °C
  humidity: number;    // %
  pressure: number;    // hPa
  altitude: number;    // m
}

// ─── Admin / Settings ────────────────────────────────────────────────────────
export interface AppSettings {
  deviceName: string;
  channel: number;
  txPower: number; // dBm
  encryptionEnabled: boolean;
  gpsUpdateInterval: number; // seconds
  theme: 'dark' | 'light';
}
