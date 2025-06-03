'use client';

import { useCallback } from 'react';

export interface ContentQualityMetrics {
  wordCount: number;
  completeness: 'draft' | 'good' | 'excellent';
  qualityScore: number;
  readingTime: number;
  hasHeader: boolean;
  hasContent: boolean;
  contentLength: 'short' | 'medium' | 'long';
  issues: string[];
  strengths: string[];
}

export function useContentQuality() {
  
  const analyzeContent = useCallback((htmlContent: string): ContentQualityMetrics => {
    // Remove HTML tags and extract plain text
    const plainText = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText.split(' ').filter(word => word.length > 0).length;
    
    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(wordCount / 200);
    
    // Check content structure
    const hasHeader = /<h[1-6]/.test(htmlContent);
    const hasContent = wordCount > 20;
    const hasParagraphs = /<p/.test(htmlContent);
    const hasChapterDivider = /chapter-divider/.test(htmlContent);
    
    // Determine content length
    let contentLength: 'short' | 'medium' | 'long';
    if (wordCount < 100) contentLength = 'short';
    else if (wordCount < 300) contentLength = 'medium';
    else contentLength = 'long';
    
    // Analyze quality factors
    const issues: string[] = [];
    const strengths: string[] = [];
    
    // Content length analysis
    if (wordCount < 50) {
      issues.push('Content too short');
    } else if (wordCount > 80) {
      strengths.push('Good content length');
    }
    
    // Structure analysis
    if (!hasHeader) {
      issues.push('Missing chapter heading');
    } else {
      strengths.push('Well-structured');
    }
    
    if (!hasParagraphs) {
      issues.push('Poor formatting');
    } else {
      strengths.push('Good formatting');
    }
    
    // Repetition check (simple)
    const sentences = plainText.split('.').filter(s => s.trim().length > 10);
    const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
    if (sentences.length > 3 && uniqueSentences.size / sentences.length < 0.8) {
      issues.push('Some repetitive content');
    }
    
    // Professional content check
    if (plainText.includes('ProfitPen.co') || plainText.includes('placeholder')) {
      issues.push('Contains placeholder text');
    }
    
    if (wordCount > 150 && hasHeader && hasParagraphs) {
      strengths.push('Professional quality');
    }
    
    // Calculate quality score (0-100)
    let qualityScore = 50; // Base score
    
    // Word count factor (0-30 points)
    if (wordCount > 200) qualityScore += 30;
    else if (wordCount > 100) qualityScore += 20;
    else if (wordCount > 50) qualityScore += 10;
    else qualityScore -= 20;
    
    // Structure factor (0-25 points)
    if (hasHeader && hasParagraphs) qualityScore += 25;
    else if (hasHeader || hasParagraphs) qualityScore += 10;
    
    // Content variety factor (0-20 points)
    if (uniqueSentences.size / Math.max(sentences.length, 1) > 0.9) qualityScore += 20;
    else if (uniqueSentences.size / Math.max(sentences.length, 1) > 0.7) qualityScore += 10;
    
    // Professional factor (0-15 points)
    if (!plainText.includes('placeholder') && !plainText.includes('ProfitPen.co')) {
      qualityScore += 15;
    }
    
    // Issues penalty
    qualityScore -= issues.length * 5;
    
    // Ensure score is within bounds
    qualityScore = Math.max(0, Math.min(100, qualityScore));
    
    // Determine completeness based on score and content
    let completeness: 'draft' | 'good' | 'excellent';
    if (qualityScore >= 85 && wordCount > 150) completeness = 'excellent';
    else if (qualityScore >= 65 && wordCount > 80) completeness = 'good';
    else completeness = 'draft';
    
    return {
      wordCount,
      completeness,
      qualityScore,
      readingTime,
      hasHeader,
      hasContent,
      contentLength,
      issues,
      strengths
    };
  }, []);

  const getQualityBadgeColor = (completeness: ContentQualityMetrics['completeness']) => {
    switch (completeness) {
      case 'excellent': return 'text-green-600 border-green-600';
      case 'good': return 'text-blue-600 border-blue-600';
      case 'draft': return 'text-yellow-600 border-yellow-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const getQualityIcon = (completeness: ContentQualityMetrics['completeness']) => {
    switch (completeness) {
      case 'excellent': return '✨';
      case 'good': return '✓';
      case 'draft': return '📝';
      default: return '?';
    }
  };

  const getQualityText = (completeness: ContentQualityMetrics['completeness']) => {
    switch (completeness) {
      case 'excellent': return 'Excellent';
      case 'good': return 'Good';
      case 'draft': return 'Draft';
      default: return 'Unknown';
    }
  };

  return {
    analyzeContent,
    getQualityBadgeColor,
    getQualityIcon,
    getQualityText
  };
}
