'use client';

import { usePreferences } from '../../hooks/usePreferences';
import { X } from 'lucide-react';

interface StatisticsDisplayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatisticsDisplay({ isOpen, onClose }: StatisticsDisplayProps) {
  const { preferences, resetStatistics } = usePreferences();
  const { statistics } = preferences;

  if (!isOpen) return null;

  const winPercentage = statistics.gamesPlayed > 0 
    ? Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)
    : 0;

  const maxGuesses = Math.max(...Object.values(statistics.guessDistribution));

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 text-white rounded-lg shadow-xl text-left max-w-md w-full mx-4 flex flex-col max-h-[75vh] sm:max-h-[80vh] min-h-[400px]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Statistics</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close statistics"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{statistics.gamesPlayed}</div>
              <div className="text-sm text-gray-400">Played</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{winPercentage}%</div>
              <div className="text-sm text-gray-400">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{statistics.currentStreak}</div>
              <div className="text-sm text-gray-400">Current</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{statistics.maxStreak}</div>
              <div className="text-sm text-gray-400">Best</div>
            </div>
          </div>

          {/* Guess Distribution */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2 text-white">Guess Distribution</h3>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5, 6].map(guess => {
                const count = statistics.guessDistribution[guess];
                const percentage = maxGuesses > 0 ? (count / maxGuesses) * 100 : 0;
                return (
                  <div key={guess} className="flex items-center">
                    <div className="w-4 text-center text-sm text-gray-400">{guess}</div>
                    <div className="flex-1 mx-2 bg-gray-700 rounded">
                      <div 
                        className="bg-purple-700 h-6 rounded flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      >
                        <span className="text-sm text-white">{count}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium mb-2 text-white">Game History</h4>
            <div className="text-sm text-gray-400 space-y-1">
              <div>Total Games: {statistics.gamesPlayed}</div>
              <div>Games Won: {statistics.gamesWon}</div>
              <div>Win Rate: {winPercentage}%</div>
              <div>Current Streak: {statistics.currentStreak}</div>
              <div>Best Streak: {statistics.maxStreak}</div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-700">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg font-medium transition-colors text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                if (confirm('Reset all statistics? This action cannot be undone.')) {
                  resetStatistics();
                }
              }}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors text-white"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 