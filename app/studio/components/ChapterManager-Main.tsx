'use client';

import { useState, useEffect } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';
import ChapterEditor from './ChapterEditor';
import ChapterList from './ChapterList';
import { generateChapter } from '@/lib/ai/gemini';

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

  // Initialize chapters when component mounts or data changes
  useEffect(() => {
    if (currentStory?.chapters && currentStory.chapters.length > 0) {
      setChapters(currentStory.chapters);
    } else {
      // Create chapters from persisted content
      createChaptersFromContent();
    }
  }, [currentStory, persistedContent, currentPageCount]);

  const createChaptersFromContent = () => {
    const visiblePages = Array.from({ length: currentPageCount }, (_, i) => i + 1);
    
    if (visiblePages.length === 0) {
      // Fallback mock data when no content exists
      setChapters([
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
      ]);
      return;
    }

    // Convert content to chapters (skip page 1 cover and page 2 TOC)
    const newChapters = [];
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
        
        // Default fallback
        return `Chapter ${chapterIndex + 1}`;
      };

      const title = extractTitle(chapterContent, i);
      const textContent = htmlToText(chapterContent);
      const wordCount = textContent.split(' ').filter(word => word.length > 0).length;

      newChapters.push({
        id: (i + 1).toString(),
        title: title,
        content: chapterContent,
        pageNumbers: [pageNum],
        wordCount: wordCount,
        status: (Math.random() > 0.5 ? 'final' : Math.random() > 0.5 ? 'review' : 'draft') as 'draft' | 'review' | 'final',
        quality: Math.round((Math.random() * 4 + 6) * 10) / 10
      });
    }
    
    setChapters(newChapters);
  };

  const handleSaveContent = async (content: string, pageNum: number) => {
    setIsSaving(true);
    try {
      // Wrap the content in the proper HTML structure
      const wrappedContent = `
        <div class="page">
          <div class="page-header">
            <span class="page-number">${pageNum}</span>
            <span class="chapter-title">Chapter ${pageNum - 2}</span>
          </div>
          <div class="page-content">
            <h2 class="chapter-heading">Chapter ${pageNum - 2}</h2>
            <div class="chapter-opening">
              <p class="chapter-text">${content}</p>
            </div>
          </div>
          <div class="page-footer">
            <span class="footer-text">ProfitPen.co</span>
          </div>
        </div>`;

      // Update the persisted content
      const newPersistedContent = {
        ...persistedContent,
        [`container${pageNum}`]: wrappedContent
      };
      setPersistedContent(newPersistedContent);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('previewContent', JSON.stringify(newPersistedContent));
      }
      
      // Refresh chapters to reflect changes
      const updatedChapters = chapters.map(chapter => {
        if (chapter.pageNumbers[0] === pageNum) {
          return {
            ...chapter,
            content: wrappedContent,
            wordCount: htmlToText(content).split(' ').filter(word => word.length > 0).length
          };
        }
        return chapter;
      });
      
      setChapters(updatedChapters);
      updateStoryChapters(updatedChapters);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateChapter = async (chapterId: string) => {
    setIsRegenerating(prev => ({ ...prev, [chapterId]: true }));
    try {
      const chapter = chapters.find(ch => ch.id === chapterId);
      if (!chapter) return;

      // Get the page number for this chapter
      const pageNum = chapter.pageNumbers[0];
      
      // Get all previous chapters up to this point
      const previousChapters = Object.entries(persistedContent)
        .filter(([key, value]) => {
          const pageKey = parseInt(key.replace('container', ''));
          return pageKey < pageNum && pageKey > 2 && value; // Only include actual chapter pages
        })
        .map(([_, value]) => value as string);

      // Calculate chapter number (page - 2 to account for empty page and TOC)
      const chapterNumber = pageNum - 2;
      
      // Generate new content for this chapter
      const regeneratedContent = await generateChapter(
        chapterNumber,
        previousChapters,
        currentStory?.themes?.join(', ') || '',
        chapter.title
      );
      
      // Update the persisted content
      const newPersistedContent = {
        ...persistedContent,
        [`container${pageNum}`]: regeneratedContent
      };
      setPersistedContent(newPersistedContent);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('previewContent', JSON.stringify(newPersistedContent));
      }
      
      // Update the chapter in the chapters array
      setChapters(prev => 
        prev.map(ch => 
          ch.id === chapterId 
            ? { 
                ...ch, 
                content: regeneratedContent,
                quality: Math.min(10, ch.quality + 0.5),
                status: 'review' as const,
                wordCount: htmlToText(regeneratedContent).split(' ').filter(word => word.length > 0).length
              }
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
                      <span>•</span>
                      <span>Navigation Overview</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onTabChange('preview')}
                      className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      📖 Preview Book
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
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">{chapter.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Page {chapter.pageNumbers.join(', ')}</span>
                          <span>•</span>
                          <span>{chapter.wordCount.toLocaleString()} words</span>
                          <span>•</span>
                          <span className={`font-medium ${chapter.quality >= 8 ? 'text-green-600' : chapter.quality >= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                            Quality: {chapter.quality}/10
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleRegenerateChapter(chapter.id)}
                          disabled={isRegenerating[chapter.id]}
                          className="px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isRegenerating[chapter.id] ? 'Regenerating...' : '🔄 Regenerate'}
                        </button>
                        <button
                          onClick={() => onTabChange('preview')}
                          className="px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                        >
                          📖 Preview
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
                // TOC Content (simplified for now)
                <div className="prose max-w-none">
                  <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
                    <div className="space-y-4">
                      {chapters.map((chapter, index) => (
                        <div key={chapter.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                             onClick={() => setSelectedChapter(chapter.id)}>
                          <div>
                            <span className="font-medium">Chapter {index + 1}: {chapter.title}</span>
                          </div>
                          <span className="text-gray-500">Page {chapter.pageNumbers[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular Chapter Content
                (() => {
                  const chapter = chapters.find(ch => ch.id === selectedChapter);
                  if (!chapter) return null;
                  
                  return <ChapterEditor 
                    key={`chapter-editor-${chapter.id}-${chapter.pageNumbers[0]}-${Date.now()}`} // More unique key
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
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Chapter</h3>
              <p className="text-gray-600">Choose a chapter from the list to view and edit its content</p>
            </div>
          </div>
        )}
      </div>

      {/* Chapters List */}
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
    </div>
  );
}
