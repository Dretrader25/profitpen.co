import { genAI } from './gemini';

const SYSTEM_PROMPT = `You are an AI data processor specializing in real estate, tasked with generating multiple structured data sections for property reports or lead summaries. Each section must be accurate, concise, and well-formatted.

Your task is to generate multiple data sections that are thematically distinct yet contribute to a comprehensive overview of a property or lead. Each section should present information clearly and professionally.

TECHNICAL REQUIREMENTS:
- Each section should aim for a word count of 150-250 words, or as appropriate for the data being presented.
- Maintain an objective and analytical tone.
- Present data factually and clearly.
- Use bullet points or lists for multiple data items within a section if it enhances readability.

FORMATTING REQUIREMENTS:
- Each section must be properly formatted with HTML structure.
- Include page/section headers with section numbers and titles.
- Include page/section footers with a brand reference.
- Use appropriate CSS classes for styling (e.g., section-title, data-text).
- Ensure consistent spacing and typography.

Return the sections as a single string with proper HTML formatting for each section.`;

export async function generateChapterRows( // Function name might be changed later to reflect "sections"
  startSection: number, // Renamed parameter
  numberOfSections: number, // Renamed parameter
  previousSections: string[], // Renamed parameter
  propertyContext: string, // Renamed parameter
  sectionTitles: string[] // Renamed parameter
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const userPrompt = `Generate ${numberOfSections} consecutive data sections starting from Section ${startSection}.

PROPERTY CONTEXT / OVERALL LEAD INFO:
${propertyContext}

PREVIOUS SECTIONS (for context, if applicable):
${previousSections.slice(-2).join('\n\n---\n\n')}

SECTION TITLES / PROPERTY ADDRESSES:
${sectionTitles.map((title, index) => `Section ${startSection + index}: ${title}`).join('\n')}

REQUIREMENTS FOR EACH SECTION:
✓ DATA ACCURACY: Ensure all presented data is plausible and correctly formatted.
✓ CLARITY & CONCISENESS: Information should be easy to understand and to the point.
✓ RELEVANT DETAILS: Include key data points pertinent to the section's topic.
✓ STRUCTURED PRESENTATION: Organize information logically, using lists or bullet points if helpful.
✓ PROFESSIONAL TONE: Maintain an objective and informative style.
✓ ACTIONABLE INFORMATION (where applicable): Highlight data that can inform decisions.

Return the sections as properly formatted HTML with the following structure for each section:

<div class="page"> {/* Assuming "page" class is for general layout */}
  <div class="page-header">
    <span class="page-number">[page_or_section_number]</span>
    <span class="section-title">Section [number]: [title]</span> {/* Changed class */}
  </div>
  <div class="page-content">
    <h2 class="section-heading">Section [number]: [title]</h2> {/* Changed class */}
    <p class="data-text">[section content, possibly with sub-headings or lists]</p> {/* Changed class */}
  </div>
  <div class="page-footer">
    <span class="footer-text">PropAnalyzed.com</span> {/* Changed brand */}
  </div>
</div>`;

  try {
    const result = await model.generateContent({
      contents: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'I understand. I will generate multiple data sections following the specified format and requirements.' }] }, // Updated model response
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
    
    // Process each section to ensure proper formatting and word count (if strict word count is still desired)
    const processedSections = chapters.map((sectionHtml: string, index: number) => { // Renamed 'chapters' to 'sectionsHtml' for clarity in this map
      const sectionNumber = startSection + index;
      const pageNumber = sectionNumber + 2; // This might be re-evaluated if TOC structure changes
      const currentSectionTitle = sectionTitles[index];

      // Extract the main content (assuming it's within a p.data-text or similar)
      const contentMatch = sectionHtml.match(/<p class="data-text">([\s\S]*?)<\/p>/); // Adjusted class
      let sectionContent = contentMatch ? contentMatch[1] : sectionHtml; // Fallback to full HTML if specific tag not found

      // Clean up the content (basic cleaning)
      sectionContent = sectionContent
        .replace(/<[^>]*>/g, '') // Remove any HTML tags if we want pure text for word count
        .replace(/\s+/g, ' ')    // Normalize whitespace
        .trim();

      // Word count adjustment logic (might need to be more flexible for data sections)
      const words = sectionContent.split(/\s+/);
      const targetWordCount = 200; // Example, might vary per section type
      if (words.length > targetWordCount) {
        sectionContent = words.slice(0, targetWordCount).join(' ') + '...';
      } else if (words.length < targetWordCount - 50) { // If significantly shorter
        sectionContent += ' Additional details and data points can be found in the full report.'; // More generic placeholder
      }

      // Reconstruct the section with proper formatting
      // Note: The AI is asked to return this structure, this is a fallback/cleanup.
      // It's better if the AI adheres to the requested HTML structure directly.
      return `
<div class="page">
  <div class="page-header">
    <span class="page-number">${pageNumber}</span>
    <span class="section-title">Section ${sectionNumber}: ${currentSectionTitle}</span>
  </div>
  <div class="page-content">
    <h2 class="section-heading">Section ${sectionNumber}: ${currentSectionTitle}</h2>
    <p class="data-text">${sectionContent}</p> {/* Ensure content is properly HTML escaped if inserted directly */}
  </div>
  <div class="page-footer">
    <span class="footer-text">PropAnalyzed.com</span>
  </div>
</div>`;
    });

    return processedSections.join('\n');
  } catch (error) {
    console.error('Error generating data sections:', error); // Changed error message
    throw error;
  }
} 