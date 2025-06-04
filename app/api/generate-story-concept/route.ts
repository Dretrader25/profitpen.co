// app/api/generate-story-concept/route.ts
import { NextResponse } from 'next/server';
import { generateStoryConcept } from '@/lib/ai/gemini'; // Import the function
import type { Genre, Tone, Audience } from '@/lib/store/storyStore'; // Import types

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idea, genre, tone, audience } = body;

    // Basic validation for required parameters
    if (!idea || !genre || !tone || !audience) {
      return NextResponse.json({ error: 'Missing required parameters: idea, genre, tone, audience' }, { status: 400 });
    }

    console.log('API Route: Calling generateStoryConcept with:', { idea, genre, tone, audience });

    // Call the existing generateStoryConcept function
    // Note: This will use the genAI instance in lib/ai/gemini.ts,
    // which is initialized with NEXT_PUBLIC_GEMINI_API_KEY.
    // For enhanced security in production, this should ideally use a server-only API key.
    const storyConceptResult = await generateStoryConcept(
      idea as string,
      genre as Genre,
      tone as Tone,
      audience as Audience
    );

    console.log('API Route: storyConceptResult:', storyConceptResult);
    return NextResponse.json(storyConceptResult);

  } catch (error) {
    console.error('Error in /api/generate-story-concept:', error);
    let errorMessage = 'An unknown error occurred while generating the story concept.';
    let errorDetails: any = error;

    if (error instanceof Error) {
      errorMessage = error.message; // Use the message from the thrown error
      // If the error has a specific structure you expect from generateStoryConcept,
      // you might want to extract more details or a specific status code.
    }

    // It's good to hide detailed errors from the client in production,
    // but for debugging, sending some detail can be helpful.
    // The original error from generateStoryConcept might be more user-friendly.
    return NextResponse.json({ error: errorMessage, details: errorDetails?.toString() }, { status: 500 });
  }
}
