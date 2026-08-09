'use client';

import Link from 'next/link';
import KidsHeader from '@/components/features/KidsHeader';

const zones = [
  {
    href: '/kids/books',
    icon: '📚',
    title: 'Story Books',
    description: 'Read fun and colorful stories',
    color: '#FF7675',
    bg: '#FFE6E6',
  },
  {
    href: '/kids/animals',
    icon: '🦁',
    title: 'Animals',
    description: 'Learn about amazing animals',
    color: '#FDCB6E',
    bg: '#FFF9E6',
  },
  {
    href: '/kids/birds',
    icon: '🦅',
    title: 'Birds',
    description: 'Discover the world of birds',
    color: '#74B9FF',
    bg: '#E6F3FF',
  },
  {
    href: '/kids/fruits',
    icon: '🍎',
    title: 'Fruits',
    description: 'Learn about healthy fruits',
    color: '#55EFC4',
    bg: '#E6FFF5',
  },
  {
    href: '/kids/abc',
    icon: '🔤',
    title: 'ABC Alphabet',
    description: 'Learn letters from A to Z',
    color: '#A29BFE',
    bg: '#F0EEFF',
  },
  {
    href: '/kids/123',
    icon: '🔢',
    title: 'Numbers 123',
    description: 'Count and learn numbers',
    color: '#FD79A8',
    bg: '#FFE6F0',
  },
  {
    href: '/kids/math',
    icon: '🧮',
    title: 'Math Games',
    description: 'Addition, subtraction & more',
    color: '#00CEC9',
    bg: '#E6FFF9',
  },
  {
    href: '/kids/snake',
    icon: '🐍',
    title: 'Snake Game',
    description: 'Play the classic snake game',
    color: '#6C5CE7',
    bg: '#F0EEFF',
  },
];

export default function KidsZonePage() {
  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        {/* Kids Gamification Header */}
        <KidsHeader />

        {/* Title Header */}
        <div className="text-center animate-fade-in-up" style={{ marginBottom: 'var(--space-12)' }}>
          <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>🧸</div>
          <h2>Kids Learning Hub & Games</h2>
          <p style={{ fontSize: 'var(--text-lg)', maxWidth: '540px', margin: 'var(--space-3) auto 0' }}>
            Earn XP, collect stars ⭐, unlock trophies 🏆, and play educational games!
          </p>
        </div>

        {/* Activity Cards */}
        <div className="grid grid-4">
          {zones.map((zone, i) => (
            <Link
              key={i}
              href={zone.href}
              className="kids-card card animate-fade-in-up"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                textAlign: 'center',
                padding: 'var(--space-8) var(--space-6)',
                borderColor: zone.bg,
                animationDelay: `${i * 80}ms`,
                display: 'block',
              }}
            >
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: 'var(--radius-2xl)',
                background: zone.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                margin: '0 auto var(--space-4)',
                transition: 'transform var(--duration-normal) var(--ease-out)',
              }}>
                {zone.icon}
              </div>
              <h5 style={{ color: zone.color, marginBottom: 'var(--space-2)' }}>{zone.title}</h5>
              <p style={{ fontSize: 'var(--text-sm)', margin: 0 }}>{zone.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
