'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import KidsHeader from '@/components/features/KidsHeader';
import { useKidsScore } from '@/hooks/useKidsScore';
import { playFoodSound, playWrongSound, initAudio } from '@/lib/sound';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type SpeedMode = 'slow' | 'normal' | 'turbo';

interface Position {
  x: number;
  y: number;
  isGolden?: boolean;
}

export default function SnakeGamePage() {
  const { addXp, unlockBadge } = useKidsScore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef<Direction>('RIGHT');
  const snakeRef = useRef<Position[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const foodRef = useRef<Position>({ x: 12, y: 10, isGolden: false });
  const gridSize = 20; // 20px per cell
  const cols = 25; // 500px width
  const rows = 20; // 400px height

  useEffect(() => {
    const saved = localStorage.getItem('ew_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnFood = useCallback((): Position => {
    const isGolden = Math.random() < 0.2; // 20% chance for golden apple
    return {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
      isGolden,
    };
  }, [cols, rows]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FAFAF7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#F0EDE8';
    ctx.lineWidth = 1;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridSize, 0);
      ctx.lineTo(i * gridSize, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * gridSize);
      ctx.lineTo(canvas.width, j * gridSize);
      ctx.stroke();
    }

    // Draw Food (Golden or Red)
    ctx.fillStyle = foodRef.current.isGolden ? '#FDCB6E' : '#FF7675';
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * gridSize + gridSize / 2,
      foodRef.current.y * gridSize + gridSize / 2,
      gridSize / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    snakeRef.current.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#6C5CE7' : '#A29BFE';
      ctx.fillRect(
        segment.x * gridSize + 1,
        segment.y * gridSize + 1,
        gridSize - 2,
        gridSize - 2
      );
    });
  }, [cols, rows]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const startGame = useCallback(() => {
    initAudio();
    snakeRef.current = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    directionRef.current = 'RIGHT';
    foodRef.current = spawnFood();
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
  }, [spawnFood]);

  const speedInterval = speedMode === 'slow' ? 160 : speedMode === 'turbo' ? 65 : 100;

  // Main Loop
  useEffect(() => {
    if (!isPlaying || isPaused || gameOver) return;

    const interval = setInterval(() => {
      const head = { ...snakeRef.current[0] };
      const dir = directionRef.current;

      if (dir === 'UP') head.y -= 1;
      if (dir === 'DOWN') head.y += 1;
      if (dir === 'LEFT') head.x -= 1;
      if (dir === 'RIGHT') head.x += 1;

      if (head.x >= cols) head.x = 0;
      if (head.x < 0) head.x = cols - 1;
      if (head.y >= rows) head.y = 0;
      if (head.y < 0) head.y = rows - 1;

      const selfCollision = snakeRef.current.some((seg, idx) => idx !== 0 && seg.x === head.x && seg.y === head.y);
      if (selfCollision) {
        playWrongSound();
        setGameOver(true);
        setIsPlaying(false);
        return;
      }

      const newSnake = [head, ...snakeRef.current];

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        playFoodSound();
        const pts = foodRef.current.isGolden ? 25 : 10;
        addXp(pts);

        setScore((prev) => {
          const next = prev + pts;
          if (next >= 50) unlockBadge('snake_pro');
          if (next > highScore) {
            setHighScore(next);
            localStorage.setItem('ew_snake_highscore', String(next));
          }
          return next;
        });

        foodRef.current = spawnFood();
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
      drawCanvas();
    }, speedInterval);

    return () => clearInterval(interval);
  }, [isPlaying, isPaused, gameOver, cols, rows, highScore, speedInterval, spawnFood, drawCanvas, addXp, unlockBadge]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const dir = directionRef.current;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (isPlaying && !gameOver) {
          setIsPaused((prev) => !prev);
        }
        return;
      }

      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && dir !== 'DOWN') directionRef.current = 'UP';
      if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && dir !== 'UP') directionRef.current = 'DOWN';
      if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && dir !== 'RIGHT') directionRef.current = 'LEFT';
      if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && dir !== 'RIGHT') directionRef.current = 'RIGHT';
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  const changeDirection = (newDir: Direction) => {
    initAudio();
    const dir = directionRef.current;
    if (newDir === 'UP' && dir !== 'DOWN') directionRef.current = 'UP';
    if (newDir === 'DOWN' && dir !== 'UP') directionRef.current = 'DOWN';
    if (newDir === 'LEFT' && dir !== 'RIGHT') directionRef.current = 'LEFT';
    if (newDir === 'RIGHT' && dir !== 'LEFT') directionRef.current = 'RIGHT';
  };

  return (
    <div className="section" style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        {/* Kids Header */}
        <KidsHeader />

        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <Link href="/kids" className="btn btn-ghost btn-sm">
            ← Back to Kids Zone
          </Link>
          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-lg)', fontWeight: 700 }}>
            <span>🍎 Score: <span className="text-gradient">{score}</span></span>
            <span>🏆 High: <span style={{ color: 'var(--accent-warm)' }}>{highScore}</span></span>
          </div>
        </div>

        {/* Speed Controls */}
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', justifyContent: 'center' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, alignSelf: 'center', marginRight: 'var(--space-2)' }}>Speed:</span>
          {(['slow', 'normal', 'turbo'] as SpeedMode[]).map((s) => (
            <button
              key={s}
              className={`btn ${speedMode === s ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setSpeedMode(s)}
              style={{ textTransform: 'capitalize' }}
            >
              {s === 'slow' && '🐢 Slow'}
              {s === 'normal' && '🐍 Normal'}
              {s === 'turbo' && '⚡ Turbo'}
            </button>
          ))}
        </div>

        {/* Canvas & Overlay Card */}
        <div className="card-elevated text-center" style={{ padding: 'var(--space-6)', position: 'relative' }}>
          <canvas
            ref={canvasRef}
            width={500}
            height={400}
            style={{
              borderRadius: 'var(--radius-xl)',
              border: '2px solid var(--border)',
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              background: 'var(--surface-cream)',
            }}
          />

          {isPlaying && isPaused && (
            <div style={{
              position: 'absolute',
              top: 'var(--space-8)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(45, 52, 54, 0.85)',
              color: 'white',
              padding: 'var(--space-2) var(--space-6)',
              borderRadius: 'var(--radius-full)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
            }}>
              PAUSED — Press Space to Resume
            </div>
          )}

          {(!isPlaying || gameOver) && (
            <div style={{
              position: 'absolute',
              inset: 'var(--space-6)',
              background: 'rgba(255, 255, 255, 0.92)',
              backdropFilter: 'blur(4px)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--space-4)',
            }}>
              <div style={{ fontSize: '64px' }}>{gameOver ? '💥' : '🐍'}</div>
              <h3>{gameOver ? 'Game Over!' : 'Snake Game'}</h3>
              {gameOver && <p style={{ fontSize: 'var(--text-lg)', fontWeight: 600 }}>Your Score: {score}</p>}
              <button className="btn btn-primary btn-lg" onClick={startGame}>
                {gameOver ? 'Play Again' : 'Start Game'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile On-Screen D-Pad */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-6)' }}>
          <button className="btn btn-secondary btn-icon" onClick={() => changeDirection('UP')} style={{ width: '56px', height: '56px', fontSize: '20px' }}>⬆️</button>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <button className="btn btn-secondary btn-icon" onClick={() => changeDirection('LEFT')} style={{ width: '56px', height: '56px', fontSize: '20px' }}>⬅️</button>
            <button className="btn btn-secondary btn-icon" onClick={() => changeDirection('RIGHT')} style={{ width: '56px', height: '56px', fontSize: '20px' }}>➡️</button>
          </div>
          <button className="btn btn-secondary btn-icon" onClick={() => changeDirection('DOWN')} style={{ width: '56px', height: '56px', fontSize: '20px' }}>⬇️</button>
        </div>
      </div>
    </div>
  );
}
