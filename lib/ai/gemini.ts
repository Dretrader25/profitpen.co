import { GoogleGenerativeAI } from '@google/generative-ai';
import { Genre, Tone, Audience } from '../store/storyStore';
import { generateStoryConceptPrompt } from './generateStoryConcept';

// Debug logging
console.log('API Key available:', !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);
console.log('API Key length:', process.env.NEXT_PUBLIC_GEMINI_API_KEY?.length);

export const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const generateStoryConcept = async (
  idea: string,
  genre: Genre,
  tone: Tone,
  audience: Audience
) => {
  console.log('generateStoryConcept called with:', { idea, genre, tone, audience });
  
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = generateStoryConceptPrompt(idea, genre, tone, audience);

  console.log('Making API call to Gemini...');
  const result = await model.generateContent(prompt);
  console.log('API call completed, processing response...');
  const response = await result.response;
  const text = response.text();
  console.log('Response text received, length:', text.length);
  
  try {
    // Clean the response text
    let jsonStr = text.trim();
    
    // Remove markdown code block markers and any language specifier
    jsonStr = jsonStr.replace(/```(?:json)?\n?|\n?```/g, '');
    
    // Remove any leading/trailing non-JSON text
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON object found in response');
    }
    jsonStr = jsonMatch[0];
    
    // Remove any control characters
    jsonStr = jsonStr.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
    
    // Try to parse the JSON
    let storyData;
    try {
      storyData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Initial parse failed, attempting to fix JSON:', parseError);
      // Try to fix common JSON issues
      jsonStr = jsonStr
        // Fix missing quotes around property names
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
        // Fix trailing commas
        .replace(/,(\s*[}\]])/g, '$1')
        // Fix missing commas
        .replace(/"\s*}\s*"/g, '", "')
        // Fix unescaped quotes in strings
        .replace(/(?<!\\)"/g, '\\"')
        // Fix newlines in strings
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');
      
      try {
        storyData = JSON.parse(jsonStr);
      } catch (secondParseError) {
        console.error('Second parse attempt failed:', secondParseError);
        console.error('Cleaned JSON string:', jsonStr);
        throw new Error('Failed to parse JSON response after cleaning');
      }
    }
    
    // Validate the required structure
    const requiredFields = [
      'title', 'premise', 'shortDraft', 'themes',
      'worldBuilding', 'characterFramework', 'storyStructure'
    ];
    
    for (const field of requiredFields) {
      if (!storyData[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
    
    return storyData;
  } catch (error) {
    console.error('Error parsing story concept:', error);
    console.error('Raw response:', text);
    throw new Error('Failed to generate story concept. Please try again.');
  }
};

export async function generateChapter(
  chapterNumber: number,
  previousChapters: string[],
  storyContext: string,
  chapterTitle?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are an elite chapter writer crafting a concise, impactful chapter.

    CHAPTER ASSIGNMENT: Write Chapter ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ''} in exactly 150-200 words.

    STORY FOUNDATION: ${storyContext}
    
    PREVIOUS CHAPTER CONTEXT:
    ${previousChapters.slice(-2).join('\n\n---\n\n')}
    
    QUALITY REQUIREMENTS:
    ✓ Hook readers with the first sentence
    ✓ Build tension and character depth
    ✓ Advance the plot meaningfully
    ✓ Create emotional investment
    ✓ End with a compelling hook for the next chapter

    STRUCTURE (150-200 words total):
    1. Opening Hook (40-50 words): Set the scene and tension
    2. Core Development (80-100 words): Key plot/character development
    3. Resolution/Hook (30-50 words): Satisfying conclusion with next-chapter tease

    Return the chapter in this HTML structure:

    <div class="page">
      <div class="page-header">
        <span class="page-number">[page_number]</span>
        <span class="chapter-title">Chapter [number]: [title]</span>
      </div>
      <div class="page-content">
        <h2 class="chapter-heading">Chapter [number]: [title]</h2>
        <div class="chapter-opening">
          <p class="chapter-text">[opening hook]</p>
        </div>
        <div class="chapter-divider"></div>
        <div class="chapter-main">
          <p class="chapter-text">[core development]</p>
        </div>
        <div class="chapter-divider"></div>
        <div class="chapter-closing">
          <p class="chapter-text">[resolution/hook]</p>
        </div>
      </div>
      <div class="page-footer">
        <span class="footer-text">ProfitPen.co</span>
      </div>
    </div>`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text();
    
    // Clean up the content
    content = content.trim();
    content = content.replace(/```(?:html)?\n?|\n?```/g, '');
    content = content.replace(/[*_~`]/g, '');
    content = content.replace(/\n\s*\n/g, '\n').trim();
    
    // Calculate page number (chapter + 2 for empty page and TOC)
    const pageNumber = chapterNumber + 2;
    
    // Ensure the content has the proper structure
    if (!content.includes('<div class="page">')) {
      content = `
        <div class="page">
          <div class="page-header">
            <span class="page-number">${pageNumber}</span>
            <span class="chapter-title">Chapter ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ''}</span>
          </div>
          <div class="page-content">
            <h2 class="chapter-heading">Chapter ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ''}</h2>
            <div class="chapter-opening">
              <p class="chapter-text">${content}</p>
            </div>
          </div>
          <div class="page-footer">
            <span class="footer-text">ProfitPen.co</span>
          </div>
        </div>`;
    }
    
    // Ensure word count is appropriate (150-200 words)
    const textContent = content.replace(/<[^>]*>/g, '');
    const words = textContent.split(/\s+/);
    if (words.length > 200) {
      // Find the last complete sentence within the 200-word limit
      const truncatedText = words.slice(0, 200).join(' ');
      const lastPeriod = truncatedText.lastIndexOf('.');
      const finalText = truncatedText.substring(0, lastPeriod + 1);
      
      // Update the content with the truncated text
      content = content.replace(/<p class="chapter-text">([\s\S]*?)<\/p>/g, 
        `<p class="chapter-text">${finalText}</p>`);
    } else if (words.length < 150) {
      // Add a brief hook for the next chapter if content is too short
      const hookText = ' The stage is set for the next chapter, where these developments will take an unexpected turn...';
      content = content.replace(/<div class="chapter-closing">([\s\S]*?)<\/div>/g,
        `<div class="chapter-closing">$1${hookText}</div>`);
    }
    
    return content;
  } catch (error) {
    console.error('Error generating chapter:', error);
    throw error;
  }
}

function generateChapterPrompt(
  chapterNumber: number,
  previousChapters: string[],
  storyContext: string,
  chapterTitle?: string
): string {
  return `You are writing a chapter for a book. The chapter should be well-structured and engaging.

Context:
- This is Chapter ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ''}
- The book's themes include: ${storyContext}
- Previous chapters have covered: ${previousChapters.length > 0 ? previousChapters.join(', ') : 'This is the first chapter'}

Requirements:
1. Write an engaging opening paragraph that introduces the chapter's main theme
2. The content should be professional and well-structured
3. Use clear, concise language
4. Include relevant examples or explanations
5. Maintain a consistent tone throughout
6. The content should be suitable for a book chapter
7. Focus on creating content that will be displayed in a book-like format with proper headers and sections
8. Ensure the content flows naturally and maintains professional formatting

Please write the main content for this chapter. Focus on the opening section that will be displayed in the preview. The content will be automatically formatted with proper HTML structure and styling.`;
}