import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface ZoomModalProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onSave?: (content: string) => void;
}

export default function ZoomModal({ 
  isOpen, 
  content, 
  onClose, 
  onNext, 
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  onSave
}: ZoomModalProps) {
  const [direction, setDirection] = useState(0);
  const [editedContent, setEditedContent] = useState(content);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Update editedContent when content prop changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (contentRef.current) {
      contentRef.current.innerHTML = content;
      setEditedContent(content);
    }
  }, [content]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (contentRef.current && editedContent !== content) {
        onSave?.(editedContent);
      }
      onClose();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentRef.current && editedContent !== content) {
      onSave?.(editedContent);
    }
    setDirection(1);
    onNext?.();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (contentRef.current && editedContent !== content) {
      onSave?.(editedContent);
    }
    setDirection(-1);
    onPrevious?.();
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newContent = e.currentTarget.innerHTML;
    setEditedContent(newContent);
  };

  const handleClose = () => {
    if (contentRef.current && editedContent !== content) {
      onSave?.(editedContent);
    }
    onClose();
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        className={`absolute left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white shadow-xl transition-all duration-200 hover:scale-110 z-50 ${
          !hasPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
        disabled={!hasPrevious}
        aria-label="Previous page"
      >
        <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key="zoom-modal-content"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 40,
            duration: 0.2
          }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
            <h3 className="text-lg font-semibold text-gray-900">Detailed Information</h3> {/* Changed */}
            <button 
              onClick={handleClose} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div 
            ref={contentRef}
            className="p-4 text-gray-900 bg-white/90 backdrop-blur-sm relative" 
            style={{
              color: '#1f2937',
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }}
            contentEditable
            suppressContentEditableWarning
            onInput={handleContentChange}
          />
        </motion.div>
      </AnimatePresence>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className={`absolute right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white shadow-xl transition-all duration-200 hover:scale-110 z-50 ${
          !hasNext ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
        }`}
        disabled={!hasNext}
        aria-label="Next page"
      >
        <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
