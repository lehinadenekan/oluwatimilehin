// Perfect 10/10 Statistics Display Component
// File: components/word-master/EnhancedStatisticsDisplay.tsx

'use client';

import { useState } from 'react';
import { X, Trophy, TrendingUp, Calculator, Target, Zap, Award, Star, Lightbulb } from 'lucide-react';
import { useEnhancedStatistics } from '../../hooks/useEnhancedStatistics';
import { SCORING_CONFIG } from '../../types/statistics';

interface EnhancedStatisticsDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'progress' | 'scoring';

export default function EnhancedStatisticsDisplay({ isOpen, onClose }: EnhancedStatisticsDisplayProps) {
  const { statistics, resetStatistics } = useEnhancedStatistics();
  const [activeTab, setActiveTab] = useState<TabType>('progress');

  if (!isOpen) return null;

  const { overall, learning } = statistics;

  // Calculate achievement progress
  const achievementProgress = calculateAchievementProgress(statistics);
  
  // Get top 3 character confusions
  const topConfusions = Object.entries(learning.confusionPatterns)
    .sort(([, a], [, b]) => b.occurrences - a.occurrences)
    .slice(0, 3)
    .filter(([, stats]) => stats.occurrences > 0);

  // Calculate next milestone
  const nextMilestone = getNextMilestone(overall);

  const tabs = [
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'scoring', label: 'Scoring', icon: Calculator }
  ];

  return (
    <div 
      className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 text-white rounded-lg shadow-xl max-w-lg w-full mx-4 flex flex-col max-h-[85vh]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Tabs */}
        <div className="flex-shrink-0 p-6 pb-4 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Trophy className="mr-3" size={24} />
              Your Statistics
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-700"
              aria-label="Close statistics"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex space-x-2 bg-gray-700 rounded-lg p-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-700 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          
          {activeTab === 'progress' && (
            <>
              {/* Hero Metrics */}
              <div className="text-center space-y-4">
                <div className="bg-gray-700 rounded-lg p-6">
                  <div className="text-3xl font-bold text-white mb-2">{overall.currentStreak}</div>
                  <div className="text-gray-200 text-base">Current Streak</div>
                  <div className="text-gray-300 text-sm mt-1">Best: {overall.maxStreak}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{overall.winPercentage}%</div>
                    <div className="text-gray-200 text-sm">Win Rate</div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{overall.gamesPlayed}</div>
                    <div className="text-gray-200 text-sm">Games Played</div>
                  </div>
                </div>
              </div>

              {/* Next Milestone */}
              {nextMilestone && (
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Target className="mr-2" size={20} />
                    <h3 className="font-semibold text-white text-base">Next Milestone</h3>
                  </div>
                  <div className="text-gray-200 text-sm">{nextMilestone.description}</div>
                  <div className="mt-2 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-purple-700 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${nextMilestone.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-300 mt-1">
                    {nextMilestone.current} / {nextMilestone.target}
                  </div>
                </div>
              )}

              {/* Performance Section */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-base font-semibold mb-4 flex items-center text-white">
                  <Target size={20} className="mr-2" />
                  Performance
                </h3>
                
                {/* Guess Distribution */}
                <div className="mb-4">
                  <div className="text-sm text-gray-200 mb-3">Guess Distribution</div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5, 6].map(guess => {
                      const count = overall.guessDistribution[guess];
                      const maxCount = Math.max(...Object.values(overall.guessDistribution));
                      const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                      const isUsersBest = count === maxCount && count > 0;
                      
                      return (
                        <div key={guess} className="flex items-center">
                          <div className="w-6 text-center text-sm text-gray-300 font-medium">{guess}</div>
                          <div className="flex-1 mx-3 bg-gray-600 rounded-full h-5 relative">
                            <div 
                              className={`h-5 rounded-full flex items-center justify-end pr-2 transition-all duration-300 ${
                                isUsersBest 
                                  ? 'bg-green-700' 
                                  : 'bg-purple-700'
                              }`}
                              style={{ width: `${Math.max(percentage, count > 0 ? 15 : 0)}%` }}
                            >
                              {count > 0 && (
                                <span className="text-xs text-white font-medium flex items-center">
                                  {count}
                                  {isUsersBest && <Star size={12} className="ml-1" />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-600 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{overall.bestScore}</div>
                    <div className="text-gray-200 text-sm">Best Score</div>
                    <div className="text-xs text-gray-300 mt-1">Avg: {overall.averageScore}</div>
                  </div>
                  <div className="bg-gray-600 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">{learning.perfectGames}</div>
                    <div className="text-gray-200 text-sm">Perfect Games</div>
                    <div className="text-xs text-gray-300 mt-1">No hints used</div>
                  </div>
                </div>
              </div>

              {/* Achievement Progress */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h3 className="text-base font-semibold mb-4 flex items-center text-white">
                  <Award size={20} className="mr-2" />
                  Achievements ({statistics.achievements.length}/10)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {achievementProgress.slice(0, 4).map(achievement => (
                    <div 
                      key={achievement.id}
                      className={`rounded-lg p-4 border-2 transition-all ${
                        achievement.unlocked 
                          ? 'bg-gray-600 border-purple-700' 
                          : 'bg-gray-600 border-gray-500'
                      }`}
                    >
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">{achievement.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${achievement.unlocked ? 'text-white' : 'text-gray-300'}`}>
                            {achievement.name}
                          </div>
                        </div>
                      </div>
                      {!achievement.unlocked && achievement.progress > 0 && (
                        <div className="mt-2">
                          <div className="bg-gray-700 rounded-full h-1.5">
                            <div 
                              className="bg-purple-700 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(achievement.progress, 100)}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-300 mt-1">
                            {Math.round(achievement.progress)}% complete
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning Section - Only if there are confusions */}
              {topConfusions.length > 0 && (
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                  <h3 className="text-base font-semibold mb-4 flex items-center text-white">
                    <Lightbulb size={20} className="mr-2" />
                    Areas to Improve
                  </h3>
                  <div className="space-y-3">
                    {topConfusions.map(([pattern, stats]) => {
                      const successRate = Math.round((stats.resolved / stats.occurrences) * 100);
                      return (
                        <div key={pattern} className="flex items-center justify-between bg-gray-600 rounded-lg p-4">
                          <div>
                            <div className="font-medium text-white text-base">{pattern}</div>
                            <div className="text-sm text-gray-200">
                              {stats.occurrences} times confused
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-semibold ${
                              successRate >= 70 ? 'text-green-400' : 
                              successRate >= 40 ? 'text-purple-400' : 'text-gray-300'
                            }`}>
                              {successRate}%
                            </div>
                            <div className="text-xs text-gray-300">resolved</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Dynamic Encouragement */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 text-center">
                <div className="text-gray-200 text-sm leading-relaxed">
                  {getEncouragementMessage(overall, learning)}
                </div>
              </div>
            </>
          )}

          {activeTab === 'scoring' && (
            <>
              {/* Scoring Overview */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h3 className="text-base font-semibold mb-3 flex items-center text-white">
                  <Calculator size={20} className="mr-2" />
                  How Scoring Works
                </h3>
                <p className="text-gray-200 text-sm leading-relaxed">
                  Your score is calculated based on guesses, difficulty, hints used, and bonuses. 
                  Understanding this helps you maximize your points!
                </p>
              </div>

              {/* Base Points */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="font-semibold mb-3 text-white text-base flex items-center">
                  <Target className="mr-2" size={18} />
                  Base Points by Guesses
                </h4>
                <div className="space-y-2">
                  {Object.entries(SCORING_CONFIG.BASE_POINTS).map(([guesses, points]) => (
                    <div key={guesses} className="flex justify-between items-center bg-gray-600 rounded p-3">
                      <span className="text-gray-200 text-sm">{guesses} guess{guesses !== '1' ? 'es' : ''}</span>
                      <span className="font-semibold text-white text-sm">{points} points</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Multipliers */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="font-semibold mb-3 text-white text-base flex items-center">
                  <Zap className="mr-2" size={18} />
                  Difficulty Multipliers
                </h4>
                <div className="space-y-2">
                  {Object.entries(SCORING_CONFIG.DIFFICULTY_MULTIPLIERS).map(([difficulty, multiplier]) => (
                    <div key={difficulty} className="flex justify-between items-center bg-gray-600 rounded p-3">
                      <span className="text-gray-200 text-sm capitalize">{difficulty}</span>
                      <span className="font-semibold text-white text-sm">×{multiplier}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonuses */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h4 className="font-semibold mb-3 text-white text-base flex items-center">
                  <Star className="mr-2" size={18} />
                  Bonus Opportunities
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-600 rounded p-3">
                    <span className="text-gray-200 text-sm">Perfect Game (No hints)</span>
                    <span className="font-semibold text-white text-sm">+{SCORING_CONFIG.BONUSES.NO_HINTS}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-600 rounded p-3">
                    <span className="text-gray-200 text-sm">First Try Success</span>
                    <span className="font-semibold text-white text-sm">+{SCORING_CONFIG.BONUSES.FIRST_TRY}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-600 rounded p-3">
                    <span className="text-gray-200 text-sm">Streak Bonus (per win)</span>
                    <span className="font-semibold text-white text-sm">+{SCORING_CONFIG.BONUSES.STREAK_PER_GAME} (max 50)</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-600 rounded p-3">
                    <span className="text-gray-200 text-sm">Speed Bonus (&lt;30s)</span>
                    <span className="font-semibold text-white text-sm">Up to +{SCORING_CONFIG.BONUSES.SPEED_BONUS_MAX}</span>
                  </div>
                </div>
              </div>

              {/* Penalties */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h4 className="font-semibold mb-3 text-white text-base flex items-center">
                  <X className="mr-2" size={18} />
                  Hint Penalties
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-gray-600 rounded p-3">
                    <span className="text-gray-200 text-sm">Character Hint</span>
                    <span className="font-semibold text-white text-sm">{SCORING_CONFIG.PENALTIES.CHARACTER_HINT}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-600 rounded p-3">
                    <span className="text-gray-200 text-sm">Tone Guidance</span>
                    <span className="font-semibold text-white text-sm">{SCORING_CONFIG.PENALTIES.TONE_GUIDANCE}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-600 rounded p-3">
                    <span className="text-gray-200 text-sm">Letter Reveal</span>
                    <span className="font-semibold text-white text-sm">{SCORING_CONFIG.PENALTIES.LETTER_REVEAL}</span>
                  </div>
                </div>
              </div>

              {/* Optimization Tips */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-6">
                <h4 className="font-semibold mb-3 text-white text-base flex items-center">
                  <Lightbulb className="mr-2" size={18} />
                  Score Optimization Tips
                </h4>
                <ul className="space-y-2 text-gray-200 text-sm">
                  <li className="flex items-start">
                    <span className="text-gray-300 mr-2">•</span>
                    <span>Aim for fewer guesses - each guess costs you points</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-300 mr-2">•</span>
                    <span>Avoid hints when possible for the +15 perfect game bonus</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-300 mr-2">•</span>
                    <span>Build win streaks for +2 points per consecutive win</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-300 mr-2">•</span>
                    <span>Try advanced difficulty for 2x multiplier</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gray-300 mr-2">•</span>
                    <span>Play quickly for speed bonuses (under 30 seconds)</span>
                  </li>
                </ul>
              </div>

              {/* Score Calculator Example */}
              <div className="bg-gray-700 rounded-lg p-6">
                <h4 className="font-semibold mb-3 text-white text-base">Example: Your Best Score ({overall.bestScore})</h4>
                <div className="text-sm text-gray-200 space-y-2">
                  <p>Let&apos;s say you scored {overall.bestScore} points:</p>
                  <div className="mt-2 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base points (3 guesses):</span>
                      <span>80 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Difficulty multiplier (Easy ×1.0):</span>
                      <span>80 points</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perfect game bonus:</span>
                      <span>+15 points</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-600 pt-2 font-semibold">
                      <span>Total:</span>
                      <span>95 points</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    *This is an estimate. Actual calculation includes streak bonuses and other factors.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all statistics? This action cannot be undone.')) {
                  resetStatistics();
                }
              }}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateAchievementProgress(statistics: any) {
  const achievements = [
    {
      id: 'first_win',
      name: 'First Victory',
      icon: '🎉',
      unlocked: statistics.overall.gamesWon >= 1,
      progress: Math.min((statistics.overall.gamesWon / 1) * 100, 100)
    },
    {
      id: 'perfect_game',
      name: 'Flawless',
      icon: '✨',
      unlocked: statistics.learning.perfectGames >= 1,
      progress: Math.min((statistics.learning.perfectGames / 1) * 100, 100)
    },
    {
      id: 'streak_5',
      name: 'On Fire',
      icon: '🔥',
      unlocked: statistics.overall.maxStreak >= 5,
      progress: Math.min((statistics.overall.maxStreak / 5) * 100, 100)
    },
    {
      id: 'streak_10',
      name: 'Unstoppable',
      icon: '⚡',
      unlocked: statistics.overall.maxStreak >= 10,
      progress: Math.min((statistics.overall.maxStreak / 10) * 100, 100)
    },
    {
      id: 'one_guess_master',
      name: 'Psychic',
      icon: '🔮',
      unlocked: statistics.overall.guessDistribution[1] >= 1,
      progress: Math.min((statistics.overall.guessDistribution[1] / 1) * 100, 100)
    },
    {
      id: 'scholar',
      name: 'Scholar',
      icon: '🎓',
      unlocked: statistics.overall.gamesPlayed >= 100,
      progress: Math.min((statistics.overall.gamesPlayed / 100) * 100, 100)
    }
  ];
  
  return achievements;
}

function getNextMilestone(overall: any) {
  const milestones = [
    { target: 5, description: "Play 5 games", current: overall.gamesPlayed },
    { target: 3, description: "Win 3 in a row", current: overall.maxStreak },
    { target: 10, description: "Win 10 games total", current: overall.gamesWon },
    { target: 100, description: "Score 100+ points", current: overall.bestScore },
    { target: 25, description: "Play 25 games", current: overall.gamesPlayed }
  ];
  
  for (const milestone of milestones) {
    if (milestone.current < milestone.target) {
      return {
        ...milestone,
        progress: (milestone.current / milestone.target) * 100
      };
    }
  }
  
  return null;
}

function getEncouragementMessage(overall: any, learning: any) {
  if (overall.gamesPlayed < 3) {
    return "Great start! Keep playing to unlock achievements and improve your Yorùbá skills. 🌟";
  }
  
  if (overall.winPercentage === 100 && overall.gamesPlayed >= 5) {
    return "Perfect record! You're absolutely crushing it. Can you maintain this excellence? 🏆";
  }
  
  if (overall.currentStreak >= 5) {
    return "Incredible streak! You're in the zone. Don't break the chain! 🔥";
  }
  
  if (learning.perfectGames >= 2) {
    return "Excellent! Multiple perfect games shows real mastery. Try harder difficulties! ⭐";
  }
  
  if (overall.winPercentage >= 80) {
    return "Outstanding performance! You're mastering Yorùbá pronunciation and spelling. 🎯";
  }
  
  if (overall.gamesPlayed >= 10) {
    return "You're building great habits! Consistency is key to language learning. Keep it up! 📚";
  }
  
  return "Every game makes you better. Focus on patterns and you'll see improvement! 💪";
}
