'use client';

import { useState, useEffect } from 'react';

interface GamePreferences {
  difficulty: 'easy' | 'intermediate' | 'advanced';
  wordLength: 2 | 3 | 4 | 5 | 6 | 7 | 8;
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    guessDistribution: { [key: number]: number };
  };
}

const defaultPreferences: GamePreferences = {
  difficulty: 'easy',
  wordLength: 3,
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  }
};

// Add migration function
function migratePreferences(prefs: any): GamePreferences {
  const migrated = { ...defaultPreferences, ...prefs };
  if (prefs.difficulty === 'advanced' || !prefs.difficulty) {
    migrated.difficulty = 'easy';
  }
  return migrated;
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<GamePreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('yoruba-word-master-preferences');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences(migratePreferences(parsed));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('yoruba-word-master-preferences', JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    }
  }, [preferences, isLoaded]);

  const updatePreference = <K extends keyof GamePreferences>(
    key: K,
    value: GamePreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const updateStatistics = (gameWon: boolean, guessCount: number) => {
    setPreferences(prev => {
      const newStats = { ...prev.statistics };
      newStats.gamesPlayed += 1;
      
      if (gameWon) {
        newStats.gamesWon += 1;
        newStats.currentStreak += 1;
        newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
        newStats.guessDistribution[guessCount] += 1;
      } else {
        newStats.currentStreak = 0;
      }
      
      return { ...prev, statistics: newStats };
    });
  };

  const resetStatistics = () => {
    updatePreference('statistics', defaultPreferences.statistics);
  };

  const resetAllPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    isLoaded,
    updatePreference,
    updateStatistics,
    resetStatistics,
    resetAllPreferences
  };
}

