'use client';

import React, { useRef, useEffect } from 'react';
import { X, CheckCircle } from 'lucide-react';

interface CharacterHint {
  correctChar: string;
  confusedChar: string;
  explanation: string;
}

interface CharacterHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  confusions: CharacterHint[];
  guessWord: string;
  correctWord: string;
}

const CharacterHintModal: React.FC<CharacterHintModalProps> = ({ 
  isOpen, 
  onClose,
  confusions,
  guessWord,
  correctWord
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside and escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        style={{ 
          WebkitBackdropFilter: 'blur(4px)',
          touchAction: 'none'
        }}
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-gray-800 rounded-lg shadow-xl text-left max-w-lg w-full mx-4 text-gray-300 z-10 max-h-[80vh] overflow-y-auto"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-2xl font-bold text-white">Character Pronunciation Tip</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <div className="space-y-5">
            {/* Progress Indicator */}
            <div className="bg-purple-900 bg-opacity-50 border border-purple-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="font-medium text-purple-200">Good Progress!</h3>
              </div>
              <p className="text-sm text-purple-300">
                You got the right letters! Now let&apos;s work on the tonal marks.
              </p>
              <p className="text-xs text-purple-300 mt-2">
                Attempt 1 of 6 - Keep going!
              </p>
            </div>

            {/* Tonal Marks Tip */}
            <div className="bg-purple-900 bg-opacity-50 border border-purple-700 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-purple-200">💡 Tonal Marks Tip</h3>
              <p className="text-sm text-purple-300">
                Tonal marks change word meanings in Yorùbá. For example:
              </p>
              <div className="mt-2 text-sm space-y-1">
                <p><code className="bg-gray-700 px-1 rounded">oko</code> = farm</p>
                <p><code className="bg-gray-700 px-1 rounded">ọkọ</code> = husband</p>
                <p><code className="bg-gray-700 px-1 rounded">ọkọ́</code> = spear</p>
                      </div>
                    </div>
                    
            {/* Settings Tip */}
            <div className="bg-purple-900 bg-opacity-50 border border-purple-700 rounded-lg p-4">
              <h3 className="font-medium mb-2 text-purple-200">⚙️ Settings Tip</h3>
              <p className="text-sm text-purple-300">
                Turn on &quot;Show tonal accents&quot; in Settings to see the accents before guessing!
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium transition-colors min-h-[44px]"
            >
              Continue Playing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterHintModal; 