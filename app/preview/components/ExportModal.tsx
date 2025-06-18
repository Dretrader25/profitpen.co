'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
  previewsUsed: number;
  onExportComplete?: () => void;
}

export default function ExportModal({ isOpen, onClose, isPremium, previewsUsed, onExportComplete }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'epub' | 'mp3'>('pdf');

  const handleExport = async () => {
    try {
      // Export logic here
      if (onExportComplete) {
        onExportComplete();
      }
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeIn"
      }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-2xl border border-gray-700/30 shadow-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Export Report/Data {/* Changed */}
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'pdf', label: 'PDF Report', icon: '📄' }, // Changed label
                    { id: 'csv', label: 'CSV Data', icon: '📊', premium: true }, // Changed: epub to csv, icon
                    { id: 'audio', label: 'AI Summary', icon: '🎧', premium: true } // Changed: mp3 to audio, icon (optional)
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setSelectedFormat(format.id as any)} // Allow new format IDs
                      className={`relative p-4 rounded-xl border transition-all duration-200 ${
                        selectedFormat === format.id
                          ? 'bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/50'
                          : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/30 hover:border-gray-600/50'
                      }`}
                      disabled={format.premium && !isPremium}
                    >
                      <div className="text-2xl mb-2">{format.icon}</div>
                      <div className="text-sm font-medium text-white">{format.label}</div>
                      {format.premium && !isPremium && (
                        <div className="absolute top-2 right-2">
                          <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full">
                            PRO
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/30">
                    <h3 className="text-lg font-medium text-white mb-2">Export Details</h3>
                    <p className="text-gray-400 text-sm">
                      {selectedFormat === 'pdf' && 'Export property/lead details as a PDF report, perfect for printing and sharing.'} {/* Changed */}
                      {selectedFormat === 'csv' && 'Export data in CSV format for spreadsheets or other tools.'} {/* Changed for csv */}
                      {selectedFormat === 'audio' && 'Generate an AI audio summary of the key data points for this record.'} {/* Changed for audio */}
                    </p>
                  </div>

                  {!isPremium && (selectedFormat === 'csv' || selectedFormat === 'audio') && ( // Adjusted condition for new formats
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-700/20 border border-blue-500/30">
                      <h3 className="text-lg font-medium text-white mb-2">Upgrade to Premium</h3>
                      <p className="text-gray-300 text-sm">
                        Get access to CSV data exports and AI audio summaries, plus many more premium features. {/* Changed */}
                      </p>
                      <button className="mt-3 w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
                        Upgrade Now
                      </button>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleExport}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        selectedFormat === 'pdf' || isPremium
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                          : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={selectedFormat !== 'pdf' && !isPremium}
                    >
                      Export
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 