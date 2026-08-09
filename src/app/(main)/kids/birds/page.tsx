'use client';

import Link from 'next/link';
import { speakText } from '@/lib/sound';

const birds = [
  { name: 'Eagle', emoji: '🦅', fact: 'Eagles have sharp eyesight to spot prey from far away!' },
  { name: 'Parrot', emoji: '🦜', fact: 'Parrots can mimic human words and voices!' },
  { name: 'Penguin', emoji: '🐧', fact: 'Penguins are birds that swim in icy waters but cannot fly!' },
  { name: 'Owl', emoji: '🦉', fact: 'Owls are active at night and can turn their heads almost all the way around!' },
  { name: 'Flamingo', emoji: '🦩', fact: 'Flamingos are pink because of the shrimp they eat!' },
  { name: 'Peacock', emoji: '🦚', fact: 'Peacocks have beautiful colorful tail feathers!' },
  { name: 'Swan', emoji: '🦢', fact: 'Swans are graceful water birds that float on lakes!' },
  { name: 'Hummingbird', emoji: '🐦', fact: 'Hummingbirds fly very fast and can hover in place!' },
];

export default function BirdsPage() {
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
          <h2>🦅 Birds Explorer</h2>
        </div>

        <div className="grid grid-4">
          {birds.map((item) => (
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
              <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--accent-sky)' }}>{item.name}</h4>
              <p style={{ fontSize: 'var(--text-xs)', margin: 0 }}>{item.fact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
