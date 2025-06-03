import { NextRequest, NextResponse } from 'next/server';
import { genAI } from '@/lib/ai/gemini';
import { GoogleAuth } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Step 1: Use Gemini to enhance the prompt for better cover generation
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const enhancedPromptTemplate = `
Create a concise, professional book cover description for AI image generation. Keep it under 200 characters.

User input: "${prompt}"

Return only a clean, detailed visual description focusing on:
- Main visual elements
- Color scheme
- Style (realistic/artistic/minimalist)
- Mood/atmosphere

Make it suitable for book cover generation. No explanatory text, just the visual description.
`;

    const result = await model.generateContent(enhancedPromptTemplate);
    const response = await result.response;
    const enhancedPrompt = response.text().trim();

    // Step 2: Generate actual image using Google Cloud Vertex AI Imagen with Service Account auth
    const imageGenerationPrompt = `professional book cover, ${enhancedPrompt}, high quality, detailed, commercial book design`;
    
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    
    if (!projectId || !serviceAccountJson) {
      console.log('Google Cloud credentials not found, using placeholder...');
      return NextResponse.json({
        enhancedPrompt,
        imageUrl: `https://via.placeholder.com/768x1024/4A90E2/FFFFFF?text=${encodeURIComponent('Book Cover\n' + String(prompt).slice(0, 50) + '...')}`,
        message: "Add GOOGLE_CLOUD_PROJECT_ID and GOOGLE_SERVICE_ACCOUNT_JSON to environment variables for AI-generated images.",
        isPlaceholder: true
      });
    }

    try {
      // Parse the service account JSON
      const serviceAccountKey = JSON.parse(serviceAccountJson);
      
      // Create Google Auth client with Service Account
      const auth = new GoogleAuth({
        credentials: serviceAccountKey,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
      });

      // Get access token
      const authClient = await auth.getClient();
      const accessTokenResponse = await authClient.getAccessToken();
      const accessToken = accessTokenResponse.token;

      if (!accessToken) {
        throw new Error('Failed to get access token');
      }

      console.log('Successfully authenticated with Service Account');

      // Try Imagen 3.0 with Service Account authentication
      const vertexResponse = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{
              prompt: imageGenerationPrompt
            }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "3:4", // Perfect for book covers
              safetyFilterLevel: "block_some",
              personGeneration: "allow_adult"
            }
          })
        }
      );

      if (vertexResponse.ok) {
        const data = await vertexResponse.json();
        console.log('Vertex AI Imagen 3.0 response received successfully');
        
        // Check for the image in the response
        const imageData = data.predictions?.[0]?.bytesBase64Encoded;
        
        if (imageData) {
          const imageUrl = `data:image/png;base64,${imageData}`;
          return NextResponse.json({
            originalPrompt: prompt, // Add the original user prompt
            enhancedPrompt,
            imageUrl,
            message: "Image generated successfully with Google Cloud Vertex AI Imagen 3.0!",
            isPlaceholder: false
          });
        } else {
          console.log('No image data in response:', data);
        }
      } else {
        const errorData = await vertexResponse.text();
        console.log('Vertex AI Imagen 3.0 error:', vertexResponse.status, errorData);
      }

      // Fallback: Try the standard imagegeneration model
      const imageGenResponse = await fetch(
        `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagegeneration@006:predict`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{
              prompt: imageGenerationPrompt
            }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "3:4",
              includeRaiReason: false,
              seed: Math.floor(Math.random() * 1000000)
            }
          })
        }
      );

      if (imageGenResponse.ok) {
        const data = await imageGenResponse.json();
        console.log('Standard image generation response received successfully');
        
        const imageData = data.predictions?.[0]?.bytesBase64Encoded;
        
        if (imageData) {
          const imageUrl = `data:image/png;base64,${imageData}`;
          return NextResponse.json({
            enhancedPrompt,
            imageUrl,
            message: "Image generated successfully with Google Cloud Imagen!",
            isPlaceholder: false
          });
        } else {
          console.log('No image data in fallback response:', data);
        }
      } else {
        const errorData = await imageGenResponse.text();
        console.log('Standard image generation API error:', imageGenResponse.status, errorData);
      }

    } catch (authError) {
      console.error('Authentication or API error:', authError);
    }

    // Final fallback - enhanced placeholder
    return NextResponse.json({
      enhancedPrompt,
      imageUrl: `https://via.placeholder.com/768x1024/4A90E2/FFFFFF?text=${encodeURIComponent('Book Cover\n' + String(prompt).slice(0, 50) + '...')}`,
      message: "Authentication successful but image generation failed. Check your Google Cloud project setup and billing.",
      isPlaceholder: true
    });

  } catch (error) {
    console.error('Error generating image:', error);
    
    // Fallback to placeholder
    return NextResponse.json({
      enhancedPrompt: typeof prompt === 'string' ? prompt : 'Book Cover',
      imageUrl: `https://via.placeholder.com/768x1024/4A90E2/FFFFFF?text=${encodeURIComponent('Book Cover\nError occurred')}`,
      message: "Error occurred during generation. Generated placeholder image.",
      isPlaceholder: true
    });
  }
}
