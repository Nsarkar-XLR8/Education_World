'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/products', label: 'Products', icon: '📚' },
  { href: '/admin/orders', label: 'Orders', icon: '📦' },
  { href: '/admin/abroad', label: 'Study Abroad', icon: '✈️' },
  { href: '/', label: 'Back to Site', icon: '🌐' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="loading-page"><div className="spinner" /></div>;
  }

  const isAdmin = (session?.user as { role?: string })?.role === 'ADMIN';

  if (!isAdmin) {
    return (
      <div className="loading-page" style={{ flexDirection: 'column', gap: 'var(--space-4)' }}>
        <h3>🔒 Access Denied</h3>
        <p>You must be logged in as an Admin to access this area.</p>
        <Link href="/login" className="btn btn-primary">Go to Login</Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Admin Sidebar */}
      <aside className="sidebar admin-sidebar">
        <div className="sidebar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)' }}>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'white' }}>Admin Portal</span>
        </div>

        <ul className="sidebar-nav">
          {adminLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={pathname === link.href ? 'active' : ''}>
                <span>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '260px', padding: 'var(--space-8)', background: 'var(--surface-warm)' }}>
        {children}
      </main>
    </div>
  );
}
