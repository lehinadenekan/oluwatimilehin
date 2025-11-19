'use client';

import React, { useState, useCallback } from 'react';
import GameBoard from '../wordle/GameBoard';
import Keyboard from '../wordle/Keyboard';
import useWordMaster from '../../hooks/useWordMaster';
import GameEndModal from '../wordle/GameEndModal';
import HelpModal from '../wordle/HelpModal';
import LetterRevealModal from '../wordle/LetterRevealModal';
import AccentGuidanceModal from '../wordle/AccentGuidanceModal';
import CharacterHintModal from '../wordle/CharacterHintModal';
import SettingsPanel from '../word-master/SettingsPanel';
import EnhancedStatisticsDisplay from '../word-master/EnhancedStatisticsDisplay';
import ConfirmationModal from '../word-master/ConfirmationModal';
import ToastNotification from '../word-master/ToastNotification';
import GameWalkthrough, { walkthroughSteps } from '../walkthrough/GameWalkthrough';
import { CallBackProps } from 'react-joyride';

export interface YorubaWordMasterEmbedProps {
  /** Base URL for API calls (defaults to Wisdom Deck domain) */
  apiBaseUrl?: string;
  /** Default difficulty level */
  defaultDifficulty?: 'easy' | 'intermediate';
  /** Default word length */
  defaultWordLength?: 2 | 3;
  /** Show statistics panel */
  showStatistics?: boolean;
  /** Show settings panel */
  showSettings?: boolean;
  /** Callback when game completes */
  onGameComplete?: (isWon: boolean, turn: number, word: string) => void;
  /** Custom CSS class name */
  className?: string;
  /** Custom theme colors */
  theme?: {
    primary?: string;
    secondary?: string;
  };
}

/**
 * Embeddable Yoruba Word Master Game Component
 * 
 * A standalone React component that can be embedded in any React application.
 * 
 * @example
 * ```tsx
 * <YorubaWordMasterEmbed 
 *   defaultDifficulty="easy"
 *   defaultWordLength={3}
 *   onGameComplete={(won, turn, word) => console.log('Game complete!')}
 * />
 * ```
 */
