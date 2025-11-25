'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution?: string;
  solutionInfo?: {
    partOfSpeech: string;
    englishTranslation: string;
    additionalInfo: string;
  };
  isWordRevealed?: boolean;
  revealWord?: () => void;
  turn?: number;
  wordLength?: number;
  onRestartWalkthrough?: () => void;
}

const tabs = [
  { id: 'howToPlay', label: 'How to Play' },
  { id: 'revealWord', label: 'Reveal Word' },
  { id: 'restartWalkthrough', label: 'Restart Walkthrough' },
];

const HelpModal: React.FC<HelpModalProps> = ({ 
  isOpen, 
  onClose, 
  solution, 
  solutionInfo, 
  isWordRevealed, 
  revealWord, 
  turn = 0,
  wordLength = 5,
  onRestartWalkthrough
}) => {
  const [activeTab, setActiveTab] = useState<'howToPlay' | 'revealWord' | 'restartWalkthrough'>('howToPlay');
  const [showRevealConfirmation, setShowRevealConfirmation] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRevealWord = () => {
    if (revealWord) {
      revealWord();
      setShowRevealConfirmation(false);
    }
  };

  // Tab Content Components
  const HowToPlayTab = () => (
    <div className="space-y-5 text-justify">
      <p className="text-center text-sm text-gray-400">Guess the secret {wordLength}-letter <strong className="text-purple-400">Yorùbá</strong> word in six tries.</p>
      <hr className="border-gray-700"/>
      <div>
        <h3 className="text-sm font-medium mb-2 text-white">Àwọn Àwọ̀ (The Colors)</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-500 flex items-center justify-center text-2xl font-bold text-white rounded-md">A</div>
            <p className="text-sm text-gray-400"><strong className="text-white">Correct:</strong> The letter is in the word and in the correct spot.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-700 flex items-center justify-center text-2xl font-bold text-white rounded-md">B</div>
            <p className="text-sm text-gray-400"><strong className="text-white">Present:</strong> The letter is in the word but in the wrong spot.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-700 flex items-center justify-center text-2xl font-bold text-white rounded-md">D</div>
            <p className="text-sm text-gray-400"><strong className="text-white">Absent:</strong> The letter is not in the word in any spot.</p>
          </div>
        </div>
      </div>
      <hr className="border-gray-700"/>
      <div>
        <h3 className="text-sm font-medium mb-2 text-white">Àmì Ohùn (Accents Are Key)</h3>
        <p className="mb-2 text-sm text-gray-400">In Yorùbá, accents change a word&apos;s meaning! (e.g., <code className="bg-gray-700 px-1 rounded">oko</code> = farm, <code className="bg-gray-700 px-1 rounded">ọkọ</code> = husband, <code className="bg-gray-700 px-1 rounded">ọkọ́</code> = spear).</p>
        <ul className="list-disc list-outside space-y-1 pl-5 text-sm text-gray-400">
          <li>To type an accented vowel, <strong className="text-purple-400">press and hold</strong> it on the on-screen keyboard to see its variations.</li>
          <li>The unique letters <code className="bg-gray-700 px-1 rounded">ẹ</code>, <code className="bg-gray-700 px-1 rounded">ọ</code>, and <code className="bg-gray-700 px-1 rounded">ṣ</code> have their own keys.</li>
        </ul>
      </div>
      <hr className="border-gray-700"/>
      <div>
        <h3 className="text-sm font-medium mb-2 text-white">Ìrànlọ́wọ́ (Need a Clue?)</h3>
        <ul className="list-disc list-outside space-y-1 pl-5 text-sm text-gray-400">
          <li>For an easier game, toggle on <strong className="text-purple-400">&apos;Show tonal accents&apos;</strong> *before* you start to see the word&apos;s accents.</li>
          <li>After your first guess, you can use the other hint toggles to reveal the word&apos;s translation and more.</li>
          <li>If you&apos;re really stuck, check the &quot;Reveal Word&quot; tab to reveal the word and learn its meaning.</li>
        </ul>
      </div>
    </div>
  );

  const RevealWordTab = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium mb-2 text-white">Ìrànlọ́wọ́ (Need a Clue?)</h4>
      <div className="space-y-3 text-sm text-gray-400">
        <p>Having trouble with the current word?</p>
        <ul className="space-y-2 text-sm text-gray-400">
          <li>• For an easier game, toggle on &apos;Show tonal accents&apos; in Settings</li>
          <li>• After your first guess, use hint toggles to reveal translation and more</li>
          <li>• If you&apos;re really stuck, you can reveal the word below</li>
        </ul>
        {!isWordRevealed ? (
          <button
            onClick={() => setShowRevealConfirmation(true)}
            className="w-full mt-4 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Reveal Word
          </button>
        ) : (
          <div className="mt-4 p-3 bg-purple-900 bg-opacity-50 border border-purple-700 rounded-lg">
            <p className="text-purple-200 font-medium">
              Today&apos;s word: <span className="text-purple-100 text-xl">{solution}</span>
            </p>
            {solutionInfo && (
              <div className="text-sm text-purple-300 mt-2 space-y-1">
                {solutionInfo.englishTranslation && (
                  <p><strong>English:</strong> {solutionInfo.englishTranslation}</p>
                )}
                {solutionInfo.partOfSpeech && (
                  <p><strong>Part of Speech:</strong> {solutionInfo.partOfSpeech}</p>
                )}
                {solutionInfo.additionalInfo && (
                  <p><strong>Info:</strong> {solutionInfo.additionalInfo}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {showRevealConfirmation && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-4">
            <h4 className="text-2xl font-bold text-white mb-4">Reveal the word?</h4>
            <p className="text-sm text-gray-400 mb-6">
              This will end your current game and show you the solution with its meaning.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRevealConfirmation(false)}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRevealWord}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Yes, Reveal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const RestartWalkthroughTab = () => (
    <div className="space-y-4">
      <h4 className="text-sm font-medium mb-2 text-white">Interactive Walkthrough</h4>
      <div className="space-y-3 text-sm text-gray-400">
        <p>Take a guided tour of all game features and controls.</p>
        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-3">
          <h5 className="font-medium mb-2 text-purple-200">Walkthrough Covers:</h5>
          <ul className="space-y-1 text-sm text-purple-300">
            <li>• Game board and keyboard</li>
            <li>• Statistics tracking</li>
            <li>• Settings and difficulty options</li>
            <li>• Hint systems and toggles</li>
            <li>• All interactive features</li>
          </ul>
        </div>
        <button
          onClick={() => {
            if (onRestartWalkthrough) {
              onRestartWalkthrough();
              onClose();
            }
          }}
          className="w-full mt-4 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-300"
        >
          Start Interactive Walkthrough
        </button>
      </div>
    </div>
  );

  return (
    <div 
      className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl text-left max-w-2xl w-full mx-4 text-gray-300 flex flex-col max-h-[75vh] sm:max-h-[80vh] min-h-[300px]" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Help & Hints</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close help"
            >
              <X size={24} />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-purple-700">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`flex-1 py-2 px-1 sm:px-4 text-sm font-medium flex items-center justify-center gap-2
                  ${activeTab === tab.id ? 'text-purple-300 border-b-2 border-purple-700 bg-purple-900/30' : 'text-gray-400 hover:text-purple-200'}
                `}
                onClick={() => setActiveTab(tab.id as any)}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >                
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          {activeTab === 'howToPlay' && <HowToPlayTab />}
          {activeTab === 'revealWord' && <RevealWordTab />}
          {activeTab === 'restartWalkthrough' && <RestartWalkthroughTab />}
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-6 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 