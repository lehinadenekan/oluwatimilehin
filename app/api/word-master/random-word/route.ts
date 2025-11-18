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

export async function GET(request: Request) {
  try {
    // Get parameters from query string
    const { searchParams } = new URL(request.url);
    const lengthParam = searchParams.get('length');
    const difficultyParam = searchParams.get('difficulty');
    
    // Default to 'easy' difficulty
    let difficulty: 'easy' | 'intermediate' = 'easy';
    if (difficultyParam === 'intermediate') {
      difficulty = 'intermediate';
    }
    
    // Default to length 3
    const wordLength = lengthParam ? parseInt(lengthParam, 10) : 3;
    
    console.log(`🔵 [API] Proxying request to Wisdom Deck - length=${wordLength}, difficulty=${difficulty}`);
    
    // Validate word length
    if (wordLength < 2 || wordLength > 7) {
      return corsResponse(
        NextResponse.json(
          { error: 'Word length must be between 2 and 7' },
          { status: 400 }
        )
      );
    }

    // Proxy to Wisdom Deck API
    const wisdomDeckUrl = `https://www.wisdomdeck.online/api/word-master/random-word?length=${wordLength}&difficulty=${difficulty}`;
    console.log(`🔵 [API] Fetching from: ${wisdomDeckUrl}`);
    
    const response = await fetch(wisdomDeckUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log(`🔵 [API] Response status: ${response.status}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🔵 [API] Wisdom Deck API error: ${response.status} - ${errorText}`);
      throw new Error(`Wisdom Deck API returned ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Check if the response contains an error
    if (data.error) {
      console.error(`🔵 [API] Wisdom Deck API returned error: ${data.error}`);
      throw new Error(`Wisdom Deck API error: ${data.error}`);
    }
    
    console.log('✅ Successfully fetched word from Wisdom Deck');
    
    return corsResponse(NextResponse.json(data));
  } catch (error) {
    console.error('❌ Error in random word API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return corsResponse(
      NextResponse.json(
        { 
          error: 'Failed to fetch random word',
          details: errorMessage,
          message: 'The word database is temporarily unavailable. Please try again later.'
        },
        { status: 500 }
      )
    );
  }
}

