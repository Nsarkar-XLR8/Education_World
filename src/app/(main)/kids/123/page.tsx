'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import KidsHeader from '@/components/features/KidsHeader';
import { useKidsScore } from '@/hooks/useKidsScore';
import { speakText, playCorrectSound, playWrongSound } from '@/lib/sound';

const numbers = Array.from({ length: 20 }, (_, i) => ({
  num: i + 1,
  word: [
    'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'
  ][i],
  emoji: ['🍎', '🎈', '⭐', '🚗', '🐱', '🐶', '🍕', '🍓', '🏀', '🍦', '🍩', '🚀', '🌺', '⚽', '🎨', '🦁', '🦆', '🥑', '🎁', '💎'][i],
}));

export default function OneTwoPage() {
  const { addXp } = useKidsScore();
  const [tab, setTab] = useState<'explore' | 'quiz'>('explore');
  const [quizTarget, setQuizTarget] = useState<typeof numbers[0] | null>(null);
  const [options, setOptions] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);

  const generateQuiz = useCallback(() => {
    const target = numbers[Math.floor(Math.random() * 10)]; // Numbers 1-10 for easy counting
    const distractors = new Set<number>();
    while (distractors.size < 3) {
      const d = Math.floor(Math.random() * 10) + 1;
      if (d !== target.num) distractors.add(d);
    }
    const opts = [target.num, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    setQuizTarget(target);
    setOptions(opts);
    speakText(`How many items do you see?`);
  }, []);

  useEffect(() => {
    if (tab === 'quiz') {
      generateQuiz();
    }
  }, [tab, generateQuiz]);

  function handleCardClick(item: typeof numbers[0]) {
    speakText(`${item.num}, ${item.word}`);
    addXp(2);
  }

  function handleQuizChoice(num: number) {
    if (!quizTarget) return;

    if (num === quizTarget.num) {
      playCorrectSound();
      speakText(`Correct! There are ${quizTarget.num} items.`);
      addXp(10);
      setQuizScore((prev) => prev + 1);
      setTimeout(generateQuiz, 1200);
    } else {
      playWrongSound();
      speakText('Try counting again!');
    }
  }

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container">
        <KidsHeader />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
          <Link href="/kids" className="btn btn-ghost btn-sm">
            ← Back to Kids Zone
          </Link>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button
              className={`btn ${tab === 'explore' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab('explore')}
            >
              🔢 Explore Numbers
            </button>
            <button
              className={`btn ${tab === 'quiz' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab('quiz')}
            >
              🎯 Counting Quiz
            </button>
          </div>
        </div>

        {tab === 'explore' ? (
          <div className="grid grid-4">
            {numbers.map((item) => (
              <button
                key={item.num}
                className="card-elevated text-center"
                onClick={() => handleCardClick(item)}
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-2xl)',
                  cursor: 'pointer',
                  border: '2px solid var(--border-light)',
                  transition: 'transform var(--duration-fast)',
                }}
              >
                <div style={{
                  fontSize: '48px',
                  fontWeight: 800,
                  color: 'var(--secondary-dark)',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {item.num}
                </div>
                <div style={{ fontSize: '32px', margin: 'var(--space-2) 0' }}>
                  {Array.from({ length: Math.min(item.num, 5) }).map((_, idx) => (
                    <span key={idx}>{item.emoji}</span>
                  ))}
                </div>
                <h5 style={{ margin: 0 }}>{item.word}</h5>
              </button>
            ))}
          </div>
        ) : (
          <div className="card-elevated text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-12)' }}>
            {quizTarget && (
              <>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
                  How many items do you count?
                </p>
                <div style={{
                  fontSize: '48px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-3)',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-8)',
                  padding: 'var(--space-6)',
                  background: 'var(--surface-cool)',
                  borderRadius: 'var(--radius-xl)',
                }}>
                  {Array.from({ length: quizTarget.num }).map((_, i) => (
                    <span key={i}>{quizTarget.emoji}</span>
                  ))}
                </div>

                <div className="grid grid-4">
                  {options.map((n) => (
                    <button
                      key={n}
                      className="btn btn-secondary btn-lg"
                      onClick={() => handleQuizChoice(n)}
                      style={{ height: '70px', fontSize: '32px', fontWeight: 800 }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-6)' }}>
                  Quiz Score: {quizScore}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
