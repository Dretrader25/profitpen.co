'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '@/lib/store/storyStore';

interface TitleSectionProps {
  isGenerating: boolean;
  progress: number;
  getBookQualityStats: () => {
    totalPages: number;
    totalWords: number;
    averageScore: number;
    excellentPages: number;
    completionPercentage: number;
  } | null;
  isFadingOut: boolean;
}

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -30,
    transition: { duration: 0.3 }
  }
};

export default function TitleSection({ 
  isGenerating, 
  progress, 
  getBookQualityStats, 
  isFadingOut 
}: TitleSectionProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState('');
  const [showInsights, setShowInsights] = useState(false);

  const { currentStory } = useStoryStore();

  const handleTitleEdit = () => {
    setTempTitle(currentStory?.title || 'Your Ebook Title');
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    // Here you would save the title to your store
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setIsEditingTitle(false);
    setTempTitle('');
  };

  const getSmartInsight = () => {
    const bookStats = getBookQualityStats();
    if (!bookStats) return null;
    
    const insights = [
      bookStats.averageScore >= 85 ? "🚀 Your book quality is publishing-ready!" : null,
      bookStats.totalPages >= 50 ? "📚 Great length for your genre!" : null,
      bookStats.completionPercentage >= 90 ? "✨ Almost ready for export!" : null,
      bookStats.excellentPages > bookStats.totalPages * 0.6 ? "🏆 Majority of pages are excellent quality!" : null,
    ].filter(Boolean);
    
    return insights[Math.floor(Math.random() * insights.length)];
  };

  return (
    <motion.div 
      className="w-full max-w-5xl rounded-lg border border-gray-200 p-3 bg-gradient-to-br from-gray-50 to-gray-100 backdrop-blur-xl relative overflow-hidden"
      variants={titleVariants}
      animate={isFadingOut ? "exit" : "visible"}
    >
      {/* Subtle quality indicator overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/5 to-transparent opacity-50" />
      
      {isGenerating ? (
        <div className="flex items-center justify-center h-16 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-48 bg-gray-200/30 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-gray-600 text-xs">Generating...</span>
          </div>
        </div>
      ) : (
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-4">
            {/* Left side: Title and controls */}
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="flex-1 bg-transparent text-xl font-bold text-gray-800 border-b border-gray-300 focus:border-blue-400 outline-none px-1 py-1"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') handleTitleCancel();
                    }}
                  />
                  <button onClick={handleTitleSave} className="text-green-600 hover:text-green-500 text-xs">
                    ✓
                  </button>
                  <button onClick={handleTitleCancel} className="text-red-600 hover:text-red-500 text-xs">
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 group">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight cursor-pointer hover:from-blue-600 hover:to-blue-500 transition-all truncate"
                      onClick={handleTitleEdit}>
                    {currentStory?.title || 'Your Ebook Title'}
                  </h2>
                  <button 
                    onClick={handleTitleEdit}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-blue-500 transition-all text-xs"
                    title="Edit title"
                  >
                    ✏️
                  </button>
                  <button 
                    className="text-yellow-600 hover:text-yellow-500 transition-all text-xs"
                    title="AI title suggestions"
                  >
                    ✨
                  </button>
                </div>
              )}
            </div>

            {/* Right side: Stats and insights */}
            <div className="flex items-center gap-3">
              {/* Compact Book Quality Stats */}
              {(() => {
                const bookStats = getBookQualityStats();
                return bookStats && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-200/30 rounded text-xs">
                      <span className="text-gray-500">📖</span>
                      <span className="text-gray-700 font-medium">{bookStats.totalPages}p</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-200/30 rounded text-xs">
                      <span className="text-gray-500">📝</span>
                      <span className="text-gray-700 font-medium">{Math.round(bookStats.totalWords/1000)}k</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-200/30 rounded text-xs">
                      <div className={`w-2 h-2 rounded-full ${
                        bookStats.averageScore >= 90 ? 'bg-green-500' :
                        bookStats.averageScore >= 80 ? 'bg-blue-500' :
                        bookStats.averageScore >= 70 ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}></div>
                      <span className="text-gray-700 font-medium">{bookStats.averageScore}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Smart insights toggle */}
              <button
                onClick={() => setShowInsights(!showInsights)}
                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-md text-xs transition-all border border-blue-200"
              >
                💡
              </button>
            </div>
          </div>

          {/* Smart Insight Banner */}
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-md border border-blue-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-600">
                    {getSmartInsight() || "Keep writing to unlock more insights!"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
} 