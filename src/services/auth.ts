import { mockAuthUsers } from '../data/mockData';
import type { AuthUser, AuthSession } from '../types';

const delay = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

const SESSION_KEY = 'taccomm_session';

export const authService = {
  async signIn(email: string, password: string): Promise<AuthSession> {
    await delay();
    const user = mockAuthUsers.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid email or password');
    
    const session: AuthSession = {
      user: { ...user, password: '' }, // don't store password in session
      token: `token_${user.id}_${Date.now()}`,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  },

  async signOut(): Promise<void> {
    await delay(200);
    localStorage.removeItem(SESSION_KEY);
  },

  getSession(): AuthSession | null {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  async resetPassword(email: string): Promise<boolean> {
    await delay(800);
    const user = mockAuthUsers.find((u) => u.email === email);
    if (!user) throw new Error('Email not found');
    // In real app: send reset email
    return true;
  },

  async updateProfile(userId: string, updates: Partial<Pick<AuthUser, 'name' | 'callsign'>>): Promise<AuthUser> {
    await delay(400);
    const user = mockAuthUsers.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    Object.assign(user, updates);
    
    // Update session
    const session = authService.getSession();
    if (session && session.user.id === userId) {
      session.user = { ...session.user, ...updates };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
    
    return { ...user, password: '' };
  },
};
