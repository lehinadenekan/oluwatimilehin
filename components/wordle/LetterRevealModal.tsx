'use client';

import React from 'react';
import { X } from 'lucide-react';

interface LetterRevealModalProps {
  isOpen: boolean;
  onReveal: () => void;
  onDecline: () => void;
}

const LetterRevealModal: React.FC<LetterRevealModalProps> = ({ 
  isOpen, 
  onReveal, 
  onDecline 
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" 
      onClick={onDecline}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl text-left max-w-md w-full mx-4 text-gray-300" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-2xl font-bold text-white">Need a Hint?</h2>
          <button
            onClick={onDecline}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              Would you like to reveal a random letter from the word?
            </p>
            
            <div className="bg-purple-900 bg-opacity-30 border border-purple-700 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-purple-200">💡 Hint System</h3>
              <p className="text-sm text-purple-300">
                This will show you one random letter in its correct position. 
                You can only use this hint once per game!
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onDecline}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
              >
                No, I&apos;ll keep trying
              </button>
              <button
                onClick={onReveal}
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Yes, reveal letter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LetterRevealModal; 