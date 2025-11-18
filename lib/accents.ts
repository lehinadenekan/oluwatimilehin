/**
 * Extracts the combining diacritical mark from a character, ignoring the Yoruba dot below.
 * e.g., 'à' -> '`'
 * e.g., 'ẹ' -> null
 * @param char The character to process.
 * @returns The diacritical mark or null if not found or is a dot below.
 */
export function getDiacritic(char: string): string | null {
  if (char.length !== 1) {
    return null;
  }
  
  const normalized = char.normalize('NFD');
  if (normalized.length > 1) {
    const diacritic = normalized.substring(1);
    
    // Explicitly ignore the Yoruba dot below
    if (diacritic.includes('\u0323')) {
        return null;
    }
    
    // Return common accents
    if (diacritic === '\u0300') return '`'; // grave
    if (diacritic === '\u0301') return '´'; // acute
    
    // Fallback for other potential marks, though less common in this context
    return diacritic;
  }
  
  return null;
}

// Create named export object
const accentsModule = { getDiacritic };

// Add default export to ensure module recognition
export default accentsModule;

