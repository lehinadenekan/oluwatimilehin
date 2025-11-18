export interface WordleWord {
  id: string;
  word: string;
  part_of_speech: string;
  english_translation: string;
  example_sentence?: string;
  variants?: string[]; // All valid spellings for this word
}

export type GuessResult = {
  letter: string;
  status: 'correct' | 'present' | 'absent';
}

export interface GameState {
  currentGuess: string;
  guesses: string[];
  results: GuessResult[][];
  gameStatus: 'playing' | 'won' | 'lost';
  solution?: WordleWord;
  error?: string;
}

// Constants for game configuration
export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

// Special Yoruba characters that need to be handled
export const YORUBA_SPECIAL_CHARS = ['ẹ', 'ọ', 'ṣ', 'à', 'á', 'è', 'é', 'ì', 'í', 'ò', 'ó', 'ù', 'ú', 'ẹ̀', 'ẹ́', 'ọ̀', 'ọ́', 'gb'];

