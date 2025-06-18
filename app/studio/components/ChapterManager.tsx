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
  const { updateStoryChapters } = useStoryStore();
  const [selectedChapter, setSelectedChapter] = useState<string | null>('toc');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'order' | 'title' | 'quality' | 'wordCount'>('order');
  const [isRegenerating, setIsRegenerating] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
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

  // Initialize chapters from currentStory when available
  useEffect(() => {
    if (currentStory?.chapters && currentStory.chapters.length > 0) {
      setChapters(currentStory.chapters);
    } else {
      // Get content from localStorage like the preview page does
      const createChaptersFromContent = () => {
        const persistedContent = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('previewContent') || '{}') 
          : {};
        
        const currentPageCount = typeof window !== 'undefined' 
          ? parseInt(localStorage.getItem('currentPageCount') || '8') 
          : 8;

        const visiblePages = Array.from({ length: currentPageCount }, (_, i) => i + 1);
        
        if (visiblePages.length === 0) {
          // Fallback mock data when no content exists
          return [
            {
              id: '1',
              title: 'The Beginning',
              content: 'Chapter content...',
              pageNumbers: [3],
              wordCount: 1250,
              status: 'final' as const,
              quality: 8.5
            },
            {
              id: '2', 
              title: 'The Journey Starts',
              content: 'Chapter content...',
              pageNumbers: [4],
              wordCount: 1400,
              status: 'review' as const,
              quality: 7.2
            }
          ];
        }

        // Convert content to chapters (skip page 1 cover and page 2 TOC)
        const chapters = [];
        // Skip first 2 pages (cover and TOC) and start chapters from page 3
        const chapterPages = visiblePages.slice(2); // Remove pages 1 and 2
        
        // Extract all chapter titles from TOC first (page 2)
        const tocContent = persistedContent['container2'] || '';
        const tocTitles = tocContent ? extractTitlesFromTOC(tocContent) : [];
        
        // Each page from page 3 onwards becomes its own chapter
        for (let i = 0; i < chapterPages.length; i++) {
          const pageNum = chapterPages[i];
          const chapterContent = persistedContent[`container${pageNum}`] || '';

          // Extract chapter title from content or use default
          const extractTitle = (content: string, chapterIndex: number) => {
            // First priority: Use TOC-extracted titles if available
            if (tocTitles.length > chapterIndex) {
              return tocTitles[chapterIndex];
            }
            
            // Second priority: Extract from chapter content
            const titleMatch = content.match(/<h[1-2][^>]*>(.*?)<\/h[1-2]>/i) ||
                              content.match(/<strong[^>]*>(.*?)<\/strong>/i) ||
                              content.match(/<b[^>]*>(.*?)<\/b>/i);
            
            if (titleMatch) {
              const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
              if (title.length > 0 && title.length < 100) {
                return title;
              }
            }
            
            // Fallback: Default chapter naming
            return `Chapter ${chapterIndex + 1}`;
          };

          const chapter = {
            id: `chapter-${i + 1}`,
            title: extractTitle(chapterContent, i),
            content: chapterContent,
            pageNumbers: [pageNum],
            wordCount: htmlToText(chapterContent).split(' ').filter(word => word.length > 0).length,
            status: 'final' as const,
            quality: 7.5
          };

          chapters.push(chapter);
        }

        return chapters;
      };

      const newChapters = createChaptersFromContent();
      setChapters(newChapters);
      // Also update the story store
      updateStoryChapters(newChapters);
    }
  }, [currentStory?.chapters, updateStoryChapters]);

  // Listen for changes in localStorage to refresh chapters
  useEffect(() => {
    const refreshChapters = () => {
      if (!currentStory?.chapters || currentStory.chapters.length === 0) {
        // Recreate chapters from localStorage content
        const persistedContent = typeof window !== 'undefined' 
          ? JSON.parse(localStorage.getItem('previewContent') || '{}') 
          : {};
        
        const currentPageCount = typeof window !== 'undefined' 
          ? parseInt(localStorage.getItem('currentPageCount') || '8') 
          : 8;

        const visiblePages = Array.from({ length: currentPageCount }, (_, i) => i + 1);
        
        if (visiblePages.length > 0) {
          const chapters = [];
          
          // Extract all chapter titles from TOC first (page 2)
          const tocContent = persistedContent['container2'] || '';
          const tocTitles = tocContent ? extractTitlesFromTOC(tocContent) : [];
          
          // Skip first 2 pages (cover and TOC) and start chapters from page 3
          const chapterPages = visiblePages.slice(2); // Remove pages 1 and 2
          
          // Each page from page 3 onwards becomes its own chapter
          for (let i = 0; i < chapterPages.length; i++) {
            const pageNum = chapterPages[i];
            const chapterContent = persistedContent[`container${pageNum}`] || '';

            // Extract chapter title from content or use default
            const extractTitle = (content: string, chapterIndex: number) => {
              // First priority: Use TOC-extracted titles if available
              if (tocTitles.length > chapterIndex) {
                return tocTitles[chapterIndex];
              }
              
              // Second priority: Extract from chapter content
              const titleMatch = content.match(/<h[1-2][^>]*>(.*?)<\/h[1-2]>/i) ||
                                content.match(/<strong[^>]*>(.*?)<\/strong>/i) ||
                                content.match(/<b[^>]*>(.*?)<\/b>/i);
              
              if (titleMatch) {
                const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
                if (title.length > 0 && title.length < 100) {
                  return title;
                }
              }
              
              return `Chapter ${chapterIndex + 1}`;
            };

            const chapter = {
              id: `chapter-${i + 1}`,
              title: extractTitle(chapterContent, i),
              content: chapterContent,
              pageNumbers: [pageNum],
              wordCount: htmlToText(chapterContent).split(' ').filter(word => word.length > 0).length,
              status: 'final' as const,
              quality: 7.5
            };

            chapters.push(chapter);
          }
          
          setChapters(chapters);
          updateStoryChapters(chapters);
        }
      }
    };

    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'previewContent' || e.key === 'currentPageCount') {
        refreshChapters();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [currentStory?.chapters, updateStoryChapters]);

  // Initialize chapters from persistedContent prop when available
  useEffect(() => {
    if (persistedContent && Object.keys(persistedContent).length > 0 && currentPageCount > 0) {
      const createChaptersFromProps = () => {
        const visiblePages = Array.from({ length: currentPageCount }, (_, i) => i + 1);
        
        if (visiblePages.length <= 2) {
          return []; // Need at least cover and TOC
        }

        const chapters = [];
        // Extract all chapter titles from TOC first (page 2)
        const tocContent = persistedContent['container2'] || '';
        const tocTitles = tocContent ? extractTitlesFromTOC(tocContent) : [];
        
        // Skip first 2 pages (cover and TOC) and start chapters from page 3
        const chapterPages = visiblePages.slice(2); // Remove pages 1 and 2
        
        // Each page from page 3 onwards becomes its own chapter
        for (let i = 0; i < chapterPages.length; i++) {
          const pageNum = chapterPages[i];
          const chapterContent = persistedContent[`container${pageNum}`] || '';

          if (chapterContent.trim()) { // Only create chapter if content exists
            // Extract chapter title from content or use default
            const extractTitle = (content: string, chapterIndex: number) => {
              // First priority: Use TOC-extracted titles if available
              if (tocTitles.length > chapterIndex) {
                return tocTitles[chapterIndex];
              }
              
              // Second priority: Extract from chapter content
              const titleMatch = content.match(/<h[1-2][^>]*>(.*?)<\/h[1-2]>/i) ||
                                content.match(/<strong[^>]*>(.*?)<\/strong>/i) ||
                                content.match(/<b[^>]*>(.*?)<\/b>/i);
              
              if (titleMatch) {
                const title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
                if (title.length > 0 && title.length < 100) {
                  return title;
                }
              }
              
              return `Chapter ${chapterIndex + 1}`;
            };

            const chapter = {
              id: `chapter-${i + 1}`,
              title: extractTitle(chapterContent, i),
              content: chapterContent,
              pageNumbers: [pageNum],
              wordCount: htmlToText(chapterContent).split(' ').filter(word => word.length > 0).length,
              status: 'final' as const,
              quality: 7.5
            };

            chapters.push(chapter);
          }
        }

        return chapters;
      };

      const newChapters = createChaptersFromProps();
      if (newChapters.length > 0) {
        setChapters(newChapters);
        updateStoryChapters(newChapters);
      }
    }
  }, [persistedContent, currentPageCount, updateStoryChapters]);

  const filteredChapters = chapters
    .filter(chapter => 
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    setIsSaving(true);
    try {
      // Update the persisted content
      const newPersistedContent = {
        ...persistedContent,
        [`container${pageNum}`]: content
      };
      setPersistedContent(newPersistedContent);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('previewContent', JSON.stringify(newPersistedContent));
      }
      
      // Refresh chapters to reflect changes
      const refreshChapters = () => {
        const visiblePages = Array.from({ length: currentPageCount }, (_, i) => i + 1);
        const chapterPages = visiblePages.slice(2);
        
        const updatedChapters = chapters.map(chapter => {
          if (chapter.pageNumbers[0] === pageNum) {
            return {
              ...chapter,
              content: content,
              wordCount: htmlToText(content).split(' ').filter(word => word.length > 0).length
            };
          }
          return chapter;
        });
        
        setChapters(updatedChapters);
        updateStoryChapters(updatedChapters);
      };
      
      refreshChapters();
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateChapter = async (chapterId: string) => {
    setIsRegenerating(prev => ({ ...prev, [chapterId]: true }));
    try {
      // Simulate regeneration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setChapters(prev => 
        prev.map(ch => 
          ch.id === chapterId 
            ? { ...ch, quality: Math.min(10, ch.quality + 0.5), status: 'review' as const }
            : ch
        )
      );
    } finally {
      setIsRegenerating(prev => ({ ...prev, [chapterId]: false }));
    }
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (confirm('Are you sure you want to delete this chapter?')) {
      setChapters(prev => prev.filter(ch => ch.id !== chapterId));
      if (selectedChapter === chapterId) {
        setSelectedChapter(null);
      }
    }
  };

  const getStatusColor = (status: string) => {
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
                      📋 Property Index / Lead List Summary
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Summary View</span>
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
                          Property: {chapter.title} {/* Changed "Chapter X:" */}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Record ID: {chapter.pageNumbers[0]}</span> {/* Changed "Page" to "Record ID" */}
                          <span>{chapter.wordCount} Data Points</span> {/* Changed "words" to "Data Points" */}
                          <span className={`font-medium ${getQualityColor(chapter.quality)}`}>
                            Lead Score: {chapter.quality}/10 {/* Changed "Quality" to "Lead Score" */}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRegenerateChapter(chapter.id)}
                          disabled={isRegenerating[chapter.id]}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-gray-700"
                        >
                          {isRegenerating[chapter.id] ? (
                            <div className="w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          Refresh Data {/* Changed */}
                        </button>

                        <button
                          onClick={() => handleSaveContent(chapter.content, chapter.pageNumbers[0])}
                          disabled={isSaving}
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
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center gap-2 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Property {/* Changed */}
                        </button>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Chapter Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {selectedChapter === 'toc' ? (
                // TOC Content
                <div className="prose max-w-none">
                  <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <div className="text-center mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-4">Property Index / Lead List</h1> {/* Changed */}
                      <p className="text-gray-600">Navigate through your properties/leads</p> {/* Changed */}
                    </div>
                    
                    <div className="space-y-3">
                      {chapters.map((chapter, index) => ( // chapters variable will be renamed later if possible, for now, map over it
                        <div key={chapter.id} 
                             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                             onClick={() => setSelectedChapter(chapter.id)}
                        >
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="font-medium text-gray-900">{chapter.title}</h3> {/* Title might be address */}
                              <p className="text-sm text-gray-500">
                                Record ID: {chapter.pageNumbers[0]} • {chapter.wordCount} Data Points {/* Changed */}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getQualityColor(chapter.quality)} bg-opacity-10`}>
                              Lead Score: {chapter.quality}/10 {/* Changed */}
                            </span>
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-2">Lead List Statistics</h3> {/* Changed */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Total Properties/Leads:</span> {/* Changed */}
                          <span className="font-medium ml-2">{chapters.length}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Data Points:</span> {/* Changed */}
                          <span className="font-medium ml-2">{chapters.reduce((sum, ch) => sum + ch.wordCount, 0).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Average Lead Score:</span> {/* Changed */}
                          <span className="font-medium ml-2">{(chapters.reduce((sum, ch) => sum + ch.quality, 0) / chapters.length).toFixed(1)}/10</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Records:</span> {/* Changed */}
                          <span className="font-medium ml-2">{chapters.length}</span> {/* Simplified from pageNumbers */}
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
                    isSaving={isSaving}
                  />;
                })()
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏘️</div> {/* Changed icon */}
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Property/Lead</h3> {/* Changed */}
              <p className="text-gray-600">Choose a property or lead from the list to view and manage its details.</p> {/* Changed */}
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

