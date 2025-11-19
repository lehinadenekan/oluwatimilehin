'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  detectCharacterConfusion, 
  isOnlyCharacterConfusion, 
  generateCharacterHintMessage,
  CharacterHint 
} from '../lib/yorubaCharacterHints';
import { useEnhancedStatistics } from './useEnhancedStatistics';
import { getGraphemes as getGraphemesProper, countGraphemes as countGraphemesProper } from '../lib/graphemeUtils';

// Helper function for case-insensitive Yoruba comparison
const normalizeForComparison = (text: string): string => {
  return text.normalize('NFC').toLowerCase();
};

// Define the structure for a tile's state
export type TileStatus = 'empty' | 'correct' | 'present' | 'absent';

export interface Tile {
  char: string;
  status: TileStatus;
}

export type KeyboardStatus = { [key: string]: TileStatus };

// Helper function to count graphemes (visual characters) in a string
const countGraphemes = (str: string): number => {
  // Use proper grapheme segmentation for complex Unicode characters
  return countGraphemesProper(str);
};

// Helper function to get graphemes from a string (handles null chars for empty positions)
const getGraphemes = (str: string): string[] => {
  // Use proper grapheme segmentation for complex Unicode characters
  return getGraphemesProper(str).map(char => 
    char === '\u0000' ? '' : char
  );
};

// Helper function to strip only tone marks (keep Yoruba dot-below)
// Removes: U+0300 (grave), U+0301 (acute)
// Keeps:   U+0323 (dot below) so ẹ/ọ remain after stripping tones
const stripAccents = (text: string): string => {
  const decomposed = text.normalize('NFD');
  const withoutTones = decomposed.replace(/[\u0300\u0301]/g, '');
  return withoutTones.normalize('NFC');
};

// Helper function to check for accent mismatch
const checkForAccentMismatch = (guess: string, solution: string): boolean => {
  const guessStripped = stripAccents(normalizeForComparison(guess));
  const solutionStripped = stripAccents(normalizeForComparison(solution));
  return guessStripped === solutionStripped && normalizeForComparison(guess) !== normalizeForComparison(solution);
};

  // Mobile debugging helper
  const debugMobile = (message: string, data?: any) => {
    if (typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)) {
      console.log(`[MOBILE DEBUG] ${message}`, data);
    }
    // Also log on desktop for debugging
    console.log(`[DEBUG] ${message}`, data);
  };

// The full set of characters allowed in the Yoruba Wordle.
const yorubaAlphabet = new Set([
  'a', 'à', 'á', 'ã', 'b', 'd', 'e', 'è', 'é', 'ẽ', 'ẹ', 'ẹ̀', 'ẹ́', 'ẹ̃', 'f', 'g', 
  'gb', 'h', 'i', 'ì', 'í', 'ĩ', 'j', 'k', 'l', 'm', 'n', 'o', 'ò', 'ó', 'õ', 
  'ọ', 'ọ̀', 'ọ́', 'ọ̃', 'p', 'r', 's', 'ṣ', 't', 'u', 'ù', 'ú', 'ũ', 'w', 'y'
].map(char => char.normalize('NFC')));

