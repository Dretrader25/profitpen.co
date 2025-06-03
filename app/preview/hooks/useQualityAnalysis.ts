import { useState, useEffect } from 'react';
import { useContentQuality, ContentQualityMetrics } from './useContentQuality';

export function useQualityAnalysis() {
  const { analyzeContent } = useContentQuality();
  const [contentQuality, setContentQuality] = useState<Record<string, ContentQualityMetrics>>({});

  // Analyze content quality whenever content changes
  const analyzeContentQuality = (persistedContent: Record<string, string>) => {
    Object.keys(persistedContent).forEach(key => {
      const content = persistedContent[key];
      if (typeof content === 'string' && content.trim()) {
        const metrics = analyzeContent(content);
        setContentQuality(prev => ({ ...prev, [key]: metrics }));
      }
    });
  };

  // Analyze content quality for a specific page
  const analyzePageQuality = (pageNum: number, persistedContent: Record<string, string>) => {
    const content = persistedContent[`container${pageNum}`];
    if (typeof content === 'string') {
      // Analyze the content and update the quality metrics
      const metrics = analyzeContent(content);
      setContentQuality(prev => ({ ...prev, [`container${pageNum}`]: metrics }));
    }
  };

  // Get overall book quality statistics
  const getBookQualityStats = () => {
    const qualityEntries = Object.entries(contentQuality);
    if (qualityEntries.length === 0) return null;

    const totalPages = qualityEntries.length;
    const excellentPages = qualityEntries.filter(([_, metrics]) => metrics.completeness === 'excellent').length;
    const goodPages = qualityEntries.filter(([_, metrics]) => metrics.completeness === 'good').length;
    const draftPages = qualityEntries.filter(([_, metrics]) => metrics.completeness === 'draft').length;
    
    const totalWords = qualityEntries.reduce((sum, [_, metrics]) => sum + metrics.wordCount, 0);
    const averageScore = qualityEntries.reduce((sum, [_, metrics]) => sum + metrics.qualityScore, 0) / totalPages;
    const totalReadingTime = qualityEntries.reduce((sum, [_, metrics]) => sum + metrics.readingTime, 0);

    return {
      totalPages,
      excellentPages,
      goodPages,
      draftPages,
      totalWords,
      averageScore: Math.round(averageScore),
      totalReadingTime,
      completionPercentage: Math.round(((excellentPages + goodPages) / totalPages) * 100)
    };
  };

  return {
    contentQuality,
    setContentQuality,
    analyzeContentQuality,
    analyzePageQuality,
    getBookQualityStats
  };
}
