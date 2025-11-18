// Enhanced Statistics Hook
// File: hooks/useEnhancedStatistics.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  EnhancedStatistics, 
  GameResult, 
  GameScore, 
  Achievement,
  ACHIEVEMENTS,
  calculateGameScore,
  createDefaultStatistics 
} from '../types/statistics';

const STORAGE_KEY = 'yoruba-word-master-enhanced-stats';

export function useEnhancedStatistics() {
  const [statistics, setStatistics] = useState<EnhancedStatistics>(createDefaultStatistics());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load statistics from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old data if needed
        const migrated = migrateOldStatistics(parsed);
        setStatistics(migrated);
      }
    } catch (error) {
      console.error('Failed to load enhanced statistics:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save statistics to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(statistics));
      } catch (error) {
        console.error('Failed to save enhanced statistics:', error);
      }
    }
  }, [statistics, isLoaded]);

  // Record a completed game
  const recordGameResult = useCallback((
    won: boolean,
    guessCount: number,
    word: string,
    wordLength: number,
    difficulty: 'easy' | 'intermediate' | 'advanced',
    hintsUsed: { characterHints: number; toneGuidance: number; letterReveals: number },
    timeToComplete: number,
    characterConfusions: string[] = []
  ) => {
    setStatistics(prev => {
      const newStats = { ...prev };
      
      // Calculate score
      const gameScore = calculateGameScore(
        guessCount,
        difficulty,
        wordLength,
        hintsUsed,
        prev.overall.currentStreak,
        timeToComplete
      );

      // Create game result
      const gameResult: GameResult = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: new Date(),
        won,
        guessCount,
        word,
        wordLength,
        difficulty,
        score: gameScore,
        hintsUsed,
        timeToComplete,
        characterConfusions
      };

      // Update recent games (keep last 50)
      newStats.recentGames = [gameResult, ...prev.recentGames].slice(0, 50);

      // Update overall stats
      updateGameStats(newStats.overall, gameResult);
      
      // Update difficulty-specific stats
      updateGameStats(newStats.byDifficulty[difficulty], gameResult);
      
      // Update word length-specific stats
      if (!newStats.byWordLength[wordLength]) {
        newStats.byWordLength[wordLength] = createDefaultGameStats();
      }
      updateGameStats(newStats.byWordLength[wordLength], gameResult);

      // Update learning metrics
      updateLearningMetrics(newStats.learning, gameResult);

      // Check for new achievements
      const newAchievements = checkAchievements(newStats, prev);
      newStats.achievements = [...prev.achievements, ...newAchievements];

      // Update trends
      updateTrends(newStats);

      return newStats;
    });
  }, []);

  // Update game statistics helper
  const updateGameStats = (stats: any, result: GameResult) => {
    stats.gamesPlayed += 1;
    
    if (result.won) {
      stats.gamesWon += 1;
      stats.currentStreak += 1;
      stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
      stats.guessDistribution[result.guessCount] += 1;
      
      // Update time stats
      if (stats.fastestWin === 0 || result.timeToComplete < stats.fastestWin) {
        stats.fastestWin = result.timeToComplete;
      }
    } else {
      stats.currentStreak = 0;
    }

    // Update averages
    stats.winPercentage = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
    
    if (result.won) {
      const totalGuesses = Object.entries(stats.guessDistribution)
        .reduce((sum, [guesses, count]) => sum + (parseInt(guesses) * (count as number)), 0);
      stats.averageGuesses = totalGuesses / stats.gamesWon;
      
      // Update time average (only for wins)
      const totalTime = stats.averageTime * (stats.gamesWon - 1) + result.timeToComplete;
      stats.averageTime = totalTime / stats.gamesWon;
    }

    // Update score stats
    stats.totalScore += result.score.totalScore;
    stats.averageScore = Math.round(stats.totalScore / stats.gamesPlayed);
    if (result.score.totalScore > stats.bestScore) {
      stats.bestScore = result.score.totalScore;
    }
  };

  // Update learning metrics helper
  const updateLearningMetrics = (learning: any, result: GameResult) => {
    // Track character confusions
    result.characterConfusions.forEach(confusion => {
      if (!learning.confusionPatterns[confusion]) {
        learning.confusionPatterns[confusion] = {
          occurrences: 0,
          resolved: 0,
          lastOccurred: new Date()
        };
      }
      learning.confusionPatterns[confusion].occurrences += 1;
      learning.confusionPatterns[confusion].lastOccurred = new Date();
      
      // If no character hint was used, mark as resolved
      if (result.hintsUsed.characterHints === 0) {
        learning.confusionPatterns[confusion].resolved += 1;
      }
    });

    // Track tone accuracy
    learning.toneAccuracy.attempts += 1;
    if (result.hintsUsed.toneGuidance === 0) {
      learning.toneAccuracy.correct += 1;
    }
    learning.toneAccuracy.accuracy = learning.toneAccuracy.correct / learning.toneAccuracy.attempts;

    // Track perfect games
    const totalHints = result.hintsUsed.characterHints + result.hintsUsed.toneGuidance + result.hintsUsed.letterReveals;
    if (result.won && totalHints === 0) {
      learning.perfectGames += 1;
      learning.currentPerfectStreak += 1;
      learning.longestPerfectStreak = Math.max(learning.longestPerfectStreak, learning.currentPerfectStreak);
    } else {
      learning.currentPerfectStreak = 0;
    }

    // Update character accuracy
    Array.from(result.word).forEach(char => {
      if (!learning.characterAccuracy[char]) {
        learning.characterAccuracy[char] = { attempts: 0, correct: 0, accuracy: 0 };
      }
      learning.characterAccuracy[char].attempts += 1;
      if (result.won && result.characterConfusions.length === 0) {
        learning.characterAccuracy[char].correct += 1;
      }
      learning.characterAccuracy[char].accuracy = 
        learning.characterAccuracy[char].correct / learning.characterAccuracy[char].attempts;
    });
  };

  // Check for new achievements
  const checkAchievements = (newStats: EnhancedStatistics, oldStats: EnhancedStatistics): Achievement[] => {
    const newAchievements: Achievement[] = [];
    const earnedIds = new Set(oldStats.achievements.map(a => a.id));

    ACHIEVEMENTS.forEach(achievement => {
      if (earnedIds.has(achievement.id)) return;

      let earned = false;
      const now = new Date();

      switch (achievement.id) {
        case 'first_win':
          earned = newStats.overall.gamesWon >= 1;
          break;
        case 'perfect_game':
          earned = newStats.learning.perfectGames >= 1;
          break;
        case 'streak_5':
          earned = newStats.overall.maxStreak >= 5;
          break;
        case 'streak_10':
          earned = newStats.overall.maxStreak >= 10;
          break;
        case 'one_guess_master':
          earned = newStats.overall.guessDistribution[1] >= 1;
          break;
        case 'character_master':
          const avgAccuracy = Object.values(newStats.learning.characterAccuracy)
            .reduce((sum, char) => sum + char.accuracy, 0) / 
            Object.keys(newStats.learning.characterAccuracy).length;
          earned = avgAccuracy >= 0.9 && Object.keys(newStats.learning.characterAccuracy).length >= 10;
          break;
        case 'tone_master':
          earned = newStats.learning.toneAccuracy.accuracy >= 0.85 && 
                   newStats.learning.toneAccuracy.attempts >= 20;
          break;
        case 'speedster':
          earned = newStats.overall.fastestWin > 0 && newStats.overall.fastestWin < 15000;
          break;
        case 'scholar':
          earned = newStats.overall.gamesPlayed >= 100;
          break;
        case 'high_scorer':
          earned = newStats.overall.bestScore >= 200;
          break;
      }

      if (earned) {
        newAchievements.push({ ...achievement, unlockedAt: now });
      }
    });

    return newAchievements;
  };

  // Update trends helper
  const updateTrends = (stats: EnhancedStatistics) => {
    const recentGames = stats.recentGames.slice(0, 10);
    if (recentGames.length >= 5) {
      const recentWins = recentGames.filter(g => g.won).length;
      const recentWinRate = recentWins / recentGames.length;
      stats.trends.winRateChange = recentWinRate - (stats.overall.winPercentage / 100);

      const recentAvgScore = recentGames.reduce((sum, g) => sum + g.score.totalScore, 0) / recentGames.length;
      stats.trends.scoreChange = recentAvgScore - stats.overall.averageScore;

      // Learning progress based on recent perfect games and hint usage
      const recentPerfectGames = recentGames.filter(g => 
        g.won && (g.hintsUsed.characterHints + g.hintsUsed.toneGuidance + g.hintsUsed.letterReveals) === 0
      ).length;
      stats.trends.learningProgress = recentPerfectGames / recentGames.length;
    }
  };

  // Create default game stats
  const createDefaultGameStats = () => ({
    gamesPlayed: 0,
    gamesWon: 0,
    winPercentage: 0,
    currentStreak: 0,
    maxStreak: 0,
    averageGuesses: 0,
    averageScore: 0,
    totalScore: 0,
    bestScore: 0,
    guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
    averageTime: 0,
    fastestWin: 0
  });

  // Migrate old statistics format
  const migrateOldStatistics = (oldStats: any): EnhancedStatistics => {
    if (oldStats.overall) {
      return oldStats; // Already new format
    }

    // Migrate from old usePreferences format
    const newStats = createDefaultStatistics();
    if (oldStats.gamesPlayed) {
      newStats.overall.gamesPlayed = oldStats.gamesPlayed;
      newStats.overall.gamesWon = oldStats.gamesWon;
      newStats.overall.currentStreak = oldStats.currentStreak;
      newStats.overall.maxStreak = oldStats.maxStreak;
      newStats.overall.guessDistribution = oldStats.guessDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
      newStats.overall.winPercentage = oldStats.gamesPlayed > 0 ? 
        Math.round((oldStats.gamesWon / oldStats.gamesPlayed) * 100) : 0;
    }
    return newStats;
  };

  // Reset statistics
  const resetStatistics = useCallback(() => {
    setStatistics(createDefaultStatistics());
  }, []);

  // Get statistics summary for display
  const getStatisticsSummary = useCallback(() => {
    return {
      gamesPlayed: statistics.overall.gamesPlayed,
      winPercentage: statistics.overall.winPercentage,
      currentStreak: statistics.overall.currentStreak,
      bestStreak: statistics.overall.maxStreak,
      averageScore: statistics.overall.averageScore,
      bestScore: statistics.overall.bestScore,
      perfectGames: statistics.learning.perfectGames,
      achievements: statistics.achievements.length
    };
  }, [statistics]);

  return {
    statistics,
    isLoaded,
    recordGameResult,
    resetStatistics,
    getStatisticsSummary
  };
}

