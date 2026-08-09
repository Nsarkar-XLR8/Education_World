'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Auto sign in after successful signup
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
      setLoading(false);
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
      <div style={{ width: '100%', maxWidth: '440px' }}>
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
            <h3>Create Account</h3>
          </Link>
          <p style={{ marginTop: 'var(--space-2)' }}>Join Education World today — it&apos;s free</p>
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

            <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" className="input" placeholder="John Doe" required autoFocus />
            </div>

            <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="phone">Phone Number</label>
              <input id="phone" name="phone" type="tel" className="input" placeholder="+880 1XXX-XXXXXX" required />
            </div>

            <div className="input-group" style={{ marginBottom: 'var(--space-4)' }}>
              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" className="input" placeholder="you@example.com" required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="input" placeholder="Min 6 chars" required minLength={6} />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">Confirm</label>
                <input id="confirmPassword" name="confirmPassword" type="password" className="input" placeholder="Confirm" required />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Creating account...
                </span>
              ) : (
                'Create Account'
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
              Already have an account?{' '}
              <Link href="/login" style={{ fontWeight: 600 }}>Sign in</Link>
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
