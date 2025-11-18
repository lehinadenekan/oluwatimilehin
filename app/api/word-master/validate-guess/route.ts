import { NextResponse } from 'next/server';

// Helper function to handle CORS
function corsResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return corsResponse(new NextResponse(null, { status: 200 }));
}

export async function POST(request: Request) {
  try {
    console.log('🔍 VALIDATION ENDPOINT START 🔍');
    
    const body = await request.json();
    const { guess } = body;

    console.log('📝 GUESS RECEIVED:', {
      guess,
      type: typeof guess,
      length: guess?.length,
      normalized: guess?.normalize('NFC'),
    });

    // Validate input
    if (!guess || typeof guess !== 'string') {
      console.log('❌ VALIDATION FAILED: Invalid input type');
      return corsResponse(
        NextResponse.json(
          { error: 'Invalid guess provided' },
          { status: 400 }
        )
      );
    }

    // Normalize the guess
    const normalizedGuess = guess.normalize('NFC');

    console.log('🔤 NORMALIZED GUESS:', {
      original: guess,
      normalized: normalizedGuess,
    });

    // Proxy to Wisdom Deck API
    console.log('📚 PROXYING TO WISDOM DECK API...');
    const wisdomDeckUrl = 'https://www.wisdomdeck.online/api/word-master/validate-guess';
    const response = await fetch(wisdomDeckUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guess: normalizedGuess }),
    });
    
    if (!response.ok) {
      throw new Error(`Wisdom Deck API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ VALIDATION RESULT:', data);

    return corsResponse(NextResponse.json(data));
  } catch (error) {
    console.error('💥 VALIDATION ERROR:', error);
    return corsResponse(
      NextResponse.json(
        { error: 'Failed to validate guess', details: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )
    );
  }
}

