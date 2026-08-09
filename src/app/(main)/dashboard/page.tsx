'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { gsap } from 'gsap';

const quickLinks = [
  { href: '/books', icon: '📚', label: 'Browse Books', description: 'School, college & university books' },
  { href: '/tuition', icon: '🎓', label: 'Find Tuition', description: 'Connect with tutors nearby' },
  { href: '/kids', icon: '🧸', label: 'Kids Zone', description: 'Games, stories & learning' },
  { href: '/study-abroad', icon: '✈️', label: 'Study Abroad', description: 'Universities worldwide' },
  { href: '/messages', icon: '💬', label: 'Messages', description: 'Chat with others' },
  { href: '/cart', icon: '🛒', label: 'My Cart', description: 'View your cart items' },
  { href: '/orders', icon: '📦', label: 'My Orders', description: 'Track your orders' },
  { href: '/contact', icon: '📧', label: 'Contact Us', description: 'Get in touch' },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.welcome-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
      });

      gsap.from('.quick-link-card', {
        y: 40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        delay: 0.3,
        ease: 'power2.out',
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        {/* Welcome Banner */}
        <div
          className="welcome-card card-gradient"
          style={{
            padding: 'var(--space-10) var(--space-8)',
            marginBottom: 'var(--space-8)',
            borderRadius: 'var(--radius-2xl)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>
                Welcome back, <span className="text-gradient">{session?.user?.name || 'Student'}</span> 👋
              </h2>
              <p style={{ fontSize: 'var(--text-lg)' }}>
                What would you like to explore today?
              </p>
            </div>
            <div style={{ fontSize: '64px' }}>🎓</div>
          </div>
        </div>

        {/* Quick Links Grid */}
        <h3 style={{ marginBottom: 'var(--space-6)' }}>Quick Access</h3>
        <div className="grid grid-4" ref={cardsRef}>
          {quickLinks.map((link, i) => (
            <Link key={i} href={link.href} className="quick-link-card card" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                fontSize: '32px',
                marginBottom: 'var(--space-3)',
              }}>
                {link.icon}
              </div>
              <h5 style={{ marginBottom: 'var(--space-1)' }}>{link.label}</h5>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
