'use client';

import { Settings } from 'lucide-react';

interface SettingsButtonProps {
  onClick: () => void;
  className?: string;
}

export default function SettingsButton({ onClick, className = "" }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        p-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800
        ${className}
      `}
      aria-label="Open game settings"
      title="Game Settings"
    >
      <Settings size={24} />
    </button>
  );
} 