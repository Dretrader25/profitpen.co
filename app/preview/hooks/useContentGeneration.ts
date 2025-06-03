import { useState } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';
import { generateChapter } from '@/lib/ai/gemini';

export function useContentGeneration() {
  const { currentStory } = useStoryStore();
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isGeneratingEnhanced, setIsGeneratingEnhanced] = useState(false);
  const [enhancedProgress, setEnhancedProgress] = useState<{
    step: string;
    progress: number;
    message: string;
  }>({
    step: '',
    progress: 0,
    message: ''
  });

  const handleRegeneratePage = async (
    pageNum: number, 
    persistedContent: Record<string, string>,
    setPersistedContent: (content: Record<string, string>) => void
  ) => {
    if (!currentStory) return;
    
    // Don't regenerate page 1 (empty) or page 2 (TOC)
    if (pageNum <= 2) return;
    
    try {
      // Get the chapter number (subtract 2 to account for empty first page and TOC)
      const chapterNum = pageNum - 2;
      
      // Get all previous chapters up to this point
      const previousChapters = Object.entries(persistedContent)
        .filter(([key, value]) => {
          const pageKey = parseInt(key.replace('container', ''));
          return pageKey < pageNum && pageKey > 2 && value; // Only include actual chapter pages
        })
        .map(([_, value]) => value as string);
      
      // Generate new content for this page
      const getChapterTitle = (chapterNum: number) => {
        const themeIndex = chapterNum - 1;
        const theme = currentStory.themes?.[themeIndex];
        switch (chapterNum) {
          case 1: return theme || 'Main Theme';
          case 2: return theme || 'Core Concept';
          case 3: return theme || 'Key Principles';
          case 4: return theme || 'Implementation Guide';
          case 5: return theme || 'Case Studies';
          case 6: return theme || 'Conclusion';
          default: return theme || `Chapter ${chapterNum}`;
        }
      };
      
      const chapterTitle = getChapterTitle(chapterNum);
      const regeneratedContent = await generateChapter(
        chapterNum,
        previousChapters,
        currentStory.themes?.join(', ') || '',
        chapterTitle
      );
      
      // Update the specific page
      const newContent = {
        ...persistedContent,
        [`container${pageNum}`]: regeneratedContent
      };
      
      setPersistedContent(newContent);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('previewContent', JSON.stringify(newContent));
      }
    } catch (error) {
      console.error('Error regenerating page:', error);
    }
  };

  const generateMorePages = async (
    columnCount: number = 1,
    currentPageCount: number,
    maxPages: number,
    persistedContent: Record<string, string>,
    setPersistedContent: (content: Record<string, string>) => void,
    setCurrentPageCount: (count: number) => void
  ) => {
    if (currentPageCount >= maxPages) return;
    
    setIsGeneratingMore(true);
    try {
      const existingContent = Object.values(persistedContent)
        .map(content => typeof content === 'string' ? content : '')
        .join('\n\n');
      
      // Generate just one new page
      const newPageNum = currentPageCount + 1;
      
      // Calculate the correct chapter number
      // Page 1 = empty, Page 2 = TOC, Page 3 = Chapter 1, Page 4 = Chapter 2, etc.
      const chapterNumber = newPageNum - 2; // Subtract 2 to account for empty page and TOC
      
      const getChapterTitle = (chapterNum: number) => {
        const themes = currentStory?.themes || [];
        const themeIndex = (chapterNum - 1) % themes.length; // Cycle through themes
        const theme = themes[themeIndex];
        
        // Generate more meaningful chapter titles based on chapter number and themes
        switch (chapterNum) {
          case 1: return theme ? `The Beginning: ${theme}` : 'The Opening';
          case 2: return theme ? `Understanding ${theme}` : 'The Foundation';
          case 3: return theme ? `Exploring ${theme}` : 'The Development';
          case 4: return theme ? `Mastering ${theme}` : 'The Challenge';
          case 5: return theme ? `The Power of ${theme}` : 'The Resolution';
          case 6: return theme ? `Beyond ${theme}` : 'The Application';
          case 7: return theme ? `${theme} in Action` : 'The Conclusion';
          case 8: return theme ? `The Future of ${theme}` : 'The Next Steps';
          default: 
            if (theme) {
              const variations = [
                `Advanced ${theme}`,
                `Deep Dive: ${theme}`,
                `Practical ${theme}`,
                `Real-World ${theme}`,
                `${theme} Mastery`
              ];
              return variations[chapterNum % variations.length];
            }
            return `Chapter ${chapterNum}`;
        }
      };
      
      const chapterTitle = getChapterTitle(chapterNumber);
      const pageContent = await generateChapter(
        chapterNumber,
        Object.values(persistedContent).filter(Boolean),
        currentStory?.themes?.join(', ') || '',
        chapterTitle
      );
      
      // Update state with the new page
      const newContent = { ...persistedContent, [`container${newPageNum}`]: pageContent };
      setPersistedContent(newContent);
      setCurrentPageCount(newPageNum);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('previewContent', JSON.stringify(newContent));
        localStorage.setItem('currentPageCount', newPageNum.toString());
      }
    } catch (error) {
      console.error('Error generating new page:', error);
    } finally {
      setIsGeneratingMore(false);
    }
  };

  return {
    isGeneratingMore,
    isGenerating,
    progress,
    isGeneratingEnhanced,
    enhancedProgress,
    handleRegeneratePage,
    generateMorePages
  };
}
