'use client';

import { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastNotificationProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function ToastNotification({ 
  isVisible, 
  message, 
  onClose, 
  duration = 3000 
}: ToastNotificationProps) {
  
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-right-2 duration-300">
      <div className="bg-purple-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px]">
        <CheckCircle size={20} className="text-purple-200" />
        <span className="flex-1">{message}</span>
        <button
          onClick={onClose}
          className="text-purple-200 hover:text-white transition-colors"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
} 