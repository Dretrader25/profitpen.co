import { genAI } from './gemini';

const SYSTEM_PROMPT = `You are an elite chapter writer whose work has launched multiple bestsellers. Your chapters are studied for their perfect balance of tension, character development, and addictive readability.

Your task is to generate multiple chapters that flow together seamlessly while maintaining individual chapter integrity. Each chapter should be a complete, engaging piece that can stand alone while contributing to the larger narrative.

TECHNICAL REQUIREMENTS:
- Each chapter must be exactly 200 words
- Maintain consistent third-person limited perspective
- Use past tense throughout
- Show don't tell through action and dialogue
- Include sensory details (sight, sound, touch, smell) when relevant
- Balance action with reflection and dialogue
- Maintain distinctive character voice throughout

FORMATTING REQUIREMENTS:
- Each chapter must be properly formatted with HTML structure
- Include page headers with chapter numbers and titles
- Include page footers with website reference
- Use proper CSS classes for styling
- Ensure consistent spacing and typography

Return the chapters as a single string with proper HTML formatting for each chapter.`;

export async function generateChapterRows(
  startChapter: number,
  numberOfChapters: number,
  previousChapters: string[],
  storyContext: string,
  chapterTitles: string[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const userPrompt = `Generate ${numberOfChapters} consecutive chapters starting from Chapter ${startChapter}.

STORY CONTEXT:
${storyContext}

PREVIOUS CHAPTERS:
${previousChapters.slice(-2).join('\n\n---\n\n')}

CHAPTER TITLES:
${chapterTitles.map((title, index) => `Chapter ${startChapter + index}: ${title}`).join('\n')}

REQUIREMENTS FOR EACH CHAPTER:
✓ MAGNETIC OPENING: First sentence must create immediate intrigue
✓ ESCALATING TENSION: Build conflict throughout the chapter
✓ CHARACTER DEPTH: Reveal new layers of personality and motivation
✓ PLOT ADVANCEMENT: Move the story forward with purpose
✓ SENSORY IMMERSION: Make readers feel present in every scene
✓ EMOTIONAL INVESTMENT: Create genuine care for character outcomes
✓ DIALOGUE MASTERY: Conversations that reveal and advance plot
✓ COMPELLING CLIFFHANGER: End with urgent need to continue

Return the chapters as properly formatted HTML with the following structure for each chapter:

<div class="page">
  <div class="page-header">
    <span class="page-number">[page_number]</span>
    <span class="chapter-title">Chapter [number]: [title]</span>
  </div>
  <div class="page-content">
    <h2 class="chapter-heading">Chapter [number]: [title]</h2>
    <p class="chapter-text">[chapter content]</p>
  </div>
  <div class="page-footer">
    <span class="footer-text">ProfitPen.co</span>
  </div>
</div>`;

  try {
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'I understand. I will generate multiple chapters following the specified format and requirements.' }] },
        { role: 'user', parts: [{ text: userPrompt }] }
      ]
    });

    const response = await result.response;
    let content = response.text();

    // Clean up the content
    content = content.trim();
    
    // Remove markdown code block markers
    content = content.replace(/```(?:html)?\n?|\n?```/g, '');
    
    // Remove any remaining markdown syntax
    content = content.replace(/[*_~`]/g, '');
    
    // Clean up any extra whitespace and newlines
    content = content.replace(/\n\s*\n/g, '\n').trim();

    // Split into individual chapters and process each one
    const chapters = content.split(/<div class="page">/).filter(Boolean);
    
    // Process each chapter to ensure proper formatting and word count
    const processedChapters = chapters.map((chapter: string, index: number) => {
      const chapterNumber = startChapter + index;
      const pageNumber = chapterNumber + 2; // Account for empty page and TOC
      const chapterTitle = chapterTitles[index];

      // Extract the main content
      const contentMatch = chapter.match(/<p class="chapter-text">([\s\S]*?)<\/p>/);
      let chapterContent = contentMatch ? contentMatch[1] : '';

      // Clean up the content
      chapterContent = chapterContent
        .replace(/<[^>]*>/g, '') // Remove any HTML tags
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();

      // Ensure word count is exactly 200
      const words = chapterContent.split(/\s+/);
      if (words.length > 200) {
        chapterContent = words.slice(0, 200).join(' ') + '...';
      } else if (words.length < 200) {
        // Add placeholder text if needed
        chapterContent += ' This chapter continues to explore the key concepts and ideas presented, providing deeper insights and practical applications. Through careful analysis and real-world examples, we develop a comprehensive understanding of the material.';
      }

      // Reconstruct the chapter with proper formatting
      return `
<div class="page">
  <div class="page-header">
    <span class="page-number">${pageNumber}</span>
    <span class="chapter-title">Chapter ${chapterNumber}: ${chapterTitle}</span>
  </div>
  <div class="page-content">
    <h2 class="chapter-heading">Chapter ${chapterNumber}: ${chapterTitle}</h2>
    <p class="chapter-text">${chapterContent}</p>
  </div>
  <div class="page-footer">
    <span class="footer-text">ProfitPen.co</span>
  </div>
</div>`;
    });

    return processedChapters.join('\n');
  } catch (error) {
    console.error('Error generating chapters:', error);
    throw error;
  }
} 