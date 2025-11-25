import React from 'react';
import { Tile } from '../../hooks/useWordMaster';
import { getDiacritic } from '../../lib/accents';
import { getGraphemes as getGraphemesProper } from '../../lib/graphemeUtils';

interface GameBoardProps {
  guesses: Tile[][];
  currentGuess: string;
  turn: number;
  solution: string;
  showTonalAccents: boolean;
  wordLength: number;
  revealedLetterPosition: number | null;
  isGameWon: boolean;
  isGameLost: boolean;
  className?: string;
  'data-testid'?: string;
}

// Helper function to get graphemes from a string
const getGraphemes = (str: string): string[] => {
  // Use proper grapheme segmentation for complex Unicode characters
  return getGraphemesProper(str);
};

const GameBoard: React.FC<GameBoardProps> = ({ 
  guesses, 
  currentGuess, 
  turn, 
  solution, 
  showTonalAccents, 
  wordLength, 
  revealedLetterPosition,
  isGameWon,
  isGameLost,
  className,
  'data-testid': dataTestId
}) => {
  const totalCols = wordLength;
  const solutionGraphemes = getGraphemes(solution);

  // Add bounds checking to prevent invalid turn states
  const validTurn = Math.max(0, Math.min(turn, 5)); // Ensure turn is between 0 and 5
  const validGuesses = guesses.slice(0, 6); // Ensure we only use up to 6 guesses

  return (
    <div className={`relative ${className || ''}`} data-testid={dataTestId}>
      <div className="grid grid-rows-6 gap-0.5 sm:gap-1.5">
        {validGuesses.map((guess, rowIndex) => {
          // This is a past guess, so we display it from the `guesses` state
          if (rowIndex < validTurn) {
            return (
              <div key={rowIndex} className={`grid gap-0.5 sm:gap-1.5 ${getGridColsClass(wordLength)}`}>
                {guess.map((tile, colIndex) => (
                  <div 
                    key={colIndex}
                    className={`w-10 h-10 sm:w-16 sm:h-16 border border-gray-600 flex items-center justify-center text-sm sm:text-3xl font-bold uppercase
                      ${tile.status === 'correct' ? 'bg-green-500 border-green-500' : ''}
                      ${tile.status === 'present' ? 'bg-purple-700 border-purple-700' : ''}
                      ${tile.status === 'absent' ? 'bg-gray-700 border-gray-700' : ''}
                    `}
                  >
                    {tile.char}
                  </div>
                ))}
              </div>
            );
          }

          // This is the current row for the active guess
          if (rowIndex === validTurn) {
            const currentGraphemes = getGraphemes(currentGuess);
            return (
              <div key={rowIndex} className={`grid gap-0.5 sm:gap-1.5 ${getGridColsClass(wordLength)}`}>
                {Array.from({ length: totalCols }).map((_, colIndex) => {
                  // Only show revealed letter if game is still active (not won or lost)
                  const isGameActive = !isGameWon && !isGameLost;
                  const isRevealedPosition = isGameActive && revealedLetterPosition !== null && revealedLetterPosition === colIndex;
                  const displayChar = currentGraphemes[colIndex] || '';
                  
                  return (
                    <div 
                      key={colIndex}
                      className={`w-10 h-10 sm:w-16 sm:h-16 border border-gray-600 flex items-center justify-center text-sm sm:text-3xl font-bold uppercase
                        ${isRevealedPosition ? 'bg-blue-600 border-blue-500 text-white animate-pulse' : ''}
                      `}
                    >
                      {displayChar}
                    </div>
                  );
                })}
              </div>
            );
          }

          // This is a future, empty row
          return (
            <div key={rowIndex} className={`grid gap-0.5 sm:gap-1.5 ${getGridColsClass(wordLength)}`}>
              {Array.from({ length: totalCols }).map((_, colIndex) => (
                <div 
                  key={colIndex}
                  className="w-10 h-10 sm:w-16 sm:h-16 border border-gray-600"
                />
              ))}
            </div>
          );
        })}
      </div>

      {showTonalAccents && (
        <div className={`absolute -top-8 left-0 right-0 grid gap-0.5 sm:gap-1.5 pointer-events-none ${getGridColsClass(wordLength)}`}>
          {getGraphemes(solution).map((char, index) => {
            const accent = getDiacritic(char);
            return (
              <div key={index} className="w-10 h-10 sm:w-16 sm:h-16 flex items-start justify-center">
                <span className="text-sm sm:text-3xl text-purple-400 font-semibold">
                  {accent}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Helper function to get the appropriate grid columns class
const getGridColsClass = (wordLength: number): string => {
  switch (wordLength) {
    case 2: return 'grid-cols-2';
    case 3: return 'grid-cols-3';
    case 4: return 'grid-cols-4';
    case 5: return 'grid-cols-5';
    case 6: return 'grid-cols-6';
    case 7: return 'grid-cols-7';
    default: return 'grid-cols-5';
  }
};

export default GameBoard; 