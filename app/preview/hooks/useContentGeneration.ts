import { useState } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';
import { generateChapter } from '@/lib/ai/gemini';

export function useContentGeneration() {
  const { currentStory } = useStoryStore();
  // const [isGeneratingMore, setIsGeneratingMore] = useState(false); // Removed
  const [isGenerating, setIsGenerating] = useState(false); // Kept for now, might be used by other functions
  // const [progress, setProgress] = useState(0); // Removed
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

  // generateMorePages function removed

  return {
    // isGeneratingMore, // Removed
    isGenerating, // Kept for now
    // progress, // Removed
    isGeneratingEnhanced,
    enhancedProgress,
    handleRegeneratePage,
    // generateMorePages // Removed
  };
}
