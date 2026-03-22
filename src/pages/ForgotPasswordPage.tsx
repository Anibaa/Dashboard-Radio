import { useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { authService } from '../services/auth';

interface Props {
  onBack: () => void;
}

export function ForgotPasswordPage({ onBack }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div class="w-full max-w-md space-y-6">
        <div class="text-center space-y-3">
          <img src="/icon-192.svg" alt="TacComm" class="w-20 h-20 mx-auto rounded-2xl border-2 border-emerald-700" />
          <h1 class="text-white text-2xl font-bold">Reset Password</h1>
          <p class="text-slate-400 text-sm">Enter your email to receive reset instructions</p>
        </div>

        <Card>
          {success ? (
            <div class="space-y-4 text-center">
              <div class="w-16 h-16 bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
                <span class="text-3xl">✓</span>
              </div>
              <p class="text-slate-300 text-sm">
                Password reset instructions have been sent to <span class="text-white font-semibold">{email}</span>
              </p>
              <Button onClick={onBack} class="w-full">Back to Sign In</Button>
            </div>
          ) : (
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

              {error && (
                <div class="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-300 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} class="w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <button
                type="button"
                onClick={onBack}
                class="w-full text-slate-400 hover:text-slate-300 text-sm transition-colors"
              >
                ← Back to Sign In
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