const useWordMaster = (difficulty?: 'easy' | 'intermediate', initialWordLength?: number) => {
  const actualDifficulty = difficulty ?? 'easy';
  const actualInitialWordLength = initialWordLength ?? 3;
  const [solution, setSolution] = useState<string>('');
  const [solutionVariants, setSolutionVariants] = useState<string[]>([]);
  const [solutionInfo, setSolutionInfo] = useState({
    partOfSpeech: '',
    englishTranslation: '',
    additionalInfo: ''
  });
  const [wordLength, setWordLength] = useState<number>(initialWordLength ?? 3);
  const [guesses, setGuesses] = useState<Tile[][]>(() => Array(6).fill(null).map(() => Array(initialWordLength ?? 3).fill({ char: '', status: 'empty' })));
  const [turn, setTurn] = useState<number>(0);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);
  const [isGameLost, setIsGameLost] = useState<boolean>(false);
  const [keyboardStatus, setKeyboardStatus] = useState<KeyboardStatus>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Progressive Hint System State
  const [hasRevealedLetter, setHasRevealedLetter] = useState<boolean>(false);
  const [revealedLetterPosition, setRevealedLetterPosition] = useState<number | null>(null);
  const [showLetterRevealModal, setShowLetterRevealModal] = useState<boolean>(false);
  const [showAccentModal, setShowAccentModal] = useState<boolean>(false);

  // Character Hint System State
  const [showCharacterHintModal, setShowCharacterHintModal] = useState<boolean>(false);
  const [characterHint, setCharacterHint] = useState<CharacterHint | null>(null);

  // User Input State - separate from revealed letters
  const [userInput, setUserInput] = useState<string>(''); // User's typed letters

  // Track previous guess for accent modal
  const [previousGuess, setPreviousGuess] = useState<string>('');

  // Enhanced Statistics Integration
  const { recordGameResult } = useEnhancedStatistics();
  const [gameStartTime, setGameStartTime] = useState<number>(Date.now());
  const [hintsUsedThisGame, setHintsUsedThisGame] = useState({
    characterHints: 0,
    toneGuidance: 0,
    letterReveals: 0
  });

  // Prevent multiple simultaneous submissions
  const isSubmitting = useRef<boolean>(false);

  // Prevent multiple simultaneous word fetches
  const isFetchingWord = useRef<boolean>(false);
  
  // Track current wordLength for async fetch validation
  const currentWordLengthRef = useRef<number>(wordLength);
  
  // Track when we're manually changing wordLength (should not sync from prop)
  const isManualWordLengthChange = useRef<boolean>(false);

  // New function for partial evaluation when tonal marks are wrong
  const evaluateGuessWithTonalMismatch = useCallback((guess: string, solution: string): Tile[] => {
    const normalizedGuess = guess.normalize('NFC');
    const normalizedSolution = solution.normalize('NFC');
    
    const guessChars = getGraphemes(normalizedGuess);
    const solutionChars = getGraphemes(normalizedSolution);

    const result: Tile[] = guessChars.map(char => ({ char, status: 'absent' }));
    const newKeyboardStatus = { ...keyboardStatus };

    // Create arrays to track which characters we can still match
    const solutionCharCount = solutionChars.reduce((acc, char) => {
      // Count base characters (without accents) for partial matching
      const baseChar = stripAccents(char);
      acc[baseChar] = (acc[baseChar] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // First pass: Mark correct letters (exact matches including tones)
    guessChars.forEach((char, i) => {
      if (char === solutionChars[i]) {
        result[i].status = 'correct';
        const baseChar = stripAccents(char);
        solutionCharCount[baseChar]--;
        newKeyboardStatus[char] = 'correct';
      }
    });

    // Second pass: Mark present letters (right base character, wrong position or tone)
    guessChars.forEach((char, i) => {
      if (result[i].status !== 'correct') {
        const baseGuessChar = stripAccents(char);
        
        // Check if this base character exists somewhere in the solution
        if (solutionCharCount[baseGuessChar] > 0) {
          result[i].status = 'present';
          solutionCharCount[baseGuessChar]--;
          if (newKeyboardStatus[char] !== 'correct') {
            newKeyboardStatus[char] = 'present';
          }
        } else {
          // Check if the base character matches the base of the character in this position
          const baseSolutionChar = stripAccents(solutionChars[i]);
          if (baseGuessChar === baseSolutionChar) {
            // Same base character, wrong tone - mark as present (yellow/purple)
            result[i].status = 'present';
            if (newKeyboardStatus[char] !== 'correct') {
              newKeyboardStatus[char] = 'present';
            }
          } else {
            // Different base character - mark as absent (grey)
            if (newKeyboardStatus[char] !== 'correct' && newKeyboardStatus[char] !== 'present') {
              newKeyboardStatus[char] = 'absent';
            }
          }
        }
      }
    });

    setKeyboardStatus(newKeyboardStatus);
    return result;
  }, [keyboardStatus]);

  // Helper function to check if guess matches any variant
  const checkGuessAgainstVariants = useCallback((guess: string, variants: string[]): boolean => {
    const normalizedGuess = normalizeForComparison(guess);
    return variants.some(variant => 
      normalizeForComparison(variant) === normalizedGuess
    );
  }, []);

  // Helper function to reveal random letter
  const revealRandomLetter = useCallback(() => {
    const solutionGraphemes = getGraphemes(solution);
    const availablePositions = solutionGraphemes.map((_, index) => index);
    const randomIndex = availablePositions[Math.floor(Math.random() * availablePositions.length)];
    setRevealedLetterPosition(randomIndex);
    setHasRevealedLetter(true);
    setShowLetterRevealModal(false);
    
    // Track letter reveal for statistics
    setHintsUsedThisGame(prev => ({ ...prev, letterReveals: prev.letterReveals + 1 }));
  }, [solution]);

  // FIXED: Helper function to build complete guess from user input + revealed letter
  const buildCompleteGuess = useCallback((): string => {
    const userGraphemes = getGraphemes(userInput);
    const result: string[] = Array(wordLength).fill('');
    
    // First, place the revealed letter at its correct position
    if (revealedLetterPosition !== null && revealedLetterPosition < wordLength) {
      const solutionGraphemes = getGraphemes(solution);
      if (solutionGraphemes[revealedLetterPosition]) {
        result[revealedLetterPosition] = solutionGraphemes[revealedLetterPosition];
      }
    }
    
    // Then map user input to available positions (skip revealed positions)
    let userInputIndex = 0;
    for (let resultIndex = 0; resultIndex < wordLength && userInputIndex < userGraphemes.length; resultIndex++) {
      // Skip positions that already have revealed letters
      if (revealedLetterPosition !== null && resultIndex === revealedLetterPosition) {
        continue; // Skip this position, it's already filled with revealed letter
      }
      
      // Place user input character at this available position
      if (userInputIndex < userGraphemes.length) {
        result[resultIndex] = userGraphemes[userInputIndex];
        userInputIndex++;
      }
    }
    
    // Use null character placeholder for empty positions to preserve structure
    const finalResult = result.map(char => char || '\u0000').join('');
    
    // Debug logging
    console.log('🔧 buildCompleteGuess FIXED:', {
      userInput,
      userGraphemes,
      wordLength,
      revealedLetterPosition,
      result,
      finalResult: finalResult.replace(/\u0000/g, '_'),
      userInputMappedCorrectly: userInputIndex === userGraphemes.length
    });
    
    return finalResult;
  }, [userInput, revealedLetterPosition, solution, wordLength]);

  // Helper function to clear revealed letter state
  const clearRevealedLetterState = useCallback(() => {
    setHasRevealedLetter(false);
    setRevealedLetterPosition(null);
  }, []);

  // Compute currentGuess from user input + revealed letter
  const currentGuess = buildCompleteGuess();

  const fetchWord = useCallback(async (length: number = 3) => {
    // Prevent multiple simultaneous fetches
    if (isFetchingWord.current) {
      console.log('⚠️ [useWordMaster] Fetch already in progress, skipping duplicate request');
      return;
    }
    
    isFetchingWord.current = true;
    
    try {
      console.log(`🌐 [useWordMaster] Fetching random word with length: ${length}, difficulty: ${actualDifficulty}`);
      const url = `/api/word-master/random-word?length=${length}&difficulty=${actualDifficulty}`;
      console.log('🌐 [useWordMaster] Making API request to:', url);
      
      const res = await fetch(url);
      console.log('🌐 Response status:', res.status);
      console.log('🌐 Response headers:', Object.fromEntries(res.headers));
      
      if (!res.ok) {
        console.error('🌐 HTTP error! status:', res.status);
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('🌐 Response is not JSON, content-type:', contentType);
        throw new Error('Response is not JSON');
      }
      
      const data = await res.json();
      console.log('🌐 Received word data:', data);
      
      // Check if API returned an error
      if (data.error) {
        console.error('🌐 API returned error:', data.error);
        // Store error message for user display
        const errorMsg = data.message || data.error || 'Failed to fetch word';
        throw new Error(`API error: ${errorMsg}`);
      }
      
      if (data.word && data.word.yorubaWord) {
        console.log('🌐 Valid word data received:', data.word);
        const receivedWordLength = countGraphemes(data.word.yorubaWord);
        
        // Validate word length matches request
        if (receivedWordLength !== length) {
          console.warn(`⚠️ [useWordMaster] API returned ${receivedWordLength}-letter word but ${length} was requested. Skipping this word.`);
          isFetchingWord.current = false;
          return; // Don't use mismatched word
        }
        
        // CRITICAL: Check if wordLength state has changed since we started the fetch
        // This prevents a slow 3-letter fetch from overwriting a fast 2-letter fetch
        // Use ref to get current value (not closure value)
        const currentWordLength = currentWordLengthRef.current;
        if (currentWordLength !== length) {
          console.warn(`⚠️ [useWordMaster] wordLength changed from ${length} to ${currentWordLength} during fetch. Discarding stale result and fetching new word.`);
          isFetchingWord.current = false;
          // Fetch the correct word length
          fetchWord(currentWordLength);
          return; // Don't use stale result
        }
        
        setSolution(data.word.yorubaWord.toLowerCase());
        
        // Store all variants if available
        if (data.word.variants && Array.isArray(data.word.variants)) {
          setSolutionVariants(data.word.variants.map((v: string) => v.toLowerCase()));
          console.log('🌐 Set solution variants:', data.word.variants);
        } else {
          // Fallback to just the primary solution
          setSolutionVariants([data.word.yorubaWord.toLowerCase()]);
        }
        
        setSolutionInfo({
          partOfSpeech: data.word.partOfSpeech,
          englishTranslation: data.word.englishTranslation,
          additionalInfo: data.word.additionalInfo,
        });
        console.log('🌐 Set solution:', data.word.yorubaWord.toLowerCase(), 'with length:', receivedWordLength);
      } else {
        console.error('🌐 Invalid word data structure:', data);
        throw new Error('Invalid word data received');
      }
    } catch (error) {
      console.error("🌐 Failed to fetch word:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("🌐 Error details:", {
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        url: `/api/word-master/random-word?length=${length}&difficulty=${actualDifficulty}`
      });
      
      // Check if it's a server error (500) - might be temporary
      const isServerError = error instanceof Error && (error.message.includes('500') || error.message.includes('status: 500'));
      
      // Retry once after a short delay for server errors
      if (isServerError) {
        console.log('🔄 Server error detected, retrying word fetch in 2 seconds...');
        setTimeout(() => {
          if (!isFetchingWord.current) {
            fetchWord(length);
          }
        }, 2000);
      } else {
        // Show user-friendly error message
        const errorMsg = "Could not load word. The word database may be temporarily unavailable. Please try refreshing the page.";
        setErrorMessage(errorMsg);
      }
    } finally {
      // Always reset fetch flag
      isFetchingWord.current = false;
    }
  }, [actualDifficulty]);

  // Sync internal state when prop changes (e.g., after preferences load)
  // BUT NOT when we're manually changing the word length (e.g., from settings)
  useEffect(() => {
    if (!isManualWordLengthChange.current && initialWordLength !== undefined && initialWordLength !== wordLength) {
      console.log(`🔄 [useWordMaster] Syncing wordLength from ${wordLength} to ${initialWordLength}`);
      setWordLength(initialWordLength);
    }
  }, [initialWordLength, wordLength]);

  // Update ref whenever wordLength changes
  useEffect(() => {
    currentWordLengthRef.current = wordLength;
    console.log(`📏 [useWordMaster] Updated currentWordLengthRef to ${wordLength}`);
  }, [wordLength]);
  
  useEffect(() => {
    console.log(`📄 [useWordMaster] Effect triggered - fetching word with length: ${wordLength}, difficulty: ${actualDifficulty}`);
    fetchWord(wordLength);
  }, [fetchWord, wordLength, actualDifficulty]);
  
  // Resize guesses array when wordLength changes (e.g., after preferences load from localStorage)
  useEffect(() => {
    console.log(`📏 [useWordMaster] wordLength changed to ${wordLength}, resizing guesses array`);
    setGuesses(Array(6).fill(null).map(() => Array(wordLength).fill({ char: '', status: 'empty' })));
  }, [wordLength]);

  // Start new game function - resets all state and fetches new word
  const startNewGame = useCallback(async () => {
    // Reset all game state
    setGuesses(Array(6).fill(null).map(() => Array(wordLength).fill({ char: '', status: 'empty' })));
    setUserInput(''); // Clear user input
    setTurn(0);
    setIsGameWon(false);
    setIsGameLost(false);
    setKeyboardStatus({});
    setErrorMessage('');
    setSolutionVariants([]);
    
    // Reset Progressive Hint System state
    setHasRevealedLetter(false);
    setRevealedLetterPosition(null);
    setShowLetterRevealModal(false);
    setShowAccentModal(false);
    
    // Reset Character Hint System state
    setShowCharacterHintModal(false);
    setCharacterHint(null);
    
    // Reset Enhanced Statistics tracking
    setGameStartTime(Date.now());
    setHintsUsedThisGame({
      characterHints: 0,
      toneGuidance: 0,
      letterReveals: 0
    });
    
    // Fetch new random word
    await fetchWord(wordLength);
  }, [fetchWord, wordLength]);

  // Start new game with specific word length
  const startNewGameWithLength = useCallback(async (length: number) => {
    // Mark that we're manually changing wordLength - don't sync from prop
    isManualWordLengthChange.current = true;
    
    // Reset all game state with new length
    setGuesses(Array(6).fill(null).map(() => Array(length).fill({ char: '', status: 'empty' })));
    setUserInput(''); // Clear user input
    setTurn(0);
    setIsGameWon(false);
    setIsGameLost(false);
    setKeyboardStatus({});
    setErrorMessage('');
    setSolutionVariants([]);
    
    // Reset Progressive Hint System state
    setHasRevealedLetter(false);
    setRevealedLetterPosition(null);
    setShowLetterRevealModal(false);
    setShowAccentModal(false);
    
    // Reset Character Hint System state
    setShowCharacterHintModal(false);
    setCharacterHint(null);
    
    // Reset Enhanced Statistics tracking
    setGameStartTime(Date.now());
    setHintsUsedThisGame({
      characterHints: 0,
      toneGuidance: 0,
      letterReveals: 0
    });
    
    // Set wordLength last - this triggers the useEffect that fetches the word automatically
    setWordLength(length);
    
    // Allow syncing again after a brief delay
    setTimeout(() => {
      isManualWordLengthChange.current = false;
    }, 100);
  }, []);

  const evaluateGuess = useCallback((guess: string): Tile[] => {
    const normalizedGuess = guess.normalize('NFC');
    const normalizedSolution = solution.normalize('NFC');
    
    const guessChars = getGraphemes(normalizedGuess);
    const solutionChars = getGraphemes(normalizedSolution);

    const result: Tile[] = guessChars.map(char => ({ char, status: 'absent' }));
    const newKeyboardStatus = { ...keyboardStatus };

    // Count solution characters by base character (tone-insensitive, dot-below preserved)
    const solutionBaseCount = solutionChars.reduce((acc, char) => {
      const base = stripAccents(char); // removes tones only
      acc[base] = (acc[base] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // First pass: exact matches (including tones) → correct
    guessChars.forEach((char, i) => {
      if (char === solutionChars[i]) {
        result[i].status = 'correct';
        const base = stripAccents(char);
        solutionBaseCount[base]--;
        newKeyboardStatus[char] = 'correct';
      }
    });

    // Second pass: base-letter matches (tone mismatch or wrong position) → present
    guessChars.forEach((char, i) => {
      if (result[i].status !== 'correct') {
        const baseGuess = stripAccents(char);
        if (solutionBaseCount[baseGuess] > 0) {
          result[i].status = 'present';
          solutionBaseCount[baseGuess]--;
          if (newKeyboardStatus[char] !== 'correct') {
            newKeyboardStatus[char] = 'present';
          }
        } else {
          if (newKeyboardStatus[char] !== 'correct' && newKeyboardStatus[char] !== 'present') {
            newKeyboardStatus[char] = 'absent';
          }
        }
      }
    });

    setKeyboardStatus(newKeyboardStatus);
    return result;
  }, [solution, keyboardStatus]);

  const submitGuess = useCallback(async () => {
    debugMobile('SubmitGuess called', { turn, isGameWon, isGameLost, userInput });
    
    // Prevent multiple simultaneous submissions
    if (isSubmitting.current) {
      debugMobile('Submit already in progress, ignoring duplicate submission');
      return;
    }
    
    isSubmitting.current = true;
    
    try {
      const completeGuess = buildCompleteGuess();
      // Count non-null characters for proper length validation
      const nonNullChars = getGraphemes(completeGuess).filter(char => char && char !== '\u0000').length;
      
      if (nonNullChars !== wordLength) {
        setErrorMessage("Not enough letters");
        setTimeout(() => setErrorMessage(''), 2000);
        return;
      }
      
      // Use functional state check to prevent stale closures
      const currentGameState = {
        turn: turn,
        isGameWon: isGameWon,
        isGameLost: isGameLost
      };
      
      if (currentGameState.turn >= 6 || currentGameState.isGameWon || currentGameState.isGameLost) {
        console.log('Game already ended or turn limit reached');
        return;
      }

      // Check for duplicate guesses
      const normalizedCompleteGuess = normalizeForComparison(completeGuess);
      const previousGuesses = guesses.slice(0, currentGameState.turn).map(guess => 
        guess.map(tile => tile.char).join('')
      );
      const normalizedPreviousGuesses = previousGuesses.map(guess => normalizeForComparison(guess));

      if (normalizedPreviousGuesses.includes(normalizedCompleteGuess)) {
        setErrorMessage("You've already guessed this word");
        setTimeout(() => setErrorMessage(''), 2000);
        return;
      }

      // Validate word
      console.log('Validating guess:', completeGuess);
      const normalizedGuess = normalizeForComparison(completeGuess);
      const res = await fetch('/api/word-master/validate-guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: normalizedGuess }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Validation response:', data);

      if (!data.isValid) {
        debugMobile('Invalid word, checking accent mismatch', { completeGuess, solution });
        
        // Check for character confusions FIRST (before other checks)
        const confusions = detectCharacterConfusion(completeGuess, solution);
        if (confusions.length > 0 && isOnlyCharacterConfusion(completeGuess, solution)) {
          debugMobile('Character confusion detected, showing modal');
          
          // Track character hint usage
          setHintsUsedThisGame(prev => ({ ...prev, characterHints: prev.characterHints + 1 }));
          
          // Submit the guess to the game board first
          const evaluatedGuess = evaluateGuess(completeGuess);
          setGuesses(prev => {
            const newGuesses = [...prev];
            newGuesses[currentGameState.turn] = evaluatedGuess;
            return newGuesses;
          });
          
          // Store the guess for modal display
          setPreviousGuess(completeGuess);
          
          // Show character hint modal
          setCharacterHint(confusions[0]); // For now, show first confusion
          setShowCharacterHintModal(true);
          
          // Clear user input and advance turn atomically
          setUserInput('');
          setTurn(prev => {
            const newTurn = prev + 1;
            
            // Check if this was the last turn
            if (newTurn === 6) {
              setIsGameLost(true);
              
              // Record game result for loss
              const timeToComplete = Date.now() - gameStartTime;
              const characterConfusions = confusions.map(c => `${c.confusedChar}→${c.correctChar}`);
              
              recordGameResult(
                false, // won
                6, // guessCount
                solution, // word
                wordLength, // wordLength
                actualDifficulty, // difficulty
                hintsUsedThisGame, // hintsUsed
                timeToComplete, // timeToComplete
                characterConfusions // characterConfusions
              );
            }
            
            return newTurn;
          });
          
          return;
        }
        
        // Check for accent mismatch first
        if (checkForAccentMismatch(completeGuess, solution)) {
          debugMobile('Accent mismatch detected, performing partial evaluation');
          
          // Track tone guidance usage
          setHintsUsedThisGame(prev => ({ ...prev, toneGuidance: prev.toneGuidance + 1 }));
          
          // NEW BEHAVIOR: Perform partial evaluation before showing modal
          const partialEvaluation = evaluateGuessWithTonalMismatch(completeGuess, solution);
          setGuesses(prev => {
            const newGuesses = [...prev];
            newGuesses[currentGameState.turn] = partialEvaluation;
            return newGuesses;
          });
          
          // Store the guess for modal display
          setPreviousGuess(completeGuess);
          
          // Show accent modal with visual progress
          setShowAccentModal(true);
          
          // Clear user input and advance turn atomically
          setUserInput('');
          setTurn(prev => {
            const newTurn = prev + 1;
            
            // Check if this was the last turn
            if (newTurn === 6) {
              setIsGameLost(true);
              
              // Record game result for loss
              const timeToComplete = Date.now() - gameStartTime;
              const characterConfusions: string[] = [];
              
              recordGameResult(
                false, // won
                6, // guessCount
                solution, // word
                wordLength, // wordLength
                actualDifficulty, // difficulty
                hintsUsedThisGame, // hintsUsed
                timeToComplete, // timeToComplete
                characterConfusions // characterConfusions
              );
            }
            
            return newTurn;
          });
          
          return;
        } else {
          debugMobile('Word not in dictionary, showing error');
          setErrorMessage("Word not found in dictionary - it doesn't exist");
          setTimeout(() => setErrorMessage(''), 2000);
        }
        return;
      }

      // Valid word - process normally
      const evaluatedGuess = evaluateGuess(completeGuess);
      setGuesses(prev => {
        const newGuesses = [...prev];
        newGuesses[currentGameState.turn] = evaluatedGuess;
        return newGuesses;
      });

      // Check if guess is incorrect (not all correct)
      const isIncorrectGuess = evaluatedGuess.some(tile => tile.status !== 'correct');

      // If incorrect and the only mismatch is tonal accents, show accent modal (even for valid words)
      if (isIncorrectGuess && checkForAccentMismatch(completeGuess, solution)) {
        // Track tone guidance usage
        setHintsUsedThisGame(prev => ({ ...prev, toneGuidance: prev.toneGuidance + 1 }));
        setPreviousGuess(completeGuess);
        setShowAccentModal(true);
      } else if (isIncorrectGuess && !hasRevealedLetter && !isGameWon) {
        // Otherwise, offer letter reveal as before
        setShowLetterRevealModal(true);
      }

      // Check if guess matches any variant (including the primary solution)
      if (checkGuessAgainstVariants(completeGuess, solutionVariants)) {
        setIsGameWon(true);
        clearRevealedLetterState(); // Clear revealed letter when game is won
        
        // Record game result for win
        const timeToComplete = Date.now() - gameStartTime;
        const characterConfusions = characterHint ? [`${characterHint.confusedChar}→${characterHint.correctChar}`] : [];
        
        recordGameResult(
          true, // won
          currentGameState.turn + 1, // guessCount
          solution, // word
          wordLength, // wordLength
          actualDifficulty, // difficulty
          hintsUsedThisGame, // hintsUsed
          timeToComplete, // timeToComplete
          characterConfusions // characterConfusions
        );
      }

      // Clear user input and advance turn atomically
      setUserInput('');
      setTurn(prev => {
        const newTurn = prev + 1;
        
        // Check if this was the last turn and game is lost
        if (newTurn === 6 && !checkGuessAgainstVariants(completeGuess, solutionVariants)) {
          setIsGameLost(true);
          clearRevealedLetterState(); // Clear revealed letter when game is lost
          
          // Record game result for loss
          const timeToComplete = Date.now() - gameStartTime;
          const characterConfusions = characterHint ? [`${characterHint.confusedChar}→${characterHint.correctChar}`] : [];
          
          recordGameResult(
            false, // won
            6, // guessCount
            solution, // word
            wordLength, // wordLength
            actualDifficulty, // difficulty
            hintsUsedThisGame, // hintsUsed
            timeToComplete, // timeToComplete
            characterConfusions // characterConfusions
          );
        }
        
        return newTurn;
      });
      
    } catch (error) {
      console.error('Error validating guess:', error);
      setErrorMessage("Error validating word");
      setTimeout(() => setErrorMessage(''), 2000);
    } finally {
      // Always reset submission flag
      isSubmitting.current = false;
    }
  }, [guesses, turn, isGameWon, isGameLost, wordLength, solution, solutionVariants, hasRevealedLetter, buildCompleteGuess, checkGuessAgainstVariants, evaluateGuess, evaluateGuessWithTonalMismatch, gameStartTime, difficulty, hintsUsedThisGame, characterHint, recordGameResult, clearRevealedLetterState]);

  const handleKeyPress = useCallback((key: string, allowInteraction: boolean = false) => {
    const lowerKey = key.toLowerCase().normalize('NFC');
    console.log('Handling key press:', lowerKey);
    console.log('Unicode points:', Array.from(lowerKey).map(c => c.charCodeAt(0)));

    // Prevent input during modal states
    if (showCharacterHintModal || showAccentModal || showLetterRevealModal) {
      console.log('Input blocked - modal is active');
      return;
    }

    // Prevent input during submission
    if (isSubmitting.current) {
      console.log('Input blocked - submission in progress');
      return;
    }

    if ((isGameWon || isGameLost) && !allowInteraction) return;

    if (lowerKey === 'enter') {
      submitGuess();
      return;
    }

    if (lowerKey === 'backspace') {
      // Simple: just remove last character from user input
      // Revealed letter is handled separately and won't be affected
      const userGraphemes = getGraphemes(userInput);
      if (userGraphemes.length > 0) {
        userGraphemes.pop();
        setUserInput(userGraphemes.join(''));
      }
      return;
    }

    // Handle 'gb' as a single character
    if (lowerKey === 'gb') {
      const totalUserChars = countGraphemes(userInput);
      // Calculate max user chars: total slots minus revealed letter slots
      const revealedSlots = revealedLetterPosition !== null ? 1 : 0;
      const maxUserChars = wordLength - revealedSlots;
      
      if (totalUserChars < maxUserChars) {
        setUserInput((prev) => prev + 'gb');
      }
      return;
    }

    // Regular character input
    if (yorubaAlphabet.has(lowerKey)) {
      const totalUserChars = countGraphemes(userInput);
      // Calculate max user chars: total slots minus revealed letter slots
      const revealedSlots = revealedLetterPosition !== null ? 1 : 0;
      const maxUserChars = wordLength - revealedSlots;
      
      if (totalUserChars < maxUserChars) {
        setUserInput((prev) => prev + lowerKey);
      }
    }
  }, [userInput, wordLength, revealedLetterPosition, isGameWon, isGameLost, submitGuess, showCharacterHintModal, showAccentModal, showLetterRevealModal]);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't intercept keyboard events if user is typing in an input field or textarea
      const target = event.target as HTMLElement
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable ||
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA'
      ) {
        return // Allow normal input behavior in form fields
      }

      const key = event.key.toLowerCase();
      
      // Prevent default behavior for game keys
      if (['enter', 'backspace', 'gb'].includes(key) || yorubaAlphabet.has(key)) {
        event.preventDefault();
      }
      
      // For physical keyboard, we don't allow interaction when game is won/lost
      // This maintains the original behavior for physical keyboard
      handleKeyPress(key, false);
    };

    // Mobile-specific touch handling
    const handleTouchStart = (event: TouchEvent) => {
      // Improve mobile responsiveness
      if (event.target instanceof HTMLButtonElement) {
        // Allow button touch events to propagate normally
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    // Add mobile touch optimization
    if (typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)) {
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (typeof window !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent)) {
        document.removeEventListener('touchstart', handleTouchStart);
      }
    };
  }, [handleKeyPress]);

  return {
    solution,
    solutionVariants,
    solutionInfo,
    guesses,
    currentGuess, // This is now computed from userInput + revealed letter
    userInput, // Export for debugging if needed
    turn,
    isGameWon,
    isGameLost,
    keyboardStatus,
    errorMessage,
    wordLength,
    handleKeyPress,
    startNewGame,
    startNewGameWithLength,
    // Progressive Hint System
    hasRevealedLetter,
    revealedLetterPosition,
    showLetterRevealModal,
    showAccentModal,
    revealRandomLetter,
    setShowLetterRevealModal,
    setShowAccentModal,
    // Character Hint System
    showCharacterHintModal,
    characterHint,
    setShowCharacterHintModal,
    setCharacterHint,
    // Track previous guess for accent modal
    previousGuess,
    setPreviousGuess,
    // Revealed letter state management
    clearRevealedLetterState
  };
};

export default useWordMaster;