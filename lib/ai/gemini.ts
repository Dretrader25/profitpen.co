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

  const prompt = `You are an expert data analyst generating a detailed section for a property report, adhering to a word count of 150-200 words for this section.

    DATA SECTION ASSIGNMENT: Generate Section ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ' (e.g., Ownership History, Tax Assessment Details, Comparable Sales Analysis)'} in exactly 150-200 words.

    PROPERTY CONTEXT: ${storyContext} {/* Assuming storyContext will now be propertyAddressOrID or similar */}
    
    PREVIOUS DATA SECTIONS (if applicable, for context):
    ${previousChapters.slice(-2).join('\n\n---\n\n')}
    
    QUALITY REQUIREMENTS:
    ✓ Provide clear and accurate data.
    ✓ Ensure information is concise and directly relevant to the section topic.
    ✓ Offer actionable insights or key takeaways where appropriate.
    ✓ Maintain a professional and objective tone.
    ✓ Structure the information logically.

    STRUCTURE (150-200 words total):
    1. Data Summary (40-50 words): Briefly introduce the key data points in this section.
    2. Detailed Breakdown (80-100 words): Elaborate on the data, providing specific figures or details.
    3. Key Takeaways/Implications (30-50 words): Summarize the significance of the data or suggest potential implications.

    Return the section in this HTML structure:

    <div class="page"> {/* "page" class can remain for layout consistency if desired */}
      <div class="page-header">
        <span class="page-number">[page_number]</span> {/* This might represent a section number or be omitted */}
        <span class="section-title">Section ${chapterNumber}: ${chapterTitle || 'Details'}</span> {/* Changed class and text */}
      </div>
      <div class="page-content">
        <h2 class="section-heading">Section ${chapterNumber}: ${chapterTitle || 'Details'}</h2> {/* Changed class and text */}
        <div class="data-summary"> {/* Changed class */}
          <p class="data-text">[data summary]</p> {/* Changed class */}
        </div>
        <div class="section-divider"></div> {/* Class can remain generic */}
        <div class="data-main"> {/* Changed class */}
          <p class="data-text">[detailed breakdown]</p> {/* Changed class */}
        </div>
        <div class="section-divider"></div>
        <div class="data-closing"> {/* Changed class */}
          <p class="data-text">[key takeaways/implications]</p> {/* Changed class */}
        </div>
      </div>
      <div class="page-footer">
        <span class="footer-text">PropAnalyzed.com</span> {/* Changed brand name */}
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
    
    // Calculate page number (section number + 2 for empty page and TOC if that structure is kept)
    const pageNumber = chapterNumber + 2; // This logic might need review based on how "pages" vs "sections" are handled
    
    // Ensure the content has the proper structure
    if (!content.includes('<div class="page">')) { // "page" class can remain if layout relies on it
      content = `
        <div class="page">
          <div class="page-header">
            <span class="page-number">${pageNumber}</span>
            <span class="section-title">Section ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ''}</span>
          </div>
          <div class="page-content">
            <h2 class="section-heading">Section ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ''}</h2>
            <div class="data-summary"> {/* Changed class */}
              <p class="data-text">${content}</p> {/* Changed class */}
            </div>
          </div>
          <div class="page-footer">
            <span class="footer-text">PropAnalyzed.com</span> {/* Changed brand name */}
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
    const hookText = ' Further analysis in subsequent sections will build upon these findings...'; // Changed hook text
    content = content.replace(/<div class="data-closing">([\s\S]*?)<\/div>/g, // Changed class
      `<div class="data-closing">$1${hookText}</div>`);
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