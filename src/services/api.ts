import {
  mockDevice,
  mockUsers,
  mockChats,
  mockMessages,
  mockPOIs,
  mockTelemetry,
  mockSettings,
} from '../data/mockData';
import type { AppSettings, Message } from '../types';

const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

export const api = {
  device: {
    getStatus: async () => { await delay(); return { ...mockDevice }; },
    disconnect: async () => { await delay(300); return true; },
  },

  users: {
    getAll: async () => { await delay(); return [...mockUsers]; },
  },

  chat: {
    getChats: async () => { await delay(); return [...mockChats]; },
    getMessages: async (chatId: string) => {
      await delay();
      return mockMessages.filter((m) => m.chatId === chatId);
    },
    sendMessage: async (msg: Omit<Message, 'id' | 'timestamp' | 'read'>) => {
      await delay(300);
      const newMsg: Message = { ...msg, id: `m-${Date.now()}`, timestamp: Date.now(), read: false };
      mockMessages.push(newMsg);
      return newMsg;
    },
  },

  map: {
    getPOIs: async () => { await delay(); return [...mockPOIs]; },
  },

  telemetry: {
    getHistory: async () => { await delay(); return [...mockTelemetry]; },
    getLatest: async () => { await delay(200); return mockTelemetry[mockTelemetry.length - 1]; },
  },

  settings: {
    get: async () => { await delay(); return { ...mockSettings }; },
    save: async (s: AppSettings) => { await delay(400); Object.assign(mockSettings, s); return true; },
  },
};
