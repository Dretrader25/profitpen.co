'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/previewStore';
import { useStoryStore } from '@/lib/store/storyStore';
import { motion, AnimatePresence } from 'framer-motion';
import ExportModal from './components/ExportModal';
import ZoomModal from './components/ZoomModal';
import ReadingModal from './components/ReadingModal';
import PreviewOnboarding, { useOnboarding } from './components/PreviewOnboarding';
import { CompactQualityBadge, QualityTooltip } from './components/QualityIndicator';
import { usePreviewLogic } from './hooks/usePreviewLogic';
import { usePreviewSettings } from './hooks/usePreviewSettings';
import { bookStyles, focusModeStyles, hoverControlsStyles, qualityIndicatorStyles } from './styles/previewStyles';
import TitleSection from './components/TitleSection';

const containerVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.1,
      delayChildren: 0.2,
      when: "beforeChildren"
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 1, 1],
      staggerChildren: 0.05,
      staggerDirection: -1,
      when: "afterChildren"
    }
  }
};

const pageVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.95,
    y: 30
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: -20,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 1, 1]
    }
  }
};

export default function PreviewPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [previewsUsed, setPreviewsUsed] = useState(0);
  const [zoomContent, setZoomContent] = useState('');
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isLayoutView, setIsLayoutView] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [columnCount, setColumnCount] = useState(4);
  const [theme, setTheme] = useState('light');
  const [texture, setTexture] = useState('texture');
  const [customThemeColors, setCustomThemeColors] = useState({
    background: '#ffffff',
    text: '#000000',
    accent: '#4a90e2'
  });
  const [isRegenerating, setIsRegenerating] = useState<Record<number, boolean>>({});
  const [isCustomThemeDropdownOpen, setIsCustomThemeDropdownOpen] = useState(false);
  const [isCustomTextureDropdownOpen, setIsCustomTextureDropdownOpen] = useState(false);
  const [currentZoomPage, setCurrentZoomPage] = useState<number | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [currentReadingPage, setCurrentReadingPage] = useState<number | null>(null);

  // Onboarding hook
  const { showOnboarding, completeOnboarding, resetOnboarding } = useOnboarding();

  // Grid layout logic
  const is3Columns = columnCount === 3;
  const is4Columns = columnCount === 4;
  const is5Columns = columnCount === 5;
  const is2Columns = columnCount === 2;
  const is1Column = columnCount === 1;

  // Theme logic
  const isLightTheme = theme === 'light';
  const isDarkTheme = theme === 'dark';
  const isCustomTheme = theme === 'custom';

  // Texture logic
  const hasTexture = texture === 'texture';
  const noTexture = texture === 'no-texture';
  const isCustomTexture = texture === 'custom';

  // Get current story data
  const { currentStory, setCurrentStory } = useStoryStore();
  const router = useRouter();

  // Custom hooks for logic separation
  const {
    persistedContent,
    currentPageCount,
    isGeneratingMore,
    maxPages,
    contentQuality,
    handleRemovePage,
    getVisiblePages,
    handleRegeneratePage,
    generateMorePages,
    isGenerating,
    progress,
    getPageContent,
    getBookQualityStats,
    setPersistedContent
  } = usePreviewLogic();

  const {
    colors,
    layout,
    fontSize,
    activeDropdown,
    setActiveDropdown,
    getPreviewClasses,
    handleColorsChange,
    handleLayoutChange,
    handleFontSizeChange
  } = usePreviewSettings();

  // Add this near other useEffect hooks
  useEffect(() => {
    // Check premium status from localStorage or API
    const checkPremiumStatus = async () => {
      try {
        const premiumStatus = localStorage.getItem('isPremium') === 'true';
        setIsPremium(premiumStatus);
        
        // Get previews used count
        const usedCount = parseInt(localStorage.getItem('previewsUsed') || '0');
        setPreviewsUsed(usedCount);
      } catch (error) {
        console.error('Error checking premium status:', error);
      }
    };
    
    checkPremiumStatus();
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is outside custom theme dropdown
      if (isCustomThemeDropdownOpen && !target.closest('.custom-theme-dropdown')) {
        setIsCustomThemeDropdownOpen(false);
      }
      
      // Check if click is outside custom texture dropdown
      if (isCustomTextureDropdownOpen && !target.closest('.custom-texture-dropdown')) {
        setIsCustomTextureDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomThemeDropdownOpen, isCustomTextureDropdownOpen]);

  const handleZoomPage = (pageNum: number) => {
    setCurrentZoomPage(pageNum);
    setZoomContent(getPageContent(pageNum));
    setIsZoomOpen(true);
  };

  const handleNextPage = () => {
    if (currentZoomPage !== null && currentZoomPage < currentPageCount - 1) {
      const nextPage = currentZoomPage + 1;
      setCurrentZoomPage(nextPage);
      setZoomContent(getPageContent(nextPage));
    }
  };

  const handlePreviousPage = () => {
    if (currentZoomPage !== null && currentZoomPage > 1) {
      const prevPage = currentZoomPage - 1;
      setCurrentZoomPage(prevPage);
      setZoomContent(getPageContent(prevPage));
    }
  };

  const getPreviewContainerClasses = () => {
    const baseClasses = 'preview-container relative rounded-lg border p-1 overflow-hidden';
    const themeClasses = isDarkTheme 
      ? 'bg-gray-900 text-white border-gray-700' 
      : 'bg-white text-gray-900 border-gray-200';
    const textureClasses = hasTexture 
      ? 'bg-opacity-95 backdrop-blur-sm' 
      : 'bg-opacity-100';
    const columnPaddingClass = is1Column 
      ? 'max-w-4xl mx-auto px-12 py-8' 
      : '';
    
    return `${baseClasses} ${themeClasses} ${textureClasses} ${columnPaddingClass}`;
  };

  const handlePageRegeneration = async (pageNum: number) => {
    setIsRegenerating(prev => ({ ...prev, [pageNum]: true }));
    try {
      await handleRegeneratePage(pageNum);
    } finally {
      setIsRegenerating(prev => ({ ...prev, [pageNum]: false }));
    }
  };

  const handleSaveContent = (newContent: string) => {
    if (currentZoomPage !== null) {
      // Create the updated content object
      const updatedContent = { ...persistedContent };
      updatedContent[`container${currentZoomPage}`] = newContent;
      
      // Update the state in usePreviewLogic
      setPersistedContent(updatedContent);
      
      // Update the zoom content to reflect the changes
      setZoomContent(newContent);
    }
  };

  const handleRefineInStudio = () => {
    if (!currentStory) {
      console.error('No current story found');
      return;
    }

    // Simple HTML to text conversion for better chapter content
    const htmlToText = (html: string) => {
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
    };

    // Convert preview content to chapters format
    const chapters = [];
    const visiblePages = getVisiblePages();
    
    // Group pages into chapters (every 3-4 pages per chapter)
    const pagesPerChapter = 4;
    for (let i = 0; i < visiblePages.length; i += pagesPerChapter) {
      const chapterPages = visiblePages.slice(i, i + pagesPerChapter);
      const chapterContent = chapterPages
        .map(pageNum => {
          const htmlContent = getPageContent(pageNum);
          return htmlToText(htmlContent);
        })
        .join('\n\n');
      
      const chapter = {
        id: `chapter-${Math.floor(i / pagesPerChapter) + 1}`,
        title: `Chapter ${Math.floor(i / pagesPerChapter) + 1}`,
        content: chapterContent,
        pageNumbers: chapterPages,
        wordCount: chapterContent.split(' ').length,
        status: 'draft' as const,
        quality: contentQuality[`container${chapterPages[0]}`]?.qualityScore || 7
      };
      
      chapters.push(chapter);
    }

    // Update the story with chapters
    const updatedStory = {
      ...currentStory,
      chapters
    };
    
    setCurrentStory(updatedStory);
    
    // Navigate to studio
    router.push('/studio');
  };

  const handleReadingPage = (pageNum: number) => {
    setCurrentReadingPage(pageNum);
    setIsReadingMode(true);
  };

  const handleNextReadingPage = () => {
    if (currentReadingPage !== null && currentReadingPage < currentPageCount - 1) {
      const nextPage = currentReadingPage + 1;
      setCurrentReadingPage(nextPage);
    }
  };

  const handlePreviousReadingPage = () => {
    if (currentReadingPage !== null && currentReadingPage > 0) {
      const prevPage = currentReadingPage - 1;
      setCurrentReadingPage(prevPage);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-white mb-20"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <style>{bookStyles}</style>
      <style>{focusModeStyles}</style>
      <style>{hoverControlsStyles}</style>
      <style>{qualityIndicatorStyles}</style>

      {/* Main Content */}
      <motion.main 
        className="max-w-9xl mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex flex-col items-center">
          {/* Title Section */}
          <motion.div 
            className="flex items-center justify-between w-full mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-lg backdrop-blur-sm border border-gray-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Back</span>
                </div>
              </motion.button>
              <motion.button
                onClick={() => window.location.href = '/dashboard'}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-lg backdrop-blur-sm border border-gray-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Dashboard</span>
                </div>
              </motion.button>
            </div>
            <TitleSection 
              isGenerating={isGenerating}
              progress={progress}
              getBookQualityStats={getBookQualityStats}
              isFadingOut={isFadingOut}
            />
            <div className="flex items-center gap-3">
              <motion.button
                onClick={handleRefineInStudio}
                className="px-6 py-3 bg-transparent hover:bg-blue-50 text-blue-600 hover:text-blue-700 rounded-xl font-medium transition-all duration-200 shadow-lg backdrop-blur-sm border-2 border-blue-500 hover:border-blue-600"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Refine in Studio</span>
                </div>
              </motion.button>
            </div>
          </motion.div>

          {/* Credits Bar */}
          <motion.div 
            className="mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className=" rounded-xl px-6 py-3 w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700 mr-6">Daily Credits</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: '68%' }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-600 min-w-[40px]">17/25</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg">Resets in 7h</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Toggle Buttons */}
          <div className="w-full flex justify-between mt-2 mb-2">
            {/* Theme Toggle Buttons */}
            <div className="flex gap-2 relative">
              <button
                onClick={() => setTheme('light')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  isLightTheme
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  isDarkTheme
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                Dark
              </button>
              <button
                onClick={() => setTheme('sepia')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  theme === 'sepia'
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Sepia
              </button>
              <button
                onClick={() => setTheme('vintage')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  theme === 'vintage'
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Vintage
              </button>
              <div className="relative custom-theme-dropdown">
                <button
                  onClick={() => {
                    setTheme('custom');
                    setIsCustomThemeDropdownOpen(!isCustomThemeDropdownOpen);
                  }}
                  className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                    isCustomTheme
                      ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Custom
                  <svg className={`w-3 h-3 transition-transform duration-200 ${isCustomThemeDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Custom Theme Dropdown */}
                {isCustomThemeDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 p-4 bg-gray-800/95 rounded-lg backdrop-blur-sm border border-gray-700/30 shadow-lg z-50 min-w-[280px]">
                    <h3 className="text-sm font-medium text-white mb-3">Custom Theme Colors</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Background</label>
                        <input
                          type="color"
                          value={customThemeColors.background}
                          onChange={(e) => setCustomThemeColors(prev => ({ ...prev, background: e.target.value }))}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Text</label>
                        <input
                          type="color"
                          value={customThemeColors.text}
                          onChange={(e) => setCustomThemeColors(prev => ({ ...prev, text: e.target.value }))}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Accent</label>
                        <input
                          type="color"
                          value={customThemeColors.accent}
                          onChange={(e) => setCustomThemeColors(prev => ({ ...prev, accent: e.target.value }))}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Texture Toggle Buttons */}
            <div className="flex gap-2 relative">
              <button
                onClick={() => setTexture('texture')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  hasTexture
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Texture
              </button>
              <button
                onClick={() => setTexture('no-texture')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  noTexture
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                No Texture
              </button>
              <button
                onClick={() => setTexture('parchment')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  texture === 'parchment'
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Parchment
              </button>
              <button
                onClick={() => setTexture('linen')}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  texture === 'linen'
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 10a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" />
                </svg>
                Linen
              </button>
              <div className="relative">
                <button
                  onClick={() => {
                    setTexture('custom');
                    setIsCustomTextureDropdownOpen(!isCustomTextureDropdownOpen);
                  }}
                  className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                    isCustomTexture
                      ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                  }`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Custom
                  <svg className={`w-3 h-3 transition-transform duration-200 ${isCustomTextureDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Custom Texture Dropdown */}
                {isCustomTextureDropdownOpen && (
                  <div className="absolute top-full right-0 mt-1 p-4 bg-gray-800/95 rounded-lg backdrop-blur-sm border border-gray-700/30 shadow-lg z-50 min-w-[200px]">
                    <h3 className="text-sm font-medium text-white mb-3">Custom Texture</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Upload Texture</label>
                        <input
                          type="file"
                          accept="image/*"
                          className="w-full text-xs text-gray-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-gray-700 file:text-gray-300 hover:file:bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-300 mb-1">Opacity</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          defaultValue="50"
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mode Toggle Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsReadingMode(true)}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  isReadingMode
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Reading
              </button>
              <button
                onClick={() => setIsReadingMode(false)}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  !isReadingMode
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
            </div>

            {/* Column Layout Toggle Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setColumnCount(1)}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  is1Column
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h14a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" />
                </svg>
                1 Col
              </button>
              <button
                onClick={() => setColumnCount(2)}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  is2Columns
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h7a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h5a1 1 0 011 1v4a1 1 0 01-1 1h-5a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h7a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" />
                </svg>
                2 Col
              </button>
              <button
                onClick={() => setColumnCount(3)}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  is3Columns
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" />
                </svg>
                3 Col
              </button>
              <button
                onClick={() => setColumnCount(4)}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  is4Columns
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM10 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4z" />
                </svg>
                4 Col
              </button>
              <button
                onClick={() => setColumnCount(5)}
                className={`px-2.5 py-1 text-gray-700 rounded text-xs font-medium transition-all duration-200 backdrop-blur-sm border flex items-center gap-1 ${
                  is5Columns
                    ? 'bg-gradient-to-br from-gray-200 to-gray-300 border-gray-300' 
                    : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-200 hover:from-gray-200 hover:to-gray-300'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM8 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1V5zM12 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM20 5a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2a1 1 0 01-1-1V5z" />
                </svg>
                5 Col
              </button>
            </div>
          </div>

          {/* Preview Containers */}
          <div className={`w-full gap-2 mt-2 grid ${is2Columns ? 'max-w-5xl mx-auto grid-cols-2' : ''} ${
            is3Columns ? 'grid-cols-3' : ''
          } ${
            is4Columns ? 'grid-cols-4' : ''
          } ${
            is5Columns ? 'grid-cols-5' : ''
          } ${
            columnCount === 1 ? 'grid-cols-1' : ''
          }`}>
            <AnimatePresence mode="popLayout">
              {getVisiblePages().map((pageNum) => (
                <motion.div 
                  key={`page-${pageNum}`}
                  className={`${getPreviewContainerClasses()} ${
                    is4Columns ? 'text-xs' : 'text-sm'
                  } relative`}
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  layoutId={`page-${pageNum}`}
                  transition={{
                    layout: {
                      duration: 0.4,
                      ease: [0.4, 0, 0.2, 1]
                    }
                  }}
                >
                  {/* Quality Indicator */}
                  <CompactQualityBadge 
                    content={getPageContent(pageNum)}
                    className="opacity-90"
                  />
                  
                  <div className="hover-controls">
                    <button 
                      className="control-button remove"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemovePage(pageNum);
                      }}
                      title="Remove page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button 
                      className="control-button regenerate"
                      onClick={() => handlePageRegeneration(pageNum)}
                      disabled={isRegenerating[pageNum]}
                      title="Regenerate page"
                    >
                      {isRegenerating[pageNum] ? (
                        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                    </button>
                    <button 
                      className="control-button zoom"
                      onClick={() => handleZoomPage(pageNum)}
                      title="View full page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </button>
                  </div>
                  <div 
                    className={`ebook-content ${
                      is5Columns ? 'super-compact-mode' : is4Columns ? 'compact-mode' : 'normal-mode'
                    } ${isDarkTheme ? 'invert' : ''}`}
                    dangerouslySetInnerHTML={{ 
                      __html: getPageContent(pageNum)
                    }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.main>

      {/* Bottom Gradient Dive */}
      <div className="sticky bottom-0 left-0 right-0 h-48 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
      </div>

      {/* Generate More Button */}
      <div className="sticky bottom-12 left-0 right-0 flex justify-center items-center z-10 -mt-32">
        <motion.button
          onClick={() => generateMorePages(columnCount)}
          disabled={isGeneratingMore || currentPageCount >= maxPages}
          className={`
            relative px-8 py-4 rounded-2xl font-medium text-gray-700
            ${currentPageCount >= maxPages 
              ? 'bg-gray-100/50 cursor-not-allowed' 
              : 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300'
            }
            transition-all duration-200 shadow-lg backdrop-blur-sm
            border border-gray-200
          `}
          whileHover={currentPageCount < maxPages ? { scale: 1.02 } : {}}
          whileTap={currentPageCount < maxPages ? { scale: 0.98 } : {}}
        >
          <div className="flex items-center space-x-3">
            {isGeneratingMore ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : currentPageCount >= maxPages ? (
              <>
                <span className="text-gray-400">Maximum Pages Reached</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Generate More Pages</span>
                <span className="text-sm text-gray-700">
                  ({currentPageCount}/{maxPages})
                </span>
              </>
            )}
          </div>
        </motion.button>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        isPremium={isPremium}
        previewsUsed={previewsUsed}
        onExportComplete={() => {
          // Update previews used count after successful export
          const newCount = previewsUsed + 1;
          setPreviewsUsed(newCount);
          localStorage.setItem('previewsUsed', newCount.toString());
        }}
      />

      {/* Add Help/Tour Button */}
      <div className="fixed bottom-6 left-6 z-10">
        <motion.button
          onClick={resetOnboarding}
          className="px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-medium transition-all duration-200 shadow-lg backdrop-blur-sm border border-gray-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title="Take a tour of the features"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help</span>
          </div>
        </motion.button>
      </div>

      {/* Zoom Modal */}
      <ZoomModal 
        isOpen={isZoomOpen}
        content={zoomContent}
        onClose={() => {
          setIsZoomOpen(false);
          setCurrentZoomPage(null);
        }}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
        hasNext={currentZoomPage !== null && currentZoomPage < currentPageCount - 1}
        hasPrevious={currentZoomPage !== null && currentZoomPage > 0}
        onSave={handleSaveContent}
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
        onSave={handleSaveContent}
      />

      {/* Preview Onboarding */}
      {showOnboarding && (
        <PreviewOnboarding onComplete={completeOnboarding} />
      )}
    </motion.div>
  );
}
