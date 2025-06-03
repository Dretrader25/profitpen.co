import { motion } from 'framer-motion';

interface PreviewControlsProps {
  currentPageCount: number;
  maxPages: number;
  isGeneratingMore: boolean;
  showTabs: boolean;
  setShowTabs: (show: boolean) => void;
  setIsExportModalOpen: (open: boolean) => void;
  generateMorePages: () => void;
  // Enhanced ebook generation props
  isGeneratingEnhanced?: boolean;
  enhancedProgress?: {
    step: string;
    progress: number;
    message: string;
  };
}

export default function PreviewControls({
  currentPageCount,
  maxPages,
  isGeneratingMore,
  showTabs,
  setShowTabs,
  setIsExportModalOpen,
  generateMorePages,
  isGeneratingEnhanced = false,
  enhancedProgress
}: PreviewControlsProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Preview Your Book
        </h1>
        <p className="text-gray-300 text-lg">
          Review your content before export • {currentPageCount} pages generated
        </p>
      </motion.div>

      {/* Control Buttons */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <button
          onClick={() => setShowTabs(!showTabs)}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          {showTabs ? 'Hide' : 'Show'} Preview Settings
        </button>
        
        <button
          onClick={() => setIsExportModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Export Book
        </button>
        
        <button
          onClick={generateMorePages}
          disabled={isGeneratingMore || currentPageCount >= maxPages}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg disabled:hover:scale-100"
        >
          {isGeneratingMore ? 'Generating...' : 'Generate More Pages'}
        </button>
      </motion.div>

    </div>
  );
}
