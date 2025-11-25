import React, { useState, useRef, useEffect } from 'react';
import { KeyboardStatus } from '../../hooks/useWordMaster';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  keyboardStatus: KeyboardStatus;
  className?: string;
}

// Create a map of base vowels to their accent variants
const vowelVariants: { [key: string]: string[] } = {
  'a': ['a', 'à', 'á'],
  'e': ['e', 'è', 'é'],
  'ẹ': ['ẹ', 'ẹ̀', 'ẹ́'],
  'i': ['i', 'ì', 'í'],
  'o': ['o', 'ò', 'ó'],
  'ọ': ['ọ', 'ọ̀', 'ọ́'],
  'u': ['u', 'ù', 'ú'],
};

// Normalize all keys in the map
Object.keys(vowelVariants).forEach(key => {
  const normalizedKey = key.normalize('NFC');
  const normalizedVariants = vowelVariants[key].map(v => v.normalize('NFC'));
  delete vowelVariants[key];
  vowelVariants[normalizedKey] = normalizedVariants;
});

const yorubaKeyboardLayout = [
  ['a', 'b', 'd', 'e', 'ẹ', 'f', 'g'],
  ['gb', 'h', 'i', 'j', 'k', 'l', 'm'],
  ['n', 'o', 'ọ', 'p', 'r', 's', 'ṣ'],
  ['t', 'u', 'w', 'y', 'Enter', 'Backspace']
].map(row => row.map(key => key.normalize('NFC')));

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, keyboardStatus, className }) => {
  const [activeVowelKey, setActiveVowelKey] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);
  const keyboardRef = useRef<HTMLDivElement>(null);
  const keyRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const getKeyClass = (key: string) => {
    const normalizedKey = key.normalize('NFC').toLowerCase();
    const status = keyboardStatus[normalizedKey];
    if (status === 'correct') return 'bg-green-500 text-white';
    if (status === 'present') return 'bg-purple-700 text-white';
    if (status === 'absent') return 'bg-gray-900 text-gray-500';
    return 'bg-gray-700 text-white';
  };

  const calculatePopupPosition = (keyElement: HTMLButtonElement) => {
    const rect = keyElement.getBoundingClientRect();
    const popupWidth = 280; // Approximate width of popup (3 buttons * 56px + gaps + padding)
    const popupHeight = 80; // Approximate height of popup
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // Calculate center position of the key
    const keyCenterX = rect.left + rect.width / 2;
    const keyTop = rect.top;
    
    // Calculate popup position
    let left = keyCenterX - popupWidth / 2;
    let top = keyTop - popupHeight - 8; // 8px gap above the key
    
    // Boundary checking - keep popup within viewport
    if (left < 8) {
      left = 8; // Minimum 8px from left edge
    } else if (left + popupWidth > screenWidth - 8) {
      left = screenWidth - popupWidth - 8; // Minimum 8px from right edge
    }
    
    // If popup would go above viewport, position it below the key
    if (top < 8) {
      top = keyTop + rect.height + 8; // 8px gap below the key
    }
    
    return { top, left };
  };
  
  const handleKeyClick = (key: string) => {
    // Prevent rapid clicks
    if (isProcessing) {
      console.log('Key click blocked - processing in progress');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const normalizedKey = key.normalize('NFC');
      const variants = vowelVariants[normalizedKey];
      
      if (variants && variants.length > 1) {
        // This is a vowel with variants - show the variant popup
        const keyElement = keyRefs.current[normalizedKey];
        if (keyElement) {
          const position = calculatePopupPosition(keyElement);
          setPopupPosition(position);
        }
        setActiveVowelKey(normalizedKey === activeVowelKey ? null : normalizedKey);
      } else {
        // This is a regular key or vowel without variants - input directly
        setActiveVowelKey(null);
        setPopupPosition(null);
        onKeyPress(normalizedKey);
      }
    } finally {
      // Reset processing flag after a short delay to prevent rapid clicks
      setTimeout(() => setIsProcessing(false), 100);
    }
  };

  const handleVariantClick = (variant: string) => {
    // Prevent rapid clicks
    if (isProcessing) {
      console.log('Variant click blocked - processing in progress');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const normalizedVariant = variant.normalize('NFC');
      onKeyPress(normalizedVariant);
      setActiveVowelKey(null);
      setPopupPosition(null);
    } finally {
      // Reset processing flag after a short delay to prevent rapid clicks
      setTimeout(() => setIsProcessing(false), 100);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (keyboardRef.current && !keyboardRef.current.contains(event.target as Node)) {
        setActiveVowelKey(null);
        setPopupPosition(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={keyboardRef} className={`w-full px-1 sm:max-w-2xl max-h-[180px] sm:max-h-none overflow-y-auto ${className || ''}`} data-testid="keyboard-container">
      {yorubaKeyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-0.5 sm:gap-1.5 mb-0.5 sm:mb-3">
          {row.map((key) => {
            const normalizedKey = key.normalize('NFC');
            const variants = vowelVariants[normalizedKey];

            return (
              <div key={normalizedKey} className="relative flex-1">
                <button
                  ref={(el) => { keyRefs.current[normalizedKey] = el; }}
                  onClick={() => handleKeyClick(normalizedKey)}
                  className={`h-10 sm:h-16 w-full rounded hover:bg-gray-600 flex items-center justify-center text-xs sm:text-xl font-bold uppercase p-1 sm:p-2
                    ${getKeyClass(normalizedKey)}
                  `}
                >
                  {key === 'Backspace' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 002.828 0L21 12M3 12l6.414-6.414a2 2 0 012.828 0L21 12" />
                    </svg>
                  ) : normalizedKey}
                </button>
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Fixed positioned popup that breaks out of container constraints */}
      {activeVowelKey && popupPosition && vowelVariants[activeVowelKey] && (
        <div 
          className="fixed flex gap-1 bg-gray-900 p-2 rounded-md shadow-lg z-50 min-w-max"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`
          }}
        >
          {vowelVariants[activeVowelKey].map(variantChar => {
            const normalizedVariant = variantChar.normalize('NFC');
            return (
              <button
                key={normalizedVariant}
                onClick={() => handleVariantClick(normalizedVariant)}
                className={`w-14 h-14 rounded hover:bg-blue-500 text-white flex items-center justify-center text-3xl ${getKeyClass(normalizedVariant.toLowerCase())}`}
              >
                {normalizedVariant}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Keyboard; 