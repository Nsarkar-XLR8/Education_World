'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/books', label: 'Books', icon: '📚' },
  { href: '/tuition', label: 'Tuition', icon: '🎓' },
  { href: '/kids', label: 'Kids Zone', icon: '🧸' },
  { href: '/study-abroad', label: 'Study Abroad', icon: '✈️' },
  { href: '/messages', label: 'Messages', icon: '💬' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--space-2)', color: 'var(--primary)' }}>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
          </svg>
          Education World
        </Link>

        {/* Nav Links */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={pathname === link.href || pathname?.startsWith(link.href + '/') ? 'active' : ''}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {session ? (
            <>
              <Link href="/cart" className="btn btn-ghost btn-icon" title="Cart">
                🛒
              </Link>
              <Link href="/account" className="btn btn-ghost btn-icon" title="Account">
                👤
              </Link>
              {(session.user as { role?: string })?.role === 'ADMIN' && (
                <Link href="/admin" className="btn btn-sm btn-secondary">
                  Admin
                </Link>
              )}
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => signOut({ callbackUrl: '/' })}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-sm btn-ghost">
                Login
              </Link>
              <Link href="/signup" className="btn btn-sm btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
