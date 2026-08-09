'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--surface-cool) 0%, var(--surface-cream) 100%)',
      padding: 'var(--space-6)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
      }}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: 'var(--space-8)' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-xl)',
              background: 'var(--primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 'var(--space-4)',
            }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M8 22V10l8 6-8 6z" fill="white" />
                <path d="M16 22V10l8 6-8 6z" fill="white" opacity="0.6" />
              </svg>
            </div>
            <h3>Welcome Back</h3>
          </Link>
          <p style={{ marginTop: 'var(--space-2)' }}>Sign in to your Education World account</p>
        </div>

        {/* Form Card */}
        <div className="card-elevated" style={{ padding: 'var(--space-8)' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: 'var(--space-3) var(--space-4)',
                background: '#FFE6E6',
                color: 'var(--accent-coral)',
                borderRadius: 'var(--radius-lg)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                marginBottom: 'var(--space-6)',
              }}>
                {error}
              </div>
            )}

            <div className="input-group" style={{ marginBottom: 'var(--space-5)' }}>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <div className="input-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: 'var(--space-6)',
            paddingTop: 'var(--space-6)',
            borderTop: '1px solid var(--border-light)',
          }}>
            <p style={{ fontSize: 'var(--text-sm)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/signup" style={{ fontWeight: 600 }}>Sign up</Link>
            </p>
          </div>
        </div>

        <div className="text-center" style={{ marginTop: 'var(--space-6)' }}>
          <Link href="/" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
