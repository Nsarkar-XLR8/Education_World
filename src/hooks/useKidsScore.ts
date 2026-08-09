'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

const DEFAULT_BADGES: Badge[] = [
  { id: 'first_game', name: 'First Steps', icon: '🐣', description: 'Play your first game in Kids Zone', unlocked: true },
  { id: 'math_wiz', name: 'Math Wizard', icon: '🧙‍♂️', description: 'Score 50+ points in Math Quiz', unlocked: false },
  { id: 'snake_pro', name: 'Snake Master', icon: '🐍', description: 'Reach a score of 50+ in Snake Game', unlocked: false },
  { id: 'abc_hero', name: 'Alphabet Hero', icon: '🔤', description: 'Complete ABC Alphabet quiz', unlocked: false },
  { id: 'star_collector', name: 'Super Star', icon: '⭐', description: 'Collect 100+ total XP', unlocked: false },
];

const EVENT_NAME = 'ew_kids_score_updated';

export function useKidsScore() {
  const [xp, setXp] = useState(0);
  const [stars, setStars] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [badges, setBadges] = useState<Badge[]>(DEFAULT_BADGES);

  // Sync state from storage
  const syncState = useCallback(() => {
    try {
      const savedXp = localStorage.getItem('ew_kids_xp');
      const savedStars = localStorage.getItem('ew_kids_stars');
      const savedSound = localStorage.getItem('ew_kids_sound');
      const savedBadges = localStorage.getItem('ew_kids_badges');

      if (savedXp) setXp(parseInt(savedXp, 10));
      if (savedStars) setStars(parseInt(savedStars, 10));
      if (savedSound) setSoundEnabled(savedSound === 'true');
      if (savedBadges) setBadges(JSON.parse(savedBadges));
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Listen for real-time score events across components
  useEffect(() => {
    syncState();

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        if (typeof customEvent.detail.xp === 'number') setXp(customEvent.detail.xp);
        if (typeof customEvent.detail.stars === 'number') setStars(customEvent.detail.stars);
        if (customEvent.detail.badges) setBadges(customEvent.detail.badges);
      } else {
        syncState();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => window.removeEventListener(EVENT_NAME, handleUpdate);
  }, [syncState]);

  // Dispatch real-time update event & save to storage
  const dispatchState = useCallback((newXp: number, newStars: number, newBadges: Badge[]) => {
    try {
      localStorage.setItem('ew_kids_xp', String(newXp));
      localStorage.setItem('ew_kids_stars', String(newStars));
      localStorage.setItem('ew_kids_badges', JSON.stringify(newBadges));

      window.dispatchEvent(
        new CustomEvent(EVENT_NAME, {
          detail: { xp: newXp, stars: newStars, badges: newBadges },
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, []);

  const addXp = useCallback((amount: number) => {
    setXp((prevXp) => {
      const nextXp = prevXp + amount;
      const nextStars = Math.floor(nextXp / 10);
      setStars(nextStars);

      setBadges((prevBadges) => {
        const updated = prevBadges.map((b) => {
          if (b.id === 'star_collector' && nextXp >= 100) return { ...b, unlocked: true };
          return b;
        });
        dispatchState(nextXp, nextStars, updated);
        return updated;
      });

      return nextXp;
    });
  }, [dispatchState]);

  const unlockBadge = useCallback((badgeId: string) => {
    setBadges((prevBadges) => {
      const updated = prevBadges.map((b) => (b.id === badgeId ? { ...b, unlocked: true } : b));
      dispatchState(xp, stars, updated);
      return updated;
    });
  }, [xp, stars, dispatchState]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('ew_kids_sound', String(next));
      return next;
    });
  }, []);

  const level = Math.floor(xp / 100) + 1;
  const xpInCurrentLevel = xp % 100;

  const levelTitles = [
    'Junior Explorer 🌟',
    'Star Learner 🏆',
    'Math Wizard 🧙‍♂️',
    'Super Scholar 🎓',
    'Grand Master 👑',
  ];
  const levelTitle = levelTitles[Math.min(level - 1, levelTitles.length - 1)];

  return {
    xp,
    stars,
    level,
    levelTitle,
    xpInCurrentLevel,
    soundEnabled,
    badges,
    addXp,
    unlockBadge,
    toggleSound,
  };
}
