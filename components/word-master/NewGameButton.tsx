'use client';

import { useState } from 'react';

interface NewGameButtonProps {
  onNewGame: () => Promise<void>;
  disabled?: boolean;
  className?: string;
}

export default function NewGameButton({ 
  onNewGame, 
  disabled = false, 
  className = "" 
}: NewGameButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleNewGame = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onNewGame();
    } catch (error) {
      console.error('Failed to start new game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleNewGame}
      disabled={disabled || isLoading}
      className={
        `px-6 py-3 rounded-lg font-semibold text-white
        bg-purple-600 hover:bg-purple-700 
        disabled:bg-gray-400 disabled:cursor-not-allowed
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${className}`
      }
      aria-label="Start a new game with a different word"
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        'New Game'
      )}
    </button>
  );
} 