'use client';

import { motion } from 'framer-motion';

interface Chapter {
  id: string;
  title: string;
  content: string;
  pageNumbers: number[];
  wordCount: number;
  status: 'draft' | 'review' | 'final';
  quality: number;
}

interface ChapterListProps {
  chapters: Chapter[];
  selectedChapter: string | null;
  searchTerm: string;
  sortBy: 'order' | 'title' | 'quality' | 'wordCount';
  isRegenerating: Record<string, boolean>;
  currentPageCount: number;
  persistedContent: any;
  setSelectedChapter: (id: string | null) => void;
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: 'order' | 'title' | 'quality' | 'wordCount') => void;
  setChapters: (chapters: Chapter[]) => void;
  handleRegenerateChapter: (id: string) => void;
  handleDeleteChapter: (id: string) => void;
  extractTitlesFromTOC: (content: string) => string[];
}

export default function ChapterList({
  chapters,
  selectedChapter,
  searchTerm,
  sortBy,
  isRegenerating,
  currentPageCount,
  persistedContent,
  setSelectedChapter,
  setSearchTerm,
  setSortBy,
  setChapters,
  handleRegenerateChapter,
  handleDeleteChapter,
  extractTitlesFromTOC
}: ChapterListProps) {
  
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

  const filteredChapters = chapters
    .filter(chapter => 
      chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'quality': return b.quality - a.quality;
        case 'wordCount': return b.wordCount - a.wordCount;
        default: return parseInt(a.id) - parseInt(b.id);
      }
    });

  return (
    <div className="w-1/3 border-l border-gray-200 bg-gray-50">
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Properties/Leads ({chapters.length + 1})</h2> {/* Changed */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                // Force refresh chapters from localStorage
                const persistedContent = typeof window !== 'undefined' 
                  ? JSON.parse(localStorage.getItem('previewContent') || '{}') 
                  : {};
                
                const currentPageCount = typeof window !== 'undefined' 
                  ? parseInt(localStorage.getItem('currentPageCount') || '8') 
                  : 8;

                const visiblePages = Array.from({ length: currentPageCount }, (_, i) => i + 1);
                
                if (visiblePages.length > 0) {
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
                      
                      // Default fallback
                      return `Chapter ${chapterIndex + 1}`;
                    };

                    const title = extractTitle(chapterContent, i);
                    
                    // Convert HTML to text for word count
                    const htmlToText = (html: string): string => {
                      if (typeof window === 'undefined') {
                        return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
                      }
                      
                      const tempDiv = document.createElement('div');
                      tempDiv.innerHTML = html;
                      return tempDiv.textContent || tempDiv.innerText || '';
                    };

                    const textContent = htmlToText(chapterContent);
                    const wordCount = textContent.split(' ').filter(word => word.length > 0).length;

                    chapters.push({
                      id: (i + 1).toString(),
                      title: title,
                      content: chapterContent,
                      pageNumbers: [pageNum],
                      wordCount: wordCount,
                      status: (Math.random() > 0.5 ? 'final' : Math.random() > 0.5 ? 'review' : 'draft') as 'draft' | 'review' | 'final',
                      quality: Math.round((Math.random() * 4 + 6) * 10) / 10
                    });
                  }
                  
                  setChapters(chapters);
                }
              }}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh List" // Changed
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search properties by address, owner..." // Changed
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* Sort */}
        <div className="mb-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'order' | 'title' | 'quality' | 'wordCount')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="order">Sort by Order</option>
            <option value="title">Sort by Address/Name</option> {/* Changed */}
            <option value="quality">Sort by Lead Score</option> {/* Changed */}
            <option value="wordCount">Sort by Data Completeness</option> {/* Changed */}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* TOC Item */}
        <motion.div
          className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
            selectedChapter === 'toc' ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-100'
          }`}
          onClick={() => setSelectedChapter('toc')}
          whileHover={{ x: 4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 mb-1">📋 Property/Lead Summary</h3> {/* Changed */}
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>Summary View</span> {/* Changed */}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chapter Items */}
        {filteredChapters.map((chapter) => (
          <motion.div
            key={chapter.id}
            className={`p-4 border-b border-gray-200 cursor-pointer transition-colors ${
              selectedChapter === chapter.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-100'
            }`}
            onClick={() => setSelectedChapter(chapter.id)}
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1 truncate">{chapter.title}</h3> {/* Title might be address */}
                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                  <span>Record ID: {chapter.pageNumbers.join(', ')}</span> {/* Changed */}
                  <span>{chapter.wordCount.toLocaleString()} Data Points</span> {/* Changed */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(chapter.quality)}`}>
                    Lead Score: {chapter.quality}/10 {/* Changed */}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(chapter.status)}`}>
                    {chapter.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerateChapter(chapter.id);
                  }}
                  disabled={isRegenerating[chapter.id]}
                  className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                  title="Refresh Data" // Changed
                >
                  {isRegenerating[chapter.id] ? (
                    <div className="w-4 h-4 border border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChapter(chapter.id);
                  }}
                  className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Delete Property/Lead" // Changed
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
