'use client';

import Link from 'next/link';
import { speakText } from '@/lib/sound';

const fruits = [
  { name: 'Apple', emoji: '🍎', fact: 'Apples are crunchy and full of vitamins!' },
  { name: 'Banana', emoji: '🍌', fact: 'Bananas give you lots of energy and potassium!' },
  { name: 'Orange', emoji: '🍊', fact: 'Oranges are juicy and full of Vitamin C!' },
  { name: 'Strawberry', emoji: '🍓', fact: 'Strawberries are sweet berries with tiny seeds on the outside!' },
  { name: 'Watermelon', emoji: '🍉', fact: 'Watermelon is mostly water and super refreshing in summer!' },
  { name: 'Grapes', emoji: '🍇', fact: 'Grapes grow in clusters and can be green or purple!' },
  { name: 'Pineapple', emoji: '🍍', fact: 'Pineapples have a spiky outer shell and sweet yellow fruit!' },
  { name: 'Mango', emoji: '🥭', fact: 'Mango is known as the king of tropical fruits!' },
];

export default function FruitsPage() {
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
          <h2>🍎 Fruits Explorer</h2>
        </div>

        <div className="grid grid-4">
          {fruits.map((item) => (
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
              <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--accent-mint)' }}>{item.name}</h4>
              <p style={{ fontSize: 'var(--text-xs)', margin: 0 }}>{item.fact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
