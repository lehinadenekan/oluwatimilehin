'use client';

import React, { useState } from 'react';

interface HintSystemProps {
  partOfSpeech: string;
  englishTranslation: string;
  additionalInfo: string;
  showTonalAccents: boolean;
  setShowTonalAccents: React.Dispatch<React.SetStateAction<boolean>>;
}

const HintSystem: React.FC<HintSystemProps> = ({ partOfSpeech, englishTranslation, additionalInfo, showTonalAccents, setShowTonalAccents }) => {
  const [showHints, setShowHints] = useState(false);
  const [showPartOfSpeech, setShowPartOfSpeech] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  if (!showHints) {
    return (
      <div className="my-4">
        <button 
          onClick={() => setShowHints(true)} 
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition-colors"
        >
          Need a Hint?
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 my-4 border border-gray-700 rounded-lg bg-gray-800 w-full max-w-md">
      <h3 className="text-lg font-bold text-yellow-400 mb-2">Hints</h3>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="accent-toggle" className="text-gray-300">Show tonal accents</label>
          <input id="accent-toggle" type="checkbox" className="toggle-checkbox" checked={showTonalAccents} onChange={() => setShowTonalAccents(!showTonalAccents)} />
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="pos-toggle" className="text-gray-300">Part of Speech</label>
          <input id="pos-toggle" type="checkbox" className="toggle-checkbox" checked={showPartOfSpeech} onChange={() => setShowPartOfSpeech(!showPartOfSpeech)} />
        </div>
        {showPartOfSpeech && <p className="text-gray-400 pl-4 animate-fade-in">{partOfSpeech}</p>}

        <div className="flex items-center justify-between">
          <label htmlFor="trans-toggle" className="text-gray-300">English Translation</label>
          <input id="trans-toggle" type="checkbox" className="toggle-checkbox" checked={showTranslation} onChange={() => setShowTranslation(!showTranslation)} />
        </div>
        {showTranslation && <p className="text-gray-400 pl-4 animate-fade-in">{englishTranslation}</p>}

        {additionalInfo && (
          <>
            <div className="flex items-center justify-between">
              <label htmlFor="info-toggle" className="text-gray-300">Additional Info</label>
              <input id="info-toggle" type="checkbox" className="toggle-checkbox" checked={showInfo} onChange={() => setShowInfo(!showInfo)} />
            </div>
            {showInfo && <p className="text-gray-400 pl-4 animate-fade-in">{additionalInfo}</p>}
          </>
        )}
      </div>
      <style jsx>{`
        .toggle-checkbox {
          appearance: none;
          width: 40px;
          height: 20px;
          background-color: #4a5568;
          border-radius: 10px;
          position: relative;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .toggle-checkbox:before {
          content: '';
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: white;
          top: 2px;
          left: 2px;
          transition: transform 0.2s;
        }
        .toggle-checkbox:checked {
          background-color: #f59e0b;
        }
        .toggle-checkbox:checked:before {
          transform: translateX(20px);
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default HintSystem; 