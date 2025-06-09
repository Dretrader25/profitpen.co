'use client';

import { useState, useEffect } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';
import ChapterEditor from './ChapterEditor';
import ChapterList from './ChapterList';
import { Sparkles, Save, Eye, Trash2 } from 'lucide-react';
import ReadingModal from '@/app/preview/components/ReadingModal';

// Utility function to convert HTML to readable text
const htmlToText = (html: string): string => {
  // Check if we're in the browser environment
  if (typeof window === 'undefined') {
    // Fallback for server-side rendering - simple regex-based conversion
    return html
      .replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '$1')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '$1')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '$1')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '$1')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '• $1\n')
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n"$1"\n')
      .replace(/<[^>]*>/g, '') // Remove any remaining HTML tags
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newlines
      .replace(/^\s+|\s+$/g, '') // Trim whitespace from start and end
      .replace(/&nbsp;/g, ' ') // Replace HTML entities
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"');
  }
  
  // Create a temporary div element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Convert specific HTML elements to readable text
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      const content = Array.from(element.childNodes).map(processNode).join('');
      
      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          return `\n\n${content}\n\n`;
        case 'p':
          return `${content}\n\n`;
        case 'br':
          return '\n';
        case 'strong':
        case 'b':
        case 'em':
        case 'i':
          return content; // Just return the content without special formatting
        case 'ul':
          return `\n${content}\n`;
        case 'ol':
          return `\n${content}\n`;
        case 'li':
          return `• ${content}\n`;
        case 'blockquote':
          return `\n"${content}"\n`;
        default:
          return content;
      }
    }
    
    return '';
  };
  
  const result = Array.from(tempDiv.childNodes).map(processNode).join('');
  
  // Clean up extra whitespace and HTML entities
  return result
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple newlines with double newlines
    .replace(/^\s+|\s+$/g, '') // Trim whitespace from start and end
    .replace(/&nbsp;/g, ' ') // Replace HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');
};

interface ChapterManagerProps {
  currentStory: any;
  persistedContent: any;
  currentPageCount: number;
  handleRemovePage: (pageNum: number) => void;
  getVisiblePages: () => number[];
  handleRegeneratePage: (pageNum: number) => Promise<void>;
  generateMorePages: () => Promise<void>;
  isGenerating: boolean;
  progress: number;
  getPageContent?: (pageNum: number) => string;
  setPersistedContent: (content: any) => void;
  onTabChange: (tab: string) => void;
}

interface Chapter {
  id: string;
  title: string;
  content: string;
  pageNumbers: number[];
  wordCount: number;
  status: 'draft' | 'review' | 'final';
  quality: number;
}

