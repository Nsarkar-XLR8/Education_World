'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import KidsHeader from '@/components/features/KidsHeader';
import { useKidsScore } from '@/hooks/useKidsScore';
import { playCorrectSound, playWrongSound, initAudio } from '@/lib/sound';

type Mode = 'add' | 'subtract' | 'multiply' | 'divide';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Problem {
  num1: number;
  num2: number;
  operator: string;
  answer: number;
  options: number[];
}

export default function MathGamePage() {
  const { addXp, unlockBadge } = useKidsScore();
  const [mode, setMode] = useState<Mode>('add');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [problem, setProblem] = useState<Problem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const generateProblem = useCallback((currentMode: Mode, currentDiff: Difficulty): Problem => {
    let max = 10;
    if (currentDiff === 'medium') max = 30;
    if (currentDiff === 'hard') max = 100;

    let num1 = 0;
    let num2 = 0;
    let answer = 0;
    let operator = '+';

    switch (currentMode) {
      case 'add':
        num1 = Math.floor(Math.random() * max) + 1;
        num2 = Math.floor(Math.random() * max) + 1;
        answer = num1 + num2;
        operator = '+';
        break;

      case 'subtract':
        num1 = Math.floor(Math.random() * max) + 5;
        num2 = Math.floor(Math.random() * num1) + 1;
        answer = num1 - num2;
        operator = '-';
        break;

      case 'multiply':
        num1 = Math.floor(Math.random() * (currentDiff === 'easy' ? 6 : 12)) + 1;
        num2 = Math.floor(Math.random() * (currentDiff === 'easy' ? 6 : 12)) + 1;
        answer = num1 * num2;
        operator = '×';
        break;

      case 'divide':
        num2 = Math.floor(Math.random() * 9) + 1;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
        operator = '÷';
        break;
    }

    // Generate 2 unique distractor options
    const distractors = new Set<number>();
    while (distractors.size < 2) {
      const offset = (Math.floor(Math.random() * 5) + 1) * (Math.random() > 0.5 ? 1 : -1);
      const wrong = Math.max(0, answer + offset);
      if (wrong !== answer) distractors.add(wrong);
    }

    const options = [answer, ...Array.from(distractors)].sort(() => Math.random() - 0.5);

    return { num1, num2, operator, answer, options };
  }, []);

  useEffect(() => {
    setProblem(generateProblem(mode, difficulty));
  }, [mode, difficulty, generateProblem]);

  const resetGame = useCallback(() => {
    setScore(0);
    setStreak(0);
    setHearts(3);
    setGameOver(false);
    setFeedback(null);
    setProblem(generateProblem(mode, difficulty));
  }, [mode, difficulty, generateProblem]);

  const handleSelect = useCallback((selected: number) => {
    initAudio();
    if (!problem || feedback !== null || gameOver) return;

    if (selected === problem.answer) {
      playCorrectSound();
      setFeedback('correct');
      setScore((prev) => {
        const next = prev + 10;
        if (next >= 50) unlockBadge('math_wiz');
        return next;
      });
      setStreak((prev) => {
        const next = prev + 1;
        if (next % 5 === 0) addXp(50); // Bonus XP for 5-streak
        return next;
      });
      addXp(15);

      setTimeout(() => {
        setFeedback(null);
        setProblem(generateProblem(mode, difficulty));
      }, 400);
    } else {
      playWrongSound();
      setFeedback('wrong');
      setStreak(0);

      setHearts((prevHearts) => {
        const nextHearts = prevHearts - 1;
        if (nextHearts <= 0) {
          setGameOver(true);
        }
        return nextHearts;
      });

      setTimeout(() => {
        setFeedback(null);
      }, 400);
    }
  }, [problem, feedback, gameOver, mode, difficulty, generateProblem, addXp, unlockBadge]);

  // Keyboard Shortcuts (1, 2, 3)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!problem || gameOver) return;
      if (e.key === '1' || e.key === 'Numpad1') {
        handleSelect(problem.options[0]);
      } else if (e.key === '2' || e.key === 'Numpad2') {
        handleSelect(problem.options[1]);
      } else if (e.key === '3' || e.key === 'Numpad3') {
        handleSelect(problem.options[2]);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [problem, gameOver, handleSelect]);

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Persistent Gamified Kids Header */}
        <KidsHeader />

        {/* Back Link & Heart Lives */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <Link href="/kids" className="btn btn-ghost btn-sm">
            ← Back to Kids Zone
          </Link>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 700, alignItems: 'center' }}>
            <div>
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} style={{ opacity: i < hearts ? 1 : 0.25, fontSize: '24px' }}>❤️</span>
              ))}
            </div>
            <span>⭐ Score: <span className="text-gradient">{score}</span></span>
            <span>🔥 Streak: <span style={{ color: 'var(--accent-coral)' }}>{streak}</span></span>
          </div>
        </div>

        {/* Difficulty Bar & Mode Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          {/* Modes */}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['add', 'subtract', 'multiply', 'divide'] as Mode[]).map((m) => (
              <button
                key={m}
                className={`btn ${mode === m ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => { setMode(m); setFeedback(null); }}
              >
                {m === 'add' && '➕ Add'}
                {m === 'subtract' && '➖ Sub'}
                {m === 'multiply' && '✖️ Mul'}
                {m === 'divide' && '➗ Div'}
              </button>
            ))}
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
              <button
                key={d}
                className={`btn ${difficulty === d ? 'btn-success' : 'btn-ghost'} btn-sm`}
                onClick={() => { setDifficulty(d); setFeedback(null); }}
                style={{ textTransform: 'capitalize' }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Main Quiz Card or Game Over Screen */}
        {gameOver ? (
          <div className="card-elevated text-center" style={{ padding: 'var(--space-12)', borderRadius: 'var(--radius-2xl)' }}>
            <div style={{ fontSize: '64px', marginBottom: 'var(--space-4)' }}>💔</div>
            <h2>Out of Hearts!</h2>
            <p style={{ fontSize: 'var(--text-lg)', marginBottom: 'var(--space-6)' }}>
              Final Score: <strong className="text-gradient">{score} Points</strong>
            </p>
            <button className="btn btn-primary btn-lg" onClick={resetGame}>
              🔄 Try Again
            </button>
          </div>
        ) : problem ? (
          <div
            className="card-elevated text-center"
            style={{
              padding: 'var(--space-12) var(--space-8)',
              borderRadius: 'var(--radius-2xl)',
              background: feedback === 'correct'
                ? '#E6FFF5'
                : feedback === 'wrong'
                ? '#FFE6E6'
                : 'var(--surface-white)',
              transition: 'background var(--duration-normal)',
            }}
          >
            {/* Equation Display */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
              fontSize: '64px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-10)',
            }}>
              <span style={{ color: 'var(--primary)' }}>{problem.num1}</span>
              <span style={{ color: 'var(--secondary-dark)' }}>{problem.operator}</span>
              <span style={{ color: 'var(--accent-warm)' }}>{problem.num2}</span>
              <span>=</span>
              <span style={{ color: 'var(--text-muted)' }}>?</span>
            </div>

            {/* Answer Options */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
              {problem.options.map((opt, i) => (
                <button
                  key={i}
                  className="btn btn-secondary btn-lg"
                  onClick={() => handleSelect(opt)}
                  style={{
                    height: '80px',
                    fontSize: 'var(--text-3xl)',
                    fontWeight: 800,
                    borderRadius: 'var(--radius-xl)',
                    borderColor: 'var(--border)',
                    position: 'relative',
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: 'var(--space-2)',
                    left: 'var(--space-3)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                  }}>
                    [{i + 1}]
                  </span>
                  {opt}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-6)', marginBottom: 0 }}>
              Tip: Press 1, 2, or 3 on your keyboard to answer fast!
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