export default function YorubaWordMasterEmbed({
  apiBaseUrl = 'https://www.wisdomdeck.online',
  defaultDifficulty = 'easy',
  defaultWordLength = 3,
  showStatistics = true,
  showSettings = true,
  onGameComplete,
  className = '',
  theme,
}: YorubaWordMasterEmbedProps) {
  // Use preferences with defaults (simplified version for embed)
  const [difficulty, setDifficulty] = useState<'easy' | 'intermediate'>(defaultDifficulty);
  const [wordLength, setWordLength] = useState<number>(defaultWordLength);
  
  const {
    solution,
    solutionVariants,
    solutionInfo,
    guesses,
    currentGuess,
    turn,
    isGameWon,
    isGameLost,
    keyboardStatus,
    errorMessage,
    wordLength: currentWordLength,
    handleKeyPress,
    startNewGame,
    startNewGameWithLength,
    // Progressive Hint System
    hasRevealedLetter,
    revealedLetterPosition,
    showLetterRevealModal,
    showAccentModal,
    revealRandomLetter,
    setShowLetterRevealModal,
    setShowAccentModal,
    // Character Hint System
    showCharacterHintModal,
    characterHint,
    setShowCharacterHintModal,
    setCharacterHint,
    // Track previous guess for accent modal
    previousGuess
  } = useWordMaster(difficulty, wordLength);

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [showTonalAccents, setShowTonalAccents] = useState(false);
  const [showPartOfSpeech, setShowPartOfSpeech] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('showPartOfSpeech') : null;
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('showEnglishTranslation') : null;
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [showNewGameConfirmation, setShowNewGameConfirmation] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isWordRevealed, setIsWordRevealed] = useState(false);
  const [showGameEndModal, setShowGameEndModal] = useState(false);
  const [statisticsKey, setStatisticsKey] = useState(0);
  const [runWalkthrough, setRunWalkthrough] = useState(false);

  // Handle game completion callback
  React.useEffect(() => {
    if ((isGameWon || isGameLost) && onGameComplete) {
      onGameComplete(isGameWon, turn, solution);
    }
  }, [isGameWon, isGameLost, turn, solution, onGameComplete]);

  // Show modal when game ends
  React.useEffect(() => {
    if (isGameWon || isGameLost) {
      setShowGameEndModal(true);
    }
  }, [isGameWon, isGameLost]);

  const resetGame = async () => {
    setShowGameEndModal(false);
    await startNewGame();
  };

  const handleReturnToBoard = () => {
    setShowGameEndModal(false);
  };

  const handleKeyPressWithInteraction = (key: string) => {
    const allowInteraction = (isGameWon || isGameLost) && !showGameEndModal;
    handleKeyPress(key, allowInteraction);
  };

  const handleShare = () => {
    const title = isGameWon ? `Yorùbá Word Master ${turn}/6` : `Yorùbá Word Master X/6`;
    const emojiGrid = guesses
      .slice(0, turn)
      .map(guessRow =>
        guessRow
          .map(tile => {
            if (tile.status === 'correct') return '🟩';
            if (tile.status === 'present') return '🟨';
            return '⬜';
          })
          .join('')
      )
      .join('\n');

    const shareText = `${title}\n\n${emojiGrid}`;
    navigator.clipboard.writeText(shareText).then(() => {
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    });
  };

  const handleSettings = () => setIsSettingsOpen(true);
  const handleHelp = () => setIsHelpOpen(true);
  const handleStats = () => setIsStatsOpen(true);
  const handleNewGame = () => setShowNewGameConfirmation(true);

  const handleConfirmNewGame = () => {
    setShowNewGameConfirmation(false);
    startNewGame();
  };

  const handleSettingsAppliedWithLength = async (newWordLength: number) => {
    setIsSettingsOpen(false);
    await startNewGameWithLength(newWordLength);
    setWordLength(newWordLength);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleRevealWord = () => {
    setIsWordRevealed(true);
    setIsHelpOpen(false);
  };

  const refreshStatistics = useCallback(() => {
    setStatisticsKey(prev => prev + 1);
  }, []);

  // Walkthrough handler
  const handleRestartWalkthrough = useCallback(() => {
    setRunWalkthrough(true);
  }, []);

  const handleWalkthroughCallback = useCallback((data: CallBackProps) => {
    if (data.type === 'tour:status' && (data.status === 'finished' || data.status === 'skipped')) {
      setRunWalkthrough(false);
    }
  }, []);

  // Apply theme colors if provided
  const themeStyles = theme ? {
    '--primary-color': theme.primary || '#7c3aed',
    '--secondary-color': theme.secondary || '#9333ea',
  } as React.CSSProperties : {};

  return (
    <div 
      className={`min-h-screen bg-gray-900 text-white ${className}`}
      style={themeStyles}
    >
      {/* Error Message Toast */}
      {errorMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999]">
          <div 
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg border border-red-500 max-w-sm mx-2"
            style={{
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden'
            }}
          >
            <p className="font-medium text-sm sm:text-base">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Header Bar with Title and Controls */}
      <div className="w-full bg-gray-800 border-b border-gray-700 px-4 py-3 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-lg sm:text-2xl font-bold tracking-wide uppercase flex-shrink-0">Yorùbá Word Master</h1>
          <div className="flex gap-2 flex-wrap">
          {showSettings && (
            <button
              onClick={handleSettings}
                data-tour="settings"
                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
              aria-label="Settings"
            >
              Settings
            </button>
          )}
          {showStatistics && (
            <button
              onClick={handleStats}
                data-tour="statistics"
                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
              aria-label="Statistics"
            >
              Stats
            </button>
          )}
          <button
            onClick={handleHelp}
              data-tour="help"
              className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
            aria-label="Help"
          >
            Help
          </button>
          <button
            onClick={handleNewGame}
              data-tour="new-game"
              className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-xs sm:text-sm"
            aria-label="New Game"
          >
            New Game
          </button>
          </div>
        </div>
      </div>

      {/* Project Description Card - Matching Commercial Work Style */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800 hover:border-purple-500 transition-all duration-300">
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              I created Yorùbá Word Master to help myself improve my Yorùbá vocabulary and tonal mark accuracy. Yorùbá is a tonal language in which tonal accuracy is essential to preserve the true meaning of words.
            </p>
            <p className="text-gray-400 text-sm">
              I built this using React, Next.js, Tailwind CSS, Typescript.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <GameEndModal 
        isOpen={showGameEndModal} 
        isGameWon={isGameWon}
        solution={solution}
        solutionVariants={solutionVariants}
        guesses={guesses}
        turn={turn}
        onReset={resetGame}
        onReturnToBoard={handleReturnToBoard}
        onStatsRefresh={refreshStatistics}
      />
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)} 
        solution={solution}
        revealWord={handleRevealWord}
        wordLength={currentWordLength}
        onRestartWalkthrough={handleRestartWalkthrough}
      />
      <LetterRevealModal
        isOpen={showLetterRevealModal}
        onReveal={revealRandomLetter}
        onDecline={() => setShowLetterRevealModal(false)}
      />
      <AccentGuidanceModal
        isOpen={showAccentModal}
        onClose={() => setShowAccentModal(false)}
        guessWord={previousGuess}
        solutionWord={solution}
        currentTurn={turn}
      />
      <CharacterHintModal
        isOpen={showCharacterHintModal}
        onClose={() => setShowCharacterHintModal(false)}
        confusions={characterHint ? [characterHint] : []}
        guessWord={currentGuess}
        correctWord={solution}
      />
      {showSettings && (
        <SettingsPanel 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onNewGameWithLength={handleSettingsAppliedWithLength}
          showTonalAccents={showTonalAccents}
          setShowTonalAccents={setShowTonalAccents}
          showPartOfSpeech={showPartOfSpeech}
          setShowPartOfSpeech={setShowPartOfSpeech}
          showEnglishTranslation={showEnglishTranslation}
          setShowEnglishTranslation={setShowEnglishTranslation}
        />
      )}
      {showStatistics && (
        <EnhancedStatisticsDisplay 
          isOpen={isStatsOpen}
          onClose={() => setIsStatsOpen(false)}
          key={statisticsKey}
        />
      )}
      <ConfirmationModal
        isOpen={showNewGameConfirmation}
        onConfirm={handleConfirmNewGame}
        onCancel={() => setShowNewGameConfirmation(false)}
        title="Start New Game?"
        message="Your current progress will be lost. Are you sure you want to start a new game?"
      />
      <ToastNotification
        isVisible={showToast}
        message="Settings applied successfully!"
        onClose={() => setShowToast(false)}
      />
      <ToastNotification
        isVisible={showShareToast}
        message="Copied to clipboard!"
        onClose={() => setShowShareToast(false)}
      />

      {/* Walkthrough */}
      <GameWalkthrough
        run={runWalkthrough}
        steps={walkthroughSteps}
        callback={handleWalkthroughCallback}
      />

      {/* Game Content */}
      <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white overflow-y-auto pt-4">
        {/* Game Title Header */}
        <header className="w-full text-center py-1 px-2 mb-8">
          <p className="text-xs sm:text-lg text-gray-400 hidden sm:block">Enter the correct Yorùbá word, with the correct tonal marks, to match the English translation below.</p>
        </header>
        
        {/* Main Game Area */}
        <main className="flex flex-col items-center px-1 w-full min-h-0">
          <div className="flex flex-col items-center w-full game-board">
            <GameBoard 
              guesses={guesses} 
              currentGuess={currentGuess} 
              turn={turn} 
              solution={solution} 
              showTonalAccents={showTonalAccents}
              wordLength={currentWordLength}
              revealedLetterPosition={revealedLetterPosition}
              isGameWon={isGameWon}
              isGameLost={isGameLost}
              className="mb-2 sm:mb-4"
              data-testid="game-board"
            />
            
            {/* Inline Hints Display */}
            {(showPartOfSpeech || showEnglishTranslation) && (
              <div className="text-center text-sm text-gray-300 px-2 mt-2">
                {showPartOfSpeech && solutionInfo.partOfSpeech && (
                  <p><strong>Part of Speech:</strong> {solutionInfo.partOfSpeech}</p>
                )}
                {showEnglishTranslation && solutionInfo.englishTranslation && (
                  <p><strong>English:</strong> {solutionInfo.englishTranslation}</p>
                )}
              </div>
            )}

            {/* Revealed Word Display */}
            {isWordRevealed && (
              <div className="text-center text-sm text-yellow-300 px-2 mt-2">
                <p><strong>Solution:</strong> {solution}</p>
              </div>
            )}

            {/* Keyboard */}
            <div className="keyboard-container mt-2 sm:mt-6 w-full max-w-md" data-testid="keyboard-container">
              <Keyboard 
                onKeyPress={handleKeyPressWithInteraction} 
                keyboardStatus={keyboardStatus}
              />
            </div>
            
            {/* Game Complete Indicator */}
            {(isGameWon || isGameLost) && !showGameEndModal && (
              <div className="mt-4 text-center">
                <div className="text-sm text-gray-400 mb-3">
                  {isGameWon ? '🎉 Game Complete!' : 'Game Over'}
                </div>
                <div className="flex gap-2 justify-center items-center">
                  <button
                    onClick={resetGame}
                    className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setShowGameEndModal(true)}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    View Results
                  </button>
                  <button
                    onClick={handleShare}
                    className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Share
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

