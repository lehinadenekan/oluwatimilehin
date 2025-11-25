'use client';

import { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { usePreferences } from '../../hooks/usePreferences';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onNewGame?: () => void;
  onNewGameWithLength?: (length: number) => void;
  showTonalAccents?: boolean;
  setShowTonalAccents?: (show: boolean) => void;
  showPartOfSpeech?: boolean;
  setShowPartOfSpeech?: (show: boolean) => void;
  showEnglishTranslation?: boolean;
  setShowEnglishTranslation?: (show: boolean) => void;
}

export default function SettingsPanel({ isOpen, onClose, onNewGame, onNewGameWithLength, showTonalAccents, setShowTonalAccents, showPartOfSpeech, setShowPartOfSpeech, showEnglishTranslation, setShowEnglishTranslation }: SettingsPanelProps) {
  const { preferences, updatePreference } = usePreferences();
  
  // Use preferences for state
  const difficulty = preferences.difficulty;
  const wordLength = preferences.wordLength;

  if (!isOpen) return null;

  const handleDifficultyChange = (value: string) => {
    updatePreference('difficulty', value as 'easy' | 'intermediate' | 'advanced');
  };

  const handleWordLengthChange = (value: number) => {
    updatePreference('wordLength', value as 2 | 3 | 4 | 5 | 6 | 7 | 8);
  };

  const handleApplySettings = async () => {
    console.log('⚙️ [SettingsPanel] Applying settings - difficulty:', difficulty, 'wordLength:', wordLength);
    
    // Close modal first for better UX
    onClose();
    
    // Start new game with current word length directly (not from stale preferences)
    if (onNewGameWithLength) {
      await onNewGameWithLength(wordLength);
    } else if (onNewGame) {
      // Fallback for backward compatibility
      await onNewGame();
    }
  };

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
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Settings className="mr-2" size={24} />
              Game Settings
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close settings"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-2" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="space-y-6">
            {/* Difficulty Setting */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Difficulty Level</label>
              <div className="text-sm text-gray-400 mb-2">Choose your challenge level</div>
              <select 
                value={difficulty}
                onChange={(e) => handleDifficultyChange(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent text-white"
              >
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced" disabled>Advanced (Coming Soon)</option>
              </select>
            </div>

            {/* Word Length Setting */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Word Length</label>
              <div className="text-sm text-gray-400 mb-2">Number of letters in the word</div>
              <select 
                value={wordLength}
                onChange={(e) => handleWordLengthChange(Number(e.target.value))}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-700 focus:border-transparent text-white"
              >
                <option value={2}>2 Letters</option>
                <option value={3}>3 Letters</option>
                <option value={4} disabled>4 Letters (Coming Soon)</option>
                <option value={5} disabled>5 Letters (Coming Soon)</option>
                <option value={6} disabled>6 Letters (Coming Soon)</option>
                <option value={7} disabled>7 Letters (Coming Soon)</option>
                <option value={8} disabled>8 Letters (Coming Soon)</option>
              </select>
            </div>

            {/* Game Hint Toggles */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">Game Hints</label>
              <div className="text-sm text-gray-400 mb-3">Control what hints are shown during gameplay</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-white text-sm">Show Tonal Accents</span>
                  <button
                    onClick={() => setShowTonalAccents && setShowTonalAccents(!showTonalAccents)}
                    className={`w-12 h-6 rounded-full transition-colors ${showTonalAccents ? 'bg-blue-500' : 'bg-gray-500'} relative`}
                    aria-label="Toggle tonal accents"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${showTonalAccents ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-white text-sm">Show Part of Speech</span>
                  <button
                    onClick={() => setShowPartOfSpeech && setShowPartOfSpeech(!showPartOfSpeech)}
                    className={`w-12 h-6 rounded-full transition-colors ${showPartOfSpeech ? 'bg-blue-500' : 'bg-gray-500'} relative`}
                    aria-label="Toggle part of speech"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${showPartOfSpeech ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <span className="text-white text-sm">Show English Translation</span>
                  <button
                    onClick={() => setShowEnglishTranslation && setShowEnglishTranslation(!showEnglishTranslation)}
                    className={`w-12 h-6 rounded-full transition-colors ${showEnglishTranslation ? 'bg-blue-500' : 'bg-gray-500'} relative`}
                    aria-label="Toggle English translation"
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${showEnglishTranslation ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-purple-900 bg-opacity-50 border border-purple-700 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-purple-200">Game Settings</h3>
              <p className="text-sm text-purple-300">
                Currently available: 2-3 letter words with Easy and Intermediate difficulty. More options coming soon!
              </p>
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
              Cancel
            </button>
            <button
              onClick={handleApplySettings}
              className="flex-1 px-4 py-3 bg-purple-700 hover:bg-purple-800 rounded-lg font-medium transition-colors text-white"
            >
              Apply & New Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 