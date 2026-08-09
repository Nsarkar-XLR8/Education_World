'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import KidsHeader from '@/components/features/KidsHeader';
import { useKidsScore } from '@/hooks/useKidsScore';
import { speakText, playCorrectSound, playWrongSound } from '@/lib/sound';

const alphabet = [
  { letter: 'A', word: 'Apple', emoji: '🍎' },
  { letter: 'B', word: 'Ball', emoji: '⚽' },
  { letter: 'C', word: 'Cat', emoji: '🐱' },
  { letter: 'D', word: 'Dog', emoji: '🐶' },
  { letter: 'E', word: 'Elephant', emoji: '🐘' },
  { letter: 'F', word: 'Fish', emoji: '🐟' },
  { letter: 'G', word: 'Giraffe', emoji: '🦒' },
  { letter: 'H', word: 'House', emoji: '🏠' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦' },
  { letter: 'J', word: 'Juice', emoji: '🧃' },
  { letter: 'K', word: 'Kite', emoji: '🪁' },
  { letter: 'L', word: 'Lion', emoji: '🦁' },
  { letter: 'M', word: 'Monkey', emoji: '🐒' },
  { letter: 'N', word: 'Nest', emoji: '🪹' },
  { letter: 'O', word: 'Orange', emoji: '🍊' },
  { letter: 'P', word: 'Penguin', emoji: '🐧' },
  { letter: 'Q', word: 'Queen', emoji: '👑' },
  { letter: 'R', word: 'Rabbit', emoji: '🐰' },
  { letter: 'S', word: 'Sun', emoji: '☀️' },
  { letter: 'T', word: 'Tiger', emoji: '🐯' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️' },
  { letter: 'V', word: 'Violin', emoji: '🎻' },
  { letter: 'W', word: 'Watermelon', emoji: '🍉' },
  { letter: 'X', word: 'Xylophone', emoji: '🎼' },
  { letter: 'Y', word: 'Yacht', emoji: '⛵' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓' },
];

export default function AbcPage() {
  const { addXp, unlockBadge } = useKidsScore();
  const [tab, setTab] = useState<'explore' | 'quiz'>('explore');
  const [quizTarget, setQuizTarget] = useState<typeof alphabet[0] | null>(null);
  const [options, setOptions] = useState<typeof alphabet[0][]>([]);
  const [quizScore, setQuizScore] = useState(0);

  const generateQuiz = useCallback(() => {
    const target = alphabet[Math.floor(Math.random() * alphabet.length)];
    const distractors = new Set<typeof alphabet[0]>();
    while (distractors.size < 3) {
      const d = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (d.letter !== target.letter) distractors.add(d);
    }
    const opts = [target, ...Array.from(distractors)].sort(() => Math.random() - 0.5);
    setQuizTarget(target);
    setOptions(opts);
    speakText(`Which one is letter ${target.letter}?`);
  }, []);

  useEffect(() => {
    if (tab === 'quiz') {
      generateQuiz();
    }
  }, [tab, generateQuiz]);

  function handleCardClick(item: typeof alphabet[0]) {
    speakText(`${item.letter} for ${item.word}`);
    addXp(2);
  }

  function handleQuizChoice(item: typeof alphabet[0]) {
    if (!quizTarget) return;

    if (item.letter === quizTarget.letter) {
      playCorrectSound();
      speakText('Great job! That is correct!');
      addXp(10);
      setQuizScore((prev) => {
        const next = prev + 1;
        if (next >= 5) unlockBadge('abc_hero');
        return next;
      });
      setTimeout(generateQuiz, 1200);
    } else {
      playWrongSound();
      speakText('Try again!');
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
              🔤 Explore Letters
            </button>
            <button
              className={`btn ${tab === 'quiz' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setTab('quiz')}
            >
              🎯 Letter Quiz Game
            </button>
          </div>
        </div>

        {tab === 'explore' ? (
          <div className="grid grid-4">
            {alphabet.map((item) => (
              <button
                key={item.letter}
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
                  color: 'var(--primary)',
                  fontFamily: 'var(--font-heading)',
                }}>
                  {item.letter}
                </div>
                <div style={{ fontSize: '36px', margin: 'var(--space-2) 0' }}>{item.emoji}</div>
                <h5 style={{ margin: 0 }}>{item.word}</h5>
              </button>
            ))}
          </div>
        ) : (
          <div className="card-elevated text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-12)' }}>
            {quizTarget && (
              <>
                <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
                  Find the Letter:
                </p>
                <h1 style={{ fontSize: '96px', color: 'var(--primary)', margin: '0 0 var(--space-8)' }}>
                  {quizTarget.letter}
                </h1>

                <div className="grid grid-2">
                  {options.map((opt) => (
                    <button
                      key={opt.letter}
                      className="btn btn-secondary btn-lg"
                      onClick={() => handleQuizChoice(opt)}
                      style={{
                        height: '100px',
                        fontSize: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--space-4)',
                      }}
                    >
                      <span>{opt.emoji}</span>
                      <span>{opt.word}</span>
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