export default function ChapterManager({
  currentStory,
  persistedContent,
  currentPageCount,
  handleRemovePage,
  getVisiblePages,
  handleRegeneratePage,
  generateMorePages,
  isGenerating,
  progress,
  getPageContent,
  setPersistedContent,
  onTabChange
}: ChapterManagerProps) {
  const { currentStory: activeStory, updateStoryChapters, fetchStory } = useStoryStore();
  const [selectedChapter, setSelectedChapter] = useState<string | null>('toc');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'quality' | 'wordCount'>('order');
  const [isRegenerating, setIsRegenerating] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // For general loading state
  const [error, setError] = useState<string | null>(null); // For error messages
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [currentReadingPage, setCurrentReadingPage] = useState<number | null>(null);

  // Get chapters from the current story or use empty array as fallback
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Function to extract chapter titles from TOC content
  const extractTitlesFromTOC = (tocContent: string): string[] => {
    const titles: string[] = [];
    
    // Convert HTML to text first
    const textContent = htmlToText(tocContent);
    
    // Look for various TOC patterns
    const patterns = [
      // Pattern 1: "Chapter 1: Title" or "Chapter 1 - Title" or "Chapter 1. Title"
      /Chapter\s+\d+[\:\-\.\s]+([^\n\r\.]+)/gi,
      // Pattern 2: "1. Title" or "1) Title" at start of line
      /^\s*\d+[\.\)]\s+([^\n\r\.0-9]+)/gm,
      // Pattern 3: Look for numbered list items with meaningful titles
      /^\s*(\d+)\.\s*([A-Z][A-Za-z\s\-\'\:]{8,60})\s*$/gm,
      // Pattern 4: Lines that start with capital letter and look like chapter titles
      /^([A-Z][A-Za-z\s\-\'\:]{8,60})$/gm,
      // Pattern 5: Look for bullet points or dashes followed by titles
      /^[\s\*\-\•]\s*([A-Z][A-Za-z\s\-\'\:]{8,60})\s*$/gm
    ];
    
    // Try each pattern until we find titles
    for (const pattern of patterns) {
      const tempTitles: string[] = [];
      const matches = textContent.matchAll(pattern);
      
      for (const match of matches) {
        let title = '';
        
        // For patterns with capture groups, use the appropriate group
        if (pattern.source.includes('Chapter')) {
          title = match[1]?.trim();
        } else if (pattern.source.includes('\\d+')) {
          // For numbered patterns, use the second group if it exists, otherwise the first
          title = (match[2] || match[1])?.trim();
        } else {
          title = match[1]?.trim();
        }
        
        if (title && title.length > 3 && title.length < 100) {
          // Clean up the title
          const cleanTitle = title
            .replace(/[\.\-\:]+$/, '') // Remove trailing punctuation
            .replace(/^[\.\-\:]+/, '') // Remove leading punctuation
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
          
          // Skip titles that are too generic or contain numbers that look like page numbers
          const isGeneric = /^(page|chapter|\d+)$/i.test(cleanTitle);
          const hasPageNumbers = /\b\d{1,3}\b/.test(cleanTitle) && cleanTitle.length < 20;
          
          if (cleanTitle && !isGeneric && !hasPageNumbers && !tempTitles.includes(cleanTitle)) {
            tempTitles.push(cleanTitle);
          }
        }
      }
      
      // If we found a reasonable number of titles with this pattern, use them
      if (tempTitles.length >= 2 && tempTitles.length <= 10) {
        titles.push(...tempTitles);
        break;
      }
    }
    
    // If we still don't have titles, try a more aggressive approach
    if (titles.length === 0) {
      // Look for any lines that could be chapter titles
      const lines = textContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.length > 8 && trimmed.length < 80 && 
            /^[A-Z]/.test(trimmed) && 
            !trimmed.includes('www.') && 
            !trimmed.includes('@') &&
            !/^\d+$/.test(trimmed)) {
          const cleanTitle = trimmed.replace(/[\.\-\:]+$/, '').trim();
          if (!titles.includes(cleanTitle)) {
            titles.push(cleanTitle);
          }
        }
      }
    }
    
    return titles.slice(0, 10); // Limit to maximum 10 chapters
  };

  // Initialize chapters from activeStory when available
  useEffect(() => {
    if (activeStory?.chapters && activeStory.chapters.length > 0) {
      setChapters(activeStory.chapters);
    } else if (activeStory?.id) {
      // If there's an active story but no chapters, try fetching them (or handle empty state)
      // This part depends on whether `fetchStory` re-populates chapters or if chapters are always part of `activeStory`
      // For now, we assume if activeStory.chapters is empty, it means there are no chapters yet or they failed to load.
      // A more robust solution might involve a specific loading state for chapters.
      setChapters([]);
    } else {
        // Logic to create chapters from persistedContent (localStorage) if no active story
        // This logic might need adjustment based on how stories are initiated and persisted before Supabase integration
        const createChaptersFromLocalStorage = () => {
          const localPersistedContent = typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('previewContent') || '{}')
            : {};

          const localCurrentPageCount = typeof window !== 'undefined'
            ? parseInt(localStorage.getItem('currentPageCount') || '8')
            : 8;

          const visiblePages = Array.from({ length: localCurrentPageCount }, (_, i) => i + 1);
          
          if (visiblePages.length === 0 || Object.keys(localPersistedContent).length === 0) {
            return []; // No content to create chapters from
          }

          const generatedChapters = [];
          const tocContent = localPersistedContent['container2'] || '';
          const tocTitles = tocContent ? extractTitlesFromTOC(tocContent) : [];
          const chapterPages = visiblePages.slice(2);
          
          for (let i = 0; i < chapterPages.length; i++) {
            const pageNum = chapterPages[i];
            const chapterContent = localPersistedContent[`container${pageNum}`] || '';

            const extractTitle = (content: string, chapterIndex: number) => {
              if (tocTitles.length > chapterIndex) return tocTitles[chapterIndex];
              const titleMatch = content.match(/<h[1-2][^>]*>(.*?)<\/h[1-2]>/i) ||
                                content.match(/<strong[^>]*>(.*?)<\/strong>/i) ||
                                content.match(/<b[^>]*>(.*?)<\/b>/i);
              if (titleMatch) {
                const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
                if (title.length > 0 && title.length < 100) return title;
              }
              return `Chapter ${chapterIndex + 1}`;
            };

            if (chapterContent.trim()) {
              generatedChapters.push({
                id: `chapter-${i + 1}`, // Consider generating more robust IDs
                title: extractTitle(chapterContent, i),
                content: chapterContent,
                pageNumbers: [pageNum],
                wordCount: htmlToText(chapterContent).split(' ').filter(Boolean).length,
                status: 'draft' as const, // Default status
                quality: 7.0 // Default quality
              });
            }
          }
          return generatedChapters;
        };

        const newChapters = createChaptersFromLocalStorage();
        setChapters(newChapters);
        // If these chapters should be part of a new story, you might need to create/set a new story in the store
        // For now, just updating local state. If `currentStory` (prop) is null, this implies no story is loaded from DB.
        // If `updateStoryChapters` is called, it will attempt a Supabase update if an activeStory exists.
        // This might be an issue if there's no activeStory and we're just working off localStorage.
        // Consider if `updateStoryChapters` should only be called when `activeStory` is present.
        if (activeStory) { // Only update if there's an active story context
            updateStoryChapters(newChapters).catch(err => {
                console.error("Failed to update story chapters from localStorage init:", err);
                setError("Failed to save initial chapters to cloud.");
            });
        }
    }
  }, [activeStory, updateStoryChapters, fetchStory]); // Added fetchStory to dependencies if it's used for re-fetching

  // Effect for handling chapters from props (persistedContent)
  // This seems to be a fallback or alternative way to populate chapters if currentStory is not the source.
  // Ensure this doesn't conflict with the activeStory logic.
  useEffect(() => {
    if (persistedContent && Object.keys(persistedContent).length > 0 && currentPageCount > 0 && !activeStory?.chapters?.length) {
      const createChaptersFromProps = () => {
        // ... (existing logic for createChaptersFromProps, ensure IDs are robust)
        // Similar to the localStorage logic, this should be carefully considered in the context of Supabase.
        // If these chapters are meant to be part of the `activeStory`, they should be saved via `updateStoryChapters`.
        const visiblePages = Array.from({ length: currentPageCount }, (_, i) => i + 1);
        if (visiblePages.length <= 2) return [];

        const chaptersFromProps = [];
        const tocContent = persistedContent['container2'] || '';
        const tocTitles = tocContent ? extractTitlesFromTOC(tocContent) : [];
        const chapterPages = visiblePages.slice(2);

        for (let i = 0; i < chapterPages.length; i++) {
          const pageNum = chapterPages[i];
          const chapterContent = persistedContent[`container${pageNum}`] || '';
          if (chapterContent.trim()) {
            const extractTitle = (content: string, chapterIndex: number) => {
              if (tocTitles.length > chapterIndex) return tocTitles[chapterIndex];
              const titleMatch = content.match(/<h[1-2][^>]*>(.*?)<\/h[1-2]>/i) ||
                                content.match(/<strong[^>]*>(.*?)<\/strong>/i) ||
                                content.match(/<b[^>]*>(.*?)<\/b>/i);
              if (titleMatch) {
                const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
                if (title.length > 0 && title.length < 100) return title;
              }
              return `Chapter ${chapterIndex + 1}`;
            };
            chaptersFromProps.push({
              id: `prop-chapter-${i + 1}`, // Ensure robust IDs
              title: extractTitle(chapterContent, i),
              content: chapterContent,
              pageNumbers: [pageNum],
              wordCount: htmlToText(chapterContent).split(' ').filter(Boolean).length,
              status: 'draft' as const,
              quality: 7.0
            });
          }
        }
        return chaptersFromProps;
      };

      const newChapters = createChaptersFromProps();
      if (newChapters.length > 0) {
        setChapters(newChapters);
        if (activeStory) { // Only update if there's an active story context
            updateStoryChapters(newChapters).catch(err => {
                console.error("Failed to update story chapters from props:", err);
                setError("Failed to save chapters from props to cloud.");
            });
        }
      }
    }
  }, [persistedContent, currentPageCount, activeStory, updateStoryChapters]);


  const filteredChapters = chapters
    .filter(chapter => 
      chapter?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chapter?.content?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
      chapter.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'quality':
          return b.quality - a.quality;
        case 'wordCount':
          return b.wordCount - a.wordCount;
        default:
          return parseInt(a.id) - parseInt(b.id);
      }
    });

  const handleSaveContent = async (content: string, pageNum: number) => {
    if (!activeStory) {
      setError("No active story to save to. Please load or create a story.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      // Update the persisted content locally first for responsiveness
      const newPersistedContent = {
        ...persistedContent,
        [`container${pageNum}`]: content
      };
      setPersistedContent(newPersistedContent); // Assuming this updates parent/local state if needed

      if (typeof window !== 'undefined') {
        localStorage.setItem('previewContent', JSON.stringify(newPersistedContent));
      }
      
      const updatedChapters = chapters.map(chapter => {
        if (chapter.pageNumbers.includes(pageNum)) {
          // If multiple chapters could share a page (not typical), this needs refinement.
          // Assuming one chapter per page for now based on existing logic.
          return {
            ...chapter,
            content: content, // Or update specific part of content if chapter spans multiple pages
            wordCount: htmlToText(content).split(' ').filter(Boolean).length
          };
        }
        return chapter;
      });
      
      setChapters(updatedChapters); // Update local state immediately
      await updateStoryChapters(updatedChapters); // Persist to Supabase
      // Optionally, re-fetch or use returned data from updateStoryChapters if it provides updated story object
    } catch (err) {
      console.error("Error saving content:", err);
      setError("Failed to save chapter content. Please try again.");
      // Optionally, revert local changes or notify user
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateChapter = async (chapterId: string) => {
    // This function seems to simulate regeneration and update local state.
    // If regeneration involves AI or backend calls, it should be async and handle loading/errors.
    setIsRegenerating(prev => ({ ...prev, [chapterId]: true }));
    setError(null);
    try {
      // Placeholder for actual regeneration logic (e.g., API call)
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate async operation
      
      const updatedChapters = chapters.map(ch =>
        ch.id === chapterId
          ? { ...ch, content: `${ch.content} (Regenerated)`, quality: Math.min(10, ch.quality + 0.5), status: 'review' as const }
          : ch
      );
      setChapters(updatedChapters);
      await updateStoryChapters(updatedChapters); // Save changes to Supabase
    } catch (err) {
      console.error("Error regenerating chapter:", err);
      setError("Failed to regenerate chapter.");
    } finally {
      setIsRegenerating(prev => ({ ...prev, [chapterId]: false }));
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    if (!activeStory) {
      setError("No active story. Cannot delete chapter.");
      return;
    }
    if (confirm('Are you sure you want to delete this chapter and its content? This action might be irreversible.')) {
      setIsLoading(true); // Use general loading for delete operation
      setError(null);
      try {
        const updatedChapters = chapters.filter(ch => ch.id !== chapterId);
        setChapters(updatedChapters); // Update local state
        await updateStoryChapters(updatedChapters); // Persist to Supabase

        if (selectedChapter === chapterId) {
          setSelectedChapter('toc'); // Go back to TOC or null
        }
      } catch (err) {
        console.error("Error deleting chapter:", err);
        setError("Failed to delete chapter. Please try again.");
        // Optionally, revert local state if Supabase update fails
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'final': return 'text-green-700 bg-green-100';
      case 'review': return 'text-yellow-700 bg-yellow-100';
      case 'draft': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return 'text-green-600';
    if (quality >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handlePreviewChapter = (chapter: Chapter) => {
    // Set the current reading page to the chapter's page number
    // Subtract 1 to account for the cover page (0-based index)
    const pageIndex = chapter.pageNumbers[0] - 1;
    setCurrentReadingPage(pageIndex);
    setIsReadingMode(true);
  };

  const handleNextReadingPage = () => {
    if (currentReadingPage !== null && currentReadingPage < currentPageCount - 1) {
      setCurrentReadingPage(currentReadingPage + 1);
    }
  };

  const handlePreviousReadingPage = () => {
    if (currentReadingPage !== null && currentReadingPage > 0) {
      setCurrentReadingPage(currentReadingPage - 1);
    }
  };

  return (
    <div className="h-full flex">
      {/* Chapter Editor */}
      <div className="flex-1 flex flex-col">
        {selectedChapter ? (
          <>
            {/* Chapter Header */}
            <div className="p-6 border-b border-gray-200 bg-white">
              {selectedChapter === 'toc' ? (
                // TOC Header
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      📋 Table of Contents
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Page 2</span>
                      <span>Navigation structure</span>
                      <span className="font-medium text-blue-600">
                        Essential
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onTabChange('preview')}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                    >
                      View in Preview
                    </button>
                  </div>
                </div>
              ) : (
                // Regular Chapter Header
                (() => {
                  const chapter = chapters.find(ch => ch.id === selectedChapter);
                  if (!chapter) return null;
                  
                  return (
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">
                          Chapter {chapter.id}: {chapter.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Page {chapter.pageNumbers[0]}</span>
                          <span>{chapter.wordCount} words</span>
                          <span className={`font-medium ${getQualityColor(chapter.quality)}`}>
                            Quality: {chapter.quality}/10
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerateChapter(chapter.id)}
                          disabled={isRegenerating[chapter.id] || isLoading}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-gray-700"
                        >
                          {isRegenerating[chapter.id] ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          Regenerate
                        </button>

                        <button
                          onClick={() => handleSaveContent(chapter.content, chapter.pageNumbers[0])}
                          disabled={isSaving || isLoading}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-gray-700"
                        >
                          {isSaving ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                          Save
                        </button>

                        <button
                          onClick={() => handlePreviewChapter(chapter)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 disabled:opacity-50"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          disabled={isLoading}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Chapter Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                  <p><strong>Error:</strong> {error}</p>
                  <button onClick={() => setError(null)} className="ml-2 text-sm underline">Dismiss</button>
                </div>
              )}
              {isLoading && selectedChapter !== 'toc' && ( // Show loading indicator when a chapter is loading its content or performing an action
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="ml-2 text-gray-700">Loading chapter...</p>
                </div>
              )}
              {selectedChapter === 'toc' ? (
                // TOC Content
                <div className="prose max-w-none">
                  <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">Table of Contents</h1>
                      <p className="text-gray-600">Navigate through your book chapters</p>
                    </div>
                    
                    <div className="space-y-3">
                      {chapters.map((chapter, index) => (
                        <div key={chapter.id} 
                             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                             onClick={() => setSelectedChapter(chapter.id)}
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="font-medium text-gray-900">{chapter.title}</h3>
                              <p className="text-sm text-gray-500">
                                Page {chapter.pageNumbers[0]} • {chapter.wordCount} words
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getQualityColor(chapter.quality)} bg-opacity-10`}>
                              {chapter.quality}/10
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Book Statistics</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Total Chapters:</span>
                          <span className="font-medium ml-2">{chapters.length}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Words:</span>
                          <span className="font-medium ml-2">{chapters.reduce((sum, ch) => sum + ch.wordCount, 0).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Average Quality:</span>
                          <span className="font-medium ml-2">{(chapters.reduce((sum, ch) => sum + ch.quality, 0) / chapters.length).toFixed(1)}/10</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Pages:</span>
                          <span className="font-medium ml-2">{Math.max(...chapters.flatMap(ch => ch.pageNumbers))}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular Chapter Content with ChapterEditor
                (() => {
                  const chapter = chapters.find(ch => ch.id === selectedChapter);
                  if (!chapter) return null;
                  
                  return <ChapterEditor 
                    key={`chapter-${chapter.id}-${chapter.pageNumbers[0]}`} // Force remount when chapter changes
                    chapter={chapter} 
                    onSave={(content: string) => handleSaveContent(content, chapter.pageNumbers[0])}
                    isSaving={isSaving || isLoading} // Pass general loading state as well
                  />;
                })()
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Chapter</h3>
              <p className="text-gray-600">Choose a chapter from the list to view and edit its content</p>
            </div>
          </div>
        )}
      </div>

      {/* ChapterList Component */}
      <ChapterList
        chapters={chapters}
        selectedChapter={selectedChapter}
        searchTerm={searchTerm}
        sortBy={sortBy}
        isRegenerating={isRegenerating}
        currentPageCount={currentPageCount}
        persistedContent={persistedContent}
        setSelectedChapter={setSelectedChapter}
        setSearchTerm={setSearchTerm}
        setSortBy={setSortBy}
        setChapters={setChapters}
        handleRegenerateChapter={handleRegenerateChapter}
        handleDeleteChapter={handleDeleteChapter}
        extractTitlesFromTOC={extractTitlesFromTOC}
      />

      {/* Reading Modal */}
      <ReadingModal
        isOpen={isReadingMode}
        content={persistedContent}
        onClose={() => {
          setIsReadingMode(false);
          setCurrentReadingPage(null);
        }}
        onNext={handleNextReadingPage}
        onPrevious={handlePreviousReadingPage}
        hasNext={currentReadingPage !== null && currentReadingPage < currentPageCount - 1}
        hasPrevious={currentReadingPage !== null && currentReadingPage > 0}
        onSave={(content: string) => {
          if (currentReadingPage !== null) {
            handleSaveContent(content, currentReadingPage + 1); // Add 1 back to convert to 1-based index
          }
        }}
        initialPage={currentReadingPage ?? undefined}
      />
    </div>
  );
}

