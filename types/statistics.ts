// Enhanced Statistics System for Yorùbá Word Master
// File: types/statistics.ts

export interface GameScore {
  basePoints: number;
  difficultyMultiplier: number;
  bonusPoints: number;
  penaltyPoints: number;
  totalScore: number;
  breakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  guessCount: number;
  hintsUsed: {
    characterHints: number;
    toneGuidance: number;
    letterReveals: number;
  };
  streakBonus: number;
  perfectGame: boolean; // No hints used
}

export interface GameResult {
  id: string;
  timestamp: Date;
  won: boolean;
  guessCount: number;
  word: string;
  wordLength: number;
  difficulty: 'easy' | 'intermediate' | 'advanced';
  score: GameScore;
  hintsUsed: {
    characterHints: number;
    toneGuidance: number;
    letterReveals: number;
  };
  timeToComplete: number; // milliseconds
  characterConfusions: string[]; // e.g., ['e→ẹ', 'o→ọ']
}

export interface LearningMetrics {
  // Character mastery tracking
  characterAccuracy: {
    [char: string]: {
      attempts: number;
      correct: number;
      accuracy: number;
    };
  };
  
  // Common confusions and improvement
  confusionPatterns: {
    [pattern: string]: {
      occurrences: number;
      resolved: number;
      lastOccurred: Date;
    };
  };
  
  // Tone accuracy
  toneAccuracy: {
    attempts: number;
    correct: number;
    accuracy: number;
    improvementTrend: number; // -1 to 1, negative = declining
  };
  
  // Learning streaks
  perfectGames: number; // Games with no hints
  longestPerfectStreak: number;
  currentPerfectStreak: number;
}

export interface DifficultyStats {
  easy: GameStats;
  intermediate: GameStats;
  advanced: GameStats;
}

export interface WordLengthStats {
  [length: number]: GameStats; // 2-7 letters
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  winPercentage: number;
  currentStreak: number;
  maxStreak: number;
  averageGuesses: number;
  averageScore: number;
  totalScore: number;
  bestScore: number;
  guessDistribution: { [guesses: number]: number };
  averageTime: number; // milliseconds
  fastestWin: number; // milliseconds
}

export interface EnhancedStatistics {
  // Overall performance
  overall: GameStats;
  
  // Performance by difficulty
  byDifficulty: DifficultyStats;
  
  // Performance by word length
  byWordLength: WordLengthStats;
  
  // Educational metrics
  learning: LearningMetrics;
  
  // Recent games (last 50)
  recentGames: GameResult[];
  
  // Achievements
  achievements: Achievement[];
  
