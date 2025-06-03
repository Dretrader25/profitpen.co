'use client';

import { motion } from 'framer-motion';
import { useContentQuality, ContentQualityMetrics } from '../hooks/useContentQuality';

interface QualityIndicatorProps {
  content: string;
  className?: string;
  showDetails?: boolean;
}

export default function QualityIndicator({ content, className = '', showDetails = false }: QualityIndicatorProps) {
  const { analyzeContent, getQualityBadgeColor, getQualityIcon, getQualityText } = useContentQuality();
  const metrics = analyzeContent(content);

  return (
    <div className={`quality-indicator ${className}`}>
      {/* Main Quality Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getQualityBadgeColor(metrics.completeness)} shadow-lg`}
      >
        <span className="text-sm">{getQualityIcon(metrics.completeness)}</span>
        <span>{getQualityText(metrics.completeness)}</span>
        <span className="opacity-75">({metrics.qualityScore}/100)</span>
      </motion.div>

      {/* Detailed Metrics */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 space-y-2"
        >
          {/* Stats Row */}
          <div className="flex gap-3 text-xs">
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-md">
              <span className="text-gray-400">Words:</span>
              <span className="text-white font-medium">{metrics.wordCount}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-md">
              <span className="text-gray-400">Read:</span>
              <span className="text-white font-medium">{metrics.readingTime}min</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded-md">
              <span className="text-gray-400">Length:</span>
              <span className="text-white font-medium capitalize">{metrics.contentLength}</span>
            </div>
          </div>

          {/* Strengths */}
          {metrics.strengths.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-green-400">✓ Strengths:</p>
              <div className="flex flex-wrap gap-1">
                {metrics.strengths.map((strength, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 bg-green-500/20 text-green-300 rounded-md"
                  >
                    {strength}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {metrics.issues.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-yellow-400">⚠ Suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {metrics.issues.map((issue, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-300 rounded-md"
                  >
                    {issue}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Compact version for page overlays
export function CompactQualityBadge({ content, className = '' }: { content: string; className?: string }) {
  const { analyzeContent, getQualityBadgeColor, getQualityIcon } = useContentQuality();
  const metrics = analyzeContent(content);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute top-2 right-2 z-10 ${className}`}
    >
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getQualityBadgeColor(metrics.completeness)} shadow-lg backdrop-blur-sm`}>
        <span className="text-xs">{getQualityIcon(metrics.completeness)}</span>
        <span className="hidden sm:inline">{metrics.wordCount}w</span>
      </div>
    </motion.div>
  );
}

// Detailed tooltip version
export function QualityTooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const { analyzeContent } = useContentQuality();
  const metrics = analyzeContent(content);

  return (
    <div className="relative group">
      {children}
      
      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 0, scale: 0.95, y: 10 }}
        whileHover={{ opacity: 1, scale: 1, y: 0 }}
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20"
      >
        <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-lg p-3 min-w-[200px] shadow-xl">
          <QualityIndicator content={content} showDetails={true} />
        </div>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-gray-900/95"></div>
      </motion.div>
    </div>
  );
}
