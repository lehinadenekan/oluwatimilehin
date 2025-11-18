/**
 * Proper grapheme segmentation utilities for Yoruba text
 * Handles complex graphemes like 'ẹ́' (e with dot below + acute accent) as single characters
 */

// Check if Intl.Segmenter is available (modern browsers)
const hasIntlSegmenter = typeof Intl !== 'undefined' && 'Segmenter' in Intl;

// Create segmenter instance if available
const segmenter = hasIntlSegmenter ? new (Intl as any).Segmenter('en', { granularity: 'grapheme' }) : null;

/**
 * Properly segments a string into graphemes, handling complex Unicode characters
 * @param str The string to segment
 * @returns Array of graphemes (visual characters)
 */
export function getGraphemes(str: string): string[] {
  if (!str) return [];
  
  // Use Intl.Segmenter if available (most accurate)
  if (segmenter) {
    return Array.from(segmenter.segment(str), (segment: any) => segment.segment);
  }
  
  // Fallback for older browsers - improved manual segmentation
  return fallbackGraphemeSegmentation(str);
}

/**
 * Fallback grapheme segmentation for browsers without Intl.Segmenter
 * Handles most common Yoruba graphemes correctly
 */
function fallbackGraphemeSegmentation(str: string): string[] {
  const result: string[] = [];
  let i = 0;
  
  while (i < str.length) {
    const char = str[i];
    const codePoint = char.codePointAt(0);
    
    if (!codePoint) {
      i++;
      continue;
    }
    
    // Check if this is a combining character (diacritic)
    if (isCombiningCharacter(codePoint)) {
      // If we have a previous character, combine them
      if (result.length > 0) {
        result[result.length - 1] += char;
      } else {
        // Orphaned combining character - treat as separate
        result.push(char);
      }
    } else {
      // Regular character - check if next character is a combining character
      let grapheme = char;
      let j = i + 1;
      
      // Look ahead for combining characters
      while (j < str.length && isCombiningCharacter(str.codePointAt(j) || 0)) {
        grapheme += str[j];
        j++;
      }
      
      result.push(grapheme);
      i = j - 1; // Will be incremented at end of loop
    }
    
    i++;
  }
  
  return result;
}

/**
 * Check if a Unicode code point is a combining character (diacritic)
 */
function isCombiningCharacter(codePoint: number): boolean {
  // Combining Diacritical Marks (U+0300-U+036F)
  if (codePoint >= 0x0300 && codePoint <= 0x036F) return true;
  
  // Combining Diacritical Marks Extended (U+1AB0-U+1AFF)
  if (codePoint >= 0x1AB0 && codePoint <= 0x1AFF) return true;
  
  // Combining Diacritical Marks Supplement (U+1DC0-U+1DFF)
  if (codePoint >= 0x1DC0 && codePoint <= 0x1DFF) return true;
  
  // Combining Diacritical Marks for Symbols (U+20D0-U+20FF)
  if (codePoint >= 0x20D0 && codePoint <= 0x20FF) return true;
  
  return false;
}

/**
 * Count the number of graphemes in a string
 * @param str The string to count
 * @returns Number of graphemes
 */
export function countGraphemes(str: string): number {
  return getGraphemes(str).length;
}

/**
 * Test function to verify grapheme segmentation works correctly
 */
export function testGraphemeSegmentation(): void {
  const testCases = [
    { input: 'ẹ́', expected: 1, description: 'e with dot below + acute accent' },
    { input: 'ọ̀', expected: 1, description: 'o with dot below + grave accent' },
    { input: 'à', expected: 1, description: 'a with grave accent' },
    { input: 'é', expected: 1, description: 'e with acute accent' },
    { input: 'ẹ', expected: 1, description: 'e with dot below' },
    { input: 'ọ', expected: 1, description: 'o with dot below' },
    { input: 'oko', expected: 3, description: 'simple word' },
    { input: 'ẹ́kọ́', expected: 3, description: 'word with complex graphemes' },
    { input: 'ọ̀kọ̀', expected: 3, description: 'word with complex graphemes' },
  ];
  
  console.log('🧪 Testing grapheme segmentation:');
  testCases.forEach(({ input, expected, description }) => {
    const result = getGraphemes(input);
    const count = result.length;
    const passed = count === expected;
    console.log(`${passed ? '✅' : '❌'} "${input}" (${description}): ${count} graphemes (expected ${expected})`);
    if (!passed) {
      console.log(`   Graphemes: [${result.map(g => `"${g}"`).join(', ')}]`);
    }
  });
}

