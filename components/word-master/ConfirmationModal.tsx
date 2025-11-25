'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title, 
  message, 
  confirmText = "Yes, Start New Game",
  cancelText = "Cancel"
}: ConfirmationModalProps) {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div 
      className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div 
        className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-md mx-4 flex flex-col max-h-[75vh] sm:max-h-[80vh] min-h-[300px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-6 pb-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close confirmation"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 py-4" style={{ WebkitOverflowScrolling: 'touch' }}>
          <p className="text-sm text-gray-400">{message}</p>
        </div>

        {/* Fixed Footer */}
        <div className="flex-shrink-0 p-6 pt-4 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-300"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
} 