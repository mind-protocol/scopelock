// Login Page
// Maps to: docs/missions/mission-deck/AC.md F1 (User Authentication)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.login(email, password);
      // Redirect to console
      router.push('/console');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Mission Deck</h1>
          <p className="text-muted">ScopeLock Internal Dashboard</p>
        </div>

        <div className="panel p-8">
          <h2 className="text-xl font-semibold text-text mb-6">Log In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input w-full"
                placeholder="you@scopelock.ai"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger text-danger text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted">
            <p>Week 1 MVP - Any email + password works (mock auth)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
