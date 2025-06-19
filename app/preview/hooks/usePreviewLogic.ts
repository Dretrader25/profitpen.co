import { useEffect } from 'react';
import { useContentGeneration } from './useContentGeneration';
import { usePageManagement } from './usePageManagement';
import { useStoragePersistence } from './useStoragePersistence';
import { useQualityAnalysis } from './useQualityAnalysis';

export function usePreviewLogic() {
  // Storage and persistence
  const { 
    persistedContent, 
    setPersistedContent, 
    savePageCount, 
    getSavedPageCount 
  } = useStoragePersistence();

  // Page management
  const { 
    currentPageCount, 
    setCurrentPageCount, 
    // maxPages, // Removed
    handleRemovePage: baseHandleRemovePage, 
    getVisiblePages: baseGetVisiblePages, 
    getPageContent: baseGetPageContent 
  } = usePageManagement();

  // Content generation
  const { 
    isGeneratingMore, 
    isGenerating, 
    // progress, // Removed
    isGeneratingEnhanced, 
    enhancedProgress, 
    handleRegeneratePage: baseHandleRegeneratePage
    // generateMorePages: baseGenerateMorePages // Removed
  } = useContentGeneration();

  // Quality analysis
  const { 
    contentQuality, 
    analyzeContentQuality, 
    analyzePageQuality: baseAnalyzePageQuality, 
    getBookQualityStats 
  } = useQualityAnalysis();

  // Initialize page count from localStorage
  useEffect(() => {
    const savedPageCount = getSavedPageCount();
    setCurrentPageCount(savedPageCount);
  }, []);

  // Save page count whenever it changes
  useEffect(() => {
    savePageCount(currentPageCount);
  }, [currentPageCount]);

  // Analyze content quality whenever content changes
  useEffect(() => {
    analyzeContentQuality(persistedContent);
  }, [persistedContent]);

  // Wrapper functions that pass required parameters
  const handleRemovePage = (pageNum: number) => {
    baseHandleRemovePage(pageNum, persistedContent, setPersistedContent, currentPageCount, setCurrentPageCount);
  };

  const getVisiblePages = () => {
    return baseGetVisiblePages(currentPageCount);
  };

  const handleRegeneratePage = async (pageNum: number) => {
    await baseHandleRegeneratePage(pageNum, persistedContent, setPersistedContent);
  };

  // const generateMorePages = async (columnCount: number = 1) => { // Removed
  //   await baseGenerateMorePages(columnCount, currentPageCount, maxPages, persistedContent, setPersistedContent, setCurrentPageCount);
  // };

  const getPageContent = (pageNum: number): string => {
    return baseGetPageContent(pageNum, persistedContent, setPersistedContent);
  };

  const analyzePageQuality = (pageNum: number) => {
    baseAnalyzePageQuality(pageNum, persistedContent);
  };


  return {
    persistedContent,
    currentPageCount,
    // isGeneratingMore, // Removed
    isGenerating,
    // progress, // Removed
    // maxPages, // Removed
    contentQuality,
    isGeneratingEnhanced,
    enhancedProgress,
    handleRemovePage,
    getVisiblePages,
    handleRegeneratePage,
    // generateMorePages, // Removed
    getPageContent,
    analyzePageQuality,
    getBookQualityStats,
    setPersistedContent
  };
}
