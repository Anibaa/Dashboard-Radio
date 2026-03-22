import { useState, useEffect } from 'preact/hooks';
import { authService } from '../services/auth';
import type { AuthSession } from '../types';

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = authService.getSession();
    setSession(s);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const s = await authService.signIn(email, password);
    setSession(s);
    return s;
  };

  const signOut = async () => {
    await authService.signOut();
    setSession(null);
  };

  return {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session,
    loading,
    signIn,
    signOut,
  };
}
