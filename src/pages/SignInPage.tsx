import { useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

interface Props {
  onSignIn: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
}

export function SignInPage({ onSignIn, onForgotPassword }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSignIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div class="w-full max-w-md space-y-6">
        {/* Logo / Header */}
        <div class="text-center space-y-3">
          <img src="/icon-192.svg" alt="TacComm" class="w-20 h-20 mx-auto rounded-2xl border-2 border-emerald-700" />
          <h1 class="text-white text-3xl font-bold">TacComm</h1>
          <p class="text-slate-400 text-sm">Tactical Communication Controller</p>
        </div>

        {/* Sign In Form */}
        <Card>
          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-slate-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                placeholder="your@email.com"
                required
                class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label class="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
                placeholder="••••••••"
                required
                class="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {error && (
              <div class="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-sm">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} class="w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <button
              type="button"
              onClick={onForgotPassword}
              class="w-full text-emerald-400 hover:text-emerald-300 text-sm transition-colors"
            >
              Forgot password?
            </button>
          </form>
        </Card>

        {/* Demo credentials hint */}
        <Card class="bg-slate-900/50">
          <p class="text-slate-400 text-xs mb-2">Demo credentials:</p>
          <div class="space-y-1 text-xs font-mono">
            <p class="text-slate-500">alice@taccomm.io / alpha123</p>
            <p class="text-slate-500">bob@taccomm.io / bravo123</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