  // Performance trends
  trends: {
    winRateChange: number; // Change over last 10 games
    scoreChange: number; // Score improvement trend
    learningProgress: number; // Overall learning improvement
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  progress?: number; // 0-100 for partial achievements
  target?: number; // Target value for achievement
}

// Scoring constants
export const SCORING_CONFIG = {
  BASE_POINTS: {
    1: 100, // Perfect guess
    2: 90,  // Excellent
    3: 80,  // Very good
    4: 70,  // Good
    5: 60,  // Fair
    6: 50   // Just made it
  },
  
  DIFFICULTY_MULTIPLIERS: {
    easy: 1.0,
    intermediate: 1.5,
    advanced: 2.0
  },
  
  BONUSES: {
    NO_HINTS: 15,           // Perfect game bonus
    STREAK_PER_GAME: 2,     // Per consecutive win (max 50)
    FIRST_TRY: 25,          // Additional bonus for 1-guess win
    SPEED_BONUS_MAX: 10     // Time-based bonus (< 30 seconds)
  },
  
  PENALTIES: {
    CHARACTER_HINT: -5,     // Used character confusion help
    TONE_GUIDANCE: -3,      // Used tone guidance
    LETTER_REVEAL: -10      // Revealed a letter
  },
  
  WORD_LENGTH_MULTIPLIERS: {
    2: 0.8,
    3: 0.9,
    4: 1.0,
    5: 1.1,
    6: 1.2,
    7: 1.3
  }
} as const;

// Helper functions for score calculation
export function calculateGameScore(
  guessCount: number,
  difficulty: 'easy' | 'intermediate' | 'advanced',
  wordLength: number,
  hintsUsed: { characterHints: number; toneGuidance: number; letterReveals: number },
  currentStreak: number,
  timeToComplete: number
): GameScore {
  const basePoints = SCORING_CONFIG.BASE_POINTS[guessCount as keyof typeof SCORING_CONFIG.BASE_POINTS] || 0;
  const difficultyMultiplier = SCORING_CONFIG.DIFFICULTY_MULTIPLIERS[difficulty];
  const lengthMultiplier = SCORING_CONFIG.WORD_LENGTH_MULTIPLIERS[wordLength as keyof typeof SCORING_CONFIG.WORD_LENGTH_MULTIPLIERS] || 1.0;
  
  // Calculate bonuses
  let bonusPoints = 0;
  const totalHints = hintsUsed.characterHints + hintsUsed.toneGuidance + hintsUsed.letterReveals;
  
  if (totalHints === 0) {
    bonusPoints += SCORING_CONFIG.BONUSES.NO_HINTS;
  }
  
  if (guessCount === 1) {
    bonusPoints += SCORING_CONFIG.BONUSES.FIRST_TRY;
  }
  
  // Streak bonus (max 50 points)
  const streakBonus = Math.min(currentStreak * SCORING_CONFIG.BONUSES.STREAK_PER_GAME, 50);
  bonusPoints += streakBonus;
  
  // Speed bonus (for games completed in under 30 seconds)
  if (timeToComplete < 30000) {
    const speedBonus = Math.round((30000 - timeToComplete) / 30000 * SCORING_CONFIG.BONUSES.SPEED_BONUS_MAX);
    bonusPoints += speedBonus;
  }
  
  // Calculate penalties
  const penaltyPoints = 
    (hintsUsed.characterHints * SCORING_CONFIG.PENALTIES.CHARACTER_HINT) +
    (hintsUsed.toneGuidance * SCORING_CONFIG.PENALTIES.TONE_GUIDANCE) +
    (hintsUsed.letterReveals * SCORING_CONFIG.PENALTIES.LETTER_REVEAL);
  
  // Final calculation
  const adjustedBase = Math.round(basePoints * difficultyMultiplier * lengthMultiplier);
  const totalScore = Math.max(0, adjustedBase + bonusPoints + penaltyPoints);
  
  return {
    basePoints: adjustedBase,
    difficultyMultiplier,
    bonusPoints,
    penaltyPoints,
    totalScore,
    breakdown: {
      guessCount,
      hintsUsed,
      streakBonus,
      perfectGame: totalHints === 0
    }
  };
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    name: 'First Victory',
    description: 'Win your first game',
    icon: '🎉'
  },
  {
    id: 'perfect_game',
    name: 'Flawless',
    description: 'Win a game without using any hints',
    icon: '✨'
  },
  {
    id: 'streak_5',
    name: 'On Fire',
    description: 'Win 5 games in a row',
    icon: '🔥'
  },
  {
    id: 'streak_10',
    name: 'Unstoppable',
    description: 'Win 10 games in a row',
    icon: '⚡'
  },
  {
    id: 'one_guess_master',
    name: 'Psychic',
    description: 'Guess the word on the first try',
    icon: '🔮'
  },
  {
    id: 'character_master',
    name: 'Character Expert',
    description: 'Master all Yorùbá characters (90% accuracy)',
    icon: '📚'
  },
  {
    id: 'tone_master',
    name: 'Tone Master',
    description: 'Achieve 85% tone accuracy over 20 games',
    icon: '🎵'
  },
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Win a game in under 15 seconds',
    icon: '💨'
  },
  {
    id: 'scholar',
    name: 'Yorùbá Scholar',
    description: 'Play 100 games',
    icon: '🎓'
  },
  {
    id: 'high_scorer',
    name: 'High Scorer',
    description: 'Score over 200 points in a single game',
    icon: '🏆'
  }
];

// Default statistics structure
export const createDefaultStatistics = (): EnhancedStatistics => ({
  overall: {
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
  },
  
  byDifficulty: {
    easy: {
      gamesPlayed: 0, gamesWon: 0, winPercentage: 0, currentStreak: 0, maxStreak: 0,
      averageGuesses: 0, averageScore: 0, totalScore: 0, bestScore: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      averageTime: 0, fastestWin: 0
    },
    intermediate: {
      gamesPlayed: 0, gamesWon: 0, winPercentage: 0, currentStreak: 0, maxStreak: 0,
      averageGuesses: 0, averageScore: 0, totalScore: 0, bestScore: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      averageTime: 0, fastestWin: 0
    },
    advanced: {
      gamesPlayed: 0, gamesWon: 0, winPercentage: 0, currentStreak: 0, maxStreak: 0,
      averageGuesses: 0, averageScore: 0, totalScore: 0, bestScore: 0,
      guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      averageTime: 0, fastestWin: 0
    }
  },
  
  byWordLength: {},
  
  learning: {
    characterAccuracy: {},
    confusionPatterns: {},
    toneAccuracy: {
      attempts: 0,
      correct: 0,
      accuracy: 0,
      improvementTrend: 0
    },
    perfectGames: 0,
    longestPerfectStreak: 0,
    currentPerfectStreak: 0
  },
  
  recentGames: [],
  achievements: [],
  
  trends: {
    winRateChange: 0,
    scoreChange: 0,
    learningProgress: 0
  }
});

