export interface CharacterHint {
  confusedChar: string;
  correctChar: string;
  confusedSound: string;
  correctSound: string;
  confusedExample: string;
  correctExample: string;
  explanation: string;
}

// Strip tone marks (acute/grave) but keep dot-below so e≠ẹ and o≠ọ
const stripTones = (text: string): string => {
  const decomposed = text.normalize('NFD');
  const withoutTones = decomposed.replace(/[\u0300\u0301]/g, '');
  return withoutTones.normalize('NFC');
};

// Character confusion mappings
const CHARACTER_CONFUSIONS: { [key: string]: CharacterHint } = {
  // S vs Ṣ confusions
  's→ṣ': {
    confusedChar: 's',
    correctChar: 'ṣ',
    confusedSound: 's',
    correctSound: 'sh',
    confusedExample: 'sun',
    correctExample: 'sugar',
    explanation: 'Remember: ṣ (with dot) has a "sh" sound like "sugar", while s (no dot) has the regular "s" sound like "sun".'
  },
  'ṣ→s': {
    confusedChar: 'ṣ',
    correctChar: 's',
    confusedSound: 'sh',
    correctSound: 's',
    confusedExample: 'sugar',
    correctExample: 'sun',
    explanation: 'Remember: s (no dot) has the regular "s" sound like "sun", while ṣ (with dot) has a "sh" sound like "sugar".'
  },

  // E vs Ẹ confusions
  'e→ẹ': {
    confusedChar: 'e',
    correctChar: 'ẹ',
    confusedSound: 'ay',
    correctSound: 'eh',
    confusedExample: 'they',
    correctExample: 'egg',
    explanation: 'Remember: ẹ (with dot) has an "eh" sound like "egg", while e (no dot) has an "ay" sound like "they".'
  },
  'ẹ→e': {
    confusedChar: 'ẹ',
    correctChar: 'e',
    confusedSound: 'eh',
    correctSound: 'ay',
    confusedExample: 'egg',
    correctExample: 'they',
    explanation: 'Remember: e (no dot) has an "ay" sound like "they", while ẹ (with dot) has an "eh" sound like "egg".'
  },

  // O vs Ọ confusions
  'o→ọ': {
    confusedChar: 'o',
    correctChar: 'ọ',
    confusedSound: 'oh',
    correctSound: 'aw',
    confusedExample: 'go',
    correctExample: 'awe',
    explanation: 'Remember: ọ (with dot) has an "aw" sound like "awe", while o (no dot) has an "oh" sound like "go".'
  },
  'ọ→o': {
    confusedChar: 'ọ',
    correctChar: 'o',
    confusedSound: 'aw',
    correctSound: 'oh',
    confusedExample: 'awe',
    correctExample: 'go',
    explanation: 'Remember: o (no dot) has an "oh" sound like "go", while ọ (with dot) has an "aw" sound like "awe".'
  }
};

// Normalize characters for comparison (tone-insensitive, dot-below preserved)
const normalizeChar = (char: string): string => stripTones(char).normalize('NFC').toLowerCase();

// Detect character confusions between guess and solution
export const detectCharacterConfusion = (guess: string, solution: string): CharacterHint[] => {
  const guessChars = Array.from(stripTones(guess).normalize('NFC').toLowerCase());
  const solutionChars = Array.from(stripTones(solution).normalize('NFC').toLowerCase());
  
  const confusions: CharacterHint[] = [];
  const foundConfusions = new Set<string>(); // Prevent duplicates
  
  // Check each position for character confusions
  for (let i = 0; i < Math.min(guessChars.length, solutionChars.length); i++) {
    const guessChar = guessChars[i];
    const solutionChar = solutionChars[i];
    
    if (guessChar !== solutionChar) {
      // Check for known character confusions
      const confusionKey = `${guessChar}→${solutionChar}`;
      
      if (CHARACTER_CONFUSIONS[confusionKey] && !foundConfusions.has(confusionKey)) {
        confusions.push(CHARACTER_CONFUSIONS[confusionKey]);
        foundConfusions.add(confusionKey);
      }
    }
  }
  
  return confusions;
};

// Check if guess has only character confusions (no other differences)
export const isOnlyCharacterConfusion = (guess: string, solution: string): boolean => {
  const guessNormalized = stripTones(guess).normalize('NFC').toLowerCase();
  const solutionNormalized = stripTones(solution).normalize('NFC').toLowerCase();
  
  if (guessNormalized.length !== solutionNormalized.length) {
    return false;
  }
  
  const confusions = detectCharacterConfusion(guess, solution);
  
  // Count total character differences
  let differences = 0;
  for (let i = 0; i < guessNormalized.length; i++) {
    if (guessNormalized[i] !== solutionNormalized[i]) {
      differences++;
    }
  }
  
  // If all differences are explained by known character confusions
  return confusions.length > 0 && differences === confusions.length;
};

// Generate hint message for character confusions
export const generateCharacterHintMessage = (confusions: CharacterHint[]): string => {
  if (confusions.length === 0) return '';
  
  if (confusions.length === 1) {
    return confusions[0].explanation;
  }
  
  // Multiple confusions
  const explanations = confusions.map(c => 
    `${c.correctChar} (${c.correctSound} like "${c.correctExample}") not ${c.confusedChar} (${c.confusedSound} like "${c.confusedExample}")`
  );
  
  return `Remember the differences: ${explanations.join(', ')}.`;
};

