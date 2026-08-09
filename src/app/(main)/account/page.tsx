'use client';

import { useSession } from 'next-auth/react';

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: 'var(--space-6)' }}>👤 My Account</h2>

          <div className="card-elevated" style={{ padding: 'var(--space-8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-50)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '36px',
                color: 'var(--primary)',
              }}>
                👤
              </div>
              <div>
                <h3 style={{ margin: 0 }}>{session?.user?.name || 'User'}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>{session?.user?.email}</p>
                <span className="badge badge-primary" style={{ marginTop: 'var(--space-2)' }}>
                  {(session?.user as { role?: string })?.role || 'USER'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: 0 }}>Full Name</h5>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>{session?.user?.name}</p>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ margin: 0 }}>Email Address</h5>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
