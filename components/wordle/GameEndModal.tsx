import React, { useRef, useEffect } from 'react';
import { Tile } from '../../hooks/useWordMaster';

interface GameEndModalProps {
  isOpen: boolean;
  isGameWon: boolean;
  solution: string;
  solutionVariants?: string[];
  guesses: Tile[][];
  turn: number;
  onReset: () => void;
  onReturnToBoard: () => void;
  onStatsRefresh?: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({
  isOpen, 
  isGameWon, 
  solution, 
  solutionVariants = [], 
  guesses, 
  turn, 
  onReset,
  onReturnToBoard,
  onStatsRefresh
}) => {
  // Hooks at the top level - before any early returns
  const [hasCopied, setHasCopied] = React.useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        // Do not close on click outside for now (to avoid accidental closes)
        // onReset();
      }
    }
    
    // Only add listener when modal is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen]);

  // Trigger statistics refresh when modal opens
  useEffect(() => {
    if (isOpen && onStatsRefresh) {
      onStatsRefresh();
    }
  }, [isOpen, onStatsRefresh]);

  // Early return after all hooks
  if (!isOpen) return null;

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
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    });
  };

  // Get all unique variants (excluding the primary solution)
  const otherVariants = solutionVariants
    .filter(variant => variant.toLowerCase() !== solution.toLowerCase())
    .filter((variant, index, arr) => arr.indexOf(variant) === index); // Remove duplicates

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Full screen backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      {/* Centered modal */}
      <div
        ref={modalRef}
        className="relative bg-gray-800 border-2 border-purple-500 rounded-lg p-6 mx-4 max-w-md w-full z-10 shadow-xl text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">
          {isGameWon ? 'Congratulations!' : 'Game Over'}
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          {isGameWon ? 'You guessed the word correctly.' : 'Better luck next time!'}
        </p>
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 mb-4">
          <p className="text-green-300 font-medium">
            Word: <span className="text-green-100 text-xl">{solution}</span>
          </p>
          <p className="text-green-300 text-sm">
            {isGameWon ? `Solved in ${turn} attempts` : 'Try again next time!'}
          </p>
          
          {/* Show other accepted variants if they exist */}
          {otherVariants.length > 0 && (
            <div className="mt-3 pt-3 border-t border-green-600/50">
              <p className="text-green-300 text-sm font-medium mb-1">
                Also accepted:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {otherVariants.map((variant, index) => (
                  <span 
                    key={index}
                    className="text-green-200 text-sm bg-green-800/30 px-2 py-1 rounded border border-green-500/50"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-center mb-2 flex-col sm:flex-row">
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onReturnToBoard}
            className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Return to Game Board
          </button>
          <button
            onClick={handleShare}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            {hasCopied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndModal; 