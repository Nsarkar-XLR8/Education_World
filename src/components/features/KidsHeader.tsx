'use client';

import { useState } from 'react';
import { useKidsScore } from '@/hooks/useKidsScore';

export default function KidsHeader() {
  const { xp, stars, level, levelTitle, xpInCurrentLevel, soundEnabled, badges, toggleSound } = useKidsScore();
  const [showTrophies, setShowTrophies] = useState(false);

  return (
    <div style={{
      background: 'linear-gradient(135deg, var(--surface-cool) 0%, var(--surface-white) 100%)',
      border: '1px solid var(--primary-100)',
      borderRadius: 'var(--radius-2xl)',
      padding: 'var(--space-4) var(--space-6)',
      marginBottom: 'var(--space-8)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        {/* Level & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 800,
          }}>
            {level}
          </div>
          <div>
            <h5 style={{ margin: 0, color: 'var(--primary-dark)' }}>{levelTitle}</h5>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
              Level {level} Explorer
            </span>
          </div>
        </div>

        {/* XP Progress Bar */}
        <div style={{ flex: 1, maxWidth: '280px', margin: '0 var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
            <span>XP Progress</span>
            <span>{xpInCurrentLevel} / 100 XP (Total: {xp})</span>
          </div>
          <div style={{
            width: '100%',
            height: '10px',
            background: 'var(--border-light)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${xpInCurrentLevel}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--primary) 0%, var(--secondary) 100%)',
              transition: 'width 0.4s ease-out',
            }} />
          </div>
        </div>

        {/* Right Actions: Stars, Badges Modal Trigger, Sound Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            background: '#FFF9E6',
            color: '#E17055',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
          }}>
            <span>⭐</span>
            <span>{stars} Stars</span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowTrophies(true)}
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            🏆 Badges
          </button>

          <button
            className="btn btn-ghost btn-sm"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Unmute Sound FX'}
            style={{ fontSize: '18px' }}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
      </div>

      {/* Badges Trophies Modal */}
      {showTrophies && (
        <div className="modal-backdrop active" onClick={() => setShowTrophies(false)}>
          <div className="modal active" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3 style={{ margin: 0 }}>🏆 Unlocked Badges</h3>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowTrophies(false)} style={{ fontSize: '20px' }}>
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    padding: 'var(--space-4)',
                    opacity: badge.unlocked ? 1 : 0.5,
                    background: badge.unlocked ? 'var(--surface-white)' : 'var(--surface-warm)',
                  }}
                >
                  <div style={{ fontSize: '36px' }}>{badge.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <h5 style={{ margin: 0 }}>{badge.name}</h5>
                      {badge.unlocked ? (
                        <span className="badge badge-success">Unlocked</span>
                      ) : (
                        <span className="badge badge-warning">Locked</span>
                      )}
                    </div>
                    <p style={{ fontSize: 'var(--text-xs)', margin: 'var(--space-1) 0 0', color: 'var(--text-muted)' }}>
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
