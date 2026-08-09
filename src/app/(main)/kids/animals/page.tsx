'use client';

import Link from 'next/link';
import { speakText } from '@/lib/sound';

const animals = [
  { name: 'Lion', emoji: '🦁', fact: 'The lion is known as the king of the jungle!' },
  { name: 'Tiger', emoji: '🐯', fact: 'Tigers are the largest wild cats in the world!' },
  { name: 'Elephant', emoji: '🐘', fact: 'Elephants are the largest land animals on Earth!' },
  { name: 'Giraffe', emoji: '🦒', fact: 'Giraffes have very long necks to reach tall trees!' },
  { name: 'Monkey', emoji: '🐒', fact: 'Monkeys love climbing trees and eating bananas!' },
  { name: 'Zebra', emoji: '🦓', fact: 'Every zebra has a unique pattern of black and white stripes!' },
  { name: 'Bear', emoji: '🐻', fact: 'Bears have an excellent sense of smell!' },
  { name: 'Panda', emoji: '🐼', fact: 'Pandas eat bamboo leaves all day long!' },
];

export default function AnimalsPage() {
  function handlePlay(name: string, fact: string) {
    speakText(`${name}. ${fact}`);
  }

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <Link href="/kids" className="btn btn-ghost btn-sm">
            ← Back to Kids Zone
          </Link>
          <h2>🦁 Animals Explorer</h2>
        </div>

        <div className="grid grid-4">
          {animals.map((item) => (
            <div
              key={item.name}
              className="card-elevated text-center"
              onClick={() => handlePlay(item.name, item.fact)}
              style={{
                padding: 'var(--space-6)',
                borderRadius: 'var(--radius-2xl)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: 'var(--space-2)' }}>{item.emoji}</div>
              <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--accent-coral)' }}>{item.name}</h4>
              <p style={{ fontSize: 'var(--text-xs)', margin: 0 }}>{item.fact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
