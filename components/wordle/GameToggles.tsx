'use client';

import React from 'react';

interface GameTogglesProps {
  showTonalAccents: boolean;
  setShowTonalAccents: (show: boolean) => void;
  showPartOfSpeech: boolean;
  setShowPartOfSpeech: (show: boolean) => void;
  showEnglishTranslation: boolean;
  setShowEnglishTranslation: (show: boolean) => void;
}

const GameToggles: React.FC<GameTogglesProps> = ({
  showTonalAccents,
  setShowTonalAccents,
  showPartOfSpeech,
  setShowPartOfSpeech,
  showEnglishTranslation,
  setShowEnglishTranslation
}) => {
  const Toggle = ({ 
    label, 
    enabled, 
    onChange, 
    icon 
  }: { 
    label: string; 
    enabled: boolean; 
    onChange: (enabled: boolean) => void;
    icon: string;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors
        ${enabled 
          ? 'bg-blue-500 text-white' 
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        }`}
    >
      <span>{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="flex gap-1 sm:gap-2 mb-2 justify-center">
      <Toggle
        label="Tonal Accents"
        enabled={showTonalAccents}
        onChange={setShowTonalAccents}
        icon="´"
      />
      <Toggle
        label="Part of Speech"
        enabled={showPartOfSpeech}
        onChange={setShowPartOfSpeech}
        icon="📝"
      />
      <Toggle
        label="English"
        enabled={showEnglishTranslation}
        onChange={setShowEnglishTranslation}
        icon="🇬🇧"
      />
    </div>
  );
};

export default GameToggles; 